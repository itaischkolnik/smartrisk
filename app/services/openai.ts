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

// Helper function to add timeout to promises
async function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  const timeout = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error(`Operation timed out after ${timeoutMs}ms`)), timeoutMs);
  });
  return Promise.race([promise, timeout]);
}

export async function generateBusinessAnalysis(data: BusinessData): Promise<AnalysisResult> {
  console.log('Starting business analysis generation...');
  
  // Check if OpenAI API key is set
  if (!process.env.OPENAI_API_KEY) {
    console.error('OpenAI API key not found');
    throw new Error('OpenAI API key not configured');
  }

  console.log('Initializing OpenAI client...');
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });

  try {
    console.log('Preparing analysis prompt...');
    console.log('Input data:', {
      businessDetails: data.businessDetails,
      swotAnalysis: data.swotAnalysis,
      questionnaire: data.questionnaire,
      filesCount: data.files.length
    });

    const prompt = `Analyze this business:
    
    Business Details:
    ${JSON.stringify(data.businessDetails, null, 2)}
    
    SWOT Analysis:
    ${JSON.stringify(data.swotAnalysis, null, 2)}
    
    Questionnaire Responses:
    ${JSON.stringify(data.questionnaire, null, 2)}
    
    Additional Files: ${data.files.length} files attached
    
    Please provide a comprehensive analysis in the following format:
    
    1. Executive Summary (2-3 paragraphs)
    2. Risk Assessment
       - Market Risk
       - Financial Risk
       - Operational Risk
    3. Key Findings
    4. Recommendations
    5. Risk Score
    
    Important: Keep the response focused on key insights.
    Make sure to include a clear risk score in the format 'Risk Score: X' where X is a number between 0 and 100.
    Higher scores (closer to 100) indicate lower risk.`;

    console.log('Calling OpenAI API...');
    const startTime = Date.now();
    
    // Set a 3-minute timeout for the OpenAI API call
    const completion = await withTimeout(
      openai.chat.completions.create({
        model: "gpt-4",
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
        temperature: 0.5,
        max_tokens: 2000
      }),
      180000 // 3 minutes timeout
    );

    const apiDuration = Date.now() - startTime;
    console.log(`OpenAI API call completed in ${apiDuration}ms`);

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      console.error('No content in OpenAI response:', completion);
      throw new Error('No response content received from OpenAI');
    }

    console.log('Extracting risk score...');
    // Extract risk score from the content
    const riskScoreMatch = content.match(/risk score:?\s*(\d+)/i);
    
    if (!riskScoreMatch) {
      console.warn('Risk score not found in OpenAI response, using default score');
      console.log('OpenAI response content:', content);
    }
    
    const riskScore = riskScoreMatch ? parseInt(riskScoreMatch[1]) : 50;

    // Validate risk score is within bounds
    if (isNaN(riskScore) || riskScore < 0 || riskScore > 100) {
      console.warn('Invalid risk score received:', riskScore);
      console.log('Using default score of 50');
      return {
        content,
        riskScore: 50
      };
    }

    console.log('Analysis generation completed successfully');
    console.log('Risk Score:', riskScore);
    return {
      content,
      riskScore
    };

  } catch (error) {
    console.error('Error in generateBusinessAnalysis:', error);
    if (error instanceof OpenAI.APIError) {
      console.error('OpenAI API Error:', {
        status: error.status,
        message: error.message,
        code: error.code,
        type: error.type
      });
    }
    throw new Error(error instanceof Error ? error.message : 'Failed to generate analysis');
  }
} 