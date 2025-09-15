import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '../../../../../../lib/supabase/server';

// DELETE /api/assessment/[id]/files/[fileId]/force-delete - Force delete a file record
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
    
    console.log('=== FORCE DELETE FILE ===');
    console.log('File ID:', fileId);
    console.log('User ID:', session.user.id);

    // Direct delete from database - no checks, no storage deletion
    const { error: dbError, count } = await supabase
      .from('files')
      .delete({ count: 'exact' })
      .eq('id', fileId);

    console.log('Delete result:', { error: dbError, count });

    if (dbError) {
      console.error('Database deletion failed:', dbError);
      return NextResponse.json({ error: 'Failed to delete file' }, { status: 500 });
    }

    if (count === 0) {
      console.log('No rows deleted - file may not exist');
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    console.log('Force delete successful. Rows deleted:', count);
    console.log('=== FORCE DELETE SUCCESS ===');
    
    return NextResponse.json({ 
      success: true, 
      message: 'File record deleted successfully',
      rowsDeleted: count
    });

  } catch (error) {
    console.error('Error in force delete:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 