export interface AssessmentData {
  id: string;
  section: string;
  data: any;
  created_at: string;
  updated_at: string;
}

export interface File {
  id: string;
  file_name: string;
  file_url: string;
  file_type: string;
  file_size: number;
  file_category: string;
  created_at: string;
}

export interface Profile {
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
  assessments_used_this_year: number;
  last_assessment_reset_date: string;
  created_at: string;
  updated_at: string;
}

export interface Assessment {
  id: string;
  user_id: string;
  business_name: string;
  status: string;
  summary: string | null;
  report_url: string | null;
  created_at: string;
  updated_at: string;
  profiles: Profile;
  assessment_data?: AssessmentData[];
  files?: File[];
}

export interface Page {
  id: string;
  title: string;
  slug: string;
  content: string;
  meta_description?: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}
