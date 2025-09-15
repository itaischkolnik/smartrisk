'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiMail, FiLock, FiAlertCircle, FiShield } from 'react-icons/fi';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { supabase } from '../utils/supabase';

const AdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabaseClient = supabase;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!email || !password) {
      setError('כל השדות הם חובה');
      setLoading(false);
      return;
    }

    try {
      // Sign in with Supabase using the provided credentials
      console.log('Attempting login with:', email);
      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email: email,
        password: password
      });

      console.log('Supabase auth response:', { data, error });

      if (error) {
        console.error('Supabase auth error:', error);
        setError('פרטי ההתחברות שגויים');
      } else {
        console.log('User authenticated, checking admin role for:', data.user?.email);
        // Check if user has admin role by querying the admin_roles table
        try {
          const { data: adminData, error: adminError } = await supabaseClient
            .from('admin_roles')
            .select('is_admin')
            .eq('email', data.user.email)
            .single();

          console.log('Admin role check result:', { adminData, adminError });

          if (adminError) {
            console.error('Admin role check error:', adminError);
            setError('שגיאה בבדיקת הרשאות מנהל');
            await supabaseClient.auth.signOut();
            return;
          }

          if (adminData && adminData.is_admin) {
            console.log('User is admin, redirecting to dashboard');
            // User is confirmed admin, redirect to dashboard
            router.push('/admin/dashboard');
          } else {
            console.log('User is not admin');
            // User is authenticated but not an admin
            setError('אין לך הרשאות מנהל');
            await supabaseClient.auth.signOut();
          }
        } catch (roleCheckError) {
          console.error('Role check error:', roleCheckError);
          setError('שגיאה בבדיקת הרשאות מנהל');
          await supabaseClient.auth.signOut();
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('שגיאה בהתחברות למערכת');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col font-heebo admin-page bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Heebo:wght@100;200;300;400;500;600;700;800;900&display=swap');
        
        * {
          font-family: 'Heebo', sans-serif;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes glowPulse {
          0% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.3); }
          50% { box-shadow: 0 0 30px rgba(59, 130, 246, 0.5); }
          100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.3); }
        }
        
        .modern-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 
            0 25px 50px -12px rgba(0, 0, 0, 0.1),
            0 0 0 1px rgba(255, 255, 255, 0.05);
        }
        
        .modern-input {
          background: rgba(255, 255, 255, 0.9);
          border: 2px solid rgba(226, 232, 240, 0.8);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          color: #1e293b;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }
        
        .modern-input:focus {
          background: rgba(255, 255, 255, 1);
          border-color: #3b82f6;
          box-shadow: 
            0 0 0 3px rgba(59, 130, 246, 0.1),
            0 4px 12px rgba(59, 130, 246, 0.15);
          transform: translateY(-1px);
        }
        
        .modern-input::placeholder {
          color: #94a3b8;
        }
        
        .modern-button {
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
          border: none;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 
            0 4px 14px rgba(59, 130, 246, 0.25),
            0 0 0 1px rgba(59, 130, 246, 0.1);
        }
        
        .modern-button:hover {
          transform: translateY(-2px);
          box-shadow: 
            0 8px 25px rgba(59, 130, 246, 0.35),
            0 0 0 1px rgba(59, 130, 246, 0.2);
          background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
        }
        
        .modern-button:active {
          transform: translateY(0);
        }
        
        .floating-icon {
          animation: float 3s ease-in-out infinite;
        }
        
        .glass-effect {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
      `}</style>
      
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-16 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-indigo-600/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-400/20 to-pink-600/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-300/10 to-purple-300/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-md w-full space-y-8 relative z-10">
          <div className="text-center">
                                                   <div className="flex items-center justify-center mb-4 gap-8">
                              <div className="h-20 w-20 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-700 floating-icon shadow-2xl">
                  <FiShield className="h-10 w-10 text-white" />
                </div>
                               <div className="flex flex-col items-end text-right" dir="ltr">
                 <h2 className="text-4xl font-bold bg-gradient-to-r from-slate-800 via-blue-800 to-indigo-800 bg-clip-text text-transparent">
                   התחברות למנהל
                 </h2>
                 <p className="text-slate-600 text-lg">
                   הכנס את פרטי ההתחברות שלך
                 </p>
               </div>
            </div>
          </div>
          
          <div className="modern-card rounded-2xl p-8 shadow-2xl">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 text-red-700 px-4 py-4 rounded-xl flex items-center shadow-sm">
                  <FiAlertCircle className="h-5 w-5 mr-3 text-red-500" />
                  <span className="font-medium">{error}</span>
                </div>
              )}
              
              <div className="space-y-5">
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-3 text-right">
                    כתובת אימייל
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-8 flex items-center justify-center pointer-events-none z-10">
                      <FiMail className="h-5 w-5 text-slate-600 group-focus-within:text-blue-500 transition-colors" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="modern-input appearance-none rounded-xl relative block w-full px-4 py-4 pl-20 text-right placeholder-slate-500 focus:outline-none text-base"
                      placeholder="הכנס את כתובת האימייל שלך"
                      dir="rtl"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-3 text-right">
                    סיסמה
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-8 flex items-center justify-center pointer-events-none z-10">
                      <FiLock className="h-5 w-5 text-slate-600 group-focus-within:text-blue-500 transition-colors" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="modern-input appearance-none rounded-xl relative block w-full px-4 py-4 pl-20 text-right placeholder-slate-500 focus:outline-none text-base"
                      placeholder="הכנס את הסיסמה שלך"
                      dir="rtl"
                    />
                  </div>
                </div>
              </div>
              
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                    cursor: 'pointer',
                    textAlign: 'center',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                  className="modern-button w-full py-4 px-6 text-white font-semibold rounded-xl text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed text-center"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      <span>מתחבר...</span>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <span>התחברות למנהל</span>
                      <div className="ml-2 w-5 h-5 bg-white/20 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    </div>
                  )}
                </button>
              </div>
            </form>
          </div>
          
          {/* Additional info card */}
          <div className="glass-effect rounded-xl p-4 text-center">
            <p className="text-slate-600 text-sm">
              🔐 גישה מוגבלת למנהלי המערכת בלבד
            </p>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default AdminLoginPage;
