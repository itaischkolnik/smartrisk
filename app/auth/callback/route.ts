import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');
    const siteUrl = process.env.NEXT_PUBLIC_APP_URL || requestUrl.origin;

    // If there's no code, redirect to home
    if (!code) {
      return NextResponse.redirect(new URL('/', siteUrl));
    }

    // Exchange the code for a session
    const supabase = createRouteHandlerClient({ cookies });
    await supabase.auth.exchangeCodeForSession(code);

    // After successful authentication, redirect to dashboard
    return NextResponse.redirect(new URL('/dashboard', siteUrl));
  } catch (error) {
    console.error('Auth callback error:', error);
    // On error, redirect to login page
    return NextResponse.redirect(new URL('/auth/login', process.env.NEXT_PUBLIC_APP_URL || request.url));
  }
} 