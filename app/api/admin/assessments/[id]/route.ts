import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '../../../../lib/supabase/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    console.log('Admin assessment detail API called for ID:', params.id);
    const assessmentId = params.id;

    if (!assessmentId) {
      return NextResponse.json(
        { error: 'Assessment ID is required' },
        { status: 400 }
      );
    }

    // Create a Supabase client for server-side auth
    const supabase = createServerSupabaseClient();

    try {
      // Check if user is authenticated
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        console.error('Session error:', sessionError);
        return NextResponse.json(
          { error: 'Authentication error' },
          { status: 500 }
        );
      }
      
      if (!session) {
        console.log('No session found');
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        );
      }

      console.log('User authenticated:', session.user.email);

      // Check if user is admin
      const { data: adminCheck, error: adminError } = await supabase
        .from('admin_roles')
        .select('is_admin')
        .eq('email', session.user.email)
        .single();

      if (adminError) {
        console.error('Admin check error:', adminError);
        return NextResponse.json(
          { error: 'Admin verification failed' },
          { status: 500 }
        );
      }

      if (!adminCheck || !adminCheck.is_admin) {
        console.log('Admin check failed: Not admin');
        return NextResponse.json(
          { error: 'Admin access required' },
          { status: 403 }
        );
      }

      console.log('Admin authenticated, fetching assessment...');

      // First, let's check if the assessment exists
      const { data: assessmentExists, error: existsError } = await supabase
        .from('assessments')
        .select('id')
        .eq('id', assessmentId)
        .single();

      if (existsError) {
        console.error('Assessment exists check error:', existsError);
        if (existsError.code === 'PGRST116') {
          return NextResponse.json(
            { error: 'Assessment not found' },
            { status: 404 }
          );
        }
        return NextResponse.json(
          { error: 'Database error checking assessment' },
          { status: 500 }
        );
      }

      if (!assessmentExists) {
        return NextResponse.json(
          { error: 'Assessment not found' },
          { status: 404 }
        );
      }

      console.log('Assessment exists, fetching full data...');

      // Fetch assessment with profile data - using a simpler approach first
      const { data: assessment, error: assessmentError } = await supabase
        .from('assessments')
        .select('*')
        .eq('id', assessmentId)
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

      console.log('Assessment fetched, fetching profile...');

      // Fetch profile data separately
      let profile = null;
      try {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', assessment.user_id)
          .single();

        if (profileError) {
          console.error('Error fetching profile:', profileError);
          // Don't fail the request, just log the error
        } else {
          profile = profileData;
        }
      } catch (profileErr) {
        console.error('Profile fetch exception:', profileErr);
      }

      console.log('Profile fetched, fetching assessment data...');

      // Fetch assessment data (all sections)
      let assessmentData = [];
      try {
        const { data: dataResult, error: dataError } = await supabase
          .from('assessment_data')
          .select('*')
          .eq('assessment_id', assessmentId)
          .order('section');

        if (dataError) {
          console.error('Error fetching assessment data:', dataError);
          // Don't fail the request, just log the error
        } else {
          assessmentData = dataResult || [];
        }
      } catch (dataErr) {
        console.error('Assessment data fetch exception:', dataErr);
      }

      console.log('Assessment data fetched, fetching files...');

      // Fetch files
      let files = [];
      try {
        const { data: filesResult, error: filesError } = await supabase
          .from('files')
          .select('*')
          .eq('assessment_id', assessmentId)
          .order('created_at');

        if (filesError) {
          console.error('Error fetching files:', filesError);
          // Don't fail the request, just log the error
        } else {
          files = filesResult || [];
        }
      } catch (filesErr) {
        console.error('Files fetch exception:', filesErr);
      }

      console.log('Files fetched, combining data...');

      // Combine all data
      const fullAssessment = {
        ...assessment,
        profiles: profile || null,
        assessment_data: assessmentData,
        files: files
      };

      console.log('Assessment data combined successfully, returning response');
      return NextResponse.json(fullAssessment);
    } catch (authError) {
      console.error('Authentication/authorization error:', authError);
      return NextResponse.json(
        { error: 'Authentication failed' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in admin assessment GET route:', error);
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
    console.log('Admin assessment delete API called for ID:', params.id);
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
      console.log('No session found');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('User authenticated:', session.user.email);

    // Check if user is admin
    const { data: adminCheck, error: adminError } = await supabase
      .from('admin_roles')
      .select('is_admin')
      .eq('email', session.user.email)
      .single();

    if (adminError || !adminCheck || !adminCheck.is_admin) {
      console.log('Admin check failed:', adminError || 'Not admin');
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    console.log('Admin authenticated, deleting assessment...');

    // Delete the assessment (this will cascade to assessment_data and files)
    const { error: deleteError } = await supabase
      .from('assessments')
      .delete()
      .eq('id', assessmentId);

    if (deleteError) {
      console.error('Error deleting assessment:', deleteError);
      return NextResponse.json(
        { error: 'Failed to delete assessment' },
        { status: 500 }
      );
    }

    console.log('Assessment deleted successfully');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in admin assessment DELETE route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
