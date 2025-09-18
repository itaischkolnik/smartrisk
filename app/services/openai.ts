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

interface FinancialData {
  שנה: number;
  הכנסות: number;
  "הכנסות נוספות": number;
  "רווח העסק": number;
  "משכורות בעלים": number;
  "רווח כולל": number;
  "עלות המכר": number;
  "הוצאות מנהליות": number;
  "משכורות עובדים": number;
}

export interface FileAnalysisResult {
  fileName: string;
  fileId: string;
  analysisSuccess: boolean;
  financialData?: FinancialData;
  error?: string;
  confidence?: number; // 0-100 confidence score
  extractedTextLength?: number;
  warnings?: string[];
}

// Helper function to add timeout to promises
async function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  const timeout = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error(`Operation timed out after ${timeoutMs}ms`)), timeoutMs);
  });
  return Promise.race([promise, timeout]);
}

// Function to extract text from PDF file URL using OpenAI's vision capabilities
async function extractTextFromFile(fileUrl: string): Promise<string> {
  try {
    console.log('Extracting text from PDF file:', fileUrl);
    
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OpenAI API key not configured');
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    // Download the file
    const response = await fetch(fileUrl);
    if (!response.ok) {
      throw new Error(`Failed to download file: ${response.statusText}`);
    }

    const buffer = await response.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');

    // Use OpenAI's vision model to extract text from PDF pages
    const completion = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "system",
          content: "You are a document text extraction specialist. Extract ALL text content from this document image, preserving the original structure and formatting as much as possible. Include all numbers, labels, and text exactly as they appear."
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Please extract all text content from this document. Pay special attention to financial numbers, Hebrew text, and maintain the original structure."
            },
            {
              type: "image_url",
              image_url: {
                url: `data:application/pdf;base64,${base64}`,
                detail: "high"
              }
            }
          ]
        }
      ],
      max_tokens: 4000,
      temperature: 0.1
    });

    const extractedText = completion.choices[0]?.message?.content || '';
    console.log('Successfully extracted text from PDF:', extractedText.substring(0, 200) + '...');
    return extractedText;

  } catch (error) {
    console.error('Error extracting text from file:', error);
    
    // Fallback: Try to use pdf-parse library for direct PDF text extraction
    try {
      console.log('Attempting fallback PDF text extraction using pdf-parse...');
      
      // Download the file again for pdf-parse
      const pdfResponse = await fetch(fileUrl);
      if (!pdfResponse.ok) {
        throw new Error(`Failed to download PDF for fallback: ${pdfResponse.statusText}`);
      }

      const pdfBuffer = await pdfResponse.arrayBuffer();
      
      // Dynamically import pdf-parse only on server side
      const pdfParse = (await import('pdf-parse')).default;
      const data = await pdfParse(Buffer.from(pdfBuffer));
      
      if (data.text && data.text.trim().length > 0) {
        console.log('Successfully extracted text using pdf-parse fallback');
        return data.text;
      } else {
        throw new Error('PDF appears to be empty or contains no extractable text');
      }
    } catch (fallbackError) {
      console.error('Fallback extraction also failed:', fallbackError);
      throw new Error('Unable to extract text from PDF file. The file may be password-protected, corrupted, or contain only images. Please ensure the PDF contains readable text.');
    }
  }
}

