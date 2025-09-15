import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    console.log('GET /api/admin/pages called');
    const supabase = createRouteHandlerClient({ cookies });
    console.log('Supabase client created');
    
    // Check authentication
    console.log('Checking authentication...');
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    if (authError || !session) {
      console.log('Authentication failed:', authError);
      return NextResponse.json({ error: 'לא מורשה - יש להתחבר מחדש' }, { status: 401 });
    }
    console.log('User authenticated:', session.user.email);

    // Check if user is admin using admin_roles table (matching useAdminAuth logic)
    console.log('Checking admin status...');
    const { data: adminData, error: adminError } = await supabase
      .from('admin_roles')
      .select('is_admin')
      .eq('email', session.user.email)
      .single();

    if (adminError || !adminData || !adminData.is_admin) {
      console.log('Admin check failed:', adminError, adminData);
      return NextResponse.json({ error: 'אין לך הרשאות מנהל' }, { status: 403 });
    }
    console.log('User is admin, proceeding to fetch pages');

    // After admin verification, use service-role client to bypass RLS for reliable access
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabaseAdmin = createClient(supabaseUrl, serviceKey);

    console.log('Fetching pages from database (service role)...');
    const { data: pages, error: pagesError } = await supabaseAdmin
      .from('pages')
      .select('*')
      .order('created_at', { ascending: false });

    if (pagesError) {
      // If table doesn't exist, return empty array
      if (pagesError.code === '42P01') { // Table doesn't exist
        console.log('Pages table does not exist yet, returning empty array');
        return NextResponse.json({ pages: [] });
      }
      console.error('Error fetching pages:', pagesError);
      return NextResponse.json({ error: 'שגיאה בטעינת הדפים' }, { status: 500 });
    }

    console.log('Pages fetched successfully, count:', pages?.length || 0);
    if (request.nextUrl.searchParams.has('env')) {
      return NextResponse.json({
        pages: pages || [],
        env: {
          host: (() => { try { return new URL(supabaseUrl).host; } catch { return ''; } })(),
          url_suffix: supabaseUrl?.slice(-24) || '',
          service_len: serviceKey?.length || 0,
        }
      });
    }
    return NextResponse.json({ pages: pages || [] });
  } catch (error) {
    console.error('Unexpected error in pages GET API:', error);
    return NextResponse.json({ error: 'שגיאה לא צפויה' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('POST /api/admin/pages called');
    const supabase = createRouteHandlerClient({ cookies });
    
    // Check authentication
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    if (authError || !session) {
      console.log('Authentication failed:', authError);
      return NextResponse.json({ error: 'לא מורשה - יש להתחבר מחדש' }, { status: 401 });
    }
    console.log('User authenticated:', session.user.email);

    // Check if user is admin using admin_roles table (matching useAdminAuth logic)
    const { data: adminData, error: adminError } = await supabase
      .from('admin_roles')
      .select('is_admin')
      .eq('email', session.user.email)
      .single();

    if (adminError || !adminData || !adminData.is_admin) {
      console.log('Admin check failed:', adminError, adminData);
      return NextResponse.json({ error: 'אין לך הרשאות מנהל' }, { status: 403 });
    }
    console.log('User is admin');

    // Use service-role client for DB operations to bypass RLS
    const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

    const body = await request.json();
    console.log('Request body:', body);
    const toBool = (v: any) => v === true || v === 'true' || v === 1 || v === '1' || v === 't' || v === 'T';
    const { title, slug, content, meta_description } = body;
    const is_published_raw = body?.is_published;
    const is_published_bool = toBool(is_published_raw);

    // Validate required fields
    if (!title || !slug || !content) {
      console.log('Validation failed - missing required fields');
      return NextResponse.json({ error: 'כותרת, כתובת ותוכן הם שדות חובה' }, { status: 400 });
    }

    // Check if pages table exists
    console.log('Checking if pages table exists...');
    const { data: tableExists, error: tableCheckError } = await supabaseAdmin
      .from('pages')
      .select('id')
      .limit(1);

    if (tableCheckError) {
      console.log('Error checking table existence:', tableCheckError);
      return NextResponse.json({ error: 'טבלת הדפים לא קיימת עדיין' }, { status: 500 });
    }
    console.log('Pages table exists');

    // Check if slug already exists
    console.log('Checking if slug already exists:', slug);
    const { data: existingPage, error: slugCheckError } = await supabaseAdmin
      .from('pages')
      .select('id')
      .eq('slug', slug)
      .single();

    if (slugCheckError && slugCheckError.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.log('Error checking slug existence:', slugCheckError);
      return NextResponse.json({ error: 'שגיאה בבדיקת כתובת הדף' }, { status: 500 });
    }

    if (existingPage) {
      console.log('Slug already exists:', slug);
      return NextResponse.json({ error: 'כתובת הדף כבר קיימת במערכת' }, { status: 400 });
    }
    console.log('Slug is available');

    // Insert new page
    console.log('Inserting new page...');
    const { data: newPage, error: insertError } = await supabaseAdmin
      .from('pages')
      .insert({
        title,
        slug,
        content,
        meta_description: meta_description || '',
        is_published: is_published_bool,
        created_by: session.user.id
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error inserting page:', insertError);
      return NextResponse.json({ error: 'שגיאה ביצירת הדף' }, { status: 500 });
    }

    console.log('Page created successfully:', newPage);
    return NextResponse.json({ page: newPage });
  } catch (error) {
    console.error('Unexpected error in pages POST API:', error);
    return NextResponse.json({ error: 'שגיאה לא צפויה' }, { status: 500 });
  }
}
