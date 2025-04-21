import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '../../../../lib/supabase/server';
import { generateBusinessAnalysis } from '../../../../services/openai';
import { generateAnalysisPDF } from '@/services/pdf';
import { sendEmail } from '../../../../services/email';
import { AnalysisStatus } from '@/types/analysis';

// Set timeout for the API route (30 seconds)
export const maxDuration = 30;

// Configure runtime
export const runtime = 'edge';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id: assessmentId } = params;

    if (!assessmentId) {
      return NextResponse.json(
        { error: 'Assessment ID is required' },
        { status: 400 }
      );
    }

    // Create a Supabase client
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

    // Step 1: Update assessment status to processing
    const { error: updateStatusError } = await supabase
      .from('assessments')
      .update({ status: 'processing' })
      .eq('id', assessmentId)
      .eq('user_id', userId);

    if (updateStatusError) {
      console.error('Error updating assessment status:', updateStatusError);
      return NextResponse.json(
        { error: 'Failed to update assessment status' },
        { status: 500 }
      );
    }

    // Step 2: Fetch assessment data
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

    // Step 3: Generate analysis using OpenAI with timeout
    try {
      const { content, riskScore } = await generateBusinessAnalysis({
        businessDetails: assessment.business_details,
        swotAnalysis: assessment.swot_analysis,
        questionnaire: assessment.questionnaire,
        files: assessment.files || []
      });

      // Step 4: Update assessment with analysis
      const { error: updateError } = await supabase
        .from('assessments')
        .update({
          analysis: content,
          risk_score: riskScore,
          status: 'completed'
        })
        .eq('id', assessmentId);

      if (updateError) {
        console.error('Error updating assessment:', updateError);
        return NextResponse.json(
          { error: 'Failed to save analysis' },
          { status: 500 }
        );
      }

      // Step 5: Send email with analysis
      if (session.user.email) {
        const { success: emailSent, error: emailError } = await sendEmail({
          to: session.user.email,
          subject: `SmartRisk Analysis - ${assessment.business_details?.business_name || 'Your Business'}`,
          businessName: assessment.business_details?.business_name,
          businessType: assessment.business_details?.business_type,
          riskScore: riskScore,
          analysis: content
        });

        if (!emailSent) {
          console.error('Error sending email:', emailError);
        }
      }

      return NextResponse.json({
        success: true,
        analysis: content,
        riskScore
      });

    } catch (analysisError) {
      // Update assessment status to failed if analysis fails
      await supabase
        .from('assessments')
        .update({
          status: 'failed',
          error_message: analysisError instanceof Error ? analysisError.message : 'Analysis failed'
        })
        .eq('id', assessmentId);

      throw analysisError;
    }

  } catch (error) {
    console.error('Error in analysis endpoint:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
} 