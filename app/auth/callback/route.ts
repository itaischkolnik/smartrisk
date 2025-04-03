import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');
    const siteUrl = process.env.NEXT_PUBLIC_APP_URL || requestUrl.origin;

    console.log('Auth callback received:', { 
      url: request.url,
      code: code ? 'exists' : 'missing',
      siteUrl 
    });

    // If there's no code, redirect to home
    if (!code) {
      console.log('No code found in callback');
      return NextResponse.redirect(new URL('/', siteUrl));
    }

    // Exchange the code for a session
    const supabase = createRouteHandlerClient({ cookies });
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (error) {
      console.error('Session exchange error:', error);
      return NextResponse.redirect(new URL('/auth/login', siteUrl));
    }

    if (!data.session) {
      console.error('No session created');
      return NextResponse.redirect(new URL('/auth/login', siteUrl));
    }

    console.log('Authentication successful, redirecting to dashboard');
    
    // After successful authentication, redirect to dashboard
    const response = NextResponse.redirect(new URL('/dashboard', siteUrl));
    
    // Ensure cookies are being set
    const cookieStore = cookies();
    response.cookies.set({
      name: 'sb-access-token',
      value: data.session.access_token,
      path: '/',
      secure: true,
      sameSite: 'lax'
    });
    
    return response;
  } catch (error) {
    console.error('Auth callback error:', error);
    const siteUrl = process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin;
    return NextResponse.redirect(new URL('/auth/login', siteUrl));
  }
} 