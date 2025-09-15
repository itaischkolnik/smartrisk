import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '../../../../../lib/supabase/server';

// DELETE /api/assessment/[id]/files/[fileId] - Delete a specific file
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

    const { fileId } = params;
    if (!fileId) {
      return NextResponse.json({ error: 'File ID is required' }, { status: 400 });
    }

    // Simple delete - just remove from database
    const { error, count } = await supabase
      .from('files')
      .delete({ count: 'exact' })
      .eq('id', fileId)
      .eq('assessment_id', params.id);

    if (error) {
      console.error('Delete error:', error);
      return NextResponse.json({ error: 'Failed to delete file' }, { status: 500 });
    }

    if (count === 0) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'File deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting file:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 