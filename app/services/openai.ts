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
    console.warn('Using mock implementation for development');
    return {
      content: "This is a mock analysis for development purposes.",
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
    
    Important: Keep the response concise and focused on key insights.
    Make sure to include a clear risk score in the format 'Risk Score: X' where X is a number between 0 and 100.`;

    // Set a 3-minute timeout for the OpenAI API call
    const completion = await withTimeout(
      openai.chat.completions.create({
        model: "gpt-4",  // Using more stable model
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
        temperature: 0.5,  // Lower temperature for more consistent results
        max_tokens: 2000  // Increased token limit for more detailed analysis
      }),
      180000 // 3 minutes overall timeout
    );

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response content received from OpenAI');
    }

    // Extract risk score from the content
    const riskScoreMatch = content.match(/risk score:?\s*(\d+)/i);
    
    if (!riskScoreMatch) {
      console.warn('Risk score not found in OpenAI response, using default score');
    }
    
    const riskScore = riskScoreMatch ? parseInt(riskScoreMatch[1]) : 50;

    // Validate risk score is within bounds
    if (isNaN(riskScore) || riskScore < 0 || riskScore > 100) {
      console.warn('Invalid risk score received, using default score');
      return {
        content,
        riskScore: 50
      };
    }

    return {
      content,
      riskScore
    };

  } catch (error) {
    console.error('Error calling OpenAI:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('timed out')) {
        throw new Error('הניתוח לוקח יותר זמן מהצפוי. אנא נסה שוב. אם הבעיה נמשכת, נסה לפצל את המידע לחלקים קטנים יותר.');
      }
      
      // Throw the original error with more context
      throw new Error(`כשל בייצור הניתוח: ${error.message}`);
    }
    
    // For unknown errors
    throw new Error('אירעה שגיאה בלתי צפויה במהלך ייצור הניתוח');
  }
} 