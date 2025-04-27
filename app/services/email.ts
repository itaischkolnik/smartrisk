import { Resend } from 'resend';

interface EmailConfig {
  to: string;
  subject: string;
  businessName?: string;
  businessType?: string;
  riskScore: number;
  analysis: string;
}

interface EmailResult {
  success: boolean;
  error?: string;
}

export async function sendEmail(config: EmailConfig): Promise<EmailResult> {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);

    const html = `
      <!DOCTYPE html>
      <html dir="rtl" lang="he">
        <head>
          <meta charset="utf-8">
          <title>${config.subject}</title>
          <style>
            * { direction: rtl; text-align: right; }
            body { 
              font-family: Arial, sans-serif; 
              line-height: 1.6; 
              color: #333; 
              max-width: 800px; 
              margin: 0 auto; 
              padding: 20px; 
              direction: rtl; 
            }
            h1, h2, p { text-align: right; margin-right: 0; margin-left: auto; }
            .risk-score { 
              font-size: 24px; 
              font-weight: bold; 
              color: ${config.riskScore > 70 ? '#059669' : config.riskScore > 40 ? '#d97706' : '#dc2626'}; 
              text-align: right;
            }
            .section { 
              margin: 20px 0; 
              padding: 20px; 
              background: #f8fafc; 
              border-radius: 8px;
              text-align: right;
            }
            .footer { 
              margin-top: 40px; 
              padding-top: 20px; 
              border-top: 1px solid #e2e8f0; 
              font-size: 14px; 
              color: #64748b;
              text-align: right;
            }
            strong { padding-left: 5px; }
          </style>
        </head>
        <body>
          <div style="direction: rtl; text-align: right;">
            <h1>דוח ניתוח SmartRisk</h1>
            
            <div class="section">
              <h2>סקירת העסק</h2>
              <p><strong>שם העסק:</strong> ${config.businessName || 'לא צוין'}</p>
              <p><strong>סוג העסק:</strong> ${config.businessType || 'לא צוין'}</p>
              <p><strong>ציון סיכון:</strong> <span class="risk-score">${config.riskScore}/100</span></p>
            </div>

            <div class="section">
              <h2>פרטי הניתוח</h2>
              ${config.analysis.split('\n').map(line => `<p style="text-align: right; direction: rtl;">${line}</p>`).join('')}
            </div>

            <div class="footer">
              <p>דוח זה הופק על ידי SmartRisk. לשאלות, אנא צור קשר עם צוות התמיכה שלנו.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const { data, error } = await resend.emails.send({
      from: 'SmartRisk <onboarding@resend.dev>',
      to: config.to,
      subject: config.subject,
      html: html
    });

    if (error) {
      console.error('Error sending email:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Error in sendEmail:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send email'
    };
  }
} 