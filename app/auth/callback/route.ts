import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

// Use default (Node.js) runtime so that we can set http-only cookies properly

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
    // Explicitly set cookies again to be safe (some environments drop them on exchange)
    if (data.session) {
      const { error: setErr } = await supabase.auth.setSession({
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
      });
      if (setErr) {
        console.error('setSession error:', setErr.message);
      }
    }
    
    if (error) {
      console.error('Session exchange error:', error);
      return NextResponse.redirect(new URL('/auth/login', siteUrl));
    }

    if (!data.session) {
      console.error('No session created');
      return NextResponse.redirect(new URL('/auth/login', siteUrl));
    }

    console.log('Authentication successful, user:', data.session.user.email);
    console.log('Redirecting to dashboard');
    
    // After successful authentication, redirect to dashboard with auth callback indicator
    const dashboardUrl = new URL('/dashboard', siteUrl);
    dashboardUrl.searchParams.set('auth_callback', 'true');
    
    const response = NextResponse.redirect(dashboardUrl);
    
    // Add headers to ensure session is established
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    
    return response;
  } catch (error) {
    console.error('Auth callback error:', error);
    const siteUrl = process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin;
    return NextResponse.redirect(new URL('/auth/login', siteUrl));
  }
} 