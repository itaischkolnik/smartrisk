'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../utils/supabase';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{
    error: Error | null;
    data: { user: User | null; session: Session | null } | null;
  }>;
  signUp: (email: string, password: string, metadata?: any) => Promise<{
    error: Error | null;
    data: { user: User | null; session: Session | null } | null;
  }>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }

        if (mounted) {
          if (initialSession) {
            setSession(initialSession);
            setUser(initialSession.user);
          } else {
            setSession(null);
            setUser(null);
          }
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
        if (mounted) {
          setSession(null);
          setUser(null);
          setIsLoading(false);
        }
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log('Auth state change:', event, currentSession?.user?.email);
        if (mounted) {
          // Debounce auth state changes to prevent rapid re-renders
          // Use a longer debounce for SIGNED_IN events to prevent interference with form transitions
          const debounceTime = event === 'SIGNED_IN' ? 1000 : 500;
          setTimeout(() => {
            if (!mounted) return;
            
            if (event === 'SIGNED_IN') {
              setSession(currentSession);
              setUser(currentSession?.user ?? null);
              console.log('User signed in:', currentSession?.user?.email);
              console.log('Current URL:', window.location.href);
              // If we are on home page, send user to dashboard
              if (typeof window !== 'undefined' && window.location.pathname === '/') {
                router.push('/dashboard');
              }
            } else if (event === 'SIGNED_OUT') {
              setSession(null);
              setUser(null);
              console.log('User signed out');
              router.refresh();
              router.push('/');
            } else if (event === 'TOKEN_REFRESHED') {
              setSession(currentSession);
              setUser(currentSession?.user ?? null);
              console.log('Token refreshed for:', currentSession?.user?.email);
            } else if (event === 'INITIAL_SESSION') {
              // Handle initial session loading
              setSession(currentSession);
              setUser(currentSession?.user ?? null);
              console.log('Initial session loaded:', currentSession?.user?.email);
            }
            setIsLoading(false);
          }, debounceTime);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [router]);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Error signing in:', error);
      return { data: null, error: error as Error };
    }
  };

  const signUp = async (email: string, password: string, metadata?: any) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
        },
      });

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Error signing up:', error);
      return { data: null, error: error as Error };
    }
  };

  const signOut = async () => {
    try {
      // First attempt to sign out from Supabase
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Clear state after successful sign out
      setUser(null);
      setSession(null);
      
      // Force a router refresh to update the UI
      router.refresh();
      
      // Redirect to home page
      window.location.href = '/';
    } catch (error) {
      console.error('Error signing out:', error);
      throw error; // Re-throw the error so it can be handled by the component
    }
  };

  const signInWithGoogle = async () => {
    try {
      console.log('Initiating Google sign-in...');
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        console.error('Google sign-in error:', error);
        throw error;
      }
      
      console.log('Google sign-in initiated successfully');
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  };

  const value = {
    user,
    session,
    isLoading,
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext; 