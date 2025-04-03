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

  // Get the host from the request URL
  const host = requestUrl.host;
  const protocol = host.includes('localhost') ? 'http' : 'https';
  
  // Construct the redirect URL using the same host
  const redirectTo = new URL('/dashboard', `${protocol}://${host}`);
  
  // Redirect to dashboard
  return NextResponse.redirect(redirectTo);
} 