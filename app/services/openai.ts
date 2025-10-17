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

// Function to extract text from image-based PDF using OpenAI Vision API
async function extractTextFromImagePDF(buffer: Buffer): Promise<string> {
  try {
    console.log('Attempting to extract text from image-based PDF using OpenAI Vision...');
    
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OpenAI API key not configured');
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    // Use pdf-lib to convert PDF pages to images
    const { PDFDocument } = await import('pdf-lib');
    const uint8Array = new Uint8Array(buffer);
    const pdfDoc = await PDFDocument.load(uint8Array);
    const numPages = pdfDoc.getPageCount();
    console.log(`PDF has ${numPages} pages, extracting text from first page only for image-based PDFs...`);
    
    // For now, we'll convert the entire first page to an image
    // Note: This is a simplified approach - in production you might want to use a library like pdf2pic
    // Since pdf-lib doesn't directly convert to images, we'll use a different approach
    
    // Convert buffer to base64 for a different attempt - using a PNG conversion service or library
    // For this implementation, we'll throw an error to indicate this needs OCR service
    throw new Error('Image-based PDF detected. Please use a PDF with selectable text or implement OCR service integration.');
    
  } catch (error) {
    console.error('Error extracting text from image-based PDF:', error);
    throw error;
  }
}

// Timeout wrapper for async operations
function withTimeout<T>(promise: Promise<T>, timeoutMs: number, errorMessage: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => 
      setTimeout(() => reject(new Error(errorMessage)), timeoutMs)
    )
  ]);
}

// Function to extract text from PDF using pdf-parse (simple, serverless-friendly)
async function extractTextFromFile(fileUrl: string): Promise<string> {
  try {
    console.log('Extracting text from PDF file:', fileUrl);
    console.log('Using pdf-parse library...');
    
    // Download the PDF file with timeout
    console.log('Downloading PDF from URL...');
    const response = await withTimeout(
      fetch(fileUrl),
      10000, // 10 second timeout for download
      'PDF download timed out after 10 seconds'
    );
    
    if (!response.ok) {
      throw new Error(`Failed to download file: ${response.status} ${response.statusText}`);
    }

    const arrayBuffer = await withTimeout(
      response.arrayBuffer(),
      5000, // 5 second timeout for buffer
      'Failed to read PDF buffer after 5 seconds'
    );
    
    const buffer = Buffer.from(arrayBuffer);
    console.log(`Downloaded PDF, buffer size: ${buffer.length} bytes`);
    
    if (buffer.length === 0) {
      throw new Error('Downloaded file is empty (0 bytes)');
    }

    // Use pdf-parse with explicit import to avoid test files
    console.log('Parsing PDF with pdf-parse...');
    
    // Import only what we need
    const pdfParse = require('pdf-parse');
    
    // Parse with timeout (15 seconds max per PDF)
    const data = await withTimeout(
      pdfParse(buffer, {
        max: 0, // Parse all pages
        version: 'v2.0.550' // Specify version to avoid compatibility issues
      }),
      15000, // 15 second timeout for parsing
      'PDF parsing timed out after 15 seconds'
    );
    
    const extractedText = data.text;
    
    if (!extractedText || extractedText.trim().length === 0) {
      throw new Error('PDF contains no extractable text. It may be an image-based scan.');
    }
    
    console.log(`✓ Successfully extracted ${extractedText.length} characters`);
    console.log(`Pages: ${data.numpages}`);
    console.log('First 200 characters:', extractedText.substring(0, 200));
    
    return extractedText;
    
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(
      `Failed to extract text from PDF: ${errorMessage}`
    );
  }
}

