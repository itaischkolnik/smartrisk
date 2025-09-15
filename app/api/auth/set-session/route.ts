import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';

export const runtime = 'edge';

interface Payload {
  access_token: string;
  refresh_token: string;
}

export async function POST(req: Request) {
  try {
    const { access_token, refresh_token } = (await req.json()) as Payload;

    if (!access_token || !refresh_token) {
      return NextResponse.json({ error: 'Missing tokens' }, { status: 400 });
    }

    const supabase = createRouteHandlerClient({ cookies });
    const { error } = await supabase.auth.setSession({ access_token, refresh_token });

    if (error) {
      console.error('Error setting session cookies:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Unexpected error in set-session:', err);
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 });
  }
}