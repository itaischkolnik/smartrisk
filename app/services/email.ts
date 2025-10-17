import { Resend } from 'resend';

interface EmailConfig {
  to: string;
  subject: string;
  businessName?: string;
  businessType?: string;
  riskScore: number;
  analysis: string;
}

interface ContactFormData {
  fullName: string;
  mobile: string;
  email: string;
  message?: string;
}

interface ConsultationFormData {
  fullName: string;
  mobile: string;
  email: string;
  assessmentScore: number;
  assessmentResult: string;
  questionnaireAnswers?: any;
  questions?: any[];
}

interface BusinessBuyReadinessFormData {
  fullName: string;
  mobile: string;
  email: string;
  businessName?: string;
}

interface QuickCounselingFormData {
  fullName: string;
  mobile: string;
  email: string;
}

interface EmailResult {
  success: boolean;
  error?: string;
}

export async function sendEmail(config: EmailConfig): Promise<EmailResult> {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not set');
      return { success: false, error: 'Missing email configuration' };
    }
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

export async function sendContactEmail(formData: ContactFormData): Promise<EmailResult> {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not set');
      return { success: false, error: 'Missing email configuration' };
    }
    const resend = new Resend(process.env.RESEND_API_KEY);

    const html = `
      <!DOCTYPE html>
      <html dir="rtl" lang="he">
        <head>
          <meta charset="utf-8">
          <title>פנייה חדשה - SmartRisk</title>
          <style>
            * { direction: rtl; text-align: right; }
            body { 
              font-family: Arial, sans-serif; 
              line-height: 1.6; 
              color: #333; 
              max-width: 600px; 
              margin: 0 auto; 
              padding: 20px; 
              direction: rtl; 
            }
            h1, h2, p { text-align: right; margin-right: 0; margin-left: auto; }
            .contact-info { 
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
            <h1>פנייה חדשה - SmartRisk</h1>
            
            <div class="contact-info">
              <h2>פרטי הפונה</h2>
              <p><strong>שם מלא:</strong> ${formData.fullName}</p>
              <p><strong>טלפון נייד:</strong> ${formData.mobile}</p>
              <p><strong>אימייל:</strong> ${formData.email}</p>
              ${formData.message ? `<p><strong>הודעה:</strong> ${formData.message}</p>` : ''}
            </div>

            <div class="footer">
              <p>פנייה זו נשלחה דרך טופס יצירת קשר באתר SmartRisk.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const { data, error } = await resend.emails.send({
      from: 'SmartRisk Contact <onboarding@resend.dev>',
      to: 'itaisd@gmail.com', // Send to your email (Resend limitation until domain verified)
      subject: 'פנייה חדשה - SmartRisk',
      html: html,
      replyTo: formData.email
    });

    if (error) {
      console.error('Error sending contact email:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Error in sendContactEmail:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send contact email'
    };
  }
}

export async function sendConsultationEmail(formData: ConsultationFormData): Promise<EmailResult> {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not set');
      return { success: false, error: 'Missing email configuration' };
    }
    const resend = new Resend(process.env.RESEND_API_KEY);

    const html = `
      <!DOCTYPE html>
      <html dir="rtl" lang="he">
        <head>
          <meta charset="utf-8">
          <title>בקשת ייעוץ חדשה - SmartRisk</title>
          <style>
            * { direction: rtl; text-align: right; }
            body { 
              font-family: Arial, sans-serif; 
              line-height: 1.6; 
              color: #333; 
              max-width: 600px; 
              margin: 0 auto; 
              padding: 20px; 
              direction: rtl; 
            }
            h1, h2, p { text-align: right; margin-right: 0; margin-left: auto; }
            .contact-info { 
              margin: 20px 0; 
              padding: 20px; 
              background: #f8fafc; 
              border-radius: 8px;
              text-align: right;
            }
            .assessment-info { 
              margin: 20px 0; 
              padding: 20px; 
              background: #e0f2fe; 
              border-radius: 8px;
              text-align: right;
            }
            .questionnaire-details { 
              margin: 20px 0; 
              padding: 20px; 
              background: #f0f9ff; 
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
            .score { 
              font-size: 24px; 
              font-weight: bold; 
              color: ${formData.assessmentScore > 70 ? '#059669' : formData.assessmentScore > 40 ? '#d97706' : '#dc2626'}; 
              text-align: right;
            }
          </style>
        </head>
        <body>
          <div style="direction: rtl; text-align: right;">
            <h1>בקשת ייעוץ חדשה - SmartRisk</h1>
            
            <div class="contact-info">
              <h2>פרטי הפונה</h2>
              <p><strong>שם מלא:</strong> ${formData.fullName}</p>
              <p><strong>טלפון נייד:</strong> ${formData.mobile}</p>
              <p><strong>אימייל:</strong> ${formData.email}</p>
            </div>

            <div class="assessment-info">
              <h2>תוצאות ההערכה</h2>
              <p><strong>ציון כללי:</strong> <span class="score">${formData.assessmentScore}/100</span></p>
              <p><strong>הערכה מילולית:</strong> ${formData.assessmentResult}</p>
            </div>

            ${formData.questionnaireAnswers && formData.questions ? `
            <div class="questionnaire-details">
              <h2>פרטי השאלון</h2>
              ${formData.questions.map((q, index) => {
                const answer = formData.questionnaireAnswers[q.field];
                let answerText = '';
                
                // Convert answer values to Hebrew text
                switch(answer) {
                  case 'yes': answerText = 'כן'; break;
                  case 'no': answerText = 'לא'; break;
                  case 'dont_know': answerText = 'לא יודע/בערך'; break;
                  case 'excellent': answerText = 'מעולה/לא נשען'; break;
                  case 'good': answerText = 'טוב/קצת'; break;
                  case 'average': answerText = 'בינוני'; break;
                  case 'poor': answerText = 'גרוע/הרבה'; break;
                  case 'very_poor': answerText = 'גרוע מאוד/אני העסק'; break;
                  default: answerText = answer || 'לא נענה';
                }
                
                return `
                  <div class="question-item" style="margin-bottom: 15px; padding: 10px; background: #f9f9f9; border-radius: 5px;">
                    <p style="font-weight: bold; margin-bottom: 5px;">${q.question}</p>
                    <p style="color: #0066cc; margin: 0;"><strong>תשובה:</strong> ${answerText}</p>
                  </div>
                `;
              }).join('')}
            </div>
            ` : ''}

            <div class="footer">
              <p>בקשה זו נשלחה דרך טופס הערכת מוכנות למכירה באתר SmartRisk.</p>
              <p>הפונה מעוניין בתאום פגישת ייעוץ עם מומחה.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const { data, error } = await resend.emails.send({
      from: 'SmartRisk Consultation <onboarding@resend.dev>',
      to: 'itaisd@gmail.com', // Send to your email (Resend limitation until domain verified)
      subject: 'בקשת ייעוץ חדשה - SmartRisk',
      html: html,
      replyTo: formData.email
    });

    if (error) {
      console.error('Error sending consultation email:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Error in sendConsultationEmail:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send consultation email'
    };
  }
}

