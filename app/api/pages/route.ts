import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    // Use the EXACT same database connection method as the admin API
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    
    // Force the exact same client creation as admin API
    const supabaseAdmin = createClient(supabaseUrl, serviceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // Query the pages table directly (same as admin API)
    const { data: allPages, error: pagesError } = await supabaseAdmin
      .from('pages')
      .select('id, slug, title, is_published, created_at')
      .order('created_at', { ascending: false });

    if (pagesError) {
      console.error('Error fetching pages:', pagesError);
      return NextResponse.json({ error: 'Failed to load pages' }, { status: 500 });
    }
    
    // Local safeguard – treat only strict truthy representations as published
    const normalizeBool = (val: any) => val === true || val === 'true' || val === 1 || val === '1' || val === 't' || val === 'T';
    const publishedPages = (allPages || []).filter((p: any) => normalizeBool(p.is_published));

    // Dedupe by slug (keep the first occurrence due to ordering desc by created_at)
    const seenSlugs = new Set<string>();
    const dedupedPages = publishedPages.filter((p: any) => {
      const slug = p?.slug;
      if (!slug) return false;
      if (seenSlugs.has(slug)) return false;
      seenSlugs.add(slug);
      return true;
    });

    // If ?debug=all is in the querystring, return everything
    if (request.nextUrl.searchParams.has('debug')) {
      const response = NextResponse.json({ 
        all: allPages, 
        published: publishedPages, 
        deduped: dedupedPages,
        debug: {
          total_pages: allPages?.length || 0,
          published_count: publishedPages?.length || 0,
          deduped_count: dedupedPages?.length || 0,
          timestamp: new Date().toISOString(),
          cache_buster: request.nextUrl.searchParams.get('cb') || 'none'
        }
      });
      response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
      response.headers.set('Pragma', 'no-cache');
      response.headers.set('Expires', '0');
      // Masked environment diagnostics in headers
      try {
        const urlSuffix = supabaseUrl?.slice(-12) || '';
        response.headers.set('X-Supabase-Url-Suffix', urlSuffix);
        response.headers.set('X-Supabase-Service-Len', String(serviceKey?.length || 0));
      } catch {}
      return response;
    }

    // If ?env is present, return masked env diagnostics only
    if (request.nextUrl.searchParams.has('env')) {
      const envInfo = {
        host: (() => { try { return new URL(supabaseUrl).host; } catch { return ''; } })(),
        url_suffix: supabaseUrl?.slice(-24) || '',
        service_len: serviceKey?.length || 0,
      };
      const response = NextResponse.json({ env: envInfo });
      response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
      response.headers.set('Pragma', 'no-cache');
      response.headers.set('Expires', '0');
      return response;
    }

    // If ?simple is present, return basic debug info
    if (request.nextUrl.searchParams.has('simple')) {
      const simpleDebug = {
        total_pages: allPages?.length || 0,
        published_pages: publishedPages?.length || 0,
        deduped_pages: dedupedPages?.length || 0,
        published_slugs: publishedPages?.map(p => p.slug) || [],
        timestamp: new Date().toISOString()
      };
      const response = NextResponse.json({ debug: simpleDebug, pages: dedupedPages });
      response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
      response.headers.set('Pragma', 'no-cache');
      response.headers.set('Expires', '0');
      return response;
    }

    const response = NextResponse.json({ pages: dedupedPages });
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    response.headers.set('Surrogate-Control', 'no-store');
    response.headers.set('X-Accel-Buffering', 'no');
    
    // Force immediate cache invalidation
    response.headers.set('Last-Modified', new Date().toUTCString());
    response.headers.set('ETag', `"${Date.now()}"`);
    
    // Masked environment diagnostics in headers (helpful during troubleshooting)
    try {
      const urlSuffix = supabaseUrl?.slice(-12) || '';
      response.headers.set('X-Supabase-Url-Suffix', urlSuffix);
      response.headers.set('X-Supabase-Service-Len', String(serviceKey?.length || 0));
    } catch {}
    return response;
  } catch (err) {
    console.error('Unexpected error in public pages API:', err);
    return NextResponse.json({ error: 'שגיאה לא צפויה' }, { status: 500 });
  }
}
