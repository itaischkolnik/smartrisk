import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '../../../lib/supabase/server';

export async function GET() {
  try {
    console.log('Admin stats API called');
    
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

    console.log('Admin authenticated, fetching stats...');

    // Fetch total users (profiles)
    const { count: totalUsers, error: usersError } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    if (usersError) {
      console.error('Error fetching users count:', usersError);
    }

    // Fetch total assessments
    const { count: totalAssessments, error: assessmentsError } = await supabase
      .from('assessments')
      .select('*', { count: 'exact', head: true });

    if (assessmentsError) {
      console.error('Error fetching assessments count:', assessmentsError);
    }

    // Fetch active assessments (assessments with status 'active' or 'in_progress')
    const { count: activeAssessments, error: activeError } = await supabase
      .from('assessments')
      .select('*', { count: 'exact', head: true })
      .in('status', ['active', 'in_progress', 'draft']);

    if (activeError) {
      console.error('Error fetching active assessments count:', activeError);
    }

    // Fetch pending reviews (assessments with status 'pending' or 'submitted')
    const { count: pendingReviews, error: pendingError } = await supabase
      .from('assessments')
      .select('*', { count: 'exact', head: true })
      .in('status', ['pending', 'submitted', 'review']);

    if (pendingError) {
      console.error('Error fetching pending reviews count:', pendingError);
    }

    // Fetch subscription statistics
    const { data: subscriptionStats, error: subscriptionError } = await supabase
      .from('profiles')
      .select('subscription, assessments_used_this_year');

    if (subscriptionError) {
      console.error('Error fetching subscription stats:', subscriptionError);
    }

    // Calculate subscription counts and total assessments used
    let freeUsers = 0;
    let entrepreneurUsers = 0;
    let businessUsers = 0;
    let professionalUsers = 0;
    let totalAssessmentsUsed = 0;

    if (subscriptionStats) {
      subscriptionStats.forEach(profile => {
        switch (profile.subscription) {
          case 'חינם':
            freeUsers++;
            break;
          case 'יזם':
            entrepreneurUsers++;
            break;
          case 'איש עסקים':
            businessUsers++;
            break;
          case 'מקצועי':
            professionalUsers++;
            break;
        }
        totalAssessmentsUsed += profile.assessments_used_this_year || 0;
      });
    }

    const stats = {
      totalUsers: totalUsers || 0,
      totalAssessments: totalAssessments || 0,
      activeAssessments: activeAssessments || 0,
      pendingReviews: pendingReviews || 0,
      freeUsers,
      entrepreneurUsers,
      businessUsers,
      professionalUsers,
      totalAssessmentsUsed
    };

    console.log('Returning stats:', stats);
    return NextResponse.json({ stats });

  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    );
  }
} 