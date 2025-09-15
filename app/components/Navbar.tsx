'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiMenu, FiX } from 'react-icons/fi';
import AccessibilityPanel from './AccessibilityPanel';
import { supabase } from '../utils/supabase';

// Navigation links that appear in both desktop and mobile menus
const STATIC_LINKS = [
  { href: '/about', label: 'אודות' },
  { href: '/features', label: 'תכונות' },
  { href: '/faq', label: 'שאלות נפוצות' },
  { href: '/articles', label: 'מאמרים' },
  { href: '/pricing', label: 'תמחור' },
  { href: '/contact', label: 'צור קשר' }
];

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [dynamicPages, setDynamicPages] = useState<{href:string,label:string}[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0); // Force re-render trigger
  const latestReqIdRef = React.useRef(0);
  const [mounted, setMounted] = React.useState(false);

  // Safeguard function to track state changes
  const safeSetDynamicPages = (newPages: {href:string,label:string}[] | ((prev: {href:string,label:string}[]) => {href:string,label:string}[])) => {
    console.log('🔧 safeSetDynamicPages called with:', newPages);
    console.log('🔧 Current dynamicPages before update:', dynamicPages);
    
    if (typeof newPages === 'function') {
      // Handle updater function
      setDynamicPages(prev => {
        const result = newPages(prev);
        console.log('🔧 Updater function result:', result);
        return result;
      });
    } else {
      // Handle direct array
      console.log('🔧 Setting direct array:', newPages);
      setDynamicPages(newPages);
    }
    
    console.log('🔧 safeSetDynamicPages completed');
  };

  // Function to fetch published pages
  const fetchPublishedPages = useCallback(async (forceRefresh = false, reqId = 0, retryCount = 0) => {
    // Only increment ref on client side to prevent hydration mismatch
    if (typeof window === 'undefined') return;
    
    const currentReqId = ++latestReqIdRef.current;
    console.log('🔄 fetchPublishedPages called:', { forceRefresh, reqId, currentReqId, retryCount });
    
    try {
      // Add aggressive cache busting to prevent Next.js caching
      const timestamp = Date.now();
      const randomParam = Math.random().toString(36).substring(7);
      const cacheBuster = forceRefresh ? `?cb=${timestamp}&r=${randomParam}` : `?t=${timestamp}`;
      
      console.log('🔄 Fetching from API with cache buster:', cacheBuster);
      
      const response = await fetch(`/api/pages${cacheBuster}`, {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
        cache: 'no-store'
      });
      if (response.ok) {
        const { pages } = await response.json();
        console.log('🔄 API response received:', { pagesCount: pages?.length || 0, pages });
        
        if (Array.isArray(pages)) {
          const normalizeBool = (val: any) => val === true || val === 'true' || val === 1 || val === '1';

          // Ensure we only take pages that are truly published, even if the API accidentally leaks others
          const publishedPages = pages.filter((p: any) => normalizeBool(p.is_published));
          console.log('🔄 Published pages after filtering:', { publishedCount: publishedPages.length, publishedPages });

          // Dedupe by slug locally as a safeguard
          const seenSlugs = new Set<string>();
          const deduped = publishedPages.filter((p: any) => {
            const slug = p?.slug;
            if (!slug || seenSlugs.has(slug)) return false;
            seenSlugs.add(slug);
            return true;
          });
          console.log('🔄 Deduped pages:', { dedupedCount: deduped.length, deduped });

          const newDynamicPages = deduped.map((p: any) => ({ href: `/${p.slug}`, label: p.title }));
          console.log('🔄 New dynamic pages to set:', newDynamicPages);

          // Update state only if this is the most recent request
          if (reqId === latestReqIdRef.current) {
            console.log('🔄 This is the most recent request, updating state');
            
            // Only clear the state if we're sure there are no pages AND this is a fresh fetch
            if (newDynamicPages.length === 0 && !forceRefresh) {
              console.log('🔄 No pages found, clearing state');
              safeSetDynamicPages([]);
            } else if (newDynamicPages.length > 0) {
              console.log('🔄 Pages found, updating state');
              safeSetDynamicPages(newDynamicPages);
            } else {
              console.log('🔄 Keeping existing state during force refresh');
              // Keep existing state during force refresh to prevent flickering
            }
            
            // If this was a force refresh and we got no pages, retry once after a delay
            if (forceRefresh && retryCount === 0 && (!newDynamicPages || newDynamicPages.length === 0)) {
              console.log('🔄 Force refresh with no pages, scheduling retry');
              setTimeout(() => {
                fetchPublishedPages(true, currentReqId, 1);
              }, 2000);
            }
          } else {
            console.log('🔄 This is a stale request, checking if we should update empty state');
            // Even if this is stale, if we have pages and current state is empty, update it
            if (newDynamicPages.length > 0 && dynamicPages.length === 0) {
              console.log('🔄 Updating empty state with stale data');
              safeSetDynamicPages(newDynamicPages);
            }
          }
        } else {
          console.log('❌ Pages is not an array:', typeof pages, pages);
          // Don't clear dynamicPages if we get invalid data, keep existing state
        }
      } else {
        console.error('❌ API response not ok:', response.status, response.statusText);
        // Don't clear dynamicPages on API errors, keep existing state
      }
    } catch (err) {
      console.error('❌ Failed to load published pages', err);
    } finally {
      setIsRefreshing(false);
      console.log('🔄 fetchPublishedPages completed');
    }
  }, []);

  // Fetch published pages once on mount
  useEffect(() => {
    // Only fetch on client side to prevent hydration mismatch
    if (typeof window !== 'undefined') {
      fetchPublishedPages();
    }
  }, [fetchPublishedPages]);

  // Trigger fetch when refresh is requested
  useEffect(() => {
    // Only run on client side to prevent hydration mismatch
    if (typeof window !== 'undefined' && refreshTrigger > 0) {
      fetchPublishedPages();
    }
  }, [refreshTrigger, fetchPublishedPages]);

  // Listen for Supabase realtime changes on pages table
  useEffect(() => {
    // Ensure we only subscribe in the browser
    if (typeof window === 'undefined') return;

    const channel = supabase
      .channel('realtime:pages')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'pages' },
        payload => {
          // Temporarily disabled to test if this causes auto-republishing
          // fetchPublishedPages(true); // Force refresh with cache busting
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchPublishedPages]);

  // Listen for page updates by polling every 30 seconds
  useEffect(() => {
    // Only run on client side to prevent hydration mismatch
    if (typeof window === 'undefined') return;
    
    // Enable polling to ensure navigation stays in sync
    const interval = setInterval(() => {
      // Only poll if we're not already refreshing
      if (!isRefreshing) {
        fetchPublishedPages();
      }
    }, 30000); // Poll every 30 seconds
    
    return () => clearInterval(interval);
  }, [fetchPublishedPages, isRefreshing]);

  // Expose refresh function globally for admin panel to use
  useEffect(() => {
    // Only run on client side to prevent hydration mismatch
    if (typeof window === 'undefined') return;
    
    // Listen for storage events coming from other tabs (admin dashboard)
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'navigation_refresh') {
        console.log('🔄 Storage event received, refreshing navigation...');
        fetchPublishedPages(true); // Force refresh with cache busting
      }
    };

    // Also listen for custom events (for same-tab communication)
    const handleCustomEvent = (e: Event) => {
      if (e.type === 'navigation_refresh') {
        console.log('🔄 Custom event received, refreshing navigation...');
        fetchPublishedPages(true);
      }
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener('navigation_refresh', handleCustomEvent);

    // Enhanced refresh function with better error handling
    (window as any).refreshNavigation = async () => {
      console.log('🔄 refreshNavigation called');
      
      try {
        // Force immediate refresh
        console.log('🔄 Setting refresh trigger');
        setRefreshTrigger(prev => prev + 1);
        
        console.log('🔄 Calling fetchPublishedPages with force refresh');
        await fetchPublishedPages(true); // Force refresh with cache busting
        
        // Also dispatch custom event for same-tab communication
        console.log('🔄 Dispatching custom event');
        window.dispatchEvent(new CustomEvent('navigation_refresh'));
        
        console.log('✅ Navigation refresh completed');
      } catch (error) {
        console.error('❌ Navigation refresh failed:', error);
        // Fallback: try again after a short delay
        setTimeout(async () => {
          try {
            console.log('🔄 Retrying navigation refresh after delay');
            await fetchPublishedPages(true);
          } catch (retryError) {
            console.error('❌ Navigation refresh retry failed:', retryError);
          }
        }, 1000);
      }
    };
    
    // Function to add a specific page to navigation
    (window as any).addNavPage = (slug: string, title: string) => {
      console.log('➕ addNavPage called with:', { slug, title });
      console.log('➕ Current dynamicPages before addition:', dynamicPages);
      
      safeSetDynamicPages(prev => {
        const newPage = { href: `/${slug}`, label: title };
        // Check if page already exists
        if (prev.some(p => p.href === newPage.href)) {
          console.log('➕ Page already exists, not adding duplicate');
          return prev;
        }
        const updated = [...prev, newPage];
        console.log('➕ Updated dynamicPages after addition:', updated);
        return updated;
      });
      
      console.log('➕ addNavPage completed');
    };
    
    // Function to remove a specific page from navigation
    (window as any).removeNavPageBySlug = (slug: string) => {
      console.log('🗑️ removeNavPageBySlug called with slug:', slug);
      console.log('🗑️ Current dynamicPages before removal:', dynamicPages);
      
      safeSetDynamicPages(prev => {
        const filtered = prev.filter(p => p.href !== `/${slug}`);
        console.log('🗑️ Filtered pages after removal:', filtered);
        return filtered;
      });
      
      console.log('🗑️ removeNavPageBySlug completed');
    };
    
    // Function to clear all dynamic pages
    (window as any).clearDynamicPages = () => {
      safeSetDynamicPages([]);
    };
    
    // Function to force navigation update
    (window as any).forceNavigationUpdate = () => {
      
      // Force a re-render
      setRefreshTrigger(prev => prev + 1);
      
      // Also force a fresh fetch
      fetchPublishedPages(true);
      
    };
    
    // Also expose a test function for debugging
    (window as any).testNavigationRefresh = () => {
      setRefreshTrigger(prev => prev + 1);
      fetchPublishedPages(true);
    };
    
    // Test function to call the API directly
    (window as any).testPagesAPI = async () => {
      try {
        const response = await fetch('/api/pages?t=' + Date.now());
        const data = await response.json();
        return data;
      } catch (error) {
        console.error('❌ Direct API test failed:', error);
        return null;
      }
    };
    
    // Function to manually set dynamic pages for testing
    (window as any).checkNavigationState = () => {
      return {
        dynamicPages: dynamicPages,
        isRefreshing: isRefreshing,
        refreshTrigger: refreshTrigger,
        timestamp: new Date().toISOString()
      };
    };
    
    // Cleanup function
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('navigation_refresh', handleCustomEvent);
      
      // Clean up global functions
      delete (window as any).refreshNavigation;
      delete (window as any).addNavPage;
      delete (window as any).removeNavPageBySlug;
      delete (window as any).clearDynamicPages;
      delete (window as any).forceNavigationUpdate;
      delete (window as any).testNavigationRefresh;
      delete (window as any).testPagesAPI;
      delete (window as any).checkNavigationState;
    };
  }, [fetchPublishedPages, dynamicPages, isRefreshing, refreshTrigger]);

  // Track viewport width so we can render only the needed header
  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const mq = window.matchMedia('(min-width: 768px)');
    const update = () => {
      const newIsDesktop = mq.matches;
      setIsDesktop(newIsDesktop);
    };
    
    // Set initial value
    update();
    
    // Listen for changes
    mq.addEventListener('change', update);
    
    return () => mq.removeEventListener('change', update);
  }, []);

  // Use a consistent initial state to prevent hydration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Only render desktop/mobile specific content after mounting to prevent hydration mismatch
  const shouldRenderDesktop = mounted && isDesktop;
  const shouldRenderMobile = mounted && !isDesktop;

  return (
    <nav className="bg-white bg-opacity-95 backdrop-blur-sm shadow-sm py-4 px-4 sticky top-0 relative" style={{ zIndex: 99999 }}>
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          {/* Logo - Always visible */}
          <Link href="/" className="no-underline">
            <Image
              src="/images/logo01.png"
              alt="SmartRisk Logo"
              width={mounted && isDesktop ? 160 : 120}
              height={mounted && isDesktop ? 40 : 30}
              priority
              className="h-auto"
            />
          </Link>

          {/* Loading state to prevent hydration mismatch */}
          {!mounted && (
            <div className="flex items-center gap-4">
              <div className="w-32 h-8 bg-gray-200 animate-pulse rounded"></div>
            </div>
          )}

          {/* Desktop Layout (rendered only if isDesktop) */}
          {shouldRenderDesktop && (
            <>
              
              {/* Desktop navigation links */}
              <div className="flex items-center gap-4">
                {/* First 5 static links */}
                {STATIC_LINKS.slice(0,5).map(({ href, label }) => (
                  <Link
                    key={`desk-${href}`}
                    href={href}
                    className="text-gray-600 hover:text-primary transition duration-300 px-2 py-1 text-rtl no-underline"
                  >
                    {label}
                  </Link>
                ))}

                {/* Dynamic pages inline */}
                {mounted && dynamicPages.map(({ href, label }) => (
                  <Link
                    key={`desk-dyn-${href}`}
                    href={href}
                    className="text-gray-600 hover:text-primary transition duration-300 px-2 py-1 text-rtl no-underline"
                  >
                    {label}
                  </Link>
                ))}
                
                {/* Last static link: contact */}
                <Link
                  key={`desk-${STATIC_LINKS[5].href}`}
                  href={STATIC_LINKS[5].href}
                  className="text-gray-600 hover:text-primary transition duration-300 px-2 py-1 text-rtl no-underline"
                >
                  {STATIC_LINKS[5].label}
                </Link>



                {isRefreshing && mounted && (
                  <div className="flex items-center text-blue-500 text-sm">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                    <span className="mr-2"></span>
                    מעדכן...
                  </div>
                )}
              </div>

              {/* Desktop actions (login / signup + accessibility) */}
              <div className="flex items-center gap-4">
                <Link
                  href="/auth/login"
                  className="text-gray-600 hover:text-primary transition duration-300 px-3 py-2 text-rtl no-underline"
                >
                  התחברות
                </Link>
                <Link
                  href="/auth/signup"
                  className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition duration-300 text-rtl no-underline"
                >
                  הרשמה חינם
                </Link>
                <AccessibilityPanel />
              </div>
            </>
          )}
          
          {/* Mobile Layout (rendered only if !isDesktop) */}
          {shouldRenderMobile && (
            <div className="flex items-center gap-2">
              <AccessibilityPanel />
              <button
                aria-label="תפריט"
                onClick={() => setIsMenuOpen((prev) => !prev)}
                className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white focus:outline-none hover:bg-primary-dark transition-colors duration-200"
              >
                {isMenuOpen ? <FiX size={23} /> : <FiMenu size={23} />}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile slide-in menu */}
      {/* Overlay */}
      {isMenuOpen && shouldRenderMobile && (
        <div
          className="fixed top-16 left-0 right-0 bottom-0 bg-black/40 z-10 md:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
      
      {/* Mobile menu with solid white background - always rendered for animation */}
      {shouldRenderMobile && (
        <div
          className={`fixed top-0 right-0 h-auto max-h-[80vh] w-full bg-white z-10 flex flex-col text-rtl px-4 py-6 gap-4 md:hidden text-center transition-transform duration-300 ease-in-out ${
            isMenuOpen ? 'translate-y-16' : '-translate-y-full'
          }`}
          style={{ 
            backgroundColor: 'white', 
            opacity: 1,
            pointerEvents: isMenuOpen ? 'auto' : 'none',
            transform: isMenuOpen ? 'translateY(64px)' : 'translateY(-100%)'
          }}
        >
          {(() => {
            const allLinks = [...STATIC_LINKS.slice(0,5), ...(mounted ? dynamicPages : []), STATIC_LINKS[5]];
            return allLinks.map(({ href, label }) => (
              <Link
                key={`mob-${href}`}
                href={href}
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-700 hover:text-primary transition duration-300 no-underline py-2 border-b border-gray-100"
              >
                {label}
              </Link>
            ));
          })()}
          
          {isRefreshing && mounted && (
            <div className="flex items-center text-blue-500 text-sm py-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
              <span className="mr-2"></span>
              מעדכן תפריט...
            </div>
          )}

          <hr className="my-4" />



          <Link
            href="/auth/login"
            onClick={() => setIsMenuOpen(false)}
            className="text-gray-700 hover:text-primary transition duration-300 no-underline py-2"
          >
            התחברות
          </Link>
          <Link
            href="/auth/signup"
            onClick={() => setIsMenuOpen(false)}
            className="bg-primary text-white text-center py-3 rounded-lg hover:bg-primary-dark transition duration-300 no-underline"
          >
            הרשמה חינם
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;