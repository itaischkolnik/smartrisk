import { useAuth } from '../contexts/AuthContext';
import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';

export interface AssessmentPermissions {
  canCreateAssessment: boolean;
  canUploadFiles: boolean;
  assessmentsRemaining: number;
  maxAssessments: number;
  subscription: string;
  isLoading: boolean;
}

export const useAssessmentPermissions = (): AssessmentPermissions => {
  const { user } = useAuth();
  const [permissions, setPermissions] = useState<AssessmentPermissions>({
    canCreateAssessment: false,
    canUploadFiles: false,
    assessmentsRemaining: 0,
    maxAssessments: 0,
    subscription: 'חינם',
    isLoading: true,
  });

  useEffect(() => {
    if (!user) {
      setPermissions(prev => ({ ...prev, isLoading: false }));
      return;
    }

    const fetchProfile = async () => {
      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('subscription, assessments_used_this_year')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching profile:', error);
          setPermissions(prev => ({ ...prev, isLoading: false }));
          return;
        }

        const subscription = profile?.subscription || 'חינם';
        const assessmentsUsed = profile?.assessments_used_this_year || 0;
        
        let maxAssessments = 0;
        let canCreate = false;
        let canUpload = false;

        switch (subscription) {
          case 'חינם':
            maxAssessments = 999; // Unlimited assessments for free users
            canCreate = true; // Free users can create assessments
            canUpload = false; // But cannot upload files
            break;
          case 'יזם':
            maxAssessments = 1;
            canCreate = assessmentsUsed < 1;
            canUpload = true;
            break;
          case 'איש עסקים':
            maxAssessments = 18;
            canCreate = assessmentsUsed < 18;
            canUpload = true;
            break;
          case 'מקצועי':
            maxAssessments = 36;
            canCreate = assessmentsUsed < 36;
            canUpload = true;
            break;
          default:
            maxAssessments = 999; // Default to unlimited for free users
            canCreate = true;
            canUpload = false;
        }

        setPermissions({
          canCreateAssessment: canCreate,
          canUploadFiles: canUpload,
          assessmentsRemaining: Math.max(0, maxAssessments - assessmentsUsed),
          maxAssessments,
          subscription,
          isLoading: false,
        });
      } catch (error) {
        console.error('Error in fetchProfile:', error);
        setPermissions(prev => ({ ...prev, isLoading: false }));
      }
    };

    fetchProfile();
  }, [user]);

  return permissions;
};
