import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

// Create a Supabase server client
const createServerSupabaseClient = () => {
  const cookieStore = cookies();
  
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    {
      global: {
        headers: {
          cookie: cookieStore.toString(),
        },
      },
    }
  );
};

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const assessmentId = params.id;

    if (!assessmentId) {
      return NextResponse.json(
        { error: 'Assessment ID is required' },
        { status: 400 }
      );
    }

    // Create a Supabase client for server-side auth
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

    // Fetch assessment
    const { data: assessment, error: assessmentError } = await supabase
      .from('assessments')
      .select('*')
      .eq('id', assessmentId)
      .eq('user_id', userId)
      .single();

    if (assessmentError) {
      console.error('Error fetching assessment:', assessmentError);
      return NextResponse.json(
        { error: 'Failed to fetch assessment' },
        { status: 500 }
      );
    }

    if (!assessment) {
      return NextResponse.json(
        { error: 'Assessment not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(assessment);
  } catch (error) {
    console.error('Error in assessment GET route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const assessmentId = params.id;
    const body = await request.json();

    // Create a Supabase client for server-side auth
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

    // Verify that the assessment belongs to the user
    const { data: existingAssessment, error: verifyError } = await supabase
      .from('assessments')
      .select('id')
      .eq('id', assessmentId)
      .eq('user_id', userId)
      .single();

    if (verifyError || !existingAssessment) {
      return NextResponse.json(
        { error: 'Assessment not found or unauthorized' },
        { status: 404 }
      );
    }

    // Update the assessment
    const { data, error } = await supabase
      .from('assessments')
      .update({
        ...body,
        updated_at: new Date().toISOString(),
      })
      .eq('id', assessmentId)
      .select()
      .single();

    if (error) {
      console.error('Error updating assessment:', error);
      return NextResponse.json(
        { error: 'Failed to update assessment' },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in assessment PUT route:', error);
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
    const assessmentId = params.id;

    // Create a Supabase client for server-side auth
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

    // Verify that the assessment belongs to the user
    const { data: existingAssessment, error: verifyError } = await supabase
      .from('assessments')
      .select('id')
      .eq('id', assessmentId)
      .eq('user_id', userId)
      .single();

    if (verifyError || !existingAssessment) {
      return NextResponse.json(
        { error: 'Assessment not found or unauthorized' },
        { status: 404 }
      );
    }

    // First delete all assessment_data entries
    const { error: deleteDataError } = await supabase
      .from('assessment_data')
      .delete()
      .eq('assessment_id', assessmentId);

    if (deleteDataError) {
      console.error('Error deleting assessment data:', deleteDataError);
      return NextResponse.json(
        { error: 'Failed to delete assessment data' },
        { status: 500 }
      );
    }

    // List and delete files from storage
    const { data: files, error: listError } = await supabase
      .storage
      .from('assessment-files')
      .list(`${userId}/${assessmentId}`);

    if (listError) {
      console.error('Error listing files:', listError);
      return NextResponse.json(
        { error: 'Failed to list assessment files' },
        { status: 500 }
      );
    }

    if (files && files.length > 0) {
      const filePaths = files.map(file => `${userId}/${assessmentId}/${file.name}`);
      const { error: deleteStorageError } = await supabase
        .storage
        .from('assessment-files')
        .remove(filePaths);

      if (deleteStorageError) {
        console.error('Error deleting files from storage:', deleteStorageError);
        return NextResponse.json(
          { error: 'Failed to delete assessment files' },
          { status: 500 }
        );
      }
    }

    // Finally delete the assessment itself
    const { error } = await supabase
      .from('assessments')
      .delete()
      .eq('id', assessmentId)
      .eq('user_id', userId);

    if (error) {
      console.error('Error deleting assessment:', error);
      return NextResponse.json(
        { error: 'Failed to delete assessment' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in assessment DELETE route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 