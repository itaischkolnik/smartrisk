import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import puppeteer from 'puppeteer';

// Create a Supabase server client
const createServerSupabaseClient = () => {
  const cookieStore = cookies();
  
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    {
      global: {
        headers: {
          cookie: cookieStore.toString(),
        },
      },
    }
  );
};

export async function POST(request: Request) {
  try {
    const { assessmentId } = await request.json();

    if (!assessmentId) {
      return NextResponse.json(
        { error: 'Assessment ID is required' },
        { status: 400 }
      );
    }

    // Create a Supabase client for server-side auth
    const supabase = createServerSupabaseClient();

    // Check if user is authenticated
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Fetch the assessment with analysis
    const { data: assessment, error: assessmentError } = await supabase
      .from('assessments')
      .select('*')
      .eq('id', assessmentId)
      .eq('user_id', userId)
      .single();

    if (assessmentError || !assessment) {
      console.error('Error fetching assessment:', assessmentError);
      return NextResponse.json(
        { error: 'Assessment not found' },
        { status: 404 }
      );
    }

    if (assessment.status !== 'completed' || !assessment.analysis) {
      return NextResponse.json(
        { error: 'Assessment analysis not available' },
        { status: 400 }
      );
    }

    // Generate PDF
    try {
      // Launch browser
      const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });
      const page = await browser.newPage();

      // Generate HTML content for the report
      const htmlContent = `
      <!DOCTYPE html>
      <html dir="rtl">
      <head>
        <meta charset="UTF-8">
        <title>דוח הערכת סיכונים עסקית - Smart Risk</title>
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
            border: 1px solid #ddd;
            padding: 20px;
            border-radius: 5px;
          }
          .header {
            text-align: center;
            margin-bottom: 20px;
            border-bottom: 2px solid #333;
            padding-bottom: 10px;
          }
          .header h1 {
            margin: 0;
            color: #333;
          }
          .header p {
            margin: 5px 0;
            color: #666;
          }
          .section {
            margin-bottom: 20px;
          }
          .section h2 {
            color: #444;
            border-bottom: 1px solid #eee;
            padding-bottom: 5px;
          }
          .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 12px;
            color: #999;
          }
          .risk-meter {
            margin: 20px 0;
            text-align: center;
          }
          .risk-meter .score {
            font-size: 24px;
            font-weight: bold;
          }
          pre {
            white-space: pre-wrap;
            font-family: Arial, sans-serif;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>דוח הערכת סיכונים עסקית</h1>
            <p>Smart Risk | ${new Date().toLocaleDateString('he-IL')}</p>
          </div>
          
          <div class="section">
            <h2>פרטי העסק</h2>
            <p><strong>שם העסק:</strong> ${assessment.business_details?.business_name || 'לא צוין'}</p>
            <p><strong>סוג העסק:</strong> ${assessment.business_details?.business_type || 'לא צוין'}</p>
          </div>
          
          <div class="risk-meter">
            <p>דירוג סיכון:</p>
            <p class="score">${assessment.risk_score || 'N/A'}/100</p>
            <p>(0 = סיכון גבוה, 100 = בטוח יחסית)</p>
          </div>
          
          <div class="section">
            <h2>ניתוח מפורט</h2>
            <pre>${assessment.analysis || 'אין נתונים זמינים'}</pre>
          </div>
          
          <div class="footer">
            <p>דוח זה נוצר אוטומטית על ידי מערכת Smart Risk.</p>
            <p>© ${new Date().getFullYear()} Smart Risk. כל הזכויות שמורות.</p>
          </div>
        </div>
      </body>
      </html>
      `;

      await page.setContent(htmlContent);
      
      // Generate PDF
      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '20px',
          right: '20px',
          bottom: '20px',
          left: '20px',
        },
      });

      await browser.close();

      // Upload PDF to Supabase Storage
      const fileName = `assessment_${assessmentId}_${Date.now()}.pdf`;
      const { data: uploadData, error: uploadError } = await supabase
        .storage
        .from('reports')
        .upload(`users/${userId}/${fileName}`, pdfBuffer, {
          contentType: 'application/pdf',
          upsert: false,
        });

      if (uploadError) {
        console.error('Error uploading PDF:', uploadError);
        return NextResponse.json(
          { error: 'Failed to upload report' },
          { status: 500 }
        );
      }

      // Get public URL for the uploaded file
      const { data: publicUrlData } = await supabase
        .storage
        .from('reports')
        .getPublicUrl(`users/${userId}/${fileName}`);

      const pdfUrl = publicUrlData.publicUrl;

      // Update assessment with report URL
      await supabase
        .from('assessments')
        .update({
          report_url: pdfUrl,
          updated_at: new Date().toISOString(),
        })
        .eq('id', assessmentId);

      return NextResponse.json({
        success: true,
        reportUrl: pdfUrl,
      });
    } catch (pdfError) {
      console.error('Error generating PDF:', pdfError);
      return NextResponse.json(
        { error: 'Failed to generate PDF report' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in PDF generation:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 