// New function to analyze files for financial data
export async function analyzeFilesForFinancialData(files: any[]): Promise<FileAnalysisResult[]> {
  console.log('Starting file analysis for financial data...');
  
  if (!process.env.OPENAI_API_KEY) {
    console.error('OpenAI API key not found');
    throw new Error('OpenAI API key not configured');
  }

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });

  const results: FileAnalysisResult[] = [];

  for (const file of files) {
    try {
      console.log(`Analyzing file: ${file.name}`);
      
      // Identify file categories
      const isProfitLossFile =
        file.name.toLowerCase().includes('רווח') ||
        file.name.toLowerCase().includes('הפסד') ||
        file.name.toLowerCase().includes('profit') ||
        file.name.toLowerCase().includes('loss') ||
        (file.category && file.category.startsWith('profit_loss'));

      const isForm11 = file.name.includes('11') || file.name.includes('י"א') || file.category === 'form_11';

      const isFinancialFile = isProfitLossFile || isForm11 || file.type === 'application/pdf';

      if (!isFinancialFile) {
        console.log(`Skipping non-financial file: ${file.name}`);
        results.push({
          fileName: file.name,
          fileId: file.id,
          analysisSuccess: false,
          error: 'File type not suitable for financial analysis'
        });
        continue;
      }

      let prompt = '';
      let extractedText = '';

      // Extract actual text from the PDF file
      try {
        console.log(`Extracting text from file: ${file.name}`);
        extractedText = await extractTextFromFile(file.file_url);
        
        if (!extractedText || extractedText.trim().length === 0) {
          throw new Error('No text could be extracted from the PDF file');
        }
        
        console.log(`Successfully extracted ${extractedText.length} characters from ${file.name}`);
      } catch (extractionError) {
        console.error(`Failed to extract text from ${file.name}:`, extractionError);
        results.push({
          fileName: file.name,
          fileId: file.id,
          analysisSuccess: false,
          error: `Text extraction failed: ${extractionError instanceof Error ? extractionError.message : 'Unknown error'}`
        });
        continue;
      }

      if (isProfitLossFile) {
        prompt = `You will receive raw text extracted from a Hebrew profit and loss statement file for a single business year.

CRITICAL INSTRUCTIONS:
1. Extract ONLY the numbers that actually appear in the document text below
2. Do NOT invent, estimate, or calculate any numbers
3. If a field is not found in the document, return 0
4. Pay special attention to the revenue line – "הכנסות"
5. Look for exact matches of financial terms in Hebrew

Guidance for locating financial data:
• "הכנסות" - Look for phrases like "הכנסות ממכירות", "הכנסות ממכירות ומתן שירותים", "הכנסות כוללות"
• Numbers may be formatted with commas (e.g. 4,354,305) or spaces as thousand separators
• Ignore currency symbols (₪, שח) when extracting numeric values
• Look for the most recent year mentioned in the document

Return the extracted values in this exact JSON format:
\`\`\`json
{
  "שנה": [YEAR_FROM_DOCUMENT],
  "הכנסות": [EXACT_REVENUE_NUMBER_FROM_DOCUMENT],
  "הכנסות נוספות": [EXACT_OTHER_INCOME_FROM_DOCUMENT_OR_0],
  "רווח העסק": [EXACT_BUSINESS_PROFIT_FROM_DOCUMENT_OR_0],
  "משכורות בעלים": [EXACT_OWNER_SALARY_FROM_DOCUMENT_OR_0],
  "רווח כולל": [EXACT_TOTAL_PROFIT_FROM_DOCUMENT_OR_0],
  "עלות המכר": [EXACT_COST_OF_GOODS_FROM_DOCUMENT_OR_0],
  "הוצאות מנהליות": [EXACT_ADMIN_EXPENSES_FROM_DOCUMENT_OR_0],
  "משכורות עובדים": [EXACT_EMPLOYEE_SALARIES_FROM_DOCUMENT_OR_0]
}
\`\`\`

IMPORTANT: Only use numbers that are explicitly written in the document text below. Do not calculate or estimate any values.

Document text to analyze:
${extractedText}`;
      } else if (isForm11) {
        prompt = `You will receive raw text extracted from an Israeli "טופס י"א" depreciation form (Form 11).

CRITICAL INSTRUCTIONS:
1. Extract ONLY the numbers that actually appear in the document text below
2. Do NOT invent, estimate, or calculate any numbers
3. Look for the exact Hebrew phrase "ערך ריהוט מטלטלין וציוד" or similar variations
4. If the value is not found in the document, return 0

Please extract the numeric value for furniture and equipment and return it in JSON format:
\`\`\`json
{
  "ערך ריהוט מטלטלין וציוד": [EXACT_NUMBER_FROM_DOCUMENT_OR_0]
}
\`\`\`

IMPORTANT: Only use the exact number that appears in the document text below.

Document text to analyze:
${extractedText}`;
      } else {
        // Unknown financial file type, skip
        console.log(`Skipping unknown file type: ${file.name}`);
        results.push({
          fileName: file.name,
          fileId: file.id,
          analysisSuccess: false,
          error: 'Unknown file type for financial analysis'
        });
        continue;
      }

      console.log(`Calling OpenAI API for file: ${file.name}`);
      
      const completion = await withTimeout(
        openai.chat.completions.create({
          model: "gpt-4-0125-preview", // Use GPT-4 for better accuracy with financial data
          messages: [
            {
              role: "system",
              content: "You are a highly accurate financial document analyzer specializing in Hebrew financial statements. Your task is to extract ONLY the exact numbers that appear in the document text. Never invent, estimate, or calculate numbers. If a value is not explicitly stated in the document, return 0. Return ONLY valid JSON as instructed."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 0.0, // Use zero temperature for maximum consistency
          max_tokens: 500,
          response_format: { type: "json_object" }
        }),
        20000 // 20 second timeout per file for GPT-4
      );

      const content = completion.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No response content received from OpenAI');
      }

      console.log(`OpenAI response for ${file.name}:`, content);

      // Extract JSON from the response
      const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) || content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No valid JSON found in OpenAI response');
      }

      const parsedJson = JSON.parse(jsonMatch[0].replace(/```json|```/g, '').trim());

      let financialData: any = parsedJson;
      let confidence = 50; // Base confidence score
      let warnings: string[] = [];

      // Calculate confidence based on extracted text quality and data completeness
      if (extractedText.length > 500) confidence += 20;
      if (extractedText.length > 1000) confidence += 10;
      
      // Validate extracted data to prevent AI hallucinations
      if (isProfitLossFile) {
        // Validate that all numeric values are reasonable
        const numericFields = ['הכנסות', 'הכנסות נוספות', 'רווח העסק', 'משכורות בעלים', 'רווח כולל', 'עלות המכר', 'הוצאות מנהליות', 'משכורות עובדים'];
        
        for (const field of numericFields) {
          if (financialData[field] && (typeof financialData[field] !== 'number' || financialData[field] < 0)) {
            console.warn(`Invalid value for ${field}: ${financialData[field]}, setting to 0`);
            financialData[field] = 0;
          }
        }

        // Validate year is reasonable
        const currentYear = new Date().getFullYear();
        if (financialData["שנה"] && (financialData["שנה"] < 2000 || financialData["שנה"] > currentYear)) {
          console.warn(`Invalid year: ${financialData["שנה"]}, using current year`);
          financialData["שנה"] = currentYear - 1; // Default to last year
        }

        // Basic sanity checks for financial relationships
        const revenue = financialData["הכנסות"] || 0;
        const totalExpenses = (financialData["עלות המכר"] || 0) + 
                             (financialData["הוצאות מנהליות"] || 0) + 
                             (financialData["משכורות עובדים"] || 0);
        
        // Calculate confidence based on data completeness
        let nonZeroFields = 0;
        for (const field of numericFields) {
          if (financialData[field] && financialData[field] > 0) {
            nonZeroFields++;
          }
        }
        confidence += Math.min(30, nonZeroFields * 4); // Up to 30 points for data completeness

        // If expenses are significantly higher than revenue, flag as suspicious
        if (revenue > 0 && totalExpenses > revenue * 2) {
          console.warn(`Suspicious financial data: expenses (${totalExpenses}) much higher than revenue (${revenue})`);
          warnings.push('Expenses significantly exceed revenue - data may be inaccurate');
          confidence -= 20;
        }

        // Check for reasonable financial relationships
        if (revenue > 0) {
          const profitMargin = (financialData["רווח העסק"] || 0) / revenue;
          if (profitMargin < -0.5 || profitMargin > 0.8) {
            warnings.push('Unusual profit margin detected');
            confidence -= 10;
          }
        }

        // Ensure expected keys exist and calculate total profit if missing
        if (!financialData["רווח כולל"] || financialData["רווח כולל"] === 0) {
          financialData["רווח כולל"] = (financialData["רווח העסק"] || 0) + (financialData["משכורות בעלים"] || 0);
        }

        // Log extracted data for debugging
        console.log(`Extracted financial data from ${file.name}:`, {
          year: financialData["שנה"],
          revenue: financialData["הכנסות"],
          businessProfit: financialData["רווח העסק"],
          totalProfit: financialData["רווח כולל"]
        });
      } else if (isForm11) {
        // Validate Form 11 data
        const equipmentValue = financialData["ערך ריהוט מטלטלין וציוד"];
        if (equipmentValue && (typeof equipmentValue !== 'number' || equipmentValue < 0)) {
          console.warn(`Invalid equipment value: ${equipmentValue}, setting to 0`);
          financialData["ערך ריהוט מטלטלין וציוד"] = 0;
          warnings.push('Invalid equipment value corrected');
          confidence -= 15;
        } else if (equipmentValue && equipmentValue > 0) {
          confidence += 20; // Bonus for finding equipment value
        }

        console.log(`Extracted equipment value from ${file.name}: ${financialData["ערך ריהוט מטלטלין וציוד"]}`);
      }

      // Ensure confidence is within bounds
      confidence = Math.max(0, Math.min(100, confidence));

      results.push({
        fileName: file.name,
        fileId: file.id,
        analysisSuccess: true,
        financialData,
        confidence,
        extractedTextLength: extractedText.length,
        warnings: warnings.length > 0 ? warnings : undefined
      });

      console.log(`Successfully analyzed file: ${file.name}`);

    } catch (error) {
      console.error(`Error analyzing file ${file.name}:`, error);
      results.push({
        fileName: file.name,
        fileId: file.id,
        analysisSuccess: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  console.log(`File analysis completed. Analyzed ${results.length} files.`);
  return results;
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
    const riskScoreMatch = content.match(/ציון סיכון:?\s*(\d+)/i) || content.match(/risk score:?\s*(\d+)/i);
    
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