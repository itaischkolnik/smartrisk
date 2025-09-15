'use client';
import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    mobile: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitMessage({ type: 'success', text: data.message });
        setFormData({ fullName: '', mobile: '', email: '', message: '' });
      } else {
        setSubmitMessage({ type: 'error', text: data.error });
      }
    } catch (error) {
      setSubmitMessage({ type: 'error', text: 'שגיאה בשליחת הטופס. אנא נסה שוב.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-heebo">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Heebo:wght@100;200;300;400;500;600;700;800;900&display=swap');
        * { font-family: 'Heebo', sans-serif; }
      `}</style>
      
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-primary-dark text-white py-16 relative overflow-hidden">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            צור קשר
          </h1>
          <p className="text-xl text-white opacity-90 max-w-2xl mx-auto">
            יש לך שאלה או רוצה לקבל ייעוץ מקצועי? אנחנו כאן לעזור לך לקבל החלטות עסקיות נכונות ובטוחות.
          </p>
        </div>
      </section>

      {/* Contact Form Section */}
      <section style={{
        padding: '4rem 0',
        background: 'white'
      }}>
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div style={{
              background: 'white',
              borderRadius: '1rem',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
              padding: '2rem',
              border: '1px solid #f3f4f6'
            }}>
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                שלח לנו הודעה
              </h2>

              {submitMessage && (
                <div className={`mb-6 p-4 rounded-lg ${
                  submitMessage.type === 'success' 
                    ? 'bg-green-50 text-green-800 border border-green-200' 
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}>
                  {submitMessage.text}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2 text-right">
                    שם מלא *
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      textAlign: 'right',
                      outline: 'none'
                    }}
                    placeholder="הכנס את שמך המלא"
                  />
                </div>

                <div>
                  <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-2 text-right">
                    טלפון נייד *
                  </label>
                  <input
                    type="tel"
                    id="mobile"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      textAlign: 'right',
                      outline: 'none'
                    }}
                    placeholder="הכנס את מספר הטלפון שלך"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2 text-right">
                    אימייל *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      textAlign: 'right',
                      outline: 'none'
                    }}
                    placeholder="הכנס את כתובת האימייל שלך"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2 text-right">
                    הודעה (אופציונלי)
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={4}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      textAlign: 'right',
                      outline: 'none',
                      resize: 'none'
                    }}
                    placeholder="כתוב לנו הודעה נוספת..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    width: '100%',
                    background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                    color: 'white',
                    fontWeight: 'bold',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '0.5rem',
                    border: 'none',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    opacity: isSubmitting ? '0.5' : '1',
                    transition: 'all 0.2s'
                  }}
                >
                  {isSubmitting ? 'שולח...' : 'שלח'}
                </button>
              </form>

              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                  פרטי התקשרות נוספים
                </h3>
                                 <div className="text-center space-y-2 text-gray-600">
                   <p>📧 info@smartrisk.co.il</p>
                   <p>📱 03-5252134</p>
                   <p>🏢 תל אביב, ישראל</p>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
} 