// New function to analyze files for financial data
export async function analyzeFilesForFinancialData(files: any[]): Promise<FileAnalysisResult[]> {
  const startTime = Date.now();
  console.log('========================================');
  console.log('STARTING FILE ANALYSIS FOR FINANCIAL DATA');
  console.log(`Total files to analyze: ${files.length}`);
  console.log(`Files: ${files.map(f => f.name || f.file_name).join(', ')}`);
  console.log('========================================');
  
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
        console.log(`========================================`);
        console.log(`Processing file: ${file.name} (ID: ${file.id})`);
        const fileUrl: string | undefined = (file as any).file_url || (file as any).url;
        console.log(`File URL: ${fileUrl}`);
        console.log(`File category: ${file.category || 'unknown'}`);
        console.log(`========================================`);
        
        if (!fileUrl) {
          throw new Error('File URL is missing on file object');
        }
        extractedText = await extractTextFromFile(fileUrl);
        
        if (!extractedText || extractedText.trim().length === 0) {
          throw new Error('No text could be extracted from the PDF file');
        }
        
        console.log(`✓ Successfully extracted ${extractedText.length} characters from ${file.name}`);
        console.log(`Text preview: ${extractedText.substring(0, 150)}...`);
      } catch (extractionError) {
        console.error(`✗ Failed to extract text from ${file.name}:`, extractionError);
        const errorMsg = extractionError instanceof Error ? extractionError.message : 'Unknown error';
        console.error(`Error details: ${errorMsg}`);
        
        results.push({
          fileName: file.name,
          fileId: file.id,
          analysisSuccess: false,
          error: `Text extraction failed: ${errorMsg}`
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
      console.error(`✗ Error analyzing file ${file.name}:`, error);
      results.push({
        fileName: file.name,
        fileId: file.id,
        analysisSuccess: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(2);
  const successCount = results.filter(r => r.analysisSuccess).length;
  const failCount = results.filter(r => !r.analysisSuccess).length;
  
  console.log('========================================');
  console.log('FILE ANALYSIS COMPLETED');
  console.log(`Duration: ${duration} seconds`);
  console.log(`Total files processed: ${results.length}`);
  console.log(`Successful: ${successCount}`);
  console.log(`Failed: ${failCount}`);
  if (failCount > 0) {
    console.log('Failed files:');
    results.filter(r => !r.analysisSuccess).forEach(r => {
      console.log(`  - ${r.fileName}: ${r.error}`);
    });
  }
  console.log('========================================');
  
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

    // Process file analysis results for inclusion in prompt
    let fileAnalysisText = '';
    if (data.files && data.files.length > 0) {
      fileAnalysisText = '\n\nנתוני ניתוח קבצים פיננסיים:\n';
      
      data.files.forEach((fileResult: any, index: number) => {
        if (fileResult.analysisSuccess && fileResult.financialData) {
          fileAnalysisText += `\nקובץ ${index + 1} (${fileResult.fileName}):\n`;
          
          // Add financial data from analysis
          const financialData = fileResult.financialData;
          if (financialData.שנה) fileAnalysisText += `שנה: ${financialData.שנה}\n`;
          if (financialData.הכנסות) fileAnalysisText += `הכנסות: ${financialData.הכנסות.toLocaleString()} ₪\n`;
          if (financialData['רווח העסק']) fileAnalysisText += `רווח העסק: ${financialData['רווח העסק'].toLocaleString()} ₪\n`;
          if (financialData['רווח כולל']) fileAnalysisText += `רווח כולל: ${financialData['רווח כולל'].toLocaleString()} ₪\n`;
          if (financialData['עלות המכר']) fileAnalysisText += `עלות המכר: ${financialData['עלות המכר'].toLocaleString()} ₪\n`;
          if (financialData['הוצאות מנהליות']) fileAnalysisText += `הוצאות מנהליות: ${financialData['הוצאות מנהליות'].toLocaleString()} ₪\n`;
          if (financialData['משכורות עובדים']) fileAnalysisText += `משכורות עובדים: ${financialData['משכורות עובדים'].toLocaleString()} ₪\n`;
          if (financialData['משכורות בעלים']) fileAnalysisText += `משכורות בעלים: ${financialData['משכורות בעלים'].toLocaleString()} ₪\n`;
          if (financialData['ערך ריהוט מטלטלין וציוד']) fileAnalysisText += `ערך ציוד: ${financialData['ערך ריהוט מטלטלין וציוד'].toLocaleString()} ₪\n`;
          
          // Add confidence and warnings if available
          if (fileResult.confidence) {
            fileAnalysisText += `רמת דיוק הניתוח: ${fileResult.confidence}%\n`;
          }
          if (fileResult.warnings && fileResult.warnings.length > 0) {
            fileAnalysisText += `אזהרות: ${fileResult.warnings.join(', ')}\n`;
          }
        } else if (fileResult.error) {
          fileAnalysisText += `\nקובץ ${index + 1} (${fileResult.fileName}): שגיאה בניתוח - ${fileResult.error}\n`;
        }
      });
    }

    const prompt = `נתח את העסק הזה בקצרה:
    
    פרטי העסק:
    ${JSON.stringify(data.businessDetails, null, 2)}
    
    ניתוח SWOT:
    ${JSON.stringify(data.swotAnalysis, null, 2)}
    
    שאלון אישי:
    ${JSON.stringify(data.personalQuestionnaire, null, 2)}
    ${fileAnalysisText}
    
    קבצים נוספים: ${data.files.length} קבצים מצורפים
    
    אנא ספק ניתוח תמציתי הכולל:
    
    1. גורמי סיכון עיקריים (2-3 נקודות) - כלול התייחסות לנתונים הפיננסיים מהקבצים אם קיימים
    2. המלצות מהירות (2-3 נקודות) - בהתבסס על הנתונים הפיננסיים המנותחים
    3. ציון סיכון - קח בחשבון את הנתונים הפיננסיים בחישוב הציון
    
    חשוב: היה תמציתי וממוקד. אם יש נתונים פיננסיים מנותחים מהקבצים, השתמש בהם לחיזוק הניתוח.
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