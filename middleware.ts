import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  // Check if this is an RSC request
  const isRSC = req.headers.get('RSC') === '1' || req.headers.get('Next-Router-State-Tree') || req.nextUrl.searchParams.has('_rsc');
  if (isRSC) {
    return res;
  }

  // Get the current session
  const { data: { session } } = await supabase.auth.getSession();

  // Define paths
  const isAuthPath = req.nextUrl.pathname.startsWith('/auth');
  const isDashboardPath = req.nextUrl.pathname.startsWith('/dashboard');
  const isAssessmentPath = req.nextUrl.pathname.startsWith('/assessment');
  const isSettingsPath = req.nextUrl.pathname.startsWith('/settings');
  const isHelpPath = req.nextUrl.pathname.startsWith('/help');
  const isHomePath = req.nextUrl.pathname === '/';

  // Protected routes that require authentication
  const isProtectedRoute = isDashboardPath || isAssessmentPath || isSettingsPath || isHelpPath;

  // If the user is not signed in and trying to access a protected route
  if (!session && isProtectedRoute) {
    const redirectUrl = new URL('/auth/login', req.url);
    return NextResponse.redirect(redirectUrl);
  }

  // If the user is signed in and trying to access auth pages or home page
  if (session && (isAuthPath || isHomePath)) {
    const redirectUrl = new URL('/dashboard', req.url);
    return NextResponse.redirect(redirectUrl);
  }

  return res;
}

export const config = {
  matcher: [
    '/',
    '/auth/:path*',
    '/dashboard/:path*',
    '/assessment/:path*',
    '/settings/:path*',
    '/help/:path*',
    '/about',
    '/contact',
    '/pricing',
    '/features',
    '/assessments',
  ],
}; 