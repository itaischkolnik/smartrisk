import OpenAI from 'openai';

interface BusinessData {
  businessDetails: any;
  swotAnalysis: any;
  questionnaire: any;
  files: any[];
}

interface AnalysisResult {
  content: string;
  riskScore: number;
}

export async function generateBusinessAnalysis(data: BusinessData): Promise<AnalysisResult> {
  // Check if OpenAI API key is set
  if (!process.env.OPENAI_API_KEY) {
    console.warn('OpenAI API key not found, using mock implementation');
    return {
      content: 'This is a mock analysis. Please set up your OpenAI API key for real analysis.',
      riskScore: 50
    };
  }

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });

  try {
    const prompt = `Analyze this business:
    Business Details: ${JSON.stringify(data.businessDetails)}
    SWOT Analysis: ${JSON.stringify(data.swotAnalysis)}
    Questionnaire Responses: ${JSON.stringify(data.questionnaire)}
    Additional Files: ${data.files.length} files attached
    
    Provide a comprehensive analysis including:
    1. Business Overview
    2. Risk Assessment
    3. Recommendations
    4. Action Items
    
    Also calculate a risk score from 0-100 (where 100 is lowest risk).`;

    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "You are a business risk analysis expert. Provide detailed analysis and concrete recommendations."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    });

    if (!response.choices[0]?.message?.content) {
      throw new Error('No response from OpenAI');
    }

    // Extract risk score from the content (assuming it's mentioned in the text)
    const content = response.choices[0].message.content;
    const riskScoreMatch = content.match(/risk score:?\s*(\d+)/i);
    const riskScore = riskScoreMatch ? parseInt(riskScoreMatch[1]) : 50;

    return {
      content,
      riskScore
    };

  } catch (error) {
    console.error('Error calling OpenAI:', error);
    throw error;
  }
} 