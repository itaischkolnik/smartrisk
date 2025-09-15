'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { FiShield, FiUsers, FiUser, FiFileText, FiSettings, FiLogOut, FiBarChart, FiTrendingUp, FiAlertCircle, FiSearch, FiEye, FiMail, FiPhone, FiMapPin, FiCalendar, FiEdit, FiTrash2, FiFile, FiBookOpen, FiRefreshCw } from 'react-icons/fi';
import AdminLayout from '../../components/layout/AdminLayout';
import { supabase } from '../../utils/supabase';
import ProfileDetailModal from '../../components/admin/ProfileDetailModal';
import AssessmentDetailModal from '../../components/admin/AssessmentDetailModal';
import PageDetailModal from '../../components/admin/PageDetailModal';
import AddPageModal from '../../components/admin/AddPageModal';
import EditUserModal from '../../components/admin/EditUserModal';
import SubscriptionUpdateModal from '../../components/admin/SubscriptionUpdateModal';
import SuccessModal from '../../components/admin/SuccessModal';
import ConfirmModal from '../../components/admin/ConfirmModal';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '../../hooks/useAdminAuth';
import { Assessment, Profile, Page } from '../../types/admin';

type TabType = 'dashboard' | 'users' | 'assessments' | 'pages' | 'articles';

