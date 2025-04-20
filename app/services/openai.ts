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
  try {
    // Prepare a more concise prompt
    const prompt = `
      נתח את העסק הבא והערך את הסיכונים. ענה בפורמט JSON בלבד.

      עסק: ${JSON.stringify({
        details: data.businessDetails,
        financial: data.financialData,
        swot: data.swotAnalysis,
        questionnaire: data.questionnaire
      })}

      מבנה התשובה הנדרש:
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

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "אתה יועץ עסקי המתמחה בניתוח סיכונים. ענה בפורמט JSON בלבד."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.5,
      max_tokens: 2000,
      response_format: { type: "json_object" }
    });

    const content = completion.choices[0].message.content;
    if (!content) {
      throw new Error('OpenAI response content is empty');
    }

    const response = JSON.parse(content);

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

    return {
      content: analysisContent,
      riskScores
    };
  } catch (error) {
    console.error('Error generating analysis:', error);
    throw error;
  }
} 