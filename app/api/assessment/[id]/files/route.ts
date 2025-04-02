import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';

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

    // Fetch files for the assessment
    const { data: files, error } = await supabase
      .storage
      .from('assessment-files')
      .list(`${userId}/${assessmentId}`);

    if (error) {
      console.error('Error fetching files:', error);
      return NextResponse.json(
        { error: 'Failed to fetch files' },
        { status: 500 }
      );
    }

    return NextResponse.json(files);
  } catch (error) {
    console.error('Error in files GET route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(
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

    // Get the file data from the request
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Upload the file
    const { data, error } = await supabase
      .storage
      .from('assessment-files')
      .upload(`${userId}/${assessmentId}/${file.name}`, file);

    if (error) {
      console.error('Error uploading file:', error);
      return NextResponse.json(
        { error: 'Failed to upload file' },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in file upload:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
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
      .remove([`${assessmentId}/${filename}`]);

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