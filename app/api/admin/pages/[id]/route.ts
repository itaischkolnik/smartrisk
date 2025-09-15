import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';
export const runtime = 'nodejs';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Check authentication
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    if (authError || !session) {
      return NextResponse.json({ error: 'לא מורשה - יש להתחבר מחדש' }, { status: 401 });
    }

    // Check if user is admin via admin_roles table
    const { data: adminData, error: adminError } = await supabase
      .from('admin_roles')
      .select('is_admin')
      .eq('email', session.user.email)
      .single();

    if (adminError || !adminData || !adminData.is_admin) {
      return NextResponse.json({ error: 'אין לך הרשאות מנהל' }, { status: 403 });
    }
    const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

    // Fetch page by ID
    const { data: page, error: pageError } = await supabase
      .from('pages')
      .select('*')
      .eq('id', params.id)
      .single();

    if (pageError) {
      console.error('Error fetching page:', pageError);
      return NextResponse.json({ error: 'שגיאה בטעינת הדף' }, { status: 500 });
    }

    if (!page) {
      return NextResponse.json({ error: 'הדף לא נמצא' }, { status: 404 });
    }

    return NextResponse.json({ page });
  } catch (error) {
    console.error('Unexpected error in pages GET API:', error);
    return NextResponse.json({ error: 'שגיאה לא צפויה' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Check authentication
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    if (authError || !session) {
      return NextResponse.json({ error: 'לא מורשה - יש להתחבר מחדש' }, { status: 401 });
    }

    // Check if user is admin via admin_roles table
    const { data: adminData, error: adminError } = await supabase
      .from('admin_roles')
      .select('is_admin')
      .eq('email', session.user.email)
      .single();

    if (adminError || !adminData || !adminData.is_admin) {
      return NextResponse.json({ error: 'אין לך הרשאות מנהל' }, { status: 403 });
    }
    const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

    const body = await request.json();
    const toBool = (v: any) => v === true || v === 'true' || v === 1 || v === '1' || v === 't' || v === 'T';
    const { title, slug, content, meta_description } = body;
    const is_published_bool = toBool(body?.is_published);

    // Validate required fields
    if (!title || !slug || !content) {
      return NextResponse.json({ error: 'כותרת, כתובת ותוכן הם שדות חובה' }, { status: 400 });
    }

    // Check if slug already exists for other pages
    const { data: existingPage } = await supabaseAdmin
      .from('pages')
      .select('id')
      .eq('slug', slug)
      .neq('id', params.id)
      .single();

    if (existingPage) {
      return NextResponse.json({ error: 'כתובת הדף כבר קיימת במערכת' }, { status: 400 });
    }

    // Update page
    const { data: updatedPage, error: updateError } = await supabaseAdmin
      .from('pages')
      .update({
        title,
        slug,
        content,
        meta_description: meta_description || '',
        is_published: is_published_bool,
        updated_at: new Date().toISOString()
      })
      .eq('id', params.id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating page:', updateError);
      return NextResponse.json({ error: 'שגיאה בעדכון הדף' }, { status: 500 });
    }

    if (!updatedPage) {
      return NextResponse.json({ error: 'הדף לא נמצא' }, { status: 404 });
    }

    return NextResponse.json({ page: updatedPage });
  } catch (error) {
    console.error('Unexpected error in pages PUT API:', error);
    return NextResponse.json({ error: 'שגיאה לא צפויה' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Check authentication
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    if (authError || !session) {
      return NextResponse.json({ error: 'לא מורשה - יש להתחבר מחדש' }, { status: 401 });
    }

    // Check if user is admin via admin_roles table
    const { data: adminData, error: adminError } = await supabase
      .from('admin_roles')
      .select('is_admin')
      .eq('email', session.user.email)
      .single();

    if (adminError || !adminData || !adminData.is_admin) {
      return NextResponse.json({ error: 'אין לך הרשאות מנהל' }, { status: 403 });
    }
    const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

    // Delete page using admin client to bypass RLS
    const { error: deleteError } = await supabaseAdmin
      .from('pages')
      .delete()
      .eq('id', params.id);

    if (deleteError) {
      console.error('Error deleting page:', deleteError);
      return NextResponse.json({ error: 'שגיאה במחיקת הדף' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Unexpected error in pages DELETE API:', error);
    return NextResponse.json({ error: 'שגיאה לא צפויה' }, { status: 500 });
  }
}
