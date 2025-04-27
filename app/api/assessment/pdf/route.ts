import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '../../../lib/supabase/server';
import { sendEmail } from '../../../services/email';

export async function POST(request: Request) {
  try {
    const { assessmentId } = await request.json();

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

    // Fetch the assessment with analysis
    const { data: assessment, error: assessmentError } = await supabase
      .from('assessments')
      .select('*')
      .eq('id', assessmentId)
      .eq('user_id', userId)
      .single();

    if (assessmentError || !assessment) {
      console.error('Error fetching assessment:', assessmentError);
      return NextResponse.json(
        { error: 'Assessment not found' },
        { status: 404 }
      );
    }

    if (assessment.status !== 'completed' || !assessment.analysis) {
      return NextResponse.json(
        { error: 'Assessment analysis not available' },
        { status: 400 }
      );
    }

    // Send email with analysis
    if (!session.user.email) {
        return NextResponse.json(
        { error: 'User email not found' },
        { status: 400 }
        );
      }

    const { success, error: emailError } = await sendEmail({
      to: session.user.email,
      subject: `SmartRisk Analysis - ${assessment.business_details?.business_name || 'Your Business'}`,
      businessName: assessment.business_details?.business_name,
      businessType: assessment.business_details?.business_type,
      riskScore: assessment.risk_score,
      analysis: assessment.analysis
    });

    if (!success) {
      console.error('Error sending email:', emailError);
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Analysis sent to your email'
    });

  } catch (error) {
    console.error('Error in email sending endpoint:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 