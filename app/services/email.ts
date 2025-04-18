import nodemailer from 'nodemailer';
import { Analysis } from '@/types/analysis';

// Create reusable transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendAnalysisEmail(
  to: string,
  analysis: Analysis,
  pdfBuffer: Buffer
): Promise<void> {
  try {
    // Format risk scores for email body
    const riskScores = [
      `ציון סיכון כולל: ${analysis.riskScores.overall}/10`,
      `סיכון עסקי: ${analysis.riskScores.business}/10`,
      `סיכון פיננסי: ${analysis.riskScores.financial}/10`,
      `סיכון שוק: ${analysis.riskScores.market}/10`,
      `סיכון SWOT: ${analysis.riskScores.swot}/10`,
    ].join('\n');

    // Create email HTML body
    const htmlBody = `
      <div dir="rtl" style="font-family: Arial, sans-serif;">
        <h1>ניתוח סיכונים עסקי</h1>
        
        <h2>תקציר מנהלים</h2>
        <p><strong>המלצה מהירה:</strong> ${analysis.content.executiveSummary.quickRecommendation}</p>
        
        <h3>נקודות מפתח:</h3>
        <ul>
          ${analysis.content.executiveSummary.keyHighlights
            .map(highlight => `<li>${highlight}</li>`)
            .join('')}
        </ul>
        
        <h3>ציוני סיכון:</h3>
        <pre style="background-color: #f5f5f5; padding: 10px; border-radius: 5px;">
${riskScores}
        </pre>
        
        <p>לניתוח המלא, אנא ראה את הקובץ המצורף.</p>
        
        <hr>
        <p style="color: #666; font-size: 12px;">
          הודעה זו נשלחה באופן אוטומטי ממערכת SmartRisk.
          אנא אל תשיב להודעה זו.
        </p>
      </div>
    `;

    // Send email
    await transporter.sendMail({
      from: `"SmartRisk" <${process.env.SMTP_FROM}>`,
      to,
      subject: 'ניתוח סיכונים עסקי - SmartRisk',
      html: htmlBody,
      attachments: [
        {
          filename: 'business-analysis.pdf',
          content: pdfBuffer,
          contentType: 'application/pdf',
        },
      ],
    });
  } catch (error) {
    console.error('Error sending analysis email:', error);
    throw error;
  }
} 