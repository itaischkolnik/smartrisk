import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '../../../lib/supabase/server';

export async function GET() {
  try {
    console.log('Admin assessments API called');
    
    // Create a Supabase client for server-side auth
    const supabase = createServerSupabaseClient();

    // Check if user is authenticated
    const { data: { session } } = await supabase.auth.getSession();
    console.log('Session:', session ? 'Authenticated' : 'Not authenticated');
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user is admin by querying the admin_roles table
    const { data: adminData, error: adminError } = await supabase
      .from('admin_roles')
      .select('is_admin')
      .eq('email', session.user.email)
      .single();

    if (adminError || !adminData || !adminData.is_admin) {
      console.log('User is not admin:', session.user.email);
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    console.log('Admin authenticated, fetching assessments...');

    // Fetch all assessments with user details
    const { data: assessments, error } = await supabase
      .from('assessments')
      .select(`
        *,
        profiles:user_id (
          id,
          email,
          full_name,
          avatar_url,
          mobile_phone,
          location,
          occupation
        )
      `)
      .order('created_at', { ascending: false });

    console.log('Assessments query result:', { assessments, error });

    if (error) {
      console.error('Error fetching assessments:', error);
      return NextResponse.json(
        { error: 'Failed to fetch assessments' },
        { status: 500 }
      );
    }

    console.log('Returning assessments:', assessments?.length || 0, 'assessments found');
    return NextResponse.json({ assessments });
  } catch (error) {
    console.error('Error in assessments GET route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
