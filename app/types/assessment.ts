export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
}

export interface PersonalDetails {
  full_name: string;
  age: number;
  location: string;
  marital_status: 'single' | 'married' | 'divorced' | 'widowed';
  occupation: string;
  self_introduction: string;
}

export interface PersonalQuestionnaire {
  life_experience: string;
  strengths: string;
  weaknesses: string;
  purchase_expectations: string;
  motivation: string;
  required_funding: number;
  financial_capability: {
    assets_count: number;
    liquid_capital: number;
    available_funds_from_others: number;
    existing_loans: number;
  };
  five_year_goal: string;
}

export interface BusinessDetails {
  business_name: string;
  business_field: string;
  business_type: string;
  legal_status: string;
  establishment_date: string;
  employee_count: number;
  store_area: number;
  operating_hours: string;
  real_estate_availability: string;
  monthly_rent: number;
  contract_end_date: string;
  evacuation_fee: number;
  has_lawsuits: boolean;
  lawsuits_details?: string;
  selling_reason: string;
  is_active: boolean;
  is_relocatable: boolean;
  is_franchise: boolean;
}

export interface FinancialData {
  asking_price: number;
  annual_turnover: number;
  operating_profit: number;
  net_profit: number;
  roi: string;
  payment_details: string;
  inventory_value: number;
  equipment_value: number;
  employees_salary: number;
  expenses_file?: string;
}

export interface SwotAnalysis {
  strengths: string;
  weaknesses: string;
  opportunities: string;
  threats: string;
}

export interface AdditionalFiles {
  financial_reports?: string[];
  contracts?: string[];
  other_documents?: string[];
}

export interface Assessment {
  id?: string;
  user_id: string;
  business_name?: string;
  status: 'draft' | 'completed' | 'analyzed';
  summary?: string;
  report_url?: string;
  created_at?: string;
  updated_at?: string;
  full_name?: string;
  age?: string;
  location?: string;
  marital_status?: string;
  occupation?: string;
  self_introduction?: string;
  // Personal questionnaire
  life_experience?: string;
  strengths?: string;
  weaknesses?: string;
  expectations?: string;
  motivation?: string;
  funding?: string;
  financial_capability?: string;
  five_year_goals?: string;
  // Business details
  business_field?: string;
  business_type?: string;
  legal_status?: string;
  establishment_date?: string;
  employees_count?: number;
  area?: string;
  operating_days?: string;
  real_estate?: string;
  rent_details?: string;
  contracts?: string;
  claims_obligations?: string;
  sale_reason?: string;
  // Financial data
  asking_price?: number;
  annual_revenue?: number;
  operating_profit?: number;
  net_profit?: number;
  roi?: number;
  payment_details?: string;
  inventory_value?: number;
  equipment_value?: number;
  salary_expenses?: number;
  // SWOT
  threats?: string;
  opportunities?: string;
} 