import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';

function sanitizeFileName(fileName: string): string {
  // Remove any path components
  const name = fileName.split(/[\\/]/).pop() || fileName;
  
  // Transliterate non-ASCII characters to their ASCII equivalents
  const transliterated = name
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    // Replace Hebrew characters with their English transliteration
    .replace(/[א-ת]/g, '_')
    // Replace any remaining non-ASCII characters with underscores
    .replace(/[^\x00-\x7F]/g, '_')
    // Replace spaces and special characters with underscores
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    // Replace multiple consecutive underscores with a single one
    .replace(/_+/g, '_')
    // Remove leading/trailing underscores
    .replace(/^_+|_+$/g, '');

  return transliterated;
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    console.log('Session:', session);
    
    if (!session || !session.user || !session.user.id) {
      console.log('Unauthorized - no valid session');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const assessmentId = params.id;
    console.log('Assessment ID:', assessmentId);
    console.log('User ID:', session.user.id);
    
    if (!assessmentId) {
      return NextResponse.json({ error: 'Assessment ID is required' }, { status: 400 });
    }

    // Initialize Supabase Admin Client
    const supabase = createServerSupabaseClient();

    // Check if assessment exists and belongs to the user
    const { data: assessment, error: assessmentError } = await supabase
      .from('assessments')
      .select('id')
      .eq('id', assessmentId)
      .single();

    console.log('Assessment query result:', { assessment, error: assessmentError });

    if (assessmentError || !assessment) {
      console.error('Error finding assessment:', assessmentError);
      return NextResponse.json({ 
        error: 'Assessment not found',
        details: {
          assessmentId,
          queryError: assessmentError
        }
      }, { status: 404 });
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
    const filename = `${assessmentId}/${timestamp}_${sanitizedFileName}`;

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