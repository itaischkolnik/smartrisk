import { NextAuthOptions } from 'next-auth';
import NextAuth from 'next-auth/next';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { authOptions } from '@/lib/auth/auth-options';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    }
  }
}

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }; 