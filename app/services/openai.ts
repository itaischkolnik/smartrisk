import OpenAI from 'openai';
import { AnalysisContent, RiskScores } from '@/types/analysis';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface BusinessData {
  businessDetails: any;
  financialData: any;
  swotAnalysis: any;
  questionnaire: any;
  files: any[];
}

export async function generateBusinessAnalysis(data: BusinessData): Promise<{
  content: AnalysisContent;
  riskScores: RiskScores;
}> {
  const startTime = Date.now();
  console.log('Starting business analysis...');
  
  try {
    // Prepare a more concise prompt
    const prompt = `
      נתח את העסק הבא והערך את הסיכונים.
      חשוב: ענה בפורמט JSON בלבד, ללא טקסט נוסף לפני או אחרי ה-JSON.

      עסק: ${JSON.stringify({
        details: data.businessDetails,
        financial: data.financialData,
        swot: data.swotAnalysis,
        questionnaire: data.questionnaire
      })}

      מבנה ה-JSON הנדרש:
      {
        "executiveSummary": {
          "quickRecommendation": "משפט אחד",
          "keyHighlights": ["נקודה 1", "נקודה 2", "נקודה 3"]
        },
        "businessFundamentals": {
          "title": "יסודות העסק",
          "content": "תוכן",
          "riskScore": 0-10
        },
        "financialAnalysis": {
          "title": "ניתוח פיננסי",
          "content": "תוכן",
          "riskScore": 0-10
        },
        "marketAnalysis": {
          "title": "ניתוח שוק",
          "content": "תוכן",
          "riskScore": 0-10
        },
        "swotAnalysis": {
          "title": "ניתוח SWOT",
          "content": "תוכן",
          "riskScore": 0-10
        },
        "recommendations": {
          "actionItems": ["פעולה 1", "פעולה 2"],
          "riskMitigation": ["אסטרטגיה 1", "אסטרטגיה 2"],
          "investmentConsiderations": ["שיקול 1", "שיקול 2"]
        },
        "riskScores": {
          "overall": 0-10,
          "business": 0-10,
          "financial": 0-10,
          "market": 0-10,
          "swot": 0-10
        }
      }
    `;

    console.log('Sending request to OpenAI...', Date.now() - startTime, 'ms');
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "אתה יועץ עסקי המתמחה בניתוח סיכונים. עליך לענות בפורמט JSON בלבד, ללא טקסט נוסף לפני או אחרי. הקפד על תקינות ה-JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.5,
      max_tokens: 2000
    });

    console.log('Received response from OpenAI', Date.now() - startTime, 'ms');
    const content = completion.choices[0].message.content;
    if (!content) {
      throw new Error('OpenAI response content is empty');
    }

    try {
      console.log('Parsing JSON response...', Date.now() - startTime, 'ms');
      const response = JSON.parse(content.trim());

      // Extract and format the response
      const analysisContent: AnalysisContent = {
        executiveSummary: response.executiveSummary,
        businessFundamentals: response.businessFundamentals,
        financialAnalysis: response.financialAnalysis,
        marketAnalysis: response.marketAnalysis,
        swotAnalysis: response.swotAnalysis,
        recommendations: response.recommendations
      };

      const riskScores: RiskScores = response.riskScores;

      console.log('Analysis completed successfully', Date.now() - startTime, 'ms');
      return {
        content: analysisContent,
        riskScores
      };
    } catch (parseError) {
      console.error('Error parsing OpenAI response:', parseError);
      console.error('Raw response:', content);
      throw new Error('Failed to parse analysis response - invalid JSON format');
    }
  } catch (error) {
    console.error('Error generating analysis:', error, 'Time elapsed:', Date.now() - startTime, 'ms');
    throw error;
  }
} 