'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { FiMail, FiLock, FiAlertCircle } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/dashboard';
  const { signIn, signInWithGoogle } = useAuth();

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
      const { data, error } = await signIn(email, password);

      if (error) {
        throw error;
      }

      if (data?.user) {
        // Login successful - write secure cookies on the server so middleware can read them
        if (data.session) {
          try {
            await fetch('/api/auth/set-session', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include',
              body: JSON.stringify({
                access_token: data.session.access_token,
                refresh_token: data.session.refresh_token,
              }),
            });
          } catch (err) {
            console.error('Failed to persist session cookies:', err);
          }
        }
        window.location.href = redirect;
      } else {
        setError('פרטי ההתחברות שגויים');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(
        error instanceof Error ? error.message : 'אירעה שגיאה בהתחברות. אנא נסה שנית.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-heebo">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Heebo:wght@100;200;300;400;500;600;700;800;900&display=swap');
        
        * {
          font-family: 'Heebo', sans-serif;
        }
        
        @keyframes glowPulse {
          0% { box-shadow: 0 0 5px rgba(59, 130, 246, 0.3); }
          50% { box-shadow: 0 0 15px rgba(59, 130, 246, 0.5); }
          100% { box-shadow: 0 0 5px rgba(59, 130, 246, 0.3); }
        }
        
        .futuristic-input {
          background: rgba(255, 255, 255, 0.9);
          border: 1px solid rgba(59, 130, 246, 0.3);
          transition: all 0.3s ease;
        }
        
        .futuristic-input:focus {
          background: rgba(255, 255, 255, 1);
          border-color: rgba(59, 130, 246, 0.8);
          animation: glowPulse 2s infinite;
        }
        
        .glow-button {
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
          cursor: pointer;
        }
        
        .glow-button:before {
          content: '';
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          z-index: -1;
          background: linear-gradient(90deg, #3b82f6, #60a5fa, #93c5fd, #60a5fa, #3b82f6);
          background-size: 400%;
          opacity: 0;
          transition: opacity 0.3s ease;
          border-radius: 14px;
        }
        
        .glow-button:hover:before {
          opacity: 1;
          animation: glowAnimation 3s infinite;
        }
        
        @keyframes glowAnimation {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        button {
          cursor: pointer !important;
        }
      `}</style>
      
      {/* Navbar */}
      <Navbar />
      
      {/* Main Content */}
      <section className="bg-gradient-to-br from-primary to-primary-dark text-white py-10 flex-grow relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary-dark opacity-90"></div>
          {/* Dynamic Abstract shapes */}
          <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-primary-light opacity-10 animate-pulse"></div>
          <div className="absolute bottom-10 right-20 w-96 h-96 rounded-full bg-secondary opacity-10 animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 w-80 h-80 rounded-full bg-white opacity-5 animate-pulse" style={{ animationDelay: '2s' }}></div>
          
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-5" 
              style={{ 
                backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(255, 255, 255, .05) 25%, rgba(255, 255, 255, .05) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, .05) 75%, rgba(255, 255, 255, .05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(255, 255, 255, .05) 25%, rgba(255, 255, 255, .05) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, .05) 75%, rgba(255, 255, 255, .05) 76%, transparent 77%, transparent)',
                backgroundSize: '50px 50px' 
              }}>
          </div>
        </div>
        
        <div className="container mx-auto py-8 px-4 relative z-10">
          <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8 relative">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-gray-800">
                התחברות לחשבונך
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                או{' '}
                <Link
                  href="/auth/signup"
                  className="font-medium text-primary hover:text-primary-dark"
                >
                  הרשמה לחשבון חדש
                </Link>
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border-r-4 border-red-400 p-4 mb-6 rounded-lg">
                <div className="flex">
                  <div className="mr-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                  <div className="flex-shrink-0">
                    <FiAlertCircle className="h-5 w-5 text-red-400" />
                  </div>
                </div>
              </div>
            )}

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email-address" className="block text-sm font-medium text-gray-700 mb-1 text-right">
                  כתובת אימייל
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <FiMail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="futuristic-input w-full px-4 pr-10 py-3 rounded-xl border border-gray-200 text-gray-800 focus:outline-none focus:ring-1 focus:ring-primary text-right"
                    placeholder="הכנס את כתובת האימייל שלך"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1 text-right">
                  סיסמה
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <FiLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="futuristic-input w-full px-4 pr-10 py-3 rounded-xl border border-gray-200 text-gray-800 focus:outline-none focus:ring-1 focus:ring-primary text-right"
                    placeholder="הכנס את הסיסמה שלך"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center justify-end">
                <div className="text-sm">
                  <Link
                    href="/auth/forgot-password"
                    className="font-medium text-primary hover:text-primary-dark"
                  >
                    שכחת סיסמה?
                  </Link>
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="glow-button w-full flex justify-center py-3 px-4 border border-transparent text-white font-medium rounded-xl bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:bg-blue-300 disabled:cursor-not-allowed transition-all duration-300 cursor-pointer"
                >
                  {loading ? 'מתחבר...' : 'התחברות'}
                </button>
              </div>
            </form>

            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">או התחבר באמצעות</span>
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="button"
                  className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-300 cursor-pointer"
                  onClick={async () => {
                    try {
                      setLoading(true);
                      await signInWithGoogle();
                      // The page will be redirected by Supabase
                    } catch (error) {
                      console.error('Google login error:', error);
                      setError(error instanceof Error ? error.message : 'אירעה שגיאה בהתחברות עם גוגל');
                      setLoading(false);
                    }
                  }}
                  disabled={loading}
                >
                  <div className="flex items-center justify-center w-6 h-6 ml-2">
                    <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18">
                      <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
                      <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.909-2.259c-.806.54-1.837.86-3.047.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
                      <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/>
                      <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
                    </svg>
                  </div>
                  המשך עם גוגל
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LoginPage; 