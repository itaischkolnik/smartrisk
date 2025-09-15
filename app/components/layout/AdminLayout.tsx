'use client';

import React, { useEffect, useState } from 'react';
import { useAdminAuth } from '../../hooks/useAdminAuth';
import Navbar from '../Navbar';
import Footer from '../Footer';
import { useRouter } from 'next/navigation';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { isAdmin, loading } = useAdminAuth();
  const router = useRouter();
  const [hasInitialized, setHasInitialized] = useState(false);

  // Track if we've completed the initial auth check
  useEffect(() => {
    if (!loading && !hasInitialized) {
      setHasInitialized(true);
    }
  }, [loading, hasInitialized]);

  // Show loading only on initial load, not on subsequent checks
  if (loading && !hasInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">טוען...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not admin (only after initial check)
  if (hasInitialized && !isAdmin) {
    console.log('AdminLayout: User is not admin, redirecting to login');
    router.push('/admin');
    return null;
  }

  // Show loading if we're still checking after initialization
  if (loading && hasInitialized) {
    // Return the layout but with a subtle loading indicator
    return (
      <div className="min-h-screen flex flex-col font-heebo bg-gray-50">
        <style jsx global>{`
          @import url('https://fonts.googleapis.com/css2?family=Heebo:wght@100;200;300;400;500;600;700;800;900&display=swap');
          
          * {
            font-family: 'Heebo', sans-serif;
          }
        `}</style>
        
        {/* Navbar */}
        <Navbar />
        
        {/* Main Content */}
        <div className="flex-grow relative">
          {/* Subtle loading indicator */}
          <div className="absolute top-4 right-4 z-10">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          </div>
          {children}
        </div>
        
        {/* Footer */}
        <Footer />
      </div>
    );
  }

  // User is confirmed admin, render the layout
  return (
    <div className="min-h-screen flex flex-col font-heebo bg-gray-50">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Heebo:wght@100;200;300;400;500;600;700;800;900&display=swap');
        
        * {
          font-family: 'Heebo', sans-serif;
        }
      `}</style>
      
      {/* Navbar */}
      <Navbar />
      
      {/* Main Content */}
      <div className="flex-grow">
        {children}
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default AdminLayout; 