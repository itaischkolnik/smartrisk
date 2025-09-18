import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { generateBusinessAnalysis } from '@/services/openai';
import { sendEmail } from '@/services/email';
import { auth } from '@/lib/supabase/auth';

// Configure runtime - using nodejs to support pdf-parse
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const startTime = Date.now();
  console.log('Starting analysis process...', { assessmentId: params.id });
  
  try {
    const { id } = params;
    if (!id) {
      console.log('Missing assessment ID');
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
    console.log('Creating Supabase client...');
    const supabase = createServerSupabaseClient();

    // Create an analysis record
    console.log('Creating analysis record...');
    const { data: analysis, error: createError } = await supabase
      .from('analyses')
      .insert({
        assessment_id: id,
        user_id: session.user.id,
        status: 'processing',
        analysis_content: {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (createError) {
      console.error('Error creating analysis record:', createError);
      return NextResponse.json({ error: 'Failed to create analysis record' }, { status: 500 });
    }

    // Fetch assessment data from assessment_data table
    console.log('Fetching assessment sections...');
    const { data: sections, error: sectionsError } = await supabase
      .from('assessment_data')
      .select('section, data')
      .eq('assessment_id', id);

    if (sectionsError) {
      console.error('Error fetching assessment sections:', sectionsError);
      await updateAnalysisStatus(supabase, analysis.id, 'failed', 'Failed to fetch assessment data');
      return NextResponse.json({ error: 'Failed to fetch assessment data' }, { status: 500 });
    }

    console.log('Sections found:', sections?.length || 0);

    // Convert sections array to an object for easier access
    const sectionData = sections?.reduce((acc, section) => {
      acc[section.section] = section.data;
      return acc;
    }, {} as Record<string, any>) || {};

    console.log('Available sections:', Object.keys(sectionData));

    try {
      // Format data for OpenAI analysis
      const analysisData = {
        businessDetails: sectionData.business_details || {},
        swotAnalysis: sectionData.swot_analysis || {},
        personalQuestionnaire: sectionData.personal_questionnaire || {},
        files: [] // We'll handle files later if needed
      };

      console.log('Data being sent to OpenAI:', JSON.stringify(analysisData, null, 2));

      console.log('Calling OpenAI service...');
      const analysisResult = await generateBusinessAnalysis(analysisData);
      console.log('Analysis generated successfully');

      // Update analysis record with results
      console.log('Saving analysis results...');
      const { error: saveError } = await supabase
        .from('analyses')
        .update({
          analysis_content: analysisResult.content,
          overall_risk_score: analysisResult.riskScore / 10, // Convert 0-100 to 0-10
          status: 'completed',
          updated_at: new Date().toISOString()
        })
        .eq('id', analysis.id);

      if (saveError) {
        console.error('Error saving analysis:', saveError);
        throw new Error(`Failed to save analysis: ${saveError.message}`);
      }

      // Update assessment status
      console.log('Updating assessment status...');
      const { error: updateError } = await supabase
        .from('assessments')
        .update({
          status: 'analyzed',
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (updateError) {
        console.error('Error updating assessment status:', updateError);
        throw new Error(`Failed to update assessment status: ${updateError.message}`);
      }

      // Send email notification
      console.log('Sending email notification...');
      try {
        await sendEmail({
          to: session.user.email,
          subject: 'ניתוח SmartRisk שלך מוכן',
          businessName: sectionData.business_details?.business_name || 'העסק שלך',
          businessType: sectionData.business_details?.business_type || 'עסק',
          riskScore: analysisResult.riskScore,
          analysis: analysisResult.content
        });
        console.log('Email notification sent');
      } catch (emailError) {
        console.error('Error sending email notification:', emailError);
        // Don't fail the whole process if email fails
      }

      const processingTime = Date.now() - startTime;
      console.log(`Analysis completed successfully in ${processingTime}ms`);

      return NextResponse.json({
        success: true,
        message: 'Analysis completed successfully',
        riskScore: analysisResult.riskScore
      });

    } catch (error) {
      console.error('Error in analysis process:', error);
      await updateAnalysisStatus(supabase, analysis.id, 'failed', error instanceof Error ? error.message : 'Analysis generation failed');
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

async function updateAnalysisStatus(supabase: any, id: string, status: 'pending' | 'processing' | 'completed' | 'failed', errorMessage?: string) {
  try {
    console.log(`Updating analysis ${id} status to ${status}${errorMessage ? ': ' + errorMessage : ''}`);
    const update: any = {
      status,
      updated_at: new Date().toISOString()
    };
    if (errorMessage) {
      update.error_message = errorMessage;
    } else {
      update.error_message = null; // Clear error message when status is updated without an error
    }
    await supabase.from('analyses').update(update).eq('id', id);
  } catch (error) {
    console.error('Error updating analysis status:', error);
  }
} 