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
  
  // Debug logging
  console.log('Middleware - Path:', req.nextUrl.pathname, 'Session:', !!session, 'User:', session?.user?.email);

  // Define paths
  const isAuthPath = req.nextUrl.pathname.startsWith('/auth');
  const isAdminPath = req.nextUrl.pathname.startsWith('/admin');
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

  // If the user is signed in and trying to access auth pages, redirect to dashboard
  if (session && isAuthPath) {
    const redirectUrl = new URL('/dashboard', req.url);
    return NextResponse.redirect(redirectUrl);
  }

  // If the user is signed in and trying to access home page, redirect to dashboard
  // But be more careful about this to avoid redirect loops during auth state changes
  if (session && isHomePath) {
    // Check if this is coming from an auth callback to avoid redirect loops
    const referer = req.headers.get('referer');
    const isFromAuthCallback = referer && (referer.includes('/auth/callback') || referer.includes('/auth/'));
    
    if (!isFromAuthCallback) {
      const redirectUrl = new URL('/dashboard', req.url);
      return NextResponse.redirect(redirectUrl);
    }
  }

  // Admin routes are handled separately (they use localStorage for admin session)
  // We don't redirect admin routes here as they have their own authentication

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
    '/admin/:path*',
  ],
}; 