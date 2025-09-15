import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

// Create a Supabase server client
const createServerSupabaseClient = () => {
  const cookieStore = cookies();
  
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    {
      global: {
        headers: {
          cookie: cookieStore.toString(),
        },
      },
    }
  );
};

// GET all assessments for the authenticated user
export async function GET() {
  try {
    // Create a Supabase client for server-side auth
    const supabase = createServerSupabaseClient();

    // Check if user is authenticated
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Fetch all assessments for the user
    const { data: assessments, error } = await supabase
      .from('assessments')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching assessments:', error);
      return NextResponse.json(
        { error: 'Failed to fetch assessments' },
        { status: 500 }
      );
    }

    return NextResponse.json(assessments);
  } catch (error) {
    console.error('Error in assessments GET route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST to create a new assessment
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Create a Supabase client for server-side auth
    const supabase = createServerSupabaseClient();

    // Check if user is authenticated
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Check if user can create assessment (only for completed assessments, not drafts)
    if (body.status === 'completed') {
      // Get user's profile to check subscription and usage
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('subscription, assessments_used_this_year')
        .eq('id', userId)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        return NextResponse.json(
          { error: 'Failed to fetch user profile' },
          { status: 500 }
        );
      }

      // Check if user can create assessment based on subscription
      let canCreate = false;
      let shouldIncrement = false;
      switch (profile.subscription) {
        case 'חינם':
          canCreate = true; // Free users can create assessments
          shouldIncrement = false; // But don't count them towards limits
          break;
        case 'יזם':
          canCreate = profile.assessments_used_this_year === 0;
          shouldIncrement = true;
          break;
        case 'איש עסקים':
          canCreate = profile.assessments_used_this_year < 18;
          shouldIncrement = true;
          break;
        case 'מקצועי':
          canCreate = profile.assessments_used_this_year < 36;
          shouldIncrement = true;
          break;
        default:
          canCreate = true; // Default to allowing creation
          shouldIncrement = false;
      }

      if (!canCreate) {
        const message = `You have used all ${profile.subscription === 'יזם' ? '1' : profile.subscription === 'איש עסקים' ? '18' : '36'} assessments for your plan`;
        
        return NextResponse.json(
          { error: message },
          { status: 403 }
        );
      }

      // Increment assessment count only for paid users
      if (shouldIncrement) {
        const { error: incrementError } = await supabase
          .rpc('increment_assessment_count', { user_id: userId });

        if (incrementError) {
          console.error('Error incrementing assessment count:', incrementError);
          return NextResponse.json(
            { error: 'Failed to update assessment count' },
            { status: 500 }
          );
        }
      }
    }

    // Create new assessment
    const { data, error } = await supabase
      .from('assessments')
      .insert({
        ...body,
        user_id: userId,
        status: body.status || 'draft',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating assessment:', error);
      return NextResponse.json(
        { error: 'Failed to create assessment' },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error in assessment POST route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 