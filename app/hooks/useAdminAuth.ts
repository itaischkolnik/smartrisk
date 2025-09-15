'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../utils/supabase';

export const useAdminAuth = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const lastSessionId = useRef<string | null>(null);
  const isChecking = useRef(false);

  const checkAdminStatus = useCallback(async (force = false) => {
    // Prevent multiple simultaneous checks
    if (isChecking.current && !force) {
      return;
    }

    try {
      isChecking.current = true;
      console.log('useAdminAuth: Checking admin status...');
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        console.log('useAdminAuth: No session found, user not authenticated');
        setIsAdmin(false);
        setLoading(false);
        lastSessionId.current = null;
        return;
      }

      // Check if session has actually changed
      if (!force && lastSessionId.current === session.access_token) {
        console.log('useAdminAuth: Session unchanged, skipping re-check');
        return;
      }

      console.log('useAdminAuth: Session found for:', session.user.email);

      // Check if user has admin role
      const { data: adminData, error: adminError } = await supabase
        .from('admin_roles')
        .select('is_admin')
        .eq('email', session.user.email)
        .single();

      if (adminError) {
        console.error('useAdminAuth: Admin role check error:', adminError);
        setIsAdmin(false);
      } else if (!adminData || !adminData.is_admin) {
        console.log('useAdminAuth: User is not admin:', adminData);
        setIsAdmin(false);
      } else {
        console.log('useAdminAuth: User is confirmed admin:', adminData);
        setIsAdmin(true);
      }

      // Cache the session ID
      lastSessionId.current = session.access_token;
    } catch (error) {
      console.error('useAdminAuth: Unexpected error:', error);
      setIsAdmin(false);
    } finally {
      setLoading(false);
      isChecking.current = false;
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    const initCheck = async () => {
      if (mounted) {
        await checkAdminStatus();
      }
    };

    initCheck();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('useAdminAuth: Auth state change:', event, session?.user?.email);
      
      if (!mounted) return;
      
      if (event === 'SIGNED_IN' && session) {
        // Only re-check if we don't have a valid session cached
        if (lastSessionId.current !== session.access_token) {
          setLoading(true);
          await checkAdminStatus(true);
        }
      } else if (event === 'SIGNED_OUT') {
        // Reset state when user signs out
        setIsAdmin(false);
        setLoading(false);
        lastSessionId.current = null;
      } else if (event === 'TOKEN_REFRESHED' && session) {
        // Handle token refresh more gracefully
        if (lastSessionId.current !== session.access_token) {
          lastSessionId.current = session.access_token;
          // Don't re-check admin status for token refresh
        }
      }
    });

    // Handle window focus events more gracefully
    const handleFocus = () => {
      // Only re-check if we haven't checked recently or if there's no valid session
      if (mounted && (!lastSessionId.current || !isAdmin)) {
        console.log('useAdminAuth: Window focused, checking session validity');
        checkAdminStatus(true);
      }
    };

    // Handle visibility change (tab switching)
    const handleVisibilityChange = () => {
      if (mounted && document.visibilityState === 'visible' && (!lastSessionId.current || !isAdmin)) {
        console.log('useAdminAuth: Tab became visible, checking session validity');
        checkAdminStatus(true);
      }
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      mounted = false;
      subscription.unsubscribe();
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [checkAdminStatus]);

  // Log state changes for debugging
  useEffect(() => {
    console.log('useAdminAuth: State updated - isAdmin:', isAdmin, 'loading:', loading);
  }, [isAdmin, loading]);

  return { isAdmin, loading };
}; 