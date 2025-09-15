'use client';

import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FiX, FiMail, FiPhone, FiMapPin, FiUser, FiCalendar, FiBriefcase, FiHeart, FiTarget, FiDollarSign, FiBookOpen } from 'react-icons/fi';

interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  age: number | null;
  location: string | null;
  marital_status: string | null;
  mobile_phone: string | null;
  occupation: string | null;
  self_introduction: string | null;
  life_experience: string | null;
  motivation: string | null;
  financial_capability: string | null;
  five_year_goals: string | null;
  subscription: string;
  created_at: string;
  updated_at: string;
}

interface ProfileDetailModalProps {
  profile: Profile | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProfileDetailModal: React.FC<ProfileDetailModalProps> = ({ profile, isOpen, onClose }) => {
  if (!isOpen || !profile) return null;

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      return () => document.removeEventListener('keydown', handleEsc);
    }
  }, [isOpen, onClose]);

  // Ensure no ancestor transforms/filters interfere with fixed positioning
  useEffect(() => {
    if (!isOpen) return;

    const htmlEl = document.documentElement as HTMLElement;
    const bodyEl = document.body as HTMLElement;

    const prevHtmlTransform = htmlEl.style.transform;
    const prevBodyTransform = bodyEl.style.transform;
    const prevHtmlFilter = (htmlEl.style as CSSStyleDeclaration & { filter?: string }).filter || '';
    const prevBodyFilter = (bodyEl.style as CSSStyleDeclaration & { filter?: string }).filter || '';
    const prevHtmlPerspective = (htmlEl.style as any).perspective || '';
    const prevBodyPerspective = (bodyEl.style as any).perspective || '';

    htmlEl.style.transform = 'none';
    bodyEl.style.transform = 'none';
    (htmlEl.style as any).filter = 'none';
    (bodyEl.style as any).filter = 'none';
    (htmlEl.style as any).perspective = 'none';
    (bodyEl.style as any).perspective = 'none';

    return () => {
      htmlEl.style.transform = prevHtmlTransform;
      bodyEl.style.transform = prevBodyTransform;
      (htmlEl.style as any).filter = prevHtmlFilter;
      (bodyEl.style as any).filter = prevBodyFilter;
      (htmlEl.style as any).perspective = prevHtmlPerspective;
      (bodyEl.style as any).perspective = prevBodyPerspective;
    };
  }, [isOpen]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('he-IL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

    return createPortal(
    <div 
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        zIndex: 2147483647,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        overflow: 'hidden',
        isolation: 'isolate'
      }}
      onClick={onClose}
    >
      <div 
        style={{ 
          background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
          borderRadius: '1.5rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          maxWidth: '42rem',
          width: '100%',
          maxHeight: '85vh',
          overflow: 'auto',
          border: '1px solid #e5e7eb',
          zIndex: 100000,
          // Custom scrollbar styling
          scrollbarWidth: 'thin',
          scrollbarColor: '#cbd5e1 #f1f5f9'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <style jsx>{`
          div::-webkit-scrollbar {
            width: 8px;
          }
          
          div::-webkit-scrollbar-track {
            background: #f1f5f9;
            border-radius: 4px;
            margin: 8px;
          }
          
          div::-webkit-scrollbar-thumb {
            background: linear-gradient(to bottom, #cbd5e1, #94a3b8);
            border-radius: 4px;
            border: 1px solid #e2e8f0;
          }
          
          div::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(to bottom, #94a3b8, #64748b);
          }
          
          div::-webkit-scrollbar-corner {
            background: #f1f5f9;
          }
        `}</style>
                  {/* Header */}
          <div style={{ 
            background: 'linear-gradient(to right, #2563eb, #1d4ed8, #1e40af)',
            color: 'white',
            padding: '1.5rem',
            borderTopLeftRadius: '1.5rem',
            borderTopRightRadius: '1.5rem',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ 
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to right, rgba(96, 165, 250, 0.2), transparent)'
            }}></div>
           <div style={{ 
             position: 'relative',
             display: 'flex',
             alignItems: 'center',
             justifyContent: 'space-between'
           }}>
             <div style={{ 
               display: 'flex',
               alignItems: 'center',
               gap: '1rem'
             }}>
               <div style={{ 
                 width: '3.5rem',
                 height: '3.5rem',
                 backgroundColor: 'rgba(255, 255, 255, 0.2)',
                 borderRadius: '50%',
                 display: 'flex',
                 alignItems: 'center',
                 justifyContent: 'center',
                 overflow: 'hidden',
                 border: '2px solid rgba(255, 255, 255, 0.3)',
                 backdropFilter: 'blur(4px)'
               }}>
                 {profile.avatar_url ? (
                   <img 
                     src={profile.avatar_url} 
                     alt={profile.full_name || 'User'} 
                     style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                   />
                 ) : (
                   <FiUser style={{ height: '1.75rem', width: '1.75rem', color: 'white' }} />
                 )}
               </div>
               <div>
                 <h2 style={{ 
                   fontSize: '1.25rem',
                   fontWeight: 'bold',
                   color: 'white'
                 }}>
                   {profile.full_name || 'משתמש ללא שם'}
                 </h2>
                 <p style={{ color: '#dbeafe', fontSize: '0.875rem' }}>{profile.email}</p>
               </div>
             </div>
             <button
               onClick={onClose}
               style={{ 
                 width: '2.5rem',
                 height: '2.5rem',
                 borderRadius: '50%',
                 border: '2px solid rgba(255, 255, 255, 0.3)',
                 background: 'rgba(255, 255, 255, 0.1)',
                 backdropFilter: 'blur(8px)',
                 display: 'flex',
                 alignItems: 'center',
                 justifyContent: 'center',
                 cursor: 'pointer',
                 transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                 boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
               }}
               onMouseEnter={(e) => {
                 e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
                 e.currentTarget.style.transform = 'scale(1.1)';
                 e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.25)';
               }}
               onMouseLeave={(e) => {
                 e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                 e.currentTarget.style.transform = 'scale(1)';
                 e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
               }}
             >
               <FiX style={{ 
                 height: '1.25rem', 
                 width: '1.25rem', 
                 color: 'white',
                 filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))'
               }} />
             </button>
           </div>
         </div>

                 {/* Content */}
         <div style={{ padding: '1.5rem' }}>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
             {/* Basic Information */}
             <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
               <div style={{ 
                 display: 'flex', 
                 alignItems: 'center', 
                 gap: '0.75rem',
                 marginBottom: '1rem'
               }}>
                 <div style={{ 
                   width: '2rem',
                   height: '2rem',
                   borderRadius: '0.5rem',
                   display: 'flex',
                   alignItems: 'center',
                   justifyContent: 'center',
                   background: 'linear-gradient(to right, #3b82f6, #2563eb)'
                 }}>
                   <FiUser style={{ height: '1rem', width: '1rem', color: 'white' }} />
                 </div>
                 <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#111827' }}>מידע בסיסי</h3>
               </div>
               
               <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                 <div style={{ 
                   padding: '1rem',
                   borderRadius: '0.75rem',
                   border: '1px solid #e5e7eb',
                   background: 'linear-gradient(to right, #f8fafc, #f1f5f9)'
                 }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                     <FiMail style={{ height: '1rem', width: '1rem', color: '#3b82f6' }} />
                     <div>
                       <p style={{ fontSize: '0.75rem', fontWeight: '500', color: '#4b5563', margin: 0 }}>אימייל</p>
                       <p style={{ fontSize: '0.875rem', color: '#111827', fontWeight: '600', margin: 0 }}>{profile.email}</p>
                     </div>
                   </div>
                 </div>

                 {profile.mobile_phone && (
                   <div style={{ 
                     padding: '1rem',
                     borderRadius: '0.75rem',
                     border: '1px solid #e5e7eb',
                     background: 'linear-gradient(to right, #f8fafc, #f1f5f9)'
                   }}>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                       <FiPhone style={{ height: '1rem', width: '1rem', color: '#10b981' }} />
                       <div>
                         <p style={{ fontSize: '0.75rem', fontWeight: '500', color: '#4b5563', margin: 0 }}>טלפון</p>
                         <p style={{ fontSize: '0.875rem', color: '#111827', fontWeight: '600', margin: 0 }}>{profile.mobile_phone}</p>
                       </div>
                     </div>
                   </div>
                 )}

                 <div style={{ 
                   padding: '1rem',
                   borderRadius: '0.75rem',
                   border: '1px solid #e5e7eb',
                   background: 'linear-gradient(to right, #f8fafc, #f1f5f9)'
                 }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                     <FiUser style={{ height: '1rem', width: '1rem', color: '#f59e0b' }} />
                     <div>
                       <p style={{ fontSize: '0.75rem', fontWeight: '500', color: '#4b5563', margin: 0 }}>מנוי</p>
                       <p style={{ fontSize: '0.875rem', color: '#111827', fontWeight: '600', margin: 0 }}>{profile.subscription}</p>
                     </div>
                   </div>
                 </div>

                 {profile.location && (
                   <div style={{ 
                     padding: '1rem',
                     borderRadius: '0.75rem',
                     border: '1px solid #e5e7eb',
                     background: 'linear-gradient(to right, #f9fafb, #f3f4f6)'
                   }}>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                       <FiMapPin style={{ height: '1rem', width: '1rem', color: '#ef4444' }} />
                       <div>
                         <p style={{ fontSize: '0.75rem', fontWeight: '500', color: '#4b5563', margin: 0 }}>מיקום</p>
                         <p style={{ fontSize: '0.875rem', color: '#111827', fontWeight: '600', margin: 0 }}>{profile.location}</p>
                       </div>
                     </div>
                   </div>
                 )}

                 {profile.age && (
                   <div style={{ 
                     padding: '1rem',
                     borderRadius: '0.75rem',
                     border: '1px solid #e5e7eb',
                     background: 'linear-gradient(to right, #f9fafb, #f3f4f6)'
                   }}>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                       <FiCalendar style={{ height: '1rem', width: '1rem', color: '#8b5cf6' }} />
                       <div>
                         <p style={{ fontSize: '0.75rem', fontWeight: '500', color: '#4b5563', margin: 0 }}>גיל</p>
                         <p style={{ fontSize: '0.875rem', color: '#111827', fontWeight: '600', margin: 0 }}>{profile.age}</p>
                       </div>
                     </div>
                   </div>
                 )}

                 {profile.occupation && (
                   <div style={{ 
                     padding: '1rem',
                     borderRadius: '0.75rem',
                     border: '1px solid #e5e7eb',
                     background: 'linear-gradient(to right, #f9fafb, #f3f4f6)'
                   }}>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                       <FiBriefcase style={{ height: '1rem', width: '1rem', color: '#6366f1' }} />
                       <div>
                         <p style={{ fontSize: '0.75rem', fontWeight: '500', color: '#4b5563', margin: 0 }}>עיסוק</p>
                         <p style={{ fontSize: '0.875rem', color: '#111827', fontWeight: '600', margin: 0 }}>{profile.occupation}</p>
                       </div>
                     </div>
                   </div>
                 )}
               </div>
             </div>

             {/* Assessment Information */}
             <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
               <div style={{ 
                 display: 'flex', 
                 alignItems: 'center', 
                 gap: '0.75rem',
                 marginBottom: '1rem'
               }}>
                 <div style={{ 
                   width: '2rem',
                   height: '2rem',
                   borderRadius: '0.5rem',
                   display: 'flex',
                   alignItems: 'center',
                   justifyContent: 'center',
                   background: 'linear-gradient(to right, #10b981, #059669)'
                 }}>
                   <FiBookOpen style={{ height: '1rem', width: '1rem', color: 'white' }} />
                 </div>
                                   <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#111827' }}>פרטים נוספים</h3>
               </div>
               
               <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                 {profile.self_introduction && (
                   <div style={{ 
                     padding: '1rem',
                     borderRadius: '0.75rem',
                     border: '1px solid #bfdbfe',
                     background: 'linear-gradient(to right, #eff6ff, #dbeafe)'
                   }}>
                     <p style={{ fontSize: '0.75rem', fontWeight: '500', color: '#1d4ed8', margin: '0 0 0.5rem 0' }}>הצגה עצמית</p>
                     <p style={{ fontSize: '0.875rem', color: '#111827', lineHeight: '1.6', margin: 0 }}>
                       {profile.self_introduction}
                     </p>
                   </div>
                 )}

                 {profile.life_experience && (
                   <div style={{ 
                     padding: '1rem',
                     borderRadius: '0.75rem',
                     border: '1px solid #bbf7d0',
                     background: 'linear-gradient(to right, #f0fdf4, #dcfce7)'
                   }}>
                     <p style={{ fontSize: '0.75rem', fontWeight: '500', color: '#15803d', margin: '0 0 0.5rem 0' }}>ניסיון חיים</p>
                     <p style={{ fontSize: '0.875rem', color: '#111827', lineHeight: '1.6', margin: 0 }}>
                       {profile.life_experience}
                     </p>
                   </div>
                 )}

                 {profile.motivation && (
                   <div style={{ 
                     padding: '1rem',
                     borderRadius: '0.75rem',
                     border: '1px solid #ddd6fe',
                     background: 'linear-gradient(to right, #faf5ff, #f3e8ff)'
                   }}>
                     <p style={{ fontSize: '0.75rem', fontWeight: '500', color: '#7c3aed', margin: '0 0 0.5rem 0' }}>מוטיבציה</p>
                     <p style={{ fontSize: '0.875rem', color: '#111827', lineHeight: '1.6', margin: 0 }}>
                       {profile.motivation}
                     </p>
                   </div>
                 )}

                 {profile.financial_capability && (
                   <div style={{ 
                     padding: '1rem',
                     borderRadius: '0.75rem',
                     border: '1px solid #fde68a',
                     background: 'linear-gradient(to right, #fffbeb, #fef3c7)'
                   }}>
                     <p style={{ fontSize: '0.75rem', fontWeight: '500', color: '#a16207', margin: '0 0 0.5rem 0' }}>יכולת פיננסית</p>
                     <p style={{ fontSize: '0.875rem', color: '#111827', lineHeight: '1.6', margin: 0 }}>
                       {profile.financial_capability}
                     </p>
                   </div>
                 )}

                 {profile.five_year_goals && (
                   <div style={{ 
                     padding: '1rem',
                     borderRadius: '0.75rem',
                     border: '1px solid #c7d2fe',
                     background: 'linear-gradient(to right, #eef2ff, #e0e7ff)'
                   }}>
                     <p style={{ fontSize: '0.75rem', fontWeight: '500', color: '#4338ca', margin: '0 0 0.5rem 0' }}>מטרות ל-5 שנים</p>
                     <p style={{ fontSize: '0.875rem', color: '#111827', lineHeight: '1.6', margin: 0 }}>
                       {profile.five_year_goals}
                     </p>
                   </div>
                 )}
               </div>
             </div>

             {/* Timestamps */}
             <div style={{ paddingTop: '1rem', borderTop: '1px solid #e5e7eb' }}>
               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                 <div style={{ 
                   padding: '0.75rem',
                   borderRadius: '0.75rem',
                   border: '1px solid #e5e7eb',
                   background: 'linear-gradient(to right, #f9fafb, #f3f4f6)'
                 }}>
                   <p style={{ fontSize: '0.75rem', fontWeight: '500', color: '#4b5563', margin: '0 0 0.25rem 0' }}>נוצר ב:</p>
                   <p style={{ fontSize: '0.75rem', color: '#111827', fontWeight: '600', margin: 0 }}>{formatDate(profile.created_at)}</p>
                 </div>
                 <div style={{ 
                   padding: '0.75rem',
                   borderRadius: '0.75rem',
                   border: '1px solid #e5e7eb',
                   background: 'linear-gradient(to right, #f9fafb, #f3f4f6)'
                 }}>
                   <p style={{ fontSize: '0.75rem', fontWeight: '500', color: '#4b5563', margin: '0 0 0.25rem 0' }}>עודכן ב:</p>
                   <p style={{ fontSize: '0.75rem', color: '#111827', fontWeight: '600', margin: 0 }}>{formatDate(profile.updated_at)}</p>
                 </div>
               </div>
             </div>
           </div>
         </div>

         {/* Footer */}
         <div style={{ 
           display: 'flex', 
           justifyContent: 'flex-end', 
           padding: '1rem',
           borderTop: '1px solid #e5e7eb',
           backgroundColor: '#f9fafb',
           borderBottomLeftRadius: '1.5rem',
           borderBottomRightRadius: '1.5rem'
         }}>
           <button
             onClick={onClose}
             style={{ 
               padding: '0.5rem 1rem',
               color: 'white',
               borderRadius: '0.75rem',
               transition: 'all 0.2s',
               fontWeight: '500',
               boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
               background: 'linear-gradient(to right, #2563eb, #1d4ed8)',
               fontSize: '0.875rem',
               cursor: 'pointer',
               border: 'none'
             }}
             onMouseEnter={(e) => {
               e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1)';
               e.currentTarget.style.transform = 'scale(1.05)';
             }}
             onMouseLeave={(e) => {
               e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
               e.currentTarget.style.transform = 'scale(1)';
             }}
           >
             סגור
           </button>
         </div>
      </div>
    </div>,
    document.body
  );
};

export default ProfileDetailModal; 