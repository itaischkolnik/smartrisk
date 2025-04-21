import nodemailer from 'nodemailer';

interface EmailConfig {
  to: string;
  subject: string;
  businessName?: string;
  businessType?: string;
  riskScore?: number;
  analysis: string;
}

interface EmailResult {
  success: boolean;
  error?: any;
}

// Create reusable transporter object using SMTP config
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

export async function sendEmail(config: EmailConfig): Promise<EmailResult> {
  try {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      throw new Error('SMTP credentials are not set');
    }

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">SmartRisk Assessment Results</h1>
        
        <div style="margin: 20px 0;">
          <h2 style="color: #444;">Business Details</h2>
          <p><strong>Business Name:</strong> ${config.businessName || 'Not specified'}</p>
          <p><strong>Business Type:</strong> ${config.businessType || 'Not specified'}</p>
        </div>

        ${config.riskScore !== undefined ? `
          <div style="margin: 20px 0;">
            <h2 style="color: #444;">Risk Score</h2>
            <p><strong>${config.riskScore}/100</strong></p>
            <p style="color: #666; font-size: 0.9em;">(0 = High Risk, 100 = Low Risk)</p>
          </div>
        ` : ''}

        <div style="margin: 20px 0;">
          <h2 style="color: #444;">Analysis</h2>
          <div style="white-space: pre-line;">${config.analysis}</div>
        </div>

        <hr style="margin: 30px 0;" />
        <p style="color: #666; font-size: 0.8em; text-align: center;">
          This is an automated email from SmartRisk. Please do not reply to this email.
        </p>
      </div>
    `;

    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: config.to,
      subject: config.subject,
      html: htmlContent
    };

    await transporter.sendMail(mailOptions);
    return { success: true };

  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
} 