import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '../../../../lib/supabase/server';

export async function GET(
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

    const assessmentId = params.id;

    // Get the assessment status
    const { data: assessment, error } = await supabase
      .from('assessments')
      .select('status, created_at, updated_at')
      .eq('id', assessmentId)
      .single();

    if (error) {
      console.error('Error fetching assessment status:', error);
      return NextResponse.json(
        { error: 'Failed to fetch assessment status' },
        { status: 500 }
      );
    }

    if (!assessment) {
      return NextResponse.json(
        { error: 'Assessment not found' },
        { status: 404 }
      );
    }

    // Calculate time elapsed
    const startTime = new Date(assessment.created_at).getTime();
    const lastUpdateTime = new Date(assessment.updated_at).getTime();
    const currentTime = new Date().getTime();
    
    const timeElapsedSeconds = Math.floor((currentTime - startTime) / 1000);
    const lastUpdateSeconds = Math.floor((currentTime - lastUpdateTime) / 1000);

    // If status is 'processing' and no updates for more than 5 minutes, consider it stuck
    const isStuck = assessment.status === 'processing' && lastUpdateSeconds > 300;

    return NextResponse.json({
      status: assessment.status,
      time_elapsed_seconds: timeElapsedSeconds,
      last_update_seconds: lastUpdateSeconds,
      is_stuck: isStuck
    });

  } catch (error) {
    console.error('Error in status check:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 