import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { generateBusinessAnalysis } from '@/services/openai';
import { sendEmail } from '@/services/email';
import { auth } from '@/lib/supabase/auth';

// Configure runtime
export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const startTime = Date.now();
  console.log('Starting analysis process...');
  
  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json({ error: 'Assessment ID is required' }, { status: 400 });
    }

    console.log('Getting user session...');
    // Get user session
    const session = await auth();
    if (!session?.user?.email) {
      console.log('User not authenticated');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.log('User authenticated:', session.user.email);

    // Create a Supabase client
    const supabase = createServerSupabaseClient();

    // Update status to processing
    const { error: updateError } = await supabase
      .from('assessments')
      .update({ 
        status: 'processing',
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (updateError) {
      console.error('Error updating status to processing:', updateError);
      return NextResponse.json({ error: 'Failed to update assessment status' }, { status: 500 });
    }

    console.log('Fetching assessment data...');
    // Fetch assessment and its sections
    const { data: assessment, error: assessmentError } = await supabase
      .from('assessments')
      .select('*')
      .eq('id', id)
      .single();

    if (assessmentError || !assessment) {
      console.error('Error fetching assessment:', assessmentError);
      await updateAssessmentStatus(supabase, id, 'failed', 'Failed to fetch assessment data');
      return NextResponse.json({ error: 'Assessment not found' }, { status: 404 });
    }

    try {
      // Generate analysis using OpenAI
      const analysisResult = await generateBusinessAnalysis({
        businessDetails: assessment.business_details,
        swotAnalysis: assessment.swot_analysis,
        questionnaire: assessment.questionnaire,
        files: assessment.files || []
      });

      // Update assessment with analysis
      const { error: saveError } = await supabase
        .from('assessments')
        .update({
          analysis: analysisResult.content,
          risk_score: analysisResult.riskScore,
          status: 'completed',
          completed_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (saveError) {
        throw new Error(`Failed to save analysis: ${saveError.message}`);
      }

      // Send email notification
      try {
        await sendEmail({
          to: session.user.email,
          subject: 'Your SmartRisk Analysis is Ready',
          businessName: assessment.business_details?.name,
          businessType: assessment.business_details?.type,
          riskScore: analysisResult.riskScore,
          analysis: analysisResult.content
        });
      } catch (emailError) {
        console.error('Error sending email notification:', emailError);
        // Don't fail the whole process if email fails
      }

      return NextResponse.json({
        success: true,
        message: 'Analysis completed successfully',
        riskScore: analysisResult.riskScore
      });

    } catch (error) {
      console.error('Error in analysis process:', error);
      await updateAssessmentStatus(supabase, id, 'failed', error instanceof Error ? error.message : 'Analysis generation failed');
      return NextResponse.json({ 
        error: 'Failed to generate analysis',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

async function updateAssessmentStatus(supabase: any, id: string, status: string, errorMessage?: string) {
  try {
    const update: any = {
      status,
      updated_at: new Date().toISOString()
    };
    if (errorMessage) {
      update.error_message = errorMessage;
    }
    await supabase.from('assessments').update(update).eq('id', id);
  } catch (error) {
    console.error('Error updating assessment status:', error);
  }
} 