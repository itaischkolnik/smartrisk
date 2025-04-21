import { EmailConfig } from '@/types/email';
import sgMail from '@sendgrid/mail';

if (!process.env.SENDGRID_API_KEY) {
  throw new Error('SENDGRID_API_KEY environment variable is not set');
}

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const formatAnalysisResults = (results: any) => {
  const sections = [
    { title: 'Risk Assessment', data: results.riskAssessment },
    { title: 'Recommendations', data: results.recommendations },
    { title: 'Market Analysis', data: results.marketAnalysis },
    { title: 'Financial Analysis', data: results.financialAnalysis }
  ];

  let htmlContent = `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          h1 { color: #2c5282; }
          h2 { color: #4a5568; margin-top: 20px; }
          p { margin: 10px 0; }
          .section { margin-bottom: 30px; }
        </style>
      </head>
      <body>
        <h1>SmartRisk Analysis Results</h1>
  `;

  sections.forEach(section => {
    if (section.data) {
      htmlContent += `
        <div class="section">
          <h2>${section.title}</h2>
          <p>${section.data}</p>
        </div>
      `;
    }
  });

  htmlContent += `
      </body>
    </html>
  `;

  return htmlContent;
};

export const sendEmail = async (config: EmailConfig, subject: string, analysisResults: any) => {
  const htmlContent = formatAnalysisResults(analysisResults);

  const msg = {
    to: config.to,
    from: config.from,
    subject: subject,
    html: htmlContent,
  };

  try {
    await sgMail.send(msg);
    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
}; 