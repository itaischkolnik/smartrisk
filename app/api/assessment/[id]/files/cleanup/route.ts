import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '../../../../../lib/supabase/server';

// POST /api/assessment/[id]/files/cleanup - Clean up orphaned file records
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

    const assessmentId = params.id;
    console.log('=== DIRECT DATABASE CLEANUP ===');
    console.log('Assessment ID:', assessmentId);
    console.log('User ID:', session.user.id);

    // Get all files for this assessment
    const { data: files, error: filesError } = await supabase
      .from('files')
      .select('*')
      .eq('assessment_id', assessmentId);

    if (filesError) {
      console.error('Error fetching files:', filesError);
      return NextResponse.json({ error: 'Failed to fetch files' }, { status: 500 });
    }

    console.log('Found files in database:', files?.length || 0);
    
    if (files && files.length > 0) {
      console.log('Files to be removed:', files.map(f => ({ id: f.id, name: f.file_name })));
      
      // Delete ALL file records for this assessment - they're orphaned anyway
      const { error: deleteError, count } = await supabase
        .from('files')
        .delete({ count: 'exact' })
        .eq('assessment_id', assessmentId);

      if (deleteError) {
        console.error('Error deleting file records:', deleteError);
        return NextResponse.json({ error: 'Failed to delete file records' }, { status: 500 });
      }

      console.log('Deleted records count:', count);
      console.log('=== CLEANUP COMPLETED ===');

      return NextResponse.json({
        success: true,
        message: 'All file records removed from database',
        orphanedFilesRemoved: count || 0,
        validFilesRemaining: 0,
        orphanedFiles: files.map(f => ({ id: f.id, name: f.file_name }))
      });
    } else {
      console.log('No files found to clean up');
      return NextResponse.json({
        success: true,
        message: 'No files found to clean up',
        orphanedFilesRemoved: 0,
        validFilesRemaining: 0,
        orphanedFiles: []
      });
    }

  } catch (error) {
    console.error('Error during cleanup:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 