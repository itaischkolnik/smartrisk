import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '../../../../lib/supabase/server';

function sanitizeFileName(fileName: string): string {
  // Remove any path components
  const name = fileName.split(/[\\/]/).pop() || '';
  // Remove any non-alphanumeric characters except dots and dashes
  return name.replace(/[^a-zA-Z0-9.-]/g, '_');
}

// GET /api/assessment/[id]/files - List all files
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerSupabaseClient();
    
    // Check if user is authenticated
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const assessmentId = params.id;

    // Fetch files for the assessment from the database
    const { data: files, error } = await supabase
      .from('files')
      .select('*')
      .eq('assessment_id', assessmentId);

    if (error) {
      console.error('Error fetching files:', error);
      return NextResponse.json(
        { error: 'Failed to fetch files' },
        { status: 500 }
      );
    }

    return NextResponse.json({ files });
  } catch (error) {
    console.error('Error in files GET route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/assessment/[id]/files - Upload a new file
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerSupabaseClient();
    
    // Check if user is authenticated
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const assessmentId = params.id;

    if (!assessmentId) {
      return NextResponse.json({ error: 'Assessment ID is required' }, { status: 400 });
    }

    // Process the file upload
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Get file category
    const fileCategory = formData.get('category') as string || 'general';

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Generate a unique filename with sanitization
    const timestamp = Date.now();
    const sanitizedFileName = sanitizeFileName(file.name);
    const filename = `${userId}/${assessmentId}/${timestamp}_${sanitizedFileName}`;

    // Upload file to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('assessment-files')
      .upload(filename, buffer, {
        contentType: file.type,
        cacheControl: '3600',
      });

    if (uploadError) {
      console.error('Error uploading file:', uploadError);
      return NextResponse.json({ 
        error: 'Failed to upload file',
        details: uploadError.message
      }, { status: 500 });
    }

    // Get public URL for the file
    const { data: { publicUrl } } = supabase
      .storage
      .from('assessment-files')
      .getPublicUrl(filename);

    // Save file record in the database
    const { data: fileRecord, error: fileError } = await supabase
      .from('files')
      .insert({
        assessment_id: assessmentId,
        file_name: file.name,
        file_url: publicUrl,
        file_type: file.type,
        file_size: file.size,
        file_category: fileCategory,
      })
      .select()
      .single();

    if (fileError) {
      console.error('Error saving file record:', fileError);
      return NextResponse.json({ error: 'Failed to save file record' }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      file: fileRecord
    });

  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/assessment/[id]/files/[fileId] - Delete a file
export async function DELETE(
  request: Request,
  { params }: { params: { id: string; fileId: string } }
) {
  try {
    const supabase = createServerSupabaseClient();
    
    // Check if user is authenticated
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id: assessmentId, fileId } = params;
    if (!assessmentId || !fileId) {
      return NextResponse.json({ error: 'Assessment ID and File ID are required' }, { status: 400 });
    }

    // Get file info first
    const { data: file, error: fileError } = await supabase
      .from('files')
      .select('*')
      .eq('id', fileId)
      .eq('assessment_id', assessmentId)
      .single();

    if (fileError || !file) {
      console.error('Error finding file:', fileError);
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    // Delete from storage first
    const filename = file.file_url.split('/').pop();
    const { error: storageError } = await supabase
      .storage
      .from('assessment-files')
      .remove([`${session.user.id}/${assessmentId}/${filename}`]);

    if (storageError) {
      console.error('Error deleting file from storage:', storageError);
      return NextResponse.json({ error: 'Failed to delete file from storage' }, { status: 500 });
    }

    // Then delete the database record
    const { error: dbError } = await supabase
      .from('files')
      .delete()
      .eq('id', fileId)
      .eq('assessment_id', assessmentId);

    if (dbError) {
      console.error('Error deleting file record:', dbError);
      return NextResponse.json({ error: 'Failed to delete file record' }, { status: 500 });
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error deleting file:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 