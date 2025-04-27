import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import OpenAI from 'openai';

// Create a Supabase server client
const createServerSupabaseClient = () => {
  const cookieStore = cookies();
  
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    {
      global: {
        headers: {
          cookie: cookieStore.toString(),
        },
      },
    }
  );
};

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

    // Fetch the assessment with all related data
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

    // Update assessment status to processing
    const { error: updateError } = await supabase
      .from('assessments')
      .update({
        status: 'processing',
        updated_at: new Date().toISOString(),
      })
      .eq('id', assessmentId);

    if (updateError) {
      console.error('Error updating assessment status:', updateError);
      return NextResponse.json(
        { error: 'Failed to update assessment status' },
        { status: 500 }
      );
    }

    // Generate analysis using OpenAI
    try {
      // Format assessment data for OpenAI
      const prompt = `
      Please analyze this business risk assessment data and provide a comprehensive analysis:
      
      Business Details:
      ${JSON.stringify(assessment.business_details || {}, null, 2)}
      
      Personal Information:
      ${JSON.stringify(assessment.personal_details || {}, null, 2)}
      
      Questionnaire:
      ${JSON.stringify(assessment.questionnaire || {}, null, 2)}
      
      Financial Data:
      ${JSON.stringify(assessment.financial_data || {}, null, 2)}
      
      SWOT Analysis:
      ${JSON.stringify(assessment.swot_analysis || {}, null, 2)}
      
      Please provide:
      1. Executive Summary (2-3 paragraphs)
      2. Detailed Risk Analysis (by business area)
      3. Financial Viability Assessment
      4. Recommendations
      5. Risk Score (0-100, where 0 is extremely risky and 100 is very safe)
      `;

      const response = await openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
          {
            role: "system",
            content: "אתה מומחה לניתוח סיכונים עסקיים. ספק תובנות קצרות ופרקטיות בעברית נכונה וללא שגיאות דקדוק."
          },
          { role: "user", content: prompt }
        ],
        temperature: 0.5,
        max_tokens: 2500,
      });

      const analysis = response.choices[0]?.message?.content || '';
      
      // Extract risk score from analysis
      let riskScore = 50; // Default score
      const scoreMatch = analysis.match(/Risk Score:?\s*(\d+)/i);
      if (scoreMatch && scoreMatch[1]) {
        riskScore = parseInt(scoreMatch[1], 10);
        if (isNaN(riskScore) || riskScore < 0 || riskScore > 100) {
          riskScore = 50; // Default if parsing fails
        }
      }

      // Update assessment with analysis
      const { error: analysisError } = await supabase
        .from('assessments')
        .update({
          status: 'completed',
          analysis: analysis,
          risk_score: riskScore,
          updated_at: new Date().toISOString(),
        })
        .eq('id', assessmentId);

      if (analysisError) {
        console.error('Error saving analysis:', analysisError);
        return NextResponse.json(
          { error: 'Failed to save analysis' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Assessment submitted for analysis',
        assessmentId,
      });
    } catch (aiError) {
      console.error('Error generating analysis with OpenAI:', aiError);
      
      // Update assessment status to error
      await supabase
        .from('assessments')
        .update({
          status: 'error',
          updated_at: new Date().toISOString(),
        })
        .eq('id', assessmentId);
      
      return NextResponse.json(
        { error: 'Failed to generate analysis' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in assessment submission:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 