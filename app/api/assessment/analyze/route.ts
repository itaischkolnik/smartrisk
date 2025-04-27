import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '../../../lib/supabase/server';
import { cookies } from 'next/headers';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
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
    const { assessmentId } = await request.json();

    if (!assessmentId) {
      return NextResponse.json(
        { error: 'Assessment ID is required' },
        { status: 400 }
      );
    }

    // Fetch the assessment
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

    // Generate analysis using OpenAI
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
      2. Market Analysis and Competition
      3. Detailed Risk Analysis (by business area)
      4. Financial Viability Assessment
      5. Operational Risks and Mitigation Strategies
      6. Legal and Regulatory Compliance Analysis
      7. Technology and Infrastructure Assessment
      8. Human Resources and Management Evaluation
      9. Growth Potential and Scalability Analysis
      10. Strategic Recommendations
      11. Risk Score (0-100, where 0 is extremely risky and 100 is very safe)
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "אתה מומחה לניתוח סיכונים עסקיים. ספק תובנות קצרות ופרקטיות בעברית נכונה וללא שגיאות דקדוק."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.5,
      max_tokens: 2500
    });

    const analysis = completion.choices[0]?.message?.content || '';
    
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
    const { error: updateError } = await supabase
      .from('assessments')
      .update({
        analysis: analysis,
        risk_score: riskScore,
        status: 'completed',
        updated_at: new Date().toISOString(),
      })
      .eq('id', assessmentId);

    if (updateError) {
      console.error('Error saving analysis:', updateError);
      return NextResponse.json(
        { error: 'Failed to save analysis' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      analysis,
      riskScore,
    });
  } catch (error) {
    console.error('Error in analysis:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 