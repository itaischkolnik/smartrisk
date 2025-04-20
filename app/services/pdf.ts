import { Analysis } from '@/types/analysis';
import chromium from 'chrome-aws-lambda';

export async function generateAnalysisPDF(analysis: Analysis): Promise<Buffer> {
  try {
    // Launch browser with chrome-aws-lambda
    const browser = await chromium.puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: true,
      ignoreHTTPSErrors: true,
    });

    const page = await browser.newPage();

    // Generate HTML content
    const htmlContent = `
      <!DOCTYPE html>
      <html dir="rtl" lang="he">
      <head>
        <meta charset="UTF-8">
        <title>ניתוח סיכונים עסקי - SmartRisk</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 20px;
            direction: rtl;
          }
          .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
          }
          h1 {
            font-size: 24px;
            margin-bottom: 20px;
            color: #333;
          }
          h2 {
            font-size: 20px;
            margin-top: 30px;
            margin-bottom: 15px;
            color: #444;
          }
          h3 {
            font-size: 18px;
            margin-top: 25px;
            margin-bottom: 10px;
            color: #555;
          }
          p {
            margin: 10px 0;
            color: #666;
          }
          .risk-score {
            font-weight: bold;
            color: #444;
          }
          .footer {
            margin-top: 50px;
            text-align: center;
            font-size: 12px;
            color: #888;
          }
          ul {
            list-style-type: none;
            padding: 0;
          }
          li {
            margin: 5px 0;
            padding-right: 20px;
            position: relative;
          }
          li:before {
            content: "•";
            position: absolute;
            right: 0;
            color: #666;
          }
          @page {
            size: A4;
            margin: 20mm;
          }
          @media print {
            body {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>ניתוח סיכונים עסקי</h1>
          <p>תאריך: ${new Date().toLocaleDateString('he-IL')}</p>

          <h2>תקציר מנהלים</h2>
          <p><strong>המלצה מהירה:</strong> ${analysis.content.executiveSummary.quickRecommendation}</p>
          
          <h3>נקודות מפתח:</h3>
          <ul>
            ${analysis.content.executiveSummary.keyHighlights
              .map(highlight => `<li>${highlight}</li>`)
              .join('')}
          </ul>

          <h2>ציוני סיכון</h2>
          <p class="risk-score">ציון סיכון כולל: ${analysis.riskScores.overall}/10</p>
          <p class="risk-score">סיכון עסקי: ${analysis.riskScores.business}/10</p>
          <p class="risk-score">סיכון פיננסי: ${analysis.riskScores.financial}/10</p>
          <p class="risk-score">סיכון שוק: ${analysis.riskScores.market}/10</p>
          <p class="risk-score">סיכון SWOT: ${analysis.riskScores.swot}/10</p>

          <h2>${analysis.content.businessFundamentals.title}</h2>
          <p>${analysis.content.businessFundamentals.content}</p>
          <p class="risk-score">ציון סיכון: ${analysis.content.businessFundamentals.riskScore}/10</p>

          <h2>${analysis.content.financialAnalysis.title}</h2>
          <p>${analysis.content.financialAnalysis.content}</p>
          <p class="risk-score">ציון סיכון: ${analysis.content.financialAnalysis.riskScore}/10</p>

          <h2>${analysis.content.marketAnalysis.title}</h2>
          <p>${analysis.content.marketAnalysis.content}</p>
          <p class="risk-score">ציון סיכון: ${analysis.content.marketAnalysis.riskScore}/10</p>

          <h2>${analysis.content.swotAnalysis.title}</h2>
          <p>${analysis.content.swotAnalysis.content}</p>
          <p class="risk-score">ציון סיכון: ${analysis.content.swotAnalysis.riskScore}/10</p>

          <h2>המלצות</h2>
          <h3>פעולות מומלצות:</h3>
          <ul>
            ${analysis.content.recommendations.actionItems
              .map(item => `<li>${item}</li>`)
              .join('')}
          </ul>

          <h3>אסטרטגיות להפחתת סיכון:</h3>
          <ul>
            ${analysis.content.recommendations.riskMitigation
              .map(item => `<li>${item}</li>`)
              .join('')}
          </ul>

          <h3>שיקולי השקעה:</h3>
          <ul>
            ${analysis.content.recommendations.investmentConsiderations
              .map(item => `<li>${item}</li>`)
              .join('')}
          </ul>

          <div class="footer">
            <p>© SmartRisk. כל הזכויות שמורות.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Set content and generate PDF
    await page.setContent(htmlContent);
    
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px'
      },
      preferCSSPageSize: true
    });

    await browser.close();
    return pdfBuffer;

  } catch (error) {
    console.error('PDF Generation Error:', error);
    throw error;
  }
} 