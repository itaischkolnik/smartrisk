import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';

function sanitizeFileName(fileName: string): string {
  // Remove any path components
  const name = fileName.split(/[\\/]/).pop() || '';
  // Remove any non-alphanumeric characters except dots and dashes
  return name.replace(/[^a-zA-Z0-9.-]/g, '_');
}

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

    console.log('Attempting to upload file:', {
      bucket: 'assessment-files',
      filename,
      contentType: file.type,
      fileSize: file.size
    });

    // Upload file to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('assessment-files')
      .upload(filename, buffer, {
        contentType: file.type,
        cacheControl: '3600',
      });

    if (uploadError) {
      console.error('Error uploading file to Supabase Storage:', {
        error: uploadError,
        errorMessage: uploadError.message,
        name: uploadError.name
      });
      return NextResponse.json({ 
        error: 'Failed to upload file',
        details: {
          message: uploadError.message,
          name: uploadError.name
        }
      }, { status: 500 });
    }

    console.log('File upload successful:', uploadData);

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
        file_name: file.name, // Store original file name for display
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
      file: {
        id: fileRecord.id,
        name: file.name,
        url: publicUrl,
        type: file.type,
        size: file.size,
        category: fileCategory,
      } 
    });

  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

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

    // Get the filename from the URL
    const url = new URL(request.url);
    const fileName = url.searchParams.get('fileName');

    if (!fileName) {
      return NextResponse.json(
        { error: 'File name is required' },
        { status: 400 }
      );
    }

    const sanitizedFileName = sanitizeFileName(fileName);
    const filePath = `${userId}/${assessmentId}/${sanitizedFileName}`;

    // Get file download URL
    const { data, error } = await supabase
      .storage
      .from('assessment-files')
      .createSignedUrl(filePath, 60); // URL valid for 60 seconds

    if (error) {
      console.error('Error getting file URL:', error);
      return NextResponse.json(
        { error: 'Failed to get file URL' },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: data.signedUrl });
  } catch (error) {
    console.error('Error in file GET route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    // Get the filename from the URL
    const url = new URL(request.url);
    const fileName = url.searchParams.get('fileName');

    if (!fileName) {
      return NextResponse.json(
        { error: 'File name is required' },
        { status: 400 }
      );
    }

    const sanitizedFileName = sanitizeFileName(fileName);
    const filePath = `${userId}/${assessmentId}/${sanitizedFileName}`;

    // Delete the file
    const { error } = await supabase
      .storage
      .from('assessment-files')
      .remove([filePath]);

    if (error) {
      console.error('Error deleting file:', error);
      return NextResponse.json(
        { error: 'Failed to delete file' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in file DELETE route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 