// Field labels mapping from database field names to Hebrew labels
export const fieldLabels: Record<string, string> = {
  // Personal Details
  full_name: 'שם מלא',
  age: 'גיל',
  location: 'אזור מגורים',
  marital_status: 'מצב משפחתי',
  mobile_phone: 'טלפון נייד',
  occupation: 'עיסוק נוכחי',
  self_introduction: 'הצגה עצמית',

  // Personal Questionnaire
  life_experience: 'ניסיון חיים',
  strengths: 'חוזקות',
  weaknesses: 'חולשות',
  expectations: 'ציפיות',
  motivation: 'מוטיבציה',
  funding: 'מימון',
  financial_capability: 'יכולת כלכלית',
  five_year_goals: 'מטרות ל-5 שנים',

  // Business Details
  business_name: 'שם העסק',
  business_type: 'סוג עסק',
  industry: 'תחום פעילות',
  legal_status: 'סטטוס משפטי',
  establishment_date: 'תאריך הקמה',
  employees_count: 'מספר עובדים',
  employee_count: 'מספר עובדים',
  business_structure: 'סטטוס משפטי',
  business_location: 'מיקום העסק',
  city: 'עיר',
  business_area: 'אזור העסק',
  area: 'אזור',
  operating_days: 'ימי פעילות',
  operating_hours: 'שעות פעילות',
  real_estate: 'נדל"ן',
  real_estate_availability: 'זמינות נדל"ן',
  rent_details: 'פרטי שכירות',
  rental_details: 'פרטי שכירות',
  has_rental_property: 'האם יש נכס להשכרה',
  rental_end_date: 'תאריך סיום שכירות',
  has_renewal_option: 'האם יש אופציה לחידוש',
  renewal_duration: 'משך חידוש',
  monthly_rent: 'שכירות חודשית',
  rental_deposit_cost: 'עלות פיקדון שכירות',
  contracts: 'חוזים',
  claims_obligations: 'תביעות והתחייבויות',
  sale_reason: 'סיבת מכירה',
  legal_issues: 'בעיות משפטיות',
  additional_notes: 'הערות נוספות',
  owner_phone: 'טלפון בעלים',
  property_details: 'פרטי הנכס',
  can_relocate: 'האם ניתן להעביר',
  can_be_relocated: 'האם ניתן להעביר',
  is_franchise: 'האם זה זיכיון',
  licenses_permits: 'רישיונות והיתרים',
  other_license_details: 'פרטי רישיון נוספים',
  seller_offers_support: 'האם המוכר מציע תמיכה',
  support_duration: 'משך התמיכה',

  // Financial Data
  asking_price: 'מחיר מבוקש',
  operating_profit: 'ממוצע מחזור שנתי',
  net_profit: 'רווח נקי',
  roi: 'תשואה על השקעה',
  payment_details: 'פרטי תשלום',
  inventory_value: 'שווי מלאי',
  equipment_value: 'שווי ציוד',
  salary_expenses: 'הוצאות שכר',
  average_business_profit: 'ממוצע שנתי של רווח העסק',
  average_owner_salary: 'ממוצע שנתי משכורת בעלים',
  is_inventory_included_in_price: 'האם המלאי כלול במחיר המבוקש',
  inventory_value_in_price: 'שווי המלאי במחיר',
  are_all_debts_paid: 'האם כל החובות שולמו',
  has_legal_claims: 'האם יש תביעות משפטיות',

  // Additional financial fields that might appear
  debt_details: 'נא לפרט',
  payment_terms: 'תנאי תשלום',
  financial_notes: 'הערות פיננסיות נוספות',
  monthly_expenses: 'הוצאות תפעול חודשיות',
  monthly_salary_expenses: 'הוצאות שכר חודשיות',
  additional_payment_details: 'איך הלקוחות משלמים',
  legal_claims_details: 'נא לפרט',

  // SWOT Analysis
  threats: 'איומים',
  opportunities: 'הזדמנויות',

  // File Upload
  profit_loss_year_a: 'דוח רווח והפסד - שנה א\'',
  profit_loss_year_b: 'דוח רווח והפסד - שנה ב\'',
  profit_loss_year_c: 'דוח רווח והפסד - שנה ג\'',
  form_11: 'טופס י״א (טופס פחת)',
  form_126: 'טופס 126 (תמחיר משכורות)',

  // Additional fields that might appear
  status: 'סטטוס',
  created_at: 'תאריך יצירה',
  updated_at: 'תאריך עדכון',
  summary: 'סיכום',
  report_url: 'קישור לדוח',
  user_id: 'מזהה משתמש',
  assessment_id: 'מזהה הערכה',
  file_name: 'שם קובץ',
  file_size: 'גודל קובץ',
  file_url: 'קישור לקובץ'
};

// Value translations for specific field values
export const valueLabels: Record<string, Record<string, string>> = {
  legal_status: {
    'sole_proprietorship': 'עוסק מורשה',
    'partnership': 'שותפות',
    'limited_company': 'חברה בע״מ',
    'public_company': 'חברה ציבורית',
    'other': 'אחר'
  },
  business_type: {
    'retail': 'קמעונאות',
    'restaurant': 'מסעדנות',
    'service': 'שירותים',
    'manufacturing': 'ייצור',
    'tech': 'טכנולוגיה',
    'other': 'אחר'
  },
  marital_status: {
    'single': 'רווק/ה',
    'married': 'נשוי/אה',
    'divorced': 'גרוש/ה',
    'widowed': 'אלמן/ה',
    'separated': 'מופרד/ת'
  },
  occupation: {
    'employee': 'עובד/ת שכיר/ה',
    'self-employed': 'עצמאי/ת',
    'business owner': 'בעל/ת עסק',
    'freelancer': 'פרילנסר/ית',
    'student': 'סטודנט/ית',
    'unemployed': 'מובטל/ת',
    'retired': 'פנסיונר/ית'
  },
  financial_capability: {
    'low': 'נמוך',
    'medium': 'בינוני',
    'high': 'גבוה',
    'very high': 'גבוה מאוד'
  }
};

// Function to get Hebrew label for a field
export const getFieldLabel = (fieldName: string): string => {
  return fieldLabels[fieldName] || fieldName.replace(/_/g, ' ');
};

// Function to get Hebrew label for a field value
export const getValueLabel = (fieldName: string, value: string): string => {
  if (!value) return '';
  
  const fieldValues = valueLabels[fieldName];
  if (fieldValues && fieldValues[value]) {
    return fieldValues[value];
  }
  
  return value;
};

// Function to get Hebrew label for a section
export const getSectionLabel = (sectionName: string): string => {
  const sectionLabels: Record<string, string> = {
    personal_details: 'פרטים אישיים',
    personal_questionnaire: 'שאלון אישי',
    business_details: 'פרטי העסק',
    financial_data: 'נתונים כספיים',
    swot_analysis: 'ניתוח SWOT',
    file_upload: 'העלאת קבצים'
  };

  return sectionLabels[sectionName] || sectionName.replace(/_/g, ' ');
};
