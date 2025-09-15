import { NextRequest, NextResponse } from 'next/server';
import { sendBusinessBuyReadinessEmail } from '../../services/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fullName, mobile, email, businessName } = body;

    // Validate required fields
    if (!fullName || !mobile || !email) {
      return NextResponse.json(
        { error: 'שם מלא, טלפון נייד ואימייל הם שדות חובה' },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'כתובת אימייל לא תקינה' },
        { status: 400 }
      );
    }

    // Send email
    const result = await sendBusinessBuyReadinessEmail({
      fullName,
      mobile,
      email,
      businessName
    });

    if (result.success) {
      return NextResponse.json(
        { message: 'הבקשה נשלחה בהצלחה! נחזור אליך בהקדם עם דוח הנתונים.' },
        { status: 200 }
      );
    } else {
      console.error('Email sending failed:', result.error);
      return NextResponse.json(
        { error: 'שגיאה בשליחת הבקשה. אנא נסה שוב מאוחר יותר.' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Business buy readiness form error:', error);
    return NextResponse.json(
      { error: 'שגיאה בשרת. אנא נסה שוב מאוחר יותר.' },
      { status: 500 }
    );
  }
}