const AdminDashboard = () => {
  const { isAdmin, loading: authLoading } = useAdminAuth();
  const router = useRouter();
  const [adminEmail, setAdminEmail] = useState<string | null>(null);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [assessmentsLoading, setAssessmentsLoading] = useState(false);
  const [pagesLoading, setPagesLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [assessmentSearchTerm, setAssessmentSearchTerm] = useState('');
  const [pageSearchTerm, setPageSearchTerm] = useState('');
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null);
  const [isAssessmentModalOpen, setIsAssessmentModalOpen] = useState(false);
  const [selectedPage, setSelectedPage] = useState<Page | null>(null);
  const [isPageModalOpen, setIsPageModalOpen] = useState(false);
  const [isAddPageModalOpen, setIsAddPageModalOpen] = useState(false);
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState({ title: '', message: '' });
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmModalData, setConfirmModalData] = useState<{
    title: string;
    message: string;
    onConfirm: () => void;
    isDestructive?: boolean;
  } | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [openPageModalInEditMode, setOpenPageModalInEditMode] = useState(false);

  // Real dashboard stats
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAssessments: 0,
    activeAssessments: 0,
    pendingReviews: 0,
    freeUsers: 0,
    entrepreneurUsers: 0,
    businessUsers: 0,
    professionalUsers: 0,
    totalAssessmentsUsed: 0
  });

  // Error states
  const [statsError, setStatsError] = useState<string | null>(null);
  const [profilesError, setProfilesError] = useState<string | null>(null);
  const [assessmentsError, setAssessmentsError] = useState<string | null>(null);
  const [pagesError, setPagesError] = useState<string | null>(null);

  // Set admin email when auth is confirmed
  useEffect(() => {
    if (isAdmin && !adminEmail) {
      // Get the current user's email from the session
      const getCurrentUserEmail = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user?.email) {
          setAdminEmail(session.user.email);
        }
      };
      getCurrentUserEmail();
    }
  }, [isAdmin, adminEmail]);

  // Function to safely call refreshNavigation with retry
  const safeRefreshNavigation = useCallback(async (retries = 3, delay = 500) => {
    for (let i = 0; i < retries; i++) {
      if ((window as any).refreshNavigation) {
        console.log(`✅ refreshNavigation function found on attempt ${i + 1}`);
        (window as any).refreshNavigation();
        return true;
      } else {
        console.log(`⏳ refreshNavigation function not found on attempt ${i + 1}, waiting ${delay}ms...`);
        if (i < retries - 1) {
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    console.log('❌ refreshNavigation function not found after all retries – sending storage event');
    try {
      localStorage.setItem('navigation_refresh', Date.now().toString());
    } catch (err) {
      console.error('localStorage not available to broadcast navigation refresh', err);
    }
    return false;
  }, []);

  // Check if refreshNavigation function is available
  useEffect(() => {
    const checkRefreshFunction = () => {
      if ((window as any).refreshNavigation) {
        console.log('✅ refreshNavigation function is available');
      } else {
        console.log('❌ refreshNavigation function is NOT available - Navbar may not be mounted');
      }
    };
    
    // Check immediately
    checkRefreshFunction();
    
    // Check again after a short delay to see if Navbar mounts later
    const timer = setTimeout(checkRefreshFunction, 1000);
    
    // Expose test functions globally for debugging
    (window as any).testAdminRefresh = async () => {
      console.log('🧪 Testing admin refresh mechanism...');
      const success = await safeRefreshNavigation();
      console.log('Result:', success ? '✅ Success' : '❌ Failed');
      return success;
    };
    
    (window as any).checkRefreshFunction = checkRefreshFunction;
    
    return () => {
      clearTimeout(timer);
      delete (window as any).testAdminRefresh;
      delete (window as any).checkRefreshFunction;
    };
  }, [safeRefreshNavigation]);

  useEffect(() => {
    if (adminEmail && !authLoading) {
      fetchProfiles();
      fetchStats();
      fetchPages();
    }
  }, [adminEmail, authLoading]);

  // Fetch assessments when component loads to ensure data consistency
  useEffect(() => {
    if (adminEmail && !authLoading) {
      fetchAssessments();
    }
  }, [adminEmail, authLoading]);

  const logout = async () => {
    await supabase.auth.signOut();
    router.push('/admin');
  };

  const fetchStats = useCallback(async () => {
    try {
      setStatsError(null);
      // Use the admin stats API route instead of direct database access
      const response = await fetch('/api/admin/stats');
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('לא מורשה - יש להתחבר מחדש');
        } else if (response.status === 403) {
          throw new Error('אין לך הרשאות מנהל');
        } else {
          throw new Error(`שגיאת שרת: ${response.status}`);
        }
      }
      const { stats: statsData } = await response.json();
      
      if (statsData) {
        setStats(statsData);
        console.log('Fetched stats via admin API:', statsData);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'שגיאה בטעינת הסטטיסטיקות';
      console.error('Error fetching stats:', error);
      setStatsError(errorMessage);
    }
  }, []);

  const fetchProfiles = useCallback(async () => {
    try {
      setProfilesError(null);
      // Use the admin API route instead of direct database access
      const response = await fetch('/api/admin/profiles');
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('לא מורשה - יש להתחבר מחדש');
        } else if (response.status === 403) {
          throw new Error('אין לך הרשאות מנהל');
        } else {
          throw new Error(`שגיאת שרת: ${response.status}`);
        }
      }
      const { profiles: profilesData } = await response.json();
      
      if (profilesData) {
        setProfiles(profilesData);
        console.log('Fetched profiles via admin API:', profilesData.length);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'שגיאה בטעינת המשתמשים';
      console.error('Error fetching profiles:', error);
      setProfilesError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAssessments = useCallback(async () => {
    try {
      console.log('Fetching assessments...');
      setAssessmentsError(null);
      setAssessmentsLoading(true);
      
      // Use the admin assessments API route instead of direct database access
      const response = await fetch('/api/admin/assessments');
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('לא מורשה - יש להתחבר מחדש');
        } else if (response.status === 403) {
          throw new Error('אין לך הרשאות מנהל');
        } else {
          throw new Error(`שגיאת שרת: ${response.status}`);
        }
      }
      const { assessments: assessmentsData } = await response.json();
      
      if (assessmentsData) {
        console.log('Setting assessments:', assessmentsData.length, 'assessments');
        console.log('Sample assessment data:', assessmentsData[0]);
        setAssessments(assessmentsData);
      } else {
        console.log('No assessments in response');
        setAssessments([]);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'שגיאה בטעינת ההערכות';
      console.error('Error fetching assessments:', error);
      setAssessmentsError(errorMessage);
      setAssessments([]);
    } finally {
      setAssessmentsLoading(false);
    }
  }, []);

  const fetchPages = useCallback(async () => {
    try {
      setPagesError(null);
      setPagesLoading(true);
      
      // Use the real admin pages API
      const response = await fetch('/api/admin/pages');
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('לא מורשה - יש להתחבר מחדש');
        } else if (response.status === 403) {
          throw new Error('אין לך הרשאות מנהל');
        } else {
          throw new Error(`שגיאת שרת: ${response.status}`);
        }
      }
      const { pages: pagesData } = await response.json();
      
      if (pagesData) {
        setPages(pagesData);
        console.log('Loaded pages via admin API:', pagesData.length);
      } else {
        setPages([]);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'שגיאה בטעינת הדפים';
      console.error('Error fetching pages:', error);
      setPagesError(errorMessage);
      setPages([]);
    } finally {
      setPagesLoading(false);
    }
  }, []);

  // Function to get assessment quota for a subscription
  const getAssessmentQuota = (subscription: string): number => {
    switch (subscription) {
      case 'חינם':
        return 999; // Unlimited (represented as 999 for display)
      case 'יזם':
        return 1;
      case 'איש עסקים':
        return 18;
      case 'מקצועי':
        return 36;
      default:
        return 0;
    }
  };

  // Function to format assessment usage display
  const formatAssessmentUsage = (profile: Profile): string => {
    const used = profile.assessments_used_this_year || 0;
    const total = getAssessmentQuota(profile.subscription);
    
    if (total === 999) {
      return `${used}/∞`; // Show infinity for free users
    }
    
    return `${used}/${total}`;
  };

  useEffect(() => {
    if (activeTab === 'assessments' && !authLoading) {
      fetchAssessments();
    }
  }, [activeTab, authLoading, fetchAssessments]);

  useEffect(() => {
    if (activeTab === 'pages' && !authLoading) {
      console.log('📄 Pages tab activated, checking refreshNavigation function...');
      if ((window as any).refreshNavigation) {
        console.log('✅ refreshNavigation function is available');
      } else {
        console.log('❌ refreshNavigation function is NOT available');
      }
      fetchPages();
    }
  }, [activeTab, authLoading, fetchPages]);

  const filteredProfiles = profiles.filter(profile =>
    profile.full_name?.includes(searchTerm) || 
    profile.email.includes(searchTerm) ||
    profile.location?.includes(searchTerm) ||
    profile.occupation?.includes(searchTerm)
  );

  const filteredAssessments = assessments.filter(assessment => {
    const searchLower = assessmentSearchTerm.toLowerCase();
    return (
      assessment.business_name?.toLowerCase().includes(searchLower) ||
      assessment.profiles?.full_name?.toLowerCase().includes(searchLower) ||
      assessment.profiles?.email.toLowerCase().includes(searchLower) ||
      assessment.status?.toLowerCase().includes(searchLower) ||
      assessment.summary?.toLowerCase().includes(searchLower) ||
      assessment.id.toLowerCase().includes(searchLower)
    );
  });

  const filteredPages = pages.filter(page => {
    const searchLower = pageSearchTerm.toLowerCase();
    return (
      page.title.toLowerCase().includes(searchLower) ||
      page.slug.toLowerCase().includes(searchLower) ||
      page.content.toLowerCase().includes(searchLower) ||
      page.meta_description?.toLowerCase().includes(searchLower)
    );
  });

  // Debug logging
  console.log('Assessments state:', {
    total: assessments.length,
    filtered: filteredAssessments.length,
    searchTerm: assessmentSearchTerm,
    assessments: assessments
  });

  const handleProfileClick = (profile: Profile) => {
    setSelectedProfile(profile);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProfile(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('he-IL');
  };

  const getSubscriptionColor = (subscription: string) => {
    switch (subscription) {
      case 'חינם':
        return 'text-gray-600';
      case 'יזם':
        return 'text-blue-600';
      case 'איש עסקים':
        return 'text-green-600';
      case 'מקצועי':
        return 'text-purple-600';
      default:
        return 'text-gray-600';
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'processing':
        return 'text-yellow-600 bg-yellow-100';
      case 'pending':
        return 'text-blue-600 bg-blue-100';
      case 'error':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'draft':
        return 'בטיוטא';
      case 'submitted':
        return 'הוגש';
      case 'submitted_to_webhook':
        return 'נשלחה';
      case 'processing':
        return 'בתהליך';
      case 'completed':
        return 'הושלם';
      case 'analyzed':
        return 'הושלם';
      case 'pending':
        return 'ממתין';
      case 'error':
        return 'שגיאה';
      default:
        return status;
    }
  };

  const handleEditUser = (profile: Profile) => {
    setEditingProfile(profile);
    setIsEditUserModalOpen(true);
  };

  const handleSubscriptionClick = (profile: Profile) => {
    setEditingProfile(profile);
    setIsSubscriptionModalOpen(true);
  };

  const handleSaveUser = async (editedProfile: Profile) => {
    try {
      const response = await fetch(`/api/admin/profiles/${editedProfile.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedProfile),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('לא מורשה - יש להתחבר מחדש');
        } else if (response.status === 403) {
          throw new Error('אין לך הרשאות מנהל');
        } else {
          throw new Error(`שגיאת שרת: ${response.status}`);
        }
      }

      // Update local state
      setProfiles(prev => prev.map(p => 
        p.id === editedProfile.id ? editedProfile : p
      ));

      setSuccessMessage({
        title: 'עדכון הושלם בהצלחה',
        message: 'הפרופיל עודכן בהצלחה במערכת'
      });
      setIsSuccessModalOpen(true);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'שגיאה בעדכון הפרופיל';
      console.error('Error updating profile:', error);
      
      // Show error in success modal instead of throwing
      setSuccessMessage({
        title: 'שגיאה בעדכון',
        message: errorMessage
      });
      setIsSuccessModalOpen(true);
    }
  };

  const showConfirmModal = (title: string, message: string, onConfirm: () => void, isDestructive = false) => {
    setConfirmModalData({ title, message, onConfirm, isDestructive });
    setIsConfirmModalOpen(true);
  };

  const handleDeleteUser = (profile: Profile) => {
    showConfirmModal(
      'מחיקת משתמש',
      `האם אתה בטוח שברצונך למחוק את המשתמש "${profile.full_name || profile.email}"? 

פעולה זו תמחק:
• הפרופיל של המשתמש
• כל ההערכות הקשורות
• כל הקבצים שהועלו
• חשבון ההתחברות

פעולה זו אינה הפיכה!`,
      async () => {
        try {
          const response = await fetch(`/api/admin/profiles/${profile.id}`, {
            method: 'DELETE'
          });

          if (!response.ok) {
            if (response.status === 401) {
              throw new Error('לא מורשה - יש להתחבר מחדש');
            } else if (response.status === 403) {
              throw new Error('אין לך הרשאות מנהל');
            } else if (response.status === 404) {
              throw new Error('המשתמש לא נמצא');
            } else {
              throw new Error(`שגיאת שרת: ${response.status}`);
            }
          }

          // Remove from local state
          setProfiles(prev => prev.filter(p => p.id !== profile.id));
          
          // Update stats
          setStats(prev => ({
            ...prev,
            totalUsers: prev.totalUsers - 1
          }));

          setSuccessMessage({
            title: 'מחיקה הושלמה בהצלחה',
            message: 'המשתמש נמחק בהצלחה מהמערכת'
          });
          setIsSuccessModalOpen(true);
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'שגיאה במחיקת המשתמש';
          console.error('Error deleting user:', error);
          setSuccessMessage({
            title: 'שגיאה במחיקת המשתמש',
            message: errorMessage
          });
          setIsSuccessModalOpen(true);
        }
      },
      true // isDestructive
    );
  };

  const handleViewAssessment = async (assessment: Assessment) => {
    try {
      console.log('handleViewAssessment called with:', assessment);
      console.log('Current modal state before API call:', { isAssessmentModalOpen, selectedAssessment });
      
      const response = await fetch(`/api/admin/assessments/${assessment.id}`);
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('לא מורשה - יש להתחבר מחדש');
        } else if (response.status === 403) {
          throw new Error('אין לך הרשאות מנהל');
        } else if (response.status === 404) {
          throw new Error('ההערכה לא נמצאה');
        } else {
          throw new Error(`שגיאת שרת: ${response.status}`);
        }
      }
      const fullAssessment = await response.json();
      console.log('API response received:', fullAssessment);
      
      setSelectedAssessment(fullAssessment);
      setIsAssessmentModalOpen(true);
      
      console.log('Modal state after setting:', { isAssessmentModalOpen: true, selectedAssessment: fullAssessment });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'שגיאה בטעינת פרטי ההערכה';
      console.error('Error fetching assessment details:', error);
      setSuccessMessage({
        title: 'שגיאה בטעינת פרטי ההערכה',
        message: errorMessage
      });
      setIsSuccessModalOpen(true);
    }
  };

  const handleDeleteAssessment = async (assessment: Assessment) => {
    showConfirmModal(
      'מחיקת הערכה',
      'האם אתה בטוח שברצונך למחוק הערכה זו?',
      async () => {
        try {
          const response = await fetch(`/api/admin/assessments/${assessment.id}`, {
            method: 'DELETE'
          });

          if (!response.ok) {
            if (response.status === 401) {
              throw new Error('לא מורשה - יש להתחבר מחדש');
            } else if (response.status === 403) {
              throw new Error('אין לך הרשאות מנהל');
            } else if (response.status === 404) {
              throw new Error('ההערכה לא נמצאה');
            } else {
              throw new Error(`שגיאת שרת: ${response.status}`);
            }
          }

          // Remove from local state
          setAssessments(prev => prev.filter(a => a.id !== assessment.id));
          
          // Update stats
          setStats(prev => ({
            ...prev,
            totalAssessments: prev.totalAssessments - 1
          }));

          setSuccessMessage({
            title: 'מחיקה הושלמה בהצלחה',
            message: 'ההערכה נמחקה בהצלחה מהמערכת'
          });
          setIsSuccessModalOpen(true);
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'שגיאה במחיקת ההערכה';
          console.error('Error deleting assessment:', error);
          setSuccessMessage({
            title: 'שגיאה במחיקת ההערכה',
            message: errorMessage
          });
          setIsSuccessModalOpen(true);
        }
      },
      true // isDestructive
    );
  };

  const closeAssessmentModal = () => {
    setIsAssessmentModalOpen(false);
    setSelectedAssessment(null);
  };

  const handleViewPage = async (page: Page) => {
    try {
      const response = await fetch(`/api/admin/pages/${page.id}`);
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('לא מורשה - יש להתחבר מחדש');
        } else if (response.status === 403) {
          throw new Error('אין לך הרשאות מנהל');
        } else if (response.status === 404) {
          throw new Error('הדף לא נמצא');
        } else {
          throw new Error(`שגיאת שרת: ${response.status}`);
        }
      }
      const fullPage = await response.json();
      
      setSelectedPage(fullPage.page);
      setOpenPageModalInEditMode(false); // View mode
      setIsPageModalOpen(true);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'שגיאה בטעינת פרטי הדף';
      console.error('Error fetching page details:', error);
      setSuccessMessage({
        title: 'שגיאה בטעינת פרטי הדף',
        message: errorMessage
      });
      setIsSuccessModalOpen(true);
    }
  };

  const handleEditPage = async (page: Page) => {
    setSelectedPage(page);
    setOpenPageModalInEditMode(true); // Edit mode
    setIsPageModalOpen(true);
  };

  const handleDeletePage = async (page: Page) => {
    showConfirmModal(
      'מחיקת דף',
      'האם אתה בטוח שברצונך למחוק דף זה?',
      async () => {
        try {
          const response = await fetch(`/api/admin/pages/${page.id}`, {
            method: 'DELETE'
          });

          if (!response.ok) {
            if (response.status === 401) {
              throw new Error('לא מורשה - יש להתחבר מחדש');
            } else if (response.status === 403) {
              throw new Error('אין לך הרשאות מנהל');
            } else if (response.status === 404) {
              throw new Error('הדף לא נמצא');
            } else {
              throw new Error(`שגיאת שרת: ${response.status}`);
            }
          }

                // Remove from local state
      setPages(prev => prev.filter(p => p.id !== page.id));
      
      // Verify the page was actually deleted from the database
      try {
        console.log('🔍 Verifying page deletion from database...');
        const verifyResponse = await fetch(`/api/admin/pages/${page.id}`);
        if (verifyResponse.status === 404) {
          console.log('✅ Page successfully deleted from database (404 response)');
        } else if (verifyResponse.ok) {
          const { page: existingPage } = await verifyResponse.json();
          console.log('❌ Page still exists in database after deletion:', existingPage);
          console.log('⚠️ This suggests the deletion failed!');
        }
      } catch (verifyError) {
        console.log('❌ Deletion verification failed:', verifyError);
      }
      
      // Refresh the navigation menu since a page was deleted
      console.log('🔄 Page deleted, attempting to refresh navigation...');
      console.log('🗑️ Deleted page ID:', page.id);
      console.log('🗑️ Deleted page slug:', page.slug);
      
      // Immediately clear navigation for deleted pages to prevent showing stale data
      if (typeof window !== 'undefined' && (window as any).clearDynamicPages) {
        console.log('🗑️ Immediately clearing navigation for deleted page');
        (window as any).clearDynamicPages();
      }
      try {
        if ((window as any).removeNavPageBySlug) {
          console.log('🗑️ Removing page from navigation by slug:', page.slug);
          (window as any).removeNavPageBySlug(page.slug);
        }
      } catch {}
      
      // Force immediate navigation refresh
      try {
        if ((window as any).forceImmediateRefresh) {
          console.log('🔄 Force immediate refresh after deletion');
          (window as any).forceImmediateRefresh();
        }
      } catch {}
      
      await safeRefreshNavigation();
      
      // Also trigger a direct navigation refresh for immediate update
      try {
        // Send a storage event to trigger navigation refresh in other tabs
        localStorage.setItem('navigation_refresh', Date.now().toString());
        
        // Try to call the global refresh function if available
        if (typeof window !== 'undefined' && (window as any).refreshNavigation) {
          (window as any).refreshNavigation();
        }
        
        console.log('✅ Navigation refresh triggered for page update');
      } catch (error) {
        console.log('Navigation refresh fallback failed:', error);
      }
          
          setSuccessMessage({
            title: 'מחיקה הושלמה בהצלחה',
            message: 'הדף נמחק בהצלחה מהמערכת'
          });
          setIsSuccessModalOpen(true);
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'שגיאה במחיקת הדף';
          console.error('Error deleting page:', error);
          setSuccessMessage({
            title: 'שגיאה במחיקת הדף',
            message: errorMessage
          });
          setIsSuccessModalOpen(true);
        }
      },
      true // isDestructive
    );
  };

  const handleSavePage = async (updatedPage: Partial<Page>) => {
    if (!selectedPage) return;

    try {
      const response = await fetch(`/api/admin/pages/${selectedPage.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedPage)
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('לא מורשה - יש להתחבר מחדש');
        } else if (response.status === 403) {
          throw new Error('אין לך הרשאות מנהל');
        } else if (response.status === 404) {
          throw new Error('הדף לא נמצא');
        } else {
          throw new Error(`שגיאת שרת: ${response.status}`);
        }
      }

      const { page: savedPage } = await response.json();
      
      // Verify the database update actually happened by checking the page directly
      try {
        const verifyResponse = await fetch(`/api/admin/pages/${selectedPage.id}`);
        if (verifyResponse.ok) {
          const { page: verifiedPage } = await verifyResponse.json();
          
          // Use the verified page data if it's different
          if (JSON.stringify(savedPage) !== JSON.stringify(verifiedPage)) {
            setPages(prev => prev.map(p => p.id === selectedPage.id ? verifiedPage : p));
            setSelectedPage(verifiedPage);
          } else {
            setPages(prev => prev.map(p => p.id === selectedPage.id ? savedPage : p));
            setSelectedPage(savedPage);
          }
        }
      } catch (verifyError) {
        // Fall back to using the original response
        setPages(prev => prev.map(p => p.id === selectedPage.id ? savedPage : p));
        setSelectedPage(savedPage);
      }
      
      // Always refresh the navigation menu – title, slug, or publish status might have changed
      
      // Check if publication status changed
      const normalizeBool = (val: any) => val === true || val === 'true' || val === 1 || val === '1';
      const wasPublished = normalizeBool(selectedPage.is_published);
      const isNowPublished = normalizeBool(updatedPage.is_published);
      
      console.log('🔄 Publication status change detected:', {
        wasPublished,
        isNowPublished,
        pageSlug: savedPage?.slug || selectedPage.slug,
        pageTitle: savedPage?.title || selectedPage.title
      });
      
      if (wasPublished !== isNowPublished) {
        if (isNowPublished) {
          console.log('✅ Page published, adding to navigation');
          try {
            if ((window as any).addNavPage && savedPage?.slug) {
              (window as any).addNavPage(savedPage.slug, savedPage.title);
              console.log('✅ Page added to navigation via addNavPage');
            }
          } catch (error) {
            console.log('❌ Failed to add page to navigation:', error);
          }
        } else {
          console.log('❌ Page unpublished, removing from navigation');
          // Remove only the specific unpublished page from navigation
          try {
            if ((window as any).removeNavPageBySlug && (savedPage?.slug || selectedPage.slug)) {
              (window as any).removeNavPageBySlug(savedPage?.slug || selectedPage.slug);
              console.log('✅ Page removed from navigation via removeNavPageBySlug');
            }
          } catch (error) {
            console.log('❌ Failed to remove page from navigation:', error);
          }
          
          // Immediately trigger a navigation refresh to ensure the change is reflected
          try {
            if ((window as any).refreshNavigation) {
              console.log('🔄 Triggering immediate navigation refresh for unpublished page');
              (window as any).refreshNavigation();
              console.log('✅ Immediate navigation refresh triggered');
            }
          } catch (error) {
            console.log('❌ Failed to trigger immediate navigation refresh:', error);
          }
          
          // Also trigger a delayed navigation refresh to ensure the API reflects the change
          try {
            if ((window as any).refreshNavigation) {
              console.log('🔄 Triggering delayed navigation refresh for unpublished page');
              // Add a longer delay to ensure database update is complete
              setTimeout(async () => {
                try {
                  console.log('🔄 Executing delayed navigation refresh');
                  await (window as any).refreshNavigation();
                  console.log('✅ Delayed navigation refresh completed');
                  
                  // Also force a direct API refresh to ensure the public API reflects the change
                  try {
                    console.log('🔄 Forcing direct API refresh');
                    const directRefreshResponse = await fetch('/api/pages?cb=' + Date.now(), {
                      method: 'GET',
                      headers: {
                        'Cache-Control': 'no-cache, no-store, must-revalidate',
                        'Pragma': 'no-cache',
                        'Expires': '0',
                      },
                      cache: 'no-store'
                    });
                    
                    if (directRefreshResponse.ok) {
                      const { pages: freshPages } = await directRefreshResponse.json();
                      console.log('✅ Direct API refresh successful, got', freshPages?.length || 0, 'published pages');
                    } else {
                      console.log('❌ Direct API refresh failed:', directRefreshResponse.status);
                    }
                  } catch (directError) {
                    console.log('❌ Direct API refresh failed:', directError);
                  }
                  
                  // Force refresh the admin panel's pages list to ensure it shows the updated status
                  try {
                    console.log('🔄 Forcing admin panel pages refresh');
                    await fetchPages();
                    console.log('✅ Admin panel pages refresh completed');
                  } catch (refreshError) {
                    console.log('❌ Admin panel pages refresh failed:', refreshError);
                  }
                } catch (error) {
                  console.log('❌ Delayed navigation refresh failed:', error);
                }
              }, 1000); // Increased delay to 1 second
            }
          } catch (error) {
            console.log('❌ Failed to schedule delayed navigation refresh:', error);
          }
        }
      }
      
      // Enhanced navigation refresh with multiple fallback mechanisms
      
      // Method 1: Try the global refresh function
      let navigationRefreshed = false;
      try {
        if (typeof window !== 'undefined' && (window as any).refreshNavigation) {
          await (window as any).refreshNavigation();
          navigationRefreshed = true;
        }
      } catch (error) {
        console.log('Global refreshNavigation failed:', error);
      }
      
      // Method 2: Send storage event for cross-tab communication
      if (!navigationRefreshed) {
        try {
          // Send storage event for cross-tab communication
          localStorage.setItem('navigation_refresh', Date.now().toString());
          
          // Also dispatch custom event for same-tab communication
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('navigation_refresh'));
          }
          
          navigationRefreshed = true;
        } catch (error) {
          console.log('Storage event failed:', error);
        }
      }
      
      // Method 3: Direct API call to refresh navigation
      if (!navigationRefreshed) {
        try {
          // Force a fresh fetch from the public API
          const refreshResponse = await fetch('/api/pages?cb=' + Date.now(), {
            method: 'GET',
            headers: {
              'Cache-Control': 'no-cache, no-store, must-revalidate',
              'Pragma': 'no-cache',
              'Expires': '0',
            },
            cache: 'no-store'
          });
          
          if (refreshResponse.ok) {
            const { pages: freshPages } = await refreshResponse.json();
            console.log('Direct API refresh successful, got', freshPages?.length || 0, 'pages');
          } else {
            console.log('Direct API refresh failed:', refreshResponse.status);
          }
        } catch (error) {
          console.log('Direct API refresh failed:', error);
        }
      }
      
      // Also trigger a direct navigation refresh for immediate update
      try {
        // Send a storage event to trigger navigation refresh in other tabs
        localStorage.setItem('navigation_refresh', Date.now().toString());
        
        // Try to call the global refresh function if available
        if (typeof window !== 'undefined' && (window as any).refreshNavigation) {
          (window as any).refreshNavigation();
        }
      } catch (error) {
        console.log('Navigation refresh fallback failed:', error);
      }
      
      // Reload pages list from server to ensure status column reflects DB
      try {
        await fetchPages();
      } catch (e) {
        console.log('Failed to refetch pages after save:', e);
      }
      
      setSuccessMessage({
        title: 'שמירה הושלמה בהצלחה',
        message: 'הדף נשמר בהצלחה במערכת'
      });
      setIsSuccessModalOpen(true);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'שגיאה בשמירת הדף';
      console.error('Error saving page:', error);
      setSuccessMessage({
        title: 'שגיאה בשמירת הדף',
        message: errorMessage
      });
      setIsSuccessModalOpen(true);
      throw error;
    }
  };

  const handleAddPage = async (pageData: {
    title: string;
    slug: string;
    content: string;
    meta_description: string;
    is_published: boolean;
  }) => {
    console.log('handleAddPage called with pageData:', pageData);
    try {
      console.log('Making POST request to /api/admin/pages...');
      const response = await fetch('/api/admin/pages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pageData)
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('לא מורשה - יש להתחבר מחדש');
        } else if (response.status === 403) {
          throw new Error('אין לך הרשאות מנהל');
        } else if (response.status === 400) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'שגיאה ביצירת הדף');
        } else {
          throw new Error(`שגיאת שרת: ${response.status}`);
        }
      }

      const responseData = await response.json();
      console.log('Response data:', responseData);
      
      const { page: newPage } = responseData;
      
      // Add to local state
      setPages(prev => [newPage, ...prev]);
      
      // Refresh the navigation menu if the page was published
      if (pageData.is_published) {
        console.log('🔄 New page is published, attempting to refresh navigation...');
        try {
          if ((window as any).addNavPage) {
            (window as any).addNavPage(newPage.slug, newPage.title);
          }
        } catch {}
        
        // Add a small delay to ensure database transaction is committed
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        await safeRefreshNavigation();
        
        // Also trigger a direct navigation refresh for immediate update
        try {
          // Send a storage event to trigger navigation refresh in other tabs
          localStorage.setItem('navigation_refresh', Date.now().toString());
          
          // Try to call the global refresh function if available
          if (typeof window !== 'undefined' && (window as any).refreshNavigation) {
            (window as any).refreshNavigation();
          }
          
          console.log('✅ Navigation refresh triggered for new published page');
        } catch (error) {
          console.log('Navigation refresh fallback failed:', error);
        }
      } else {
        console.log('ℹ️ Page is not published, no navigation refresh needed');
      }
      
      setSuccessMessage({
        title: 'יצירה הושלמה בהצלחה',
        message: 'הדף נוצר בהצלחה במערכת'
      });
      setIsSuccessModalOpen(true);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'שגיאה ביצירת הדף';
      console.error('Error creating page:', error);
      setSuccessMessage({
        title: 'שגיאה ביצירת הדף',
        message: errorMessage
      });
      setIsSuccessModalOpen(true);
      throw error;
    }
  };

  const closePageModal = () => {
    setIsPageModalOpen(false);
    setSelectedPage(null);
    setOpenPageModalInEditMode(false);
  };

  const closeAddPageModal = () => {
    setIsAddPageModalOpen(false);
  };

  // Don't render if still loading auth or not admin
  if (authLoading || !isAdmin) {
    return null; // AdminLayout will handle the loading/redirect
  }

  const tabs = [
    { id: 'dashboard', label: 'לוח בקרה', icon: FiBarChart },
    { id: 'users', label: 'משתמשים', icon: FiUsers },
    { id: 'assessments', label: 'הערכות', icon: FiFileText },
    { id: 'pages', label: 'דפים', icon: FiFile },
    { id: 'articles', label: 'מאמרים', icon: FiBookOpen }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-8">
            {/* Error Display */}
            {statsError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center space-x-3 space-x-reverse">
                  <FiAlertCircle className="h-5 w-5 text-red-500" />
                  <div className="flex-1">
                    <p className="text-sm text-red-800">{statsError}</p>
                  </div>
                  <button
                    onClick={fetchStats}
                    className="btn btn-sm btn-outline"
                    style={{ borderColor: '#dc2626', color: '#dc2626' }}
                  >
                    נסה שוב
                  </button>
                </div>
              </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div 
                className="card p-6 border-r-4 border-primary hover:shadow-xl transition-all duration-300 cursor-pointer"
                onClick={() => setActiveTab('users')}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">סה"כ משתמשים</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</p>
                  </div>
                  <div className="feature-icon">
                    <FiUsers className="h-8 w-8" />
                  </div>
                </div>
              </div>

              <div 
                className="card p-6 border-r-4 border-success hover:shadow-xl transition-all duration-300 cursor-pointer"
                onClick={() => setActiveTab('assessments')}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">סה"כ הערכות</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalAssessments.toLocaleString()}</p>
                  </div>
                  <div className="feature-icon">
                    <FiFileText className="h-8 w-8" />
                  </div>
                </div>
              </div>

              <div 
                className="card p-6 border-r-4 border-warning hover:shadow-xl transition-all duration-300 cursor-pointer"
                onClick={() => setActiveTab('assessments')}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">הערכות פעילות</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.activeAssessments.toLocaleString()}</p>
                  </div>
                  <div className="feature-icon">
                    <FiTrendingUp className="h-8 w-8" />
                  </div>
                </div>
              </div>

              <div className="card p-6 border-r-4 border-danger">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">בקשות לבדיקה</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.pendingReviews.toLocaleString()}</p>
                  </div>
                  <div className="feature-icon">
                    <FiAlertCircle className="h-8 w-8" />
                  </div>
                </div>
              </div>
            </div>

            {/* Subscription Usage Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mt-6">
              <div className="card p-6 border-r-4 border-gray-400">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">חינם</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.freeUsers.toLocaleString()}</p>
                  </div>
                  <div className="feature-icon text-gray-400">
                    <FiUser className="h-6 w-6" />
                  </div>
                </div>
              </div>

              <div className="card p-6 border-r-4 border-blue-400">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">יזם</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.entrepreneurUsers.toLocaleString()}</p>
                  </div>
                  <div className="feature-icon text-blue-400">
                    <FiUser className="h-6 w-6" />
                  </div>
                </div>
              </div>

              <div className="card p-6 border-r-4 border-green-400">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">איש עסקים</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.businessUsers.toLocaleString()}</p>
                  </div>
                  <div className="feature-icon text-green-400">
                    <FiUser className="h-6 w-6" />
                  </div>
                </div>
              </div>

              <div className="card p-6 border-r-4 border-purple-400">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">מקצועי</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.professionalUsers.toLocaleString()}</p>
                  </div>
                  <div className="feature-icon text-purple-400">
                    <FiUser className="h-6 w-6" />
                  </div>
                </div>
              </div>

                                   <div className="card p-6 border-r-4 border-orange-400">
                       <div className="flex items-center justify-between">
                         <div>
                           <p className="text-sm font-medium text-gray-600">הערכות בשימוש</p>
                           <p className="text-2xl font-bold text-gray-900">{stats.totalAssessmentsUsed.toLocaleString()}</p>
                           <p className="text-xs text-gray-500">מתוך כל התוכניות</p>
                         </div>
                         <div className="feature-icon text-orange-400">
                           <FiBarChart className="h-6 w-6" />
                         </div>
                       </div>
                     </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              <div 
                className="card p-6 hover:shadow-xl transition-all duration-300 cursor-pointer"
                onClick={() => setActiveTab('users')}
              >
                <div className="flex items-center space-x-4 space-x-reverse">
                  <div className="feature-icon">
                    <FiUsers className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">ניהול משתמשים</h3>
                    <p className="text-sm text-gray-600">עריכה ומחיקת משתמשים במערכת</p>
                  </div>
                </div>
              </div>

              <div 
                className="card p-6 hover:shadow-xl transition-all duration-300 cursor-pointer"
                onClick={() => setActiveTab('assessments')}
              >
                <div className="flex items-center space-x-4 space-x-reverse">
                  <div className="feature-icon">
                    <FiFileText className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">ניהול הערכות</h3>
                    <p className="text-sm text-gray-600">בקרה על הערכות עסקיות</p>
                  </div>
                </div>
              </div>

              <div 
                className="card p-6 hover:shadow-xl transition-all duration-300 cursor-pointer"
                onClick={() => setActiveTab('pages')}
              >
                <div className="flex items-center space-x-4 space-x-reverse">
                  <div className="feature-icon">
                    <FiFile className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">ניהול דפים</h3>
                    <p className="text-sm text-gray-600">הוספה ועריכה של דפי האתר</p>
                  </div>
                </div>
              </div>

              <div 
                className="card p-6 hover:shadow-xl transition-all duration-300 cursor-pointer"
                onClick={() => setActiveTab('articles')}
              >
                <div className="flex items-center space-x-4 space-x-reverse">
                  <div className="feature-icon">
                    <FiBookOpen className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">ניהול מאמרים</h3>
                    <p className="text-sm text-gray-600">הוספה ועריכה של מאמרי הבלוג</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
        break;

      case 'users':
        return (
          <div className="users-container" style={{
            backgroundColor: 'var(--card-bg)',
            borderRadius: '1rem',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)',
            overflow: 'hidden',
            border: '1px solid rgba(229, 231, 235, 0.5)',
            padding: '1.75rem',
            position: 'relative'
          }}>
            {/* Error Display */}
            {profilesError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-3 space-x-reverse">
                  <FiAlertCircle className="h-5 w-5 text-red-500" />
                  <div className="flex-1">
                    <p className="text-sm text-red-800">{profilesError}</p>
                  </div>
                  <button
                    onClick={fetchProfiles}
                    className="btn btn-sm btn-outline"
                    style={{ borderColor: '#dc2626', color: '#dc2626' }}
                  >
                    נסה שוב
                  </button>
                </div>
              </div>
            )}

            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">כל המשתמשים</h3>
                  <p className="text-sm text-gray-500">לחץ על שורה כלשהי כדי לראות פרטים מלאים</p>
                </div>
                <div className="relative flex-1 max-w-md">
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <FiSearch className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="חיפוש משתמשים..."
                    className="input-field w-full pr-10 pl-4 py-2 text-right"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>

          {loading ? (
            <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-gray-500">טוען משתמשים...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <div className="max-w-7xl mx-auto">
                <table className="w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-40">
                      משתמש
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-56">
                      פרטי קשר
                    </th>
                    <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                      מנוי
                    </th>
                    <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                      הערכות בשימוש/סה"כ
                    </th>
                    <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                      מיקום
                    </th>
                    <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                      עיסוק
                    </th>
                    <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-28">
                      תאריך הצטרפות
                    </th>
                    <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                      פעולות
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredProfiles.map((profile) => (
                    <tr 
                      key={profile.id} 
                      className="hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => handleProfileClick(profile)}
                    >
                                            <td className="px-6 py-4 whitespace-nowrap w-40">
                        <div className="flex items-center space-x-3 space-x-reverse">
                          <div className="w-8 h-8 bg-gradient-to-r from-primary to-primary-dark rounded-full flex items-center justify-center overflow-hidden">
                            {(profile.avatar_url ? (
                              <img 
                                src={profile.avatar_url} 
                                alt={profile.full_name || 'User'} 
                                className="w-full h-full object-cover" />
                              ) : (
                                <FiUsers className="h-4 w-4 text-white" />
                              ))}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {profile.full_name || 'משתמש ללא שם'}
                            </div>
                            {profile.age && (
                              <div className="text-sm text-gray-500">{profile.age} שנים</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap w-56">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <FiMail className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-900">{profile.email}</span>
                          </div>
                          {profile.mobile_phone && (
                            <div className="flex items-center space-x-2 space-x-reverse">
                              <FiPhone className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-900">{profile.mobile_phone}</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap w-20">
                        <div 
                          className="flex items-center space-x-1 space-x-reverse cursor-pointer hover:bg-blue-50 p-1 rounded-lg transition-all duration-200 group border border-transparent hover:border-blue-200"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSubscriptionClick(profile);
                          }}
                          title="לחץ לעריכת המנוי"
                        >
                          <FiUser className="h-3 w-3 text-gray-400 group-hover:text-blue-500" />
                          <span className={`text-xs font-medium group-hover:text-blue-700 ${getSubscriptionColor(profile.subscription)}`}>
                            {profile.subscription}
                          </span>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <FiEdit className="h-2 w-2 text-blue-500" />
                            <span className="text-xs text-blue-500 font-medium">ערוך</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap w-24">
                        <div className="flex items-center space-x-1 space-x-reverse">
                          <FiBarChart className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-900">
                            {formatAssessmentUsage(profile)}
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap w-24">
                        {profile.location ? (
                          <div className="flex items-center space-x-1 space-x-reverse">
                            <FiMapPin className="h-3 w-3 text-gray-400" />
                            <span className="text-xs text-gray-900">{profile.location}</span>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">לא צוין</span>
                        )}
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap w-24">
                        {profile.occupation ? (
                          <span className="text-xs text-gray-900">{profile.occupation}</span>
                        ) : (
                          <span className="text-xs text-gray-400">לא צוין</span>
                        )}
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap w-28">
                        <div className="flex items-center space-x-1 space-x-reverse">
                          <FiCalendar className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-900">{formatDate(profile.created_at)}</span>
                        </div>
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm font-medium w-20">
                        <div className="flex space-x-1 space-x-reverse">
                          <button 
                            className="btn btn-sm btn-primary p-1 rounded-lg transition-all duration-300 hover:scale-110 transform hover:-translate-y-0.5"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleProfileClick(profile);
                            }}
                          >
                            <FiEye className="h-3 w-3" />
                          </button>
                          <button 
                            className="btn btn-sm btn-outline p-1 rounded-lg transition-all duration-300 hover:scale-110 transform hover:-translate-y-0.5"
                            style={{ borderColor: '#10b981', color: '#10b981' }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditUser(profile);
                            }}
                          >
                            <FiEdit className="h-3 w-3" />
                          </button>
                          <button 
                            className="btn btn-sm btn-outline p-1 rounded-lg transition-all duration-300 hover:scale-110 transform hover:-translate-y-0.5"
                            style={{ borderColor: '#ef4444', color: '#ef4444' }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteUser(profile);
                            }}
                          >
                            <FiTrash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
                </div>
              </div>
          )}

          {!loading && filteredProfiles.length === 0 && (
            <div className="p-8 text-center">
              <FiUsers className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">לא נמצאו משתמשים</p>
            </div>
          )}
        </div>
        );
        break;

      case 'assessments':
         return (
           <div className="users-container" style={{
             backgroundColor: 'var(--card-bg)',
             borderRadius: '1rem',
             boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)',
             overflow: 'hidden',
             border: '1px solid rgba(229, 231, 235, 0.5)',
             padding: '1.75rem',
             position: 'relative'
           }}>
             {/* Error Display */}
             {assessmentsError && (
               <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                 <div className="flex items-center space-x-3 space-x-reverse">
                   <FiAlertCircle className="h-5 w-5 text-red-500" />
                   <div className="flex-1">
                     <p className="text-sm text-red-800">{assessmentsError}</p>
                   </div>
                   <button
                     onClick={fetchAssessments}
                     className="btn btn-sm btn-outline"
                     style={{ borderColor: '#dc2626', color: '#dc2626' }}
                   >
                     נסה שוב
                   </button>
                 </div>
               </div>
             )}

             <div className="px-6 py-4 border-b border-gray-200">
               <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                 <div>
                   <h3 className="text-lg font-semibold text-gray-900">כל ההערכות</h3>
                   <p className="text-sm text-gray-500">מעקב אחר כל ההערכות במערכת</p>
                 </div>
                 <div className="relative flex-1 max-w-md">
                   <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                     <FiSearch className="h-5 w-5 text-gray-400" />
                </div>
                   <input
                     type="text"
                     placeholder="חיפוש הערכות..."
                     className="input-field w-full pr-10 pl-4 py-2 text-right"
                     value={assessmentSearchTerm}
                     onChange={(e) => setAssessmentSearchTerm(e.target.value)}
                   />
                </div>
              </div>
            </div>

             {assessmentsLoading ? (
               <div className="p-8 text-center">
                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                 <p className="mt-2 text-gray-500">טוען הערכות...</p>
               </div>
             ) : (
               <div className="overflow-x-auto">
                 <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">הערכות</h2>
                <div className="text-sm text-gray-600">
                  מציג {filteredAssessments.length} מתוך {assessments.length} הערכות
                </div>
              </div>
                 <table className="w-full divide-y divide-gray-200">
                   <thead className="bg-gray-50">
                     <tr>
                       <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                         עסק
                       </th>
                       <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                         משתמש
                       </th>
                       <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                         סטטוס
                       </th>
                       <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                         תאריך יצירה
                       </th>
                       <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                         תאריך עדכון
                       </th>
                       <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                         פעולות
                       </th>
                     </tr>
                   </thead>
                   <tbody className="bg-white divide-y divide-gray-200">
                     {filteredAssessments.map((assessment) => (
                       <tr 
                         key={assessment.id} 
                         className="hover:bg-gray-50 transition-colors"
                       >
                         <td className="px-6 py-4 whitespace-nowrap">
                           <div>
                             <div className="text-sm font-medium text-gray-900">
                               {assessment.business_name}
                             </div>
                             {assessment.summary && (
                               <div className="text-sm text-gray-500 truncate max-w-xs">
                                 {assessment.summary}
                               </div>
                             )}
                           </div>
                         </td>
                         <td className="px-6 py-4 whitespace-nowrap">
                           <div className="flex items-center space-x-3 space-x-reverse">
                             <div className="w-8 h-8 bg-gradient-to-r from-primary to-primary-dark rounded-full flex items-center justify-center overflow-hidden">
                               {assessment.profiles?.avatar_url ? (
                                 <img 
                                   src={assessment.profiles.avatar_url} 
                                   alt={assessment.profiles.full_name || 'User'} 
                                   className="w-full h-full object-cover"
                                 />
                               ) : (
                                 <FiUsers className="h-4 w-4 text-white" />
                               )}
              </div>
              <div>
                               <div className="text-sm font-medium text-gray-900">
                                 {assessment.profiles?.full_name || 'משתמש ללא שם'}
                               </div>
                               <div className="text-sm text-gray-500">
                                 {assessment.profiles?.email}
              </div>
            </div>
          </div>
                         </td>
                         <td className="px-6 py-4 whitespace-nowrap">
                           <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(assessment.status)}`}>
                             {getStatusText(assessment.status)}
                           </span>
                         </td>
                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                           {formatDateTime(assessment.created_at)}
                         </td>
                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                           {formatDateTime(assessment.updated_at)}
                         </td>
                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                           <div className="flex space-x-2 space-x-reverse">
                             <button 
                               onClick={() => handleViewAssessment(assessment)}
                               className="btn btn-sm btn-primary p-2 rounded-lg transition-all duration-300 hover:scale-110 transform hover:-translate-y-0.5"
                               title="צפייה בהערכה"
                             >
                               <FiEye className="h-4 w-4" />
                             </button>
                             {assessment.report_url && (
                               <button 
                                 className="btn btn-sm btn-outline p-2 rounded-lg transition-all duration-300 hover:scale-110 transform hover:-translate-y-0.5"
                                 style={{ borderColor: '#10b981', color: '#10b981' }}
                                 title="הורדת דוח"
                               >
                                 <FiFileText className="h-4 w-4" />
                               </button>
                             )}
                             <button 
                               onClick={() => handleDeleteAssessment(assessment)}
                               className="btn btn-sm btn-outline p-2 rounded-lg transition-all duration-300 hover:scale-110 transform hover:-translate-y-0.5"
                               style={{ borderColor: '#ef4444', color: '#ef4444' }}
                               title="מחיקת הערכה"
                             >
                               <FiTrash2 className="h-4 w-4" />
                             </button>
                           </div>
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
             )}

             {!assessmentsLoading && filteredAssessments.length === 0 && (
               <div className="p-8 text-center">
                 {assessments.length === 0 ? (
                   <>
                     <FiFileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                     <p className="text-gray-500">לא נמצאו הערכות במערכת</p>
                   </>
                 ) : (
                   <>
                     <FiSearch className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                     <p className="text-gray-500">לא נמצאו הערכות התואמות לחיפוש</p>
                     <p className="text-sm text-gray-400 mt-2">נסה לשנות את מונחי החיפוש</p>
                   </>
                 )}
               </div>
             )}
           </div>
         );
        break;

      case 'pages':
        return (
          <div className="pages-container" style={{
            backgroundColor: 'var(--card-bg)',
            borderRadius: '1rem',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)',
            overflow: 'hidden',
            border: '1px solid rgba(229, 231, 235, 0.5)',
            padding: '1.75rem',
            position: 'relative'
          }}>
            {/* Error Display */}
            {pagesError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-3 space-x-reverse">
                  <FiAlertCircle className="h-5 w-5 text-red-500" />
                  <div className="flex-1">
                    <p className="text-sm text-red-800">{pagesError}</p>
                  </div>
                  <button
                    onClick={fetchPages}
                    className="btn btn-sm btn-outline"
                    style={{ borderColor: '#dc2626', color: '#dc2626' }}
                  >
                    נסה שוב
                  </button>
                </div>
              </div>
            )}

            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">כל הדפים</h3>
                  <p className="text-sm text-gray-500">לחץ על שורה כלשהי כדי לראות פרטים מלאים</p>
                </div>
                <div className="flex items-center space-x-4 space-x-reverse">
                  <div className="relative flex-1 max-w-md">
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <FiSearch className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="חיפוש דפים..."
                      className="input-field w-full pr-10 pl-4 py-2 text-right"
                      value={pageSearchTerm}
                      onChange={(e) => setPageSearchTerm(e.target.value)}
                    />
                  </div>

                  <button
                    onClick={() => setIsAddPageModalOpen(true)}
                    className="btn btn-primary px-4 py-2 text-sm font-medium"
                  >
                    <FiFile className="h-4 w-4 ml-2" />
                    הוסף דף חדש
                  </button>
                </div>
              </div>
            </div>

            {pagesLoading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="mt-2 text-gray-500">טוען דפים...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                        כותרת
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                        כתובת
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                        תיאור מטא
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                        סטטוס
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                        תאריך יצירה
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                        פעולות
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredPages.map((page) => {
                      const normalizeBool = (val: any) => val === true || val === 'true' || val === 1 || val === '1';
                      const isPublished = normalizeBool(page.is_published);
                      return (
                      <tr
                        key={page.id}
                        className="hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => handleViewPage(page)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{page.title}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">/{page.slug}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 max-w-xs truncate">
                            {page.meta_description || 'אין תיאור'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            isPublished ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {isPublished ? 'מפורסם' : 'בטיוטא'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{formatDate(page.created_at)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditPage(page);
                              }}
                              className="text-indigo-600 hover:text-indigo-900"
                              title="ערוך דף"
                            >
                              <FiEdit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeletePage(page);
                              }}
                              className="text-red-600 hover:text-red-900"
                              title="מחק דף"
                            >
                              <FiTrash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {!pagesLoading && filteredPages.length === 0 && (
              <div className="p-8 text-center">
                {pages.length === 0 ? (
                  <>
                    <FiFile className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">לא נמצאו דפים במערכת</p>
                    <button
                      onClick={() => setIsAddPageModalOpen(true)}
                      className="btn btn-primary mt-4"
                    >
                      צור דף ראשון
                    </button>
                  </>
                ) : (
                  <>
                    <FiSearch className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">לא נמצאו דפים התואמים לחיפוש</p>
                    <p className="text-sm text-gray-400 mt-2">נסה לשנות את מונחי החיפוש</p>
                  </>
                )}
              </div>
            )}
          </div>
        );

      case 'articles':
        return (
          <div className="card p-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">ניהול מאמרי הבלוג</h3>
            <p className="text-gray-500">כאן תוכל להוסיף ולערוך מאמרים לבלוג האתר...</p>
          </div>
        );

      default:
        return null;
    }
  };



  return (
         <AdminLayout>
      <style jsx>{`
        .admin-header {
          background: linear-gradient(to right, #2563eb, #1d4ed8) !important;
        }
        
        .profile-image-container {
          width: 32px !important;
          height: 32px !important;
          overflow: hidden !important;
        }
        
        .profile-image {
          width: 100% !important;
          height: 100% !important;
          object-fit: cover !important;
          max-width: 32px !important;
          max-height: 32px !important;
        }

        .admin-tabs-container {
          background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
          border-bottom: 1px solid rgba(229, 231, 235, 0.8);
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
        }

                 .admin-tab {
           position: relative;
           transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
           padding: 1rem 1.5rem;
           border-radius: 0.75rem 0.75rem 0 0;
           margin-bottom: -1px;
           font-weight: 500;
           letter-spacing: 0.025em;
           cursor: pointer;
         }

        .admin-tab::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(37, 99, 235, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%);
          border-radius: 0.75rem 0.75rem 0 0;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .admin-tab:hover::before {
          opacity: 1;
        }

        .admin-tab.active {
          color: var(--primary);
          background: white;
          border: 1px solid rgba(229, 231, 235, 0.8);
          border-bottom-color: white;
          box-shadow: 0 -4px 6px -1px rgba(0, 0, 0, 0.05);
        }

        .admin-tab.active::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, var(--primary) 0%, var(--secondary) 100%);
          border-radius: 2px 2px 0 0;
        }

        .admin-tab:not(.active) {
          color: #6b7280;
          background: transparent;
          border: 1px solid transparent;
        }

        .admin-tab:not(.active):hover {
          color: var(--primary);
          background: rgba(37, 99, 235, 0.05);
          border-color: rgba(229, 231, 235, 0.8);
          border-bottom-color: transparent;
        }

        .admin-tab-icon {
          transition: all 0.3s ease;
        }

        .admin-tab.active .admin-tab-icon {
          transform: scale(1.1);
          color: var(--primary);
        }

        .admin-tab:hover .admin-tab-icon {
          transform: scale(1.05);
        }

        .admin-tab-badge {
          position: absolute;
          top: 0.5rem;
          right: 0.5rem;
          width: 0.5rem;
          height: 0.5rem;
          background: var(--primary);
          border-radius: 50%;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

                 .admin-tab.active .admin-tab-badge {
           opacity: 1;
         }

                   .users-container {
            transform: none !important;
          }

          .users-container:hover {
            transform: none !important;
          }
       `}</style>

      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">לוח בקרה</h1>
            <p className="text-gray-600">ניהול משתמשים, הערכות ודפים</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">{adminEmail}</p>
            <p className="text-xs text-gray-500">מנהל</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="admin-tabs-container">
        <div className="container mx-auto px-4">
          <div className="flex space-x-1 space-x-reverse">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`admin-tab flex items-center space-x-2 space-x-reverse font-medium text-sm ${
                    activeTab === tab.id ? 'active' : ''
                  }`}
                >
                  <div className="admin-tab-badge"></div>
                  <Icon className="h-5 w-5 admin-tab-icon" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="container mx-auto px-4 py-8">
        {renderTabContent()}
      </div>

      {/* Profile Detail Modal */}
      <ProfileDetailModal
        profile={selectedProfile}
        isOpen={isModalOpen}
        onClose={closeModal}
      />

      {/* Edit User Modal */}
      <EditUserModal
        profile={editingProfile}
        isOpen={isEditUserModalOpen}
        onClose={() => {
          setIsEditUserModalOpen(false);
          setEditingProfile(null);
        }}
        onSave={handleSaveUser}
      />

      {/* Subscription Update Modal */}
      <SubscriptionUpdateModal
        profile={editingProfile}
        isOpen={isSubscriptionModalOpen}
        onClose={() => {
          setIsSubscriptionModalOpen(false);
          setEditingProfile(null);
        }}
        onSave={handleSaveUser}
      />

      {/* Success Modal */}
      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        title={successMessage.title}
        message={successMessage.message}
      />

      {/* Confirm Modal */}
      {confirmModalData && (
        <ConfirmModal
          isOpen={isConfirmModalOpen}
          onClose={() => {
            setIsConfirmModalOpen(false);
            setConfirmModalData(null);
          }}
          onConfirm={confirmModalData.onConfirm}
          title={confirmModalData.title}
          message={confirmModalData.message}
          isDestructive={confirmModalData.isDestructive}
        />
      )}

      {/* Assessment Detail Modal */}
      <AssessmentDetailModal
        assessment={selectedAssessment}
        isOpen={isAssessmentModalOpen}
        onClose={closeAssessmentModal}
      />

      {/* Page Detail Modal */}
      <PageDetailModal
        page={selectedPage}
        isOpen={isPageModalOpen}
        onClose={closePageModal}
        onSave={handleSavePage}
        onDelete={(pageId: string) => {
          const page = pages.find(p => p.id === pageId);
          if (page) {
            handleDeletePage(page);
          }
        }}
        startInEditMode={openPageModalInEditMode}
      />

      {/* Add Page Modal */}
      <AddPageModal
        isOpen={isAddPageModalOpen}
        onClose={closeAddPageModal}
        onSave={handleAddPage}
      />


    </AdminLayout>
  );
};

export default AdminDashboard; 