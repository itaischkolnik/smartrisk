import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const supabase = createRouteHandlerClient({ cookies });
    await supabase.auth.exchangeCodeForSession(code);
  }

  // Get the site URL from environment variable, fallback to request URL for local development
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || requestUrl.origin;
  
  // Redirect to dashboard
  return NextResponse.redirect(new URL('/dashboard', siteUrl));
} 