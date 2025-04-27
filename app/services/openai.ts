import OpenAI from 'openai';

interface BusinessData {
  businessDetails: any;
  swotAnalysis: any;
  personalQuestionnaire: any;
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
      personalQuestionnaire: data.personalQuestionnaire,
      filesCount: data.files.length
    });

    const prompt = `נתח את העסק הזה בקצרה:
    
    פרטי העסק:
    ${JSON.stringify(data.businessDetails, null, 2)}
    
    ניתוח SWOT:
    ${JSON.stringify(data.swotAnalysis, null, 2)}
    
    שאלון אישי:
    ${JSON.stringify(data.personalQuestionnaire, null, 2)}
    
    קבצים נוספים: ${data.files.length} קבצים מצורפים
    
    אנא ספק ניתוח תמציתי הכולל:
    
    1. גורמי סיכון עיקריים (2-3 נקודות)
    2. המלצות מהירות (2-3 נקודות)
    3. ציון סיכון
    
    חשוב: היה תמציתי וממוקד.
    כלול ציון סיכון בפורמט 'ציון סיכון: X' כאשר X הוא מספר בין 0 ל-100.
    ציונים גבוהים יותר (קרובים ל-100) מציינים סיכון נמוך יותר.`;

    console.log('Calling OpenAI API...');
    const startTime = Date.now();
    
    // Set a 2-minute timeout for the OpenAI API call
    const completion = await withTimeout(
      openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "אתה מומחה לניתוח סיכונים עסקיים. ספק תובנות קצרות ופרקטיות בעברית."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.5,
        max_tokens: 1000
      }),
      120000 // 2 minutes timeout
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