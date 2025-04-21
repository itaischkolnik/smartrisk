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

// Create a promise with timeout
async function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  const timeout = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error(`Operation timed out after ${timeoutMs}ms`)), timeoutMs);
  });

  return Promise.race([promise, timeout]);
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
    
    Also calculate a risk score from 0-100 (where 100 is lowest risk).
    
    Important: Keep the response concise and focused on key insights.`;

    // Set a 25-second timeout for the OpenAI API call
    const response = await withTimeout(
      openai.chat.completions.create({
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
        max_tokens: 1500 // Reduced token limit for faster response
      }),
      25000 // 25 seconds timeout
    );

    if (!response.choices[0]?.message?.content) {
      throw new Error('No response received from OpenAI');
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
    if (error instanceof Error) {
      if (error.message.includes('timed out')) {
        throw new Error('Analysis is taking longer than expected. Please try again.');
      }
    }
    throw error;
  }
} 