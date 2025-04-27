import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { PostgrestError, User } from '@supabase/supabase-js';
import { Assessment } from '../types/assessment';

// Create a single instance of the Supabase client with proper configuration
const supabase = createClientComponentClient();

// Business type translations
const businessTypeTranslations: Record<string, string> = {
  'retail': 'קמעונאות',
  'restaurant': 'מסעדנות',
  'service': 'שירותים',
  'manufacturing': 'ייצור',
  'tech': 'טכנולוגיה',
  'other': 'אחר'
};

// Helper function to ensure authenticated client
const getAuthenticatedClient = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  
  if (!session) {
    throw new Error('No authenticated session');
  }
  
  return supabase;
};

// Fetch user's assessments
export async function getUserAssessments(userId: string) {
  try {
    const client = await getAuthenticatedClient();
    
    // First get all assessments
    const { data: assessments, error: assessmentsError } = await client
      .from('assessments')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (assessmentsError) throw assessmentsError;

    // For each assessment, get its business details section
    const assessmentsWithDetails = await Promise.all((assessments || []).map(async (assessment) => {
      const { data: sectionData, error: sectionsError } = await client
        .from('assessment_data')
        .select('data')
        .eq('assessment_id', assessment.id)
        .eq('section', 'business_details')
        .maybeSingle();

      if (sectionsError) {
        console.error('Error fetching business details for assessment:', assessment.id, sectionsError);
        return assessment;
      }

      const businessDetails = sectionData?.data || {};
      const businessType = businessDetails.business_type || 'other';
      
      // Merge the business details with the assessment
      return {
        ...assessment,
        business_name: businessDetails.business_name || assessment.business_name || 'עסק ללא שם',
        business_type: businessTypeTranslations[businessType] || 'לא צוין',
        business_field: businessDetails.business_field || 'לא צוין'
      };
    }));

    return { assessments: assessmentsWithDetails as Assessment[] | null, error: null };
  } catch (error) {
    console.error('Error fetching assessments:', error);
    return { assessments: null, error: error as Error };
  }
}

// Get single assessment by ID
export async function getAssessment(id: string) {
  try {
    const client = await getAuthenticatedClient();
    const { data, error } = await client
      .from('assessments')
      .select('*')
      .eq('id', id)
      .single();

    return { assessment: data as Assessment | null, error };
  } catch (error) {
    console.error('Error fetching assessment:', error);
    return { assessment: null, error: error as Error };
  }
}

