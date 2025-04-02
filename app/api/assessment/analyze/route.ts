import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request body
    const { assessmentId } = await req.json();
    if (!assessmentId) {
      return NextResponse.json({ error: 'Assessment ID is required' }, { status: 400 });
    }

    // Initialize Supabase Admin Client
    const supabase = createServerSupabaseClient();

    // Check if assessment exists and belongs to the user
    const { data: assessment, error: assessmentError } = await supabase
      .from('assessments')
      .select('*')
      .eq('id', assessmentId)
      .eq('user_id', session.user.id)
      .single();

    if (assessmentError || !assessment) {
      console.error('Error finding assessment:', assessmentError);
      return NextResponse.json({ error: 'Assessment not found' }, { status: 404 });
    }

    // Get all assessment data
    const { data: assessmentData, error: dataError } = await supabase
      .from('assessment_data')
      .select('*')
      .eq('assessment_id', assessmentId);

    if (dataError) {
      console.error('Error fetching assessment data:', dataError);
      return NextResponse.json({ error: 'Failed to fetch assessment data' }, { status: 500 });
    }

    // Organize data by section
    const dataBySection: Record<string, any> = {};
    assessmentData.forEach(item => {
      dataBySection[item.section] = item.data;
    });

    // Get files
    const { data: files, error: filesError } = await supabase
      .from('files')
      .select('*')
      .eq('assessment_id', assessmentId);

    if (filesError) {
      console.error('Error fetching files:', filesError);
      return NextResponse.json({ error: 'Failed to fetch files' }, { status: 500 });
    }

    // Format the business data
    const businessData = dataBySection.business || {};
    const financialData = dataBySection.financial || {};
    const marketData = dataBySection.market || {};

    // Prepare data for OpenAI analysis
    const businessInfo = `
      Business Name: ${businessData.businessName || 'N/A'}
      Business Type: ${businessData.businessType || 'N/A'}
      Location: ${businessData.businessLocation || 'N/A'}
      Size (employees): ${businessData.businessSize || 'N/A'}
      Years of Operation: ${businessData.yearsOfOperation || 'N/A'}
    `;

    const financialInfo = `
      Asking Price: ₪${Number(financialData.askingPrice || 0).toLocaleString()}
      Annual Revenue: ₪${Number(financialData.annualRevenue || 0).toLocaleString()}
      Annual Profit: ₪${Number(financialData.annualProfit || 0).toLocaleString()}
      Assets: ₪${Number(financialData.assets || 0).toLocaleString()}
      Liabilities: ₪${Number(financialData.liabilities || 0).toLocaleString()}
    `;

    const marketInfo = `
      Main Competitors: ${marketData.mainCompetitors || 'N/A'}
      Market Trends: ${marketData.marketTrends || 'N/A'}
      Growth Potential: ${marketData.growthPotential || 'N/A'}
    `;

    const filesInfo = files.length > 0 
      ? `Uploaded Files: ${files.map(f => f.file_name).join(', ')}`
      : 'No files uploaded';

    // Calculate some financial metrics
    const askingPrice = Number(financialData.askingPrice || 0);
    const annualProfit = Number(financialData.annualProfit || 0);
    const roi = askingPrice > 0 ? (annualProfit / askingPrice) * 100 : 0;
    const paybackPeriod = annualProfit > 0 ? askingPrice / annualProfit : 0;

    const financialMetrics = `
      Return on Investment (ROI): ${roi.toFixed(2)}%
      Payback Period: ${paybackPeriod.toFixed(2)} years
    `;

    // Perform AI analysis
    const prompt = `
      You are an expert business analyst specializing in risk assessment for business purchases.
      Please provide a comprehensive analysis of the following business opportunity in HEBREW.
      
      ## Business Information
      ${businessInfo}
      
      ## Financial Information
      ${financialInfo}
      
      ## Key Financial Metrics
      ${financialMetrics}
      
      ## Market Analysis
      ${marketInfo}
      
      ## Additional Information
      ${filesInfo}
      
      Please provide a detailed risk assessment divided into the following sections:
      1. Business Overview: A brief summary of the business
      2. Financial Analysis: Evaluate the financial health and reasonableness of the asking price
      3. Market Analysis: Assess the competitive landscape and growth potential
      4. Risk Factors: Identify key risks and challenges
      5. Opportunities: Highlight potential growth opportunities
      6. Recommendations: Provide a clear recommendation whether to proceed with the purchase
      
      Use bullet points where appropriate. Be realistic but diplomatic in your assessment.
    `;

    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-4-0125-preview",
      messages: [
        { role: "system", content: "You are an expert business analyst specializing in risk assessment for business purchases. Your analysis is detailed, objective, and follows the structured format requested." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
    });

    const analysis = chatCompletion.choices[0].message.content;

    // Update the assessment with the analysis
    const { error: updateError } = await supabase
      .from('assessments')
      .update({
        status: 'completed',
        summary: analysis,
        updated_at: new Date().toISOString(),
      })
      .eq('id', assessmentId);

    if (updateError) {
      console.error('Error updating assessment with analysis:', updateError);
      return NextResponse.json({ error: 'Failed to update assessment' }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      analysis,
      metrics: {
        roi: roi.toFixed(2),
        paybackPeriod: paybackPeriod.toFixed(2)
      }
    });

  } catch (error) {
    console.error('Error analyzing assessment:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 