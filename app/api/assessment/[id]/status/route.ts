import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

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

    // Get the analysis status
    const { data: analysis, error } = await supabase
      .from('analyses')
      .select('status, error_message, created_at, updated_at')
      .eq('assessment_id', assessmentId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.error('Error fetching analysis status:', error);
      return NextResponse.json(
        { error: 'Failed to fetch analysis status' },
        { status: 500 }
      );
    }

    if (!analysis) {
      return NextResponse.json(
        { error: 'Analysis not found' },
        { status: 404 }
      );
    }

    // Calculate time elapsed
    const startTime = new Date(analysis.created_at).getTime();
    const lastUpdateTime = new Date(analysis.updated_at).getTime();
    const currentTime = new Date().getTime();
    
    const timeElapsedSeconds = Math.floor((currentTime - startTime) / 1000);
    const lastUpdateSeconds = Math.floor((currentTime - lastUpdateTime) / 1000);

    // If status is 'processing' and no updates for more than 5 minutes, consider it stuck
    const isStuck = analysis.status === 'processing' && lastUpdateSeconds > 300;

    return NextResponse.json({
      status: analysis.status,
      error_message: analysis.error_message,
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