export async function sendQuickCounselingEmail(formData: QuickCounselingFormData): Promise<EmailResult> {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not set');
      return { success: false, error: 'Missing email configuration' };
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    const html = `
      <!DOCTYPE html>
      <html dir="rtl" lang="he">
        <head>
          <meta charset="utf-8">
          <title>בקשת ייעוץ מהיר - SmartRisk</title>
          <style>
            * { direction: rtl; text-align: right; }
            body { 
              font-family: Arial, sans-serif; 
              line-height: 1.6; 
              color: #333; 
              max-width: 600px; 
              margin: 0 auto; 
              padding: 20px; 
              direction: rtl; 
            }
            h1, h2, p { text-align: right; margin-right: 0; margin-left: auto; }
            .contact-info { 
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
            <h1>בקשת ייעוץ מהיר - SmartRisk</h1>
            
            <div class="contact-info">
              <h2>פרטי הפונה</h2>
              <p><strong>שם מלא:</strong> ${formData.fullName}</p>
              <p><strong>טלפון נייד:</strong> ${formData.mobile}</p>
              <p><strong>דואר אלקטרוני:</strong> ${formData.email}</p>
            </div>

            <div class="footer">
              <p>בקשה זו נשלחה דרך טופס הייעוץ המהיר למכירת עסק באתר SmartRisk.</p>
              <p>הפונה מעוניין בייעוץ ראשוני חינם למכירת העסק.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const { data, error } = await resend.emails.send({
      from: 'SmartRisk Quick Counseling <onboarding@resend.dev>',
      to: 'itaisd@gmail.com', // Send to your email (Resend limitation until domain verified)
      subject: 'בקשת ייעוץ מהיר - SmartRisk',
      html: html,
      replyTo: formData.email
    });

    if (error) {
      console.error('Error sending quick counseling email:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Error in sendQuickCounselingEmail:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send quick counseling email'
    };
  }
}

export async function sendBusinessBuyReadinessEmail(formData: BusinessBuyReadinessFormData): Promise<EmailResult> {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not set');
      return { success: false, error: 'Missing email configuration' };
    }
    const resend = new Resend(process.env.RESEND_API_KEY);

    const html = `
      <!DOCTYPE html>
      <html dir="rtl" lang="he">
        <head>
          <meta charset="utf-8">
          <title>בקשת דוח נתונים לקניית עסק - SmartRisk</title>
          <style>
            * { direction: rtl; text-align: right; }
            body { 
              font-family: Arial, sans-serif; 
              line-height: 1.6; 
              color: #333; 
              max-width: 600px; 
              margin: 0 auto; 
              padding: 20px; 
              direction: rtl; 
            }
            h1, h2, p { text-align: right; margin-right: 0; margin-left: auto; }
            .contact-info { 
              margin: 20px 0; 
              padding: 20px; 
              background: #f8fafc; 
              border-radius: 8px;
              text-align: right;
            }
            .business-info { 
              margin: 20px 0; 
              padding: 20px; 
              background: #e0f2fe; 
              border-radius: 8px;
              text-align: right;
            }
            .request-details { 
              margin: 20px 0; 
              padding: 20px; 
              background: #f0f9ff; 
              border-radius: 8px;
              text-align: right;
            }
            .next-steps { 
              margin: 20px 0; 
              padding: 20px; 
              background: #fef3c7; 
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
            <h1>בקשת דוח נתונים לקניית עסק - SmartRisk</h1>
            
            <div class="contact-info">
              <h2>פרטי הפונה</h2>
              <p><strong>שם מלא:</strong> ${formData.fullName}</p>
              <p><strong>טלפון נייד:</strong> ${formData.mobile}</p>
              <p><strong>אימייל:</strong> ${formData.email}</p>
            </div>

            ${formData.businessName ? `
            <div class="business-info">
              <h2>פרטי העסק הנבדק</h2>
              <p><strong>שם העסק:</strong> ${formData.businessName}</p>
            </div>
            ` : ''}

            <div class="request-details">
              <h2>פרטי הבקשה</h2>
              <p><strong>סוג הבקשה:</strong> דוח נתונים לקניית עסק</p>
              <p><strong>תאריך הבקשה:</strong> ${new Date().toLocaleDateString('he-IL')}</p>
              <p><strong>שעת הבקשה:</strong> ${new Date().toLocaleTimeString('he-IL')}</p>
              <p><strong>מקור הבקשה:</strong> דף "רוצה לקנות עסק? עצור לבדיקת נתונים"</p>
            </div>

            <div class="next-steps">
              <h2>השלבים הבאים</h2>
              <p><strong>מה הפונה מצפה לקבל:</strong></p>
              <ul style="text-align: right; margin-right: 20px;">
                <li>דוח נתונים מבוסס A.I ללא עלות</li>
                <li>תמונת מצב ראשונית לעסק הנבדק</li>
                <li>כלי עזר להחליט אם להמשיך בבדיקות עומק</li>
                <li>המלצות לגבי המשך התהליך</li>
              </ul>
              <p><strong>פעולות נדרשות:</strong></p>
              <ul style="text-align: right; margin-right: 20px;">
                <li>צור קשר עם הפונה תוך 24 שעות</li>
                <li>קבל נתונים רלוונטיים על העסק הנבדק</li>
                <li>הכן דוח נתונים ראשוני</li>
                <li>תאם פגישת מעקב לפי הצורך</li>
              </ul>
            </div>

            <div class="footer">
              <p><strong>הערות חשובות:</strong></p>
              <p>• הפונה מעוניין בדוח נתונים חינם לפני רכישת עסק</p>
              <p>• זהו לקוח פוטנציאלי לשירותי ייעוץ מתקדמים</p>
              <p>• חשוב לתת מענה מהיר ומקצועי</p>
              <br>
              <p>בקשה זו נשלחה דרך טופס "רוצה לקנות עסק? עצור לבדיקת נתונים" באתר SmartRisk.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const { data, error } = await resend.emails.send({
      from: 'SmartRisk Business Buy <onboarding@resend.dev>',
      to: 'itaisd@gmail.com', // Send to your email (Resend limitation until domain verified)
      subject: 'בקשת דוח נתונים לקניית עסק - SmartRisk',
      html: html,
      replyTo: formData.email
    });

    if (error) {
      console.error('Error sending business buy readiness email:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Error in sendBusinessBuyReadinessEmail:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send business buy readiness email'
    };
  }
} 