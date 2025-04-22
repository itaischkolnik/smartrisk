import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { generateBusinessAnalysis } from '@/services/openai';
import { generateAnalysisPDF } from '@/services/pdf';
import { sendEmail } from '@/services/email';
import { AnalysisStatus } from '@/types/analysis';
import { auth } from '@/lib/supabase/auth';

// Configure runtime
export const runtime = 'edge';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    if (!id) {
      return Response.json({ error: 'Assessment ID is required' }, { status: 400 });
    }

    // Get user session
    const session = await auth();
    if (!session?.user?.email) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Create a Supabase client
    const supabase = createServerSupabaseClient();

    // Update assessment status to processing
    try {
      await supabase
        .from('assessments')
        .update({ 
          status: 'processing',
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
    } catch (error) {
      console.error('Error updating assessment status:', error);
      return Response.json({ error: 'Failed to update assessment status' }, { status: 500 });
    }

    // Fetch assessment data
    let assessment;
    try {
      const { data, error } = await supabase
        .from('assessments')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!data) {
        return Response.json({ error: 'Assessment not found' }, { status: 404 });
      }
      assessment = data;
    } catch (error) {
      console.error('Error fetching assessment:', error);
      await supabase
        .from('assessments')
        .update({ 
          status: 'failed',
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
      return Response.json({ error: 'Failed to fetch assessment data' }, { status: 500 });
    }

    // Generate analysis
    let analysisResult;
    try {
      analysisResult = await generateBusinessAnalysis({
        businessDetails: assessment.businessDetails,
        swotAnalysis: assessment.swotAnalysis,
        questionnaire: assessment.questionnaire,
        files: assessment.files || []
      });

      // Update assessment with analysis
      await supabase
        .from('assessments')
        .update({
          analysis: analysisResult.content,
          riskScore: analysisResult.riskScore,
          status: 'completed',
          completedAt: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      // Send email with results
      try {
        await sendEmail({
          to: session.user.email,
          subject: 'Your SmartRisk Analysis is Ready',
          businessName: assessment.businessDetails?.name || 'Your Business',
          analysis: analysisResult.content,
          riskScore: analysisResult.riskScore
        });
      } catch (emailError) {
        console.error('Error sending email:', emailError);
        // Don't fail the request if email fails, just log it
      }

      return Response.json({ 
        success: true, 
        message: 'Analysis completed successfully',
        riskScore: analysisResult.riskScore
      });

    } catch (error) {
      console.error('Error generating analysis:', error);
      await supabase
        .from('assessments')
        .update({ 
          status: 'failed',
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
      
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate analysis';
      return Response.json({ error: errorMessage }, { status: 500 });
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
          updated_at: new Date().toISOString()
        })
        .eq('id', params.id);
    } catch (updateError) {
      console.error('Failed to update assessment status to failed:', updateError);
    }

    return Response.json({ 
      error: 'An unexpected error occurred',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 