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
    // Prepare the prompt with all business data
    const prompt = `
      אנא נתח את העסק הבא ותן הערכת סיכונים מפורטת בעברית.
      
      פרטי העסק:
      ${JSON.stringify(data.businessDetails, null, 2)}
      
      נתונים פיננסיים:
      ${JSON.stringify(data.financialData, null, 2)}
      
      ניתוח SWOT:
      ${JSON.stringify(data.swotAnalysis, null, 2)}
      
      תשובות לשאלון:
      ${JSON.stringify(data.questionnaire, null, 2)}
      
      מסמכים שהועלו:
      ${JSON.stringify(data.files.map(f => f.file_name), null, 2)}
      
      אנא ספק ניתוח מפורט הכולל:
      1. תקציר מנהלים עם המלצה מהירה ונקודות מפתח
      2. ניתוח יסודות העסק (מודל עסקי, מיצוב, הנהלה)
      3. ניתוח פיננסי (רווחיות, תזרים מזומנים, ROI)
      4. ניתוח שוק (תחרות, מגמות, פוטנציאל צמיחה)
      5. סיכום ניתוח SWOT
      6. המלצות (פעולות מומלצות, אסטרטגיות להפחתת סיכון, שיקולי השקעה)
      
      לכל חלק, תן ציון סיכון בין 0 ל-10 כאשר 0 מייצג סיכון נמוך ו-10 מייצג סיכון גבוה.
      
      ענה בפורמט JSON לפי המבנה הבא:
      {
        "executiveSummary": {
          "quickRecommendation": "string",
          "keyHighlights": ["string"]
        },
        "businessFundamentals": {
          "title": "יסודות העסק",
          "content": "string",
          "riskScore": number
        },
        "financialAnalysis": {
          "title": "ניתוח פיננסי",
          "content": "string",
          "riskScore": number
        },
        "marketAnalysis": {
          "title": "ניתוח שוק",
          "content": "string",
          "riskScore": number
        },
        "swotAnalysis": {
          "title": "ניתוח SWOT",
          "content": "string",
          "riskScore": number
        },
        "recommendations": {
          "actionItems": ["string"],
          "riskMitigation": ["string"],
          "investmentConsiderations": ["string"]
        },
        "riskScores": {
          "overall": number,
          "business": number,
          "financial": number,
          "market": number,
          "swot": number
        }
      }
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "אתה יועץ עסקי מומחה המתמחה בניתוח סיכונים והערכת שווי של עסקים. אתה מדבר עברית בלבד. אנא ענה בפורמט JSON בדיוק כפי שהתבקשת."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 4000
    });

    const content = completion.choices[0].message.content;
    if (!content) {
      throw new Error('OpenAI response content is empty');
    }

    try {
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
    } catch (parseError) {
      console.error('Error parsing OpenAI response:', parseError);
      throw new Error('Failed to parse analysis response');
    }
  } catch (error) {
    console.error('Error generating analysis:', error);
    throw error;
  }
} 