// Create or update assessment
export async function saveAssessment(assessment: Partial<Assessment>, user: User) {
  try {
    if (!assessment) {
      throw new Error('Assessment data is required');
    }

    const client = await getAuthenticatedClient();
    const now = new Date().toISOString();
    
    // Create a valid assessment object that matches the schema exactly
    const validAssessment = {
      user_id: user.id,
      business_name: assessment.business_name || '',
      status: assessment.status || 'draft',
      summary: assessment.summary || '',
      report_url: assessment.report_url || '',
      updated_at: now,
    };

    try {
      // If we have an ID, try to update existing assessment
      if (assessment.id) {
        const { data: existingAssessment, error: checkError } = await client
          .from('assessments')
          .select('id, created_at')
          .eq('id', assessment.id)
          .eq('user_id', user.id)
          .single();

        // If there's an error checking or assessment doesn't exist
        if (checkError || !existingAssessment) {
          console.error('Error checking existing assessment:', checkError);
          return { 
            assessment: null, 
            error: new Error('Assessment not found or access denied') 
          };
        }

        // Update existing assessment
        const { data, error } = await client
          .from('assessments')
          .update({
            ...validAssessment,
            created_at: existingAssessment.created_at, // Keep original creation date
          })
          .eq('id', assessment.id)
          .eq('user_id', user.id)
          .select()
          .single();

        if (error) {
          console.error('Update error:', error);
          throw error;
        }
        return { assessment: data, error: null };
      }

      // Create new assessment
      const { data, error } = await client
        .from('assessments')
        .insert({
          ...validAssessment,
          created_at: now,
        })
        .select()
        .single();

      if (error) {
        console.error('Insert error:', error);
        throw error;
      }
      return { assessment: data, error: null };

    } catch (error) {
      console.error('Database operation failed:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error in saveAssessment:', error);
    return { 
      assessment: null, 
      error: error instanceof Error ? error : new Error('Failed to save assessment')
    };
  }
}

// Delete assessment
export async function deleteAssessment(id: string) {
  try {
    const { error } = await supabase
      .from('assessments')
      .delete()
      .eq('id', id);

    return { success: !error, error };
  } catch (error) {
    console.error('Error deleting assessment:', error);
    return { success: false, error: error as Error };
  }
}

// Submit assessment for analysis
export async function submitAssessmentForAnalysis(assessment: Assessment) {
  try {
    console.log('Starting assessment analysis submission...', { assessmentId: assessment.id });

    // First validate that we have all required sections
    const { data: sections, error: sectionsError } = await supabase
      .from('assessment_data')
      .select('*')
      .eq('assessment_id', assessment.id);

    if (sectionsError) {
      console.error('Error fetching assessment sections:', sectionsError);
      throw new Error('Failed to validate assessment sections');
    }

    const sectionMap = sections?.reduce((acc, section) => {
      acc[section.section] = section.data;
      return acc;
    }, {} as Record<string, any>) || {};

    // Validate required sections
    const requiredSections = ['business_details', 'swot_analysis', 'personal_questionnaire'];
    const missingSections = requiredSections.filter(section => !sectionMap[section]);
    
    if (missingSections.length > 0) {
      throw new Error(`Missing required sections: ${missingSections.join(', ')}`);
    }

    // Call the analyze API endpoint
    const response = await fetch(`/api/assessment/${assessment.id}/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Analysis API error:', {
        status: response.status,
        statusText: response.statusText,
        data
      });
      throw new Error(data.error || data.details || 'Failed to analyze assessment');
    }

    if (!data.success) {
      console.error('Analysis not successful:', data);
      throw new Error(data.error || 'Analysis was not successful');
    }

    return data;

  } catch (error) {
    console.error('Error submitting assessment for analysis:', error);
    throw error;
  }
}

interface AssessmentDataPayload {
  assessment_id: string;
  section: string;
  data: any;
  created_at: string;
  updated_at: string;
}

export const saveAssessmentData = async (data: AssessmentDataPayload) => {
  try {
    const client = await getAuthenticatedClient();
    
    // Check if section data already exists
    const { data: existingData, error: checkError } = await client
      .from('assessment_data')
      .select('id')
      .eq('assessment_id', data.assessment_id)
      .eq('section', data.section)
      .maybeSingle(); // Use maybeSingle instead of single to avoid 406 errors
      
    if (checkError) {
      throw checkError;
    }

    // Ensure data is properly formatted
    const formattedData = {
      assessment_id: data.assessment_id,
      section: data.section,
      data: data.data,
      created_at: data.created_at,
      updated_at: data.updated_at
    };

    if (existingData?.id) {
      // Update existing section
      const { error } = await client
        .from('assessment_data')
        .update({
          data: formattedData.data,
          updated_at: formattedData.updated_at
        })
        .eq('id', existingData.id);
        
      if (error) throw error;
    } else {
      // Insert new section
      const { error } = await client
        .from('assessment_data')
        .insert(formattedData);
        
      if (error) throw error;
    }

    return { success: true, error: null };
  } catch (error) {
    console.error('Error saving assessment data:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error : new Error('Failed to save assessment data')
    };
  }
};

interface AssessmentSection {
  id: string;
  assessment_id: string;
  section: string;
  data: any;
  created_at: string;
  updated_at: string;
}

export const getAssessmentData = async (assessmentId: string) => {
  try {
    const client = await getAuthenticatedClient();
    
    // Get the assessment
    const { data: assessment, error: assessmentError } = await client
      .from('assessments')
      .select('*')
      .eq('id', assessmentId)
      .single();
      
    if (assessmentError) {
      throw assessmentError;
    }
    
    // Get all sections data
    const { data: sections, error: sectionsError } = await client
      .from('assessment_data')
      .select('*')
      .eq('assessment_id', assessmentId);
      
    if (sectionsError) {
      throw sectionsError;
    }
    
    return { 
      assessment, 
      sections: sections as AssessmentSection[], 
      error: null 
    };
  } catch (error) {
    console.error('Error in getAssessmentData:', error);
    return { assessment: null, sections: null, error };
  }
}; 