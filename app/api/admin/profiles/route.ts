import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '../../../lib/supabase/server';

export async function GET() {
  try {
    console.log('Admin profiles API called');
    
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

    console.log('Admin authenticated, fetching profiles...');

    // Try to fetch profiles with a simple query first
    let { data: profiles, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    // If that fails, try with specific columns
    if (error) {
      console.log('First query failed, trying with specific columns...');
      const { data: profiles2, error: error2 } = await supabase
        .from('profiles')
        .select(`
          id,
          email,
          full_name,
          avatar_url,
          age,
          location,
          marital_status,
          mobile_phone,
          occupation,
          self_introduction,
          life_experience,
          motivation,
          financial_capability,
          five_year_goals,
          subscription,
          assessments_used_this_year,
          last_assessment_reset_date,
          created_at,
          updated_at
        `)
        .order('created_at', { ascending: false });
      
      if (error2) {
        console.error('Both queries failed:', error, error2);
        return NextResponse.json({ error: 'Failed to fetch profiles' }, { status: 500 });
      }
      
      profiles = profiles2;
      error = error2;
    }

    if (error) {
      console.error('Error fetching profiles:', error);
      return NextResponse.json({ error: 'Failed to fetch profiles' }, { status: 500 });
    }

    console.log('Returning profiles:', profiles?.length || 0, 'profiles found');
    return NextResponse.json({ profiles });
  } catch (error) {
    console.error('Error in profiles API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 