import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { PostgrestError, User } from '@supabase/supabase-js';
import { Assessment } from '../types/assessment';
import { OpenAI } from 'openai';

// Create a single instance of the Supabase client with proper configuration
const supabase = createClientComponentClient();

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

// Initialize OpenAI with fallback for development
let openai: OpenAI;
try {
  // Check if OpenAI API key exists
  if (process.env.NEXT_PUBLIC_OPENAI_API_KEY && process.env.NEXT_PUBLIC_OPENAI_API_KEY.trim() !== '') {
    openai = new OpenAI({
      apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true, // Allow browser usage - this is OK for client-side features
    });
  } else {
    console.warn('OpenAI API key is missing - using mock implementation for development');
    // Create a mock OpenAI instance for development
    openai = {
      chat: {
        completions: {
          create: async () => {
            return {
              choices: [{
                message: {
                  content: "This is a mock OpenAI response for development purposes."
                }
              }]
            };
          }
        }
      }
    } as unknown as OpenAI;
  }
} catch (error) {
  console.error('Failed to initialize OpenAI:', error);
  // Create a mock OpenAI instance as fallback
  openai = {
    chat: {
      completions: {
        create: async () => {
          return {
            choices: [{
              message: {
                content: "This is a fallback mock OpenAI response."
              }
            }]
          };
        }
      }
    }
  } as unknown as OpenAI;
}

// Fetch user's assessments
export async function getUserAssessments(userId: string) {
  try {
    const client = await getAuthenticatedClient();
    const { data, error } = await client
      .from('assessments')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    return { assessments: data as Assessment[] | null, error };
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
    
    // If assessment has an ID, check if it exists first
    if (assessment.id) {
      // Check if assessment exists and belongs to user
      const { data: existingAssessment, error: checkError } = await client
        .from('assessments')
        .select('id')
        .eq('id', assessment.id)
        .eq('user_id', user.id)
        .single();

      if (checkError || !existingAssessment) {
        // If assessment doesn't exist or doesn't belong to user, create new one
        const { data, error } = await client
          .from('assessments')
          .insert({
            ...assessment,
            id: undefined, // Remove the ID to let Supabase generate a new one
            user_id: user.id,
            created_at: now,
            updated_at: now,
          })
          .select()
          .single();

        return { assessment: data as Assessment | null, error };
      }

      // If assessment exists and belongs to user, update it
      const { data, error } = await client
        .from('assessments')
        .update({
          ...assessment,
          updated_at: now,
        })
        .eq('id', assessment.id)
        .eq('user_id', user.id)
        .select()
        .single();

      return { assessment: data as Assessment | null, error };
    } 
    // If no ID provided, create new assessment
    else {
      const { data, error } = await client
        .from('assessments')
        .insert({
          ...assessment,
          user_id: user.id,
          created_at: now,
          updated_at: now,
        })
        .select()
        .single();

      return { assessment: data as Assessment | null, error };
    }
  } catch (error) {
    console.error('Error saving assessment:', error);
    return { 
      assessment: null, 
      error: error instanceof PostgrestError ? error : new Error('Failed to save assessment') 
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
    // First update status in database
    const { error: updateError } = await supabase
      .from('assessments')
      .update({
        status: 'processing',
        updated_at: new Date().toISOString(),
      })
      .eq('id', assessment.id);

    if (updateError) throw updateError;

    // Send to OpenAI for analysis
    const analysis = await analyzeAssessmentWithAI(assessment);

    // Generate PDF and save to storage
    const reportUrl = await generateAndSavePDF(assessment, analysis);

    // Update assessment with report URL and completed status
    const { error } = await supabase
      .from('assessments')
      .update({
        report_url: reportUrl,
        status: 'completed',
        updated_at: new Date().toISOString(),
      })
      .eq('id', assessment.id);

    if (error) throw error;

    // Send email with report
    await sendReportEmail(assessment, reportUrl);

    return { success: true };
  } catch (error) {
    console.error('Error submitting assessment for analysis:', error);
    
    // Update status to reflect error
    await supabase
      .from('assessments')
      .update({
        status: 'draft',
        updated_at: new Date().toISOString(),
      })
      .eq('id', assessment.id);
      
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

// Analyze assessment with OpenAI
export async function analyzeAssessmentWithAI(assessment: Assessment) {
  try {
    // Mock OpenAI integration for now
    // In a real implementation, you would call the OpenAI API here
    console.log('Analyzing assessment with OpenAI:', assessment.id);
    
    // Wait for 2 seconds to simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Return a mock analysis
    return `
      # ניתוח עסקי: ${assessment.business_name || 'העסק המוערך'}
      
      ## סיכום
      בהתבסס על הנתונים שסופקו, העסק מציג הזדמנות השקעה ${
        Math.random() > 0.5 ? 'מבטיחה' : 'בינונית'
      } עם יחס סיכון-תשואה סביר.
      
      ## חוזקות וחולשות
      * חוזקות: ${assessment.strengths || 'לא צוין'}
      * חולשות: ${assessment.weaknesses || 'לא צוין'}
      
      ## המלצות
      1. בדיקת נאותות מעמיקה של הנתונים הפיננסיים
      2. ניתוח מתחרים בשוק המקומי
      3. בחינת אפשרויות צמיחה
      
      ## ניתוח כדאיות
      מחיר מבוקש: ${assessment.asking_price || 'לא צוין'}
      החזר השקעה צפוי: ${assessment.roi || 'לא צוין'}
      
      הערכת סיכון כללית: בינונית
    `;
  } catch (error) {
    console.error('Error analyzing with OpenAI:', error);
    return null;
  }
}

// Generate PDF and save to storage
export async function generateAndSavePDF(assessment: Assessment, analysis: string | null) {
  try {
    // Mock PDF generation and storage for now
    // In a real implementation, you would generate a PDF and upload to storage
    console.log('Generating PDF for assessment:', assessment.id);
    
    // Wait for 1 second to simulate PDF generation
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Return a mock URL
    return `https://example.com/reports/${assessment.id}.pdf`;
  } catch (error) {
    console.error('Error generating PDF:', error);
    return null;
  }
}

// Send email with report
export async function sendReportEmail(assessment: Assessment, reportUrl: string | null) {
  try {
    if (!reportUrl) {
      console.error('Report URL is null, cannot send email');
      return false;
    }
    
    // Mock email sending for now
    console.log('Sending email for assessment:', assessment.id);
    console.log('Report URL:', reportUrl);
    
    // In a real implementation, you would send an email with the report URL
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
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