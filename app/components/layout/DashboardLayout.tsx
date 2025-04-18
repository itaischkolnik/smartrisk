import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { FiMenu, FiX, FiHome, FiFileText, FiSettings, FiHelpCircle, FiLogOut } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import { RiListSettingsLine } from "react-icons/ri";

// Navigation items for the sidebar
const navItems = [
  { name: 'לוח בקרה', href: '/dashboard', icon: FiHome },
  { name: 'הערכות', href: '/assessments', icon: FiFileText },
  { name: 'הגדרות', href: '/settings', icon: FiSettings },
  { name: 'עזרה', href: '/help', icon: FiHelpCircle },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, signOut } = useAuth();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSignOut = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent any default navigation
    try {
      await signOut();
      // The redirect will be handled by the AuthContext's onAuthStateChange
    } catch (error) {
      console.error('Error signing out:', error);
      // You could add a toast notification here to show the error to the user
    }
  };

  return (
    <div className="h-screen flex">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-gray-900 bg-opacity-50 transition-opacity md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Desktop sidebar - Fixed, no scroll */}
      <aside className="hidden md:flex w-64 flex-col fixed inset-y-0 right-0 border-l" 
        style={{ backgroundColor: '#3b82f6' }}>
        <div className="flex flex-col" style={{ height: '100%' }}>
          {/* Logo section */}
          <div className="flex-shrink-0 flex items-center justify-center h-16 px-4 py-6">
            <Image 
              src="/images/logo02.png" 
              alt="SmartRisk Logo" 
              width={171} 
              height={48} 
              className="object-contain mr-2" 
              priority
            />
          </div>

          {/* Navigation section */}
          <nav className="flex-shrink-0 px-3 py-4">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center rounded-lg px-4 py-3 text-base font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-800 text-white'
                      : 'text-white hover:bg-blue-800/70'
                  }`}
                >
                  <item.icon className="ml-2 h-5 w-5" aria-hidden="true" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Spacer to push user section to bottom */}
          <div className="flex-1 min-h-0"></div>

          {/* User section - Fixed at bottom */}
          {user && (
            <div className="flex-shrink-0 border-t border-blue-700 mt-auto">
              <div className="flex flex-col items-center justify-center p-4">
                <div className="relative h-16 w-16 overflow-hidden rounded-full bg-blue-700 mb-3" style={{ borderWidth: '2px', borderStyle: 'solid', borderColor: 'white', boxShadow: '0 0 8px rgba(255,255,255,0.5)' }}>
                  {user.user_metadata?.avatar_url ? (
                    <Image
                      src={user.user_metadata.avatar_url}
                      alt={`${user.user_metadata?.full_name || 'User'}'s profile`}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xl font-semibold uppercase text-white">
                      {(user.user_metadata?.full_name || user.email || 'U').charAt(0)}
                    </div>
                  )}
                </div>
                <div className="text-center">
                  <div className="text-sm font-medium text-white">
                    {user.user_metadata?.full_name || 'משתמש'}
                  </div>
                  <div className="text-xs text-white">{user.email}</div>
                </div>
              </div>
              <div className="p-4 pt-0 flex justify-center">
                <button
                  type="button"
                  onClick={handleSignOut}
                  style={{ backgroundColor: 'transparent', borderColor: '#ffffff', borderWidth: '2px', color: 'white', borderStyle: 'solid', cursor: 'pointer' }}
                  className="w-3/4 flex flex-row-reverse items-center justify-center py-2 px-4 rounded-lg hover:bg-white/10 transition-all mb-2"
                  title="התנתק"
                  dir="rtl"
                >
                  <span className="ml-2">התנתק</span>
                  <FiLogOut className="h-5 w-5" style={{ transform: 'rotate(180deg)' }} />
                </button>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Main content - Scrollable */}
      <div className="flex-1 md:mr-64 min-h-screen">
        {/* Mobile header */}
        <div className="bg-white shadow-sm md:hidden">
          <div className="flex h-16 items-center justify-between px-4">
            <div className="flex items-center">
              <Image 
                src="/images/logo02.png" 
                alt="SmartRisk Logo" 
                width={114} 
                height={29} 
                className="object-contain mr-2" 
              />
            </div>
            <button
              type="button"
              className="text-gray-500 hover:text-gray-700"
              onClick={() => setSidebarOpen(true)}
            >
              <FiMenu className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Main scrollable area */}
        <main className="bg-gradient-to-br from-white to-blue-50 overflow-y-auto h-[calc(100vh-4rem)]">
          <div className="container mx-auto max-w-7xl px-4 py-8">{children}</div>
        </main>
      </div>
    </div>
  );
} 