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

    console.log('Fetching assessment data...');
    // Fetch assessment data
    let assessment;
    try {
      const { data, error } = await supabase
        .from('assessments')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Database error fetching assessment:', error);
        throw error;
      }
      if (!data) {
        console.log('Assessment not found');
        return NextResponse.json({ error: 'Assessment not found' }, { status: 404 });
      }
      assessment = data;
      console.log('Assessment data fetched:', {
        id: assessment.id,
        status: assessment.status,
        hasBusinessDetails: !!assessment.business_details,
        hasSwotAnalysis: !!assessment.swot_analysis,
        hasQuestionnaire: !!assessment.questionnaire
      });
    } catch (error) {
      console.error('Error fetching assessment:', error);
      return NextResponse.json({ 
        error: 'Failed to fetch assessment data',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, { status: 500 });
    }

    console.log('Updating assessment status to processing...');
    // Update assessment status to processing
    try {
      const { error: updateError } = await supabase
        .from('assessments')
        .update({ 
          status: 'processing',
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (updateError) {
        console.error('Error updating assessment status:', updateError);
        throw updateError;
      }
      console.log('Status updated to processing');
    } catch (error) {
      console.error('Error updating assessment status:', error);
      return NextResponse.json({ 
        error: 'Failed to update assessment status',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, { status: 500 });
    }

    console.log('Starting analysis generation...');
    // Generate analysis
    let analysisResult;
    try {
      // Validate required data
      if (!assessment.business_details) {
        throw new Error('Business details are required for analysis');
      }
      if (!assessment.swot_analysis) {
        throw new Error('SWOT analysis is required for analysis');
      }
      if (!assessment.questionnaire) {
        throw new Error('Questionnaire responses are required for analysis');
      }

      analysisResult = await generateBusinessAnalysis({
        businessDetails: assessment.business_details,
        swotAnalysis: assessment.swot_analysis,
        questionnaire: assessment.questionnaire,
        files: assessment.files || []
      });
      console.log('Analysis generated successfully');

      if (!analysisResult?.content) {
        throw new Error('No analysis content received');
      }

      console.log('Updating assessment with analysis results...');
      // Update assessment with analysis
      const { error: updateError } = await supabase
        .from('assessments')
        .update({
          analysis: analysisResult.content,
          risk_score: analysisResult.riskScore,
          status: 'completed',
          completed_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (updateError) {
        throw new Error(`Failed to update assessment with analysis: ${updateError.message}`);
      }
      console.log('Assessment updated with analysis results');

      console.log('Sending email notification...');
      // Send email with results
      try {
        await sendEmail({
          to: session.user.email,
          subject: 'Your SmartRisk Analysis is Ready',
          businessName: assessment.business_details?.name || 'Your Business',
          businessType: assessment.business_details?.type,
          analysis: analysisResult.content,
          riskScore: analysisResult.riskScore
        });
        console.log('Email sent successfully');
      } catch (emailError) {
        console.error('Error sending email:', emailError);
        // Don't fail the request if email fails, just log it
      }

      const totalDuration = Date.now() - startTime;
      console.log(`Analysis process completed in ${totalDuration}ms`);
      
      return NextResponse.json({ 
        success: true, 
        message: 'Analysis completed successfully',
        riskScore: analysisResult.riskScore
      });

    } catch (error) {
      console.error('Error generating analysis:', error);
      try {
        await supabase
          .from('assessments')
          .update({ 
            status: 'failed',
            error_message: error instanceof Error ? error.message : 'Unknown error',
            updated_at: new Date().toISOString()
          })
          .eq('id', id);
      } catch (updateError) {
        console.error('Error updating assessment status after failure:', updateError);
      }
      
      return NextResponse.json({ 
        error: error instanceof Error ? error.message : 'Failed to generate analysis',
        details: error instanceof Error ? error.stack : undefined
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Unexpected error in analyze route:', error);
    
    // Try to update assessment status to failed
    try {
      const supabase = createServerSupabaseClient();
      await supabase
        .from('assessments')
        .update({ 
          status: 'failed',
          error_message: error instanceof Error ? error.message : 'Unknown error',
          updated_at: new Date().toISOString()
        })
        .eq('id', params.id);
    } catch (updateError) {
      console.error('Failed to update assessment status to failed:', updateError);
    }

    const totalDuration = Date.now() - startTime;
    console.log(`Analysis process failed after ${totalDuration}ms`);

    return NextResponse.json({ 
      error: 'An unexpected error occurred',
      details: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
} 