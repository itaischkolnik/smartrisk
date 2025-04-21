import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { generateBusinessAnalysis } from '@/services/openai';
import { generateAnalysisPDF } from '@/services/pdf';
import { sendEmail } from '@/services/email';
import { AnalysisStatus } from '@/types/analysis';

export async function POST(
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

    const userId = session.user.id;
    const assessmentId = params.id;

    // Create analysis record with pending status
    const { data: analysis, error: createError } = await supabase
      .from('analyses')
      .insert({
        assessment_id: assessmentId,
        user_id: userId,
        status: 'pending',
        analysis_content: {},
      })
      .select()
      .single();

    if (createError) {
      console.error('Error creating analysis record:', createError);
      return NextResponse.json(
        { error: 'Failed to create analysis' },
        { status: 500 }
      );
    }

    // Start async analysis process
    (async () => {
      try {
        // Update status to processing
        await supabase
          .from('analyses')
          .update({ 
            status: 'processing',
            updated_at: new Date().toISOString()
          })
          .eq('id', analysis.id);

        // Step 1: Fetch all necessary data
        const [
          { data: assessmentData },
          { data: financialData },
          { data: files }
        ] = await Promise.all([
          supabase
            .from('assessments')
            .select('*')
            .eq('id', assessmentId)
            .single(),
          supabase
            .from('assessment_data')
            .select('data')
            .eq('assessment_id', assessmentId)
            .eq('section', 'financial')
            .single(),
          supabase
            .from('files')
            .select('*')
            .eq('assessment_id', assessmentId)
        ]);

        if (!assessmentData) {
          throw new Error('Assessment data not found');
        }

        // Step 2: Generate analysis using OpenAI
        const { content, riskScores } = await generateBusinessAnalysis({
          businessDetails: assessmentData,
          financialData: financialData?.data || {},
          swotAnalysis: assessmentData.swot_analysis,
          questionnaire: assessmentData.questionnaire,
          files: files || [],
        });

        // Update progress after analysis generation
        await supabase
          .from('analyses')
          .update({
            analysis_content: content,
            overall_risk_score: riskScores.overall,
            business_risk_score: riskScores.business,
            financial_risk_score: riskScores.financial,
            market_risk_score: riskScores.market,
            swot_risk_score: riskScores.swot,
            updated_at: new Date().toISOString()
          })
          .eq('id', analysis.id);

        // Step 3: Generate PDF
        const pdfBuffer = await generateAnalysisPDF({
          id: analysis.id,
          assessmentId,
          userId,
          status: 'completed',
          content,
          riskScores,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });

        // Step 4: Upload PDF to storage
        const pdfFileName = `${userId}/${assessmentId}/analysis.pdf`;
        const { data: uploadData, error: uploadError } = await supabase
          .storage
          .from('assessment-files')
          .upload(pdfFileName, pdfBuffer, {
            contentType: 'application/pdf',
            cacheControl: '3600',
            upsert: true
          });

        if (uploadError) {
          throw uploadError;
        }

        // Get PDF URL
        const { data: { publicUrl } } = supabase
          .storage
          .from('assessment-files')
          .getPublicUrl(pdfFileName);

        // Step 5: Update analysis record with results
        await supabase
          .from('analyses')
          .update({
            status: 'completed',
            pdf_url: publicUrl,
            updated_at: new Date().toISOString()
          })
          .eq('id', analysis.id);

        // Step 6: Send email with analysis
        if (session.user.email) {
          await sendEmail(
            {
              to: session.user.email,
              from: 'noreply@smartrisk.ai'
            },
            'Your SmartRisk Analysis Results',
            content
          );
        }

      } catch (error: unknown) {
        console.error('Error in analysis process:', error);
        
        // Update analysis record with error status
        await supabase
          .from('analyses')
          .update({
            status: 'failed',
            error_message: error instanceof Error ? error.message : 'An unknown error occurred',
            updated_at: new Date().toISOString()
          })
          .eq('id', analysis.id);
      }
    })();

    // Return immediate response
    return NextResponse.json({
      message: 'Analysis started',
      analysisId: analysis.id,
    });

  } catch (error) {
    console.error('Error in analysis endpoint:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 