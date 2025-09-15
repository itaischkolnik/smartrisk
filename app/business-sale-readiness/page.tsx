'use client';

import React, { useState } from 'react';
import { FiCheckCircle, FiAlertCircle, FiTrendingUp, FiBarChart, FiTarget, FiAward } from 'react-icons/fi';

interface AssessmentForm {
  // פיננסים
  financial_statements: string;
  expense_separation: string;
  cash_flow: string;
  financing_ready: string;
  
  // תלות בבעלים
  owner_dependency: string;
  employee_management: string;
  written_procedures: string;
  
  // נכסים וידע
  physical_assets: string;
  intangible_assets: string;
  asset_management: string;
  
  // משפטי ורישוי
  contracts_updated: string;
  licenses: string;
  legal_risks: string;
  
  // שיווק ולקוחות
  loyal_customers: string;
  crm_data: string;
  marketing_plan: string;
  
  // נתונים ויכולת הצגה לרוכש
  ready_to_show: string;
  teaser_ready: string;
  kpis_available: string;
}

interface AnalysisResult {
  overall_score: number;
  category_scores: {
    financial: number;
    owner_dependency: number;
    assets: number;
    legal: number;
    marketing: number;
    presentation: number;
  };
  verbal_assessment: string;
  readiness_level: string;
  categoryAnalysis: {
    financial: string;
    owner_dependency: string;
    assets: string;
    legal: string;
    marketing: string;
    presentation: string;
  };
  recommendations: string[];
}

const BusinessSaleReadiness = () => {
  const [formData, setFormData] = useState<AssessmentForm>({
    financial_statements: '',
    expense_separation: '',
    cash_flow: '',
    financing_ready: '',
    owner_dependency: '',
    employee_management: '',
    written_procedures: '',
    physical_assets: '',
    intangible_assets: '',
    asset_management: '',
    contracts_updated: '',
    licenses: '',
    legal_risks: '',
    loyal_customers: '',
    crm_data: '',
    marketing_plan: '',
    ready_to_show: '',
    teaser_ready: '',
    kpis_available: ''
  });

  const [showResults, setShowResults] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  // Questions array for the questionnaire
  const questions = [
    { field: 'financial_statements', question: 'האם לעסק יש דוחות כספיים מסודרים לשלוש השנים האחרונות?', category: 'financial' },
    { field: 'expense_separation', question: 'האם קיימת הפרדה ברורה בין ההוצאות הפרטיות להוצאות העסק?', category: 'financial' },
    { field: 'cash_flow', question: 'האם לעסק תזרים מזומנים חיובי ויציב?', category: 'financial' },
    { field: 'financing_ready', question: 'האם העסק מדווח באופן שיכול לאפשר קבלת מימון מרוכש?', category: 'financial' },
    { field: 'owner_dependency', question: 'עד כמה העסק נשען עליך בניהול היומיומי?', category: 'dependency' },
    { field: 'employee_management', question: 'האם יש עובדים שיכולים להמשיך לנהל חלק מהפעילות?', category: 'dependency' },
    { field: 'written_procedures', question: 'האם קיימים נהלים כתובים לתהליכים המרכזיים בעסק?', category: 'dependency' },
    { field: 'physical_assets', question: 'האם העסק מחזיק בנכסים פיזיים משמעותיים (מלאי, ציוד, נדל״ן)?', category: 'assets' },
    { field: 'intangible_assets', question: 'האם יש לעסק נכסים בלתי מוחשיים (מותג, אתר, מוניטין)?', category: 'assets' },
    { field: 'asset_management', question: 'האם כל הנכסים רשומים ומנוהלים באופן ברור?', category: 'assets' },
    { field: 'contracts_updated', question: 'האם כל החוזים עם ספקים, עובדים ולקוחות מעודכנים וחתומים?', category: 'legal' },
    { field: 'licenses', question: 'האם יש לעסק את כל הרישיונות הדרושים לפעולתו?', category: 'legal' },
    { field: 'legal_risks', question: 'האם קיימות תביעות או סיכונים משפטיים ידועים?', category: 'legal' },
    { field: 'loyal_customers', question: 'האם יש לעסק קהל לקוחות חוזר ונאמן?', category: 'marketing' },
    { field: 'crm_data', question: 'האם קיימים נתונים מסודרים על לקוחות (CRM)?', category: 'marketing' },
    { field: 'marketing_plan', question: 'האם יש תוכנית שיווק פעילה או ערוצי שיווק קבועים?', category: 'marketing' },
    { field: 'ready_to_show', question: 'האם יש לך מתעניינים לקנייה כעת?', category: 'presentation' },
    { field: 'teaser_ready', question: 'האם יש לך תקציר מנהלים (Teaser) מוכן?', category: 'presentation' },
    { field: 'kpis_available', question: 'האם קיימים מדדים עסקיים שוטפים (KPIs)?', category: 'presentation' }
  ];
  
  // Contact form state
  const [contactFormData, setContactFormData] = useState({
    fullName: '',
    mobile: '',
    email: ''
  });
  const [isSubmittingContact, setIsSubmittingContact] = useState(false);
  const [contactSubmitMessage, setContactSubmitMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleInputChange = (field: keyof AssessmentForm, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Last question - submit the form
      const result = generateAnalysis();
      setAnalysis(result);
      setShowResults(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const getProgressPercentage = () => {
    return Math.round(((currentQuestionIndex + 1) / questions.length) * 100);
  };

  const handleContactInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setContactFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingContact(true);
    setContactSubmitMessage(null);

    try {
      const response = await fetch('/api/consultation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...contactFormData,
          assessmentScore: analysis?.overall_score || 0,
          assessmentResult: analysis?.verbal_assessment || ''
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setContactSubmitMessage({ type: 'success', text: data.message });
        setContactFormData({ fullName: '', mobile: '', email: '' });
      } else {
        setContactSubmitMessage({ type: 'error', text: data.error });
      }
    } catch (error) {
      setContactSubmitMessage({ type: 'error', text: 'שגיאה בשליחת הטופס. אנא נסה שוב.' });
    } finally {
      setIsSubmittingContact(false);
    }
  };

  const calculateScore = (field: keyof AssessmentForm, value: string): number => {
    // Binary questions (Yes/No/Don't know)
    if (['financial_statements', 'expense_separation', 'financing_ready', 'employee_management', 'written_procedures', 'physical_assets', 'intangible_assets', 'asset_management', 'contracts_updated', 'licenses', 'legal_risks', 'loyal_customers', 'crm_data', 'marketing_plan', 'ready_to_show', 'teaser_ready', 'kpis_available'].includes(field)) {
      switch (value) {
        case 'yes': return 5;
        case 'no': return 1;
        case 'dont_know': return 2;
        default: return 0;
      }
    }
    
    // Scale questions (Excellent to Very Poor)
    switch (value) {
      case 'excellent': return 5;
      case 'good': return 4;
      case 'average': return 3;
      case 'poor': return 2;
      case 'very_poor': return 1;
      default: return 0;
    }
  };

  const generateAnalysis = (): AnalysisResult => {
    const scores = {
      financial_statements: calculateScore('financial_statements', formData.financial_statements),
      expense_separation: calculateScore('expense_separation', formData.expense_separation),
      cash_flow: calculateScore('cash_flow', formData.cash_flow),
      financing_ready: calculateScore('financing_ready', formData.financing_ready),
      owner_dependency: calculateScore('owner_dependency', formData.owner_dependency),
      employee_management: calculateScore('employee_management', formData.employee_management),
      written_procedures: calculateScore('written_procedures', formData.written_procedures),
      physical_assets: calculateScore('physical_assets', formData.physical_assets),
      intangible_assets: calculateScore('intangible_assets', formData.physical_assets),
      asset_management: calculateScore('asset_management', formData.asset_management),
      contracts_updated: calculateScore('contracts_updated', formData.contracts_updated),
      licenses: calculateScore('licenses', formData.licenses),
      legal_risks: calculateScore('legal_risks', formData.legal_risks),
      loyal_customers: calculateScore('loyal_customers', formData.loyal_customers),
      crm_data: calculateScore('crm_data', formData.crm_data),
      marketing_plan: calculateScore('marketing_plan', formData.marketing_plan),
      ready_to_show: calculateScore('ready_to_show', formData.ready_to_show),
      teaser_ready: calculateScore('teaser_ready', formData.teaser_ready),
      kpis_available: calculateScore('kpis_available', formData.kpis_available)
    };

    const category_scores = {
      financial: (scores.financial_statements + scores.expense_separation + scores.cash_flow + scores.financing_ready) / 4,
      owner_dependency: (scores.owner_dependency + scores.employee_management + scores.written_procedures) / 3,
      assets: (scores.physical_assets + scores.intangible_assets + scores.asset_management) / 3,
      legal: (scores.contracts_updated + scores.licenses + scores.legal_risks) / 3,
      marketing: (scores.loyal_customers + scores.crm_data + scores.marketing_plan) / 3,
      presentation: (scores.ready_to_show + scores.teaser_ready + scores.kpis_available) / 3
    };

    // Convert from 1-5 scale to 0-100 scale
    const overall_score = Math.round(
      (Object.values(category_scores).reduce((sum, score) => sum + score, 0) / 6 - 1) * 25
    );

    let verbal_assessment = '';
    let readiness_level = '';
    if (overall_score >= 80) {
      verbal_assessment = 'העסק מוכן ברמה גבוהה למכירה';
      readiness_level = 'גבוהה';
    } else if (overall_score >= 60) {
      verbal_assessment = 'העסק מוכן ברמה בינונית למכירה';
      readiness_level = 'בינונית';
    } else if (overall_score >= 40) {
      verbal_assessment = 'העסק דורש הכנה נוספת לפני מכירה';
      readiness_level = 'נמוכה - דורשת הכנה';
    } else {
      verbal_assessment = 'העסק דורש עבודה משמעותית לפני מכירה';
      readiness_level = 'נמוכה מאוד - דורשת עבודה משמעותית';
    }

    // Generate detailed category analysis
    const categoryAnalysis = {
      financial: generateFinancialAnalysis(scores, category_scores.financial),
      owner_dependency: generateOwnerDependencyAnalysis(scores, category_scores.owner_dependency),
      assets: generateAssetsAnalysis(scores, category_scores.assets),
      legal: generateLegalAnalysis(scores, category_scores.legal),
      marketing: generateMarketingAnalysis(scores, category_scores.marketing),
      presentation: generatePresentationAnalysis(scores, category_scores.presentation)
    };

         const recommendations: string[] = [];
     
           // Always add some general recommendations based on overall score
      if (overall_score < 80) {
        recommendations.push('📊 בדוק את כל התחומים וטפל בנקודות החלשות');
        recommendations.push('📈 שפר את התהליכים והנהלים בעסק');
        recommendations.push('💼 הכן את העסק למכירה בצורה מקצועית');
      }
     
     if (category_scores.financial < 3.5) {
       recommendations.push('📊 טפל בדוחות ובתזרים: סדר מסמכים, עדכן רווחיות וחשבונאות');
       recommendations.push('💰 הפרדה ברורה בין הוצאות פרטיות לעסקיות');
       recommendations.push('📈 הוצא דוחות מבוקר של 3 שנים אחורה');
     }
     
     if (category_scores.owner_dependency < 3.5) {
       recommendations.push('📁 צור נהלים כתובים: העבר משימות לעובדים והפחת תלות בך');
       recommendations.push('👥 הגדל את העצמאות של העובדים');
       recommendations.push('📋 תעד תהליכים מרכזיים בעסק');
     }
     
     if (category_scores.assets < 3.5) {
       recommendations.push('🏢 תיעד וסדר את כל הנכסים הפיזיים והבלתי מוחשיים');
       recommendations.push('📝 צור רשימת מלאי מסודרת עם הערכת שווי');
       recommendations.push('💼 תעד נכסים בלתי מוחשיים (מותג, מוניטין, רישיונות)');
     }
     
     if (category_scores.legal < 3.5) {
       recommendations.push('⚖️ סדר את ההיבטים המשפטיים: חוזים, רישויים ומסמכים קריטיים');
       recommendations.push('📄 עדכן וחתום על כל החוזים עם ספקים, עובדים ולקוחות');
       recommendations.push('🔐 וודא שיש לך את כל הרישיונות הדרושים לפעולת העסק');
     }
     
     if (category_scores.marketing < 3.5) {
       recommendations.push('📊 בנה מערכת CRM מסודרת לניהול לקוחות');
       recommendations.push('🎯 פתח תוכנית שיווק פעילה עם ערוצים קבועים');
       recommendations.push('📱 שפר את הנוכחות הדיגיטלית של העסק');
     }
     
     if (category_scores.presentation < 3.5) {
       recommendations.push('📄 הכן Teaser לעסק: תמצית להצגה ראשונית לרוכשים');
       recommendations.push('📊 בנה מערכת מדדים עסקיים (KPIs) שוטפת');
       recommendations.push('⚡ שפר את היכולת להציג את העסק במהירות למתעניינים');
     }
     
     // If no specific recommendations were added, add general ones
     if (recommendations.length === 0) {
       recommendations.push('🎯 העסק שלך מוכן היטב למכירה!');
       recommendations.push('📋 וודא שכל המסמכים מעודכנים');
       recommendations.push('💼 שמור על רמת המוכנות הגבוהה');
     }

    return {
      overall_score,
      category_scores,
      verbal_assessment,
      readiness_level,
      categoryAnalysis,
      recommendations
    };
  };

  const generateFinancialAnalysis = (scores: any, categoryScore: number) => {
    let analysis = '';
    
    if (scores.financial_statements === 5) {
      analysis += '✔ קיימים דוחות כספיים מסודרים לשלוש השנים האחרונות\n';
    } else if (scores.financial_statements === 1) {
      analysis += '❌ אין דוחות כספיים מסודרים או שהם לא מעודכנים\n';
    } else {
      analysis += '⚠️ דוחות כספיים קיימים חלקית או לא מעודכנים\n';
    }
    
    if (scores.expense_separation === 5) {
      analysis += '✔ קיימת הפרדה ברורה בין הוצאות פרטיות לעסקיות\n';
    } else if (scores.expense_separation === 1) {
      analysis += '❌ אין הפרדה ברורה בין הוצאות פרטיות לעסקיות\n';
    } else {
      analysis += '⚠️ הפרדת הוצאות קיימת חלקית\n';
    }
    
    if (scores.cash_flow === 5) {
      analysis += '✔ תזרים מזומנים חיובי ויציב\n';
    } else if (scores.cash_flow === 1) {
      analysis += '❌ תזרים מזומנים שלילי או לא יציב\n';
    } else {
      analysis += '⚠️ תזרים מזומנים בינוני או לא יציב מספיק\n';
    }
    
    if (scores.financing_ready === 5) {
      analysis += '✔ העסק מדווח באופן שמאפשר קבלת מימון מרוכש\n';
    } else if (scores.financing_ready === 1) {
      analysis += '❌ העסק לא מדווח באופן שמאפשר קבלת מימון מרוכש\n';
    } else {
      analysis += '⚠️ דיווח העסק מאפשר מימון חלקי בלבד\n';
    }
    
    return analysis;
  };

  const generateOwnerDependencyAnalysis = (scores: any, categoryScore: number) => {
    let analysis = '';
    
    if (scores.owner_dependency === 5) {
      analysis += '✔ העסק לא נשען עליך בניהול היומיומי\n';
    } else if (scores.owner_dependency === 1) {
      analysis += '❌ העסק נשען עליך באופן שוטף ומוחלט\n';
    } else {
      analysis += '⚠️ העסק נשען עליך באופן בינוני\n';
    }
    
    if (scores.employee_management === 5) {
      analysis += '✔ יש עובדים שיכולים להמשיך לנהל חלק מהפעילות\n';
    } else if (scores.employee_management === 1) {
      analysis += '❌ אין עובדים שיכולים להמשיך לנהל חלק מהפעילות\n';
    } else {
      analysis += '⚠️ יש עובדים חלקיים שיכולים לנהל חלק מהפעילות\n';
    }
    
    if (scores.written_procedures === 5) {
      analysis += '✔ קיימים נהלים כתובים לתהליכים המרכזיים בעסק\n';
    } else if (scores.written_procedures === 1) {
      analysis += '❌ אין נהלים מסודרים או האצלת סמכויות\n';
    } else {
      analysis += '⚠️ קיימים נהלים חלקיים או לא מסודרים\n';
    }
    
    return analysis;
  };

  const generateAssetsAnalysis = (scores: any, categoryScore: number) => {
    let analysis = '';
    
    if (scores.physical_assets === 5) {
      analysis += '✔ יש מלאי וציוד משמעותיים\n';
    } else if (scores.physical_assets === 1) {
      analysis += '❌ אין נכסים פיזיים משמעותיים\n';
    } else {
      analysis += '⚠️ יש נכסים פיזיים חלקיים\n';
    }
    
    if (scores.intangible_assets === 5) {
      analysis += '✔ יש נכסים בלתי מוחשיים (מותג, אתר, מוניטין)\n';
    } else if (scores.intangible_assets === 1) {
      analysis += '❌ אין נכסים בלתי מוחשיים משמעותיים\n';
    } else {
      analysis += '⚠️ יש נכסים בלתי מוחשיים חלקיים\n';
    }
    
    if (scores.asset_management === 5) {
      analysis += '✔ כל הנכסים רשומים ומנוהלים באופן ברור\n';
    } else if (scores.asset_management === 1) {
      analysis += '❌ אין רישום מסודר או הערכת שווי עדכנית\n';
    } else {
      analysis += '⚠️ רישום הנכסים קיים חלקית\n';
    }
    
    return analysis;
  };

  const generateLegalAnalysis = (scores: any, categoryScore: number) => {
    let analysis = '';
    
    if (scores.contracts_updated === 5) {
      analysis += '✔ כל החוזים מעודכנים וחתומים\n';
    } else if (scores.contracts_updated === 1) {
      analysis += '❌ חסרים חלק מהחוזים או שהם לא מעודכנים\n';
    } else {
      analysis += '⚠️ חלק מהחוזים מעודכנים וחלק לא\n';
    }
    
    if (scores.licenses === 5) {
      analysis += '✔ יש את כל הרישיונות הדרושים\n';
    } else if (scores.licenses === 1) {
      analysis += '❌ רישוי לא תמיד מעודכן או חסר\n';
    } else {
      analysis += '⚠️ רישוי קיים חלקית\n';
    }
    
    if (scores.legal_risks === 5) {
      analysis += '✔ אין תביעות או סיכונים משפטיים ידועים\n';
    } else if (scores.legal_risks === 1) {
      analysis += '❌ קיימות תביעות או סיכונים משפטיים\n';
    } else {
      analysis += '⚠️ יש סיכונים משפטיים קלים\n';
    }
    
    return analysis;
  };

  const generateMarketingAnalysis = (scores: any, categoryScore: number) => {
    let analysis = '';
    
    if (scores.loyal_customers === 5) {
      analysis += '✔ בסיס לקוחות חוזר ונאמן\n';
    } else if (scores.loyal_customers === 1) {
      analysis += '❌ אין בסיס לקוחות חוזר או נאמן\n';
    } else {
      analysis += '⚠️ יש בסיס לקוחות חלקי\n';
    }
    
    if (scores.crm_data === 5) {
      analysis += '✔ קיימים נתונים מסודרים על לקוחות (CRM)\n';
    } else if (scores.crm_data === 1) {
      analysis += '❌ אין נתונים מסודרים על לקוחות\n';
    } else {
      analysis += '⚠️ יש נתונים חלקיים על לקוחות\n';
    }
    
    if (scores.marketing_plan === 5) {
      analysis += '✔ קיימת פעילות שיווקית סדירה\n';
    } else if (scores.marketing_plan === 1) {
      analysis += '❌ אין תוכנית שיווק פעילה\n';
    } else {
      analysis += '⚠️ יש פעילות שיווקית חלקית\n';
    }
    
    return analysis;
  };

  const generatePresentationAnalysis = (scores: any, categoryScore: number) => {
    let analysis = '';
    
    if (scores.ready_to_show === 5) {
      analysis += '✔ אתה יכול להציג את העסק למתעניינים תוך שבוע\n';
    } else if (scores.ready_to_show === 1) {
      analysis += '❌ אין יכולת להציג את העסק במהירות\n';
    } else {
      analysis += '⚠️ יכולת הצגה חלקית או לא מהירה מספיק\n';
    }
    
    if (scores.teaser_ready === 5) {
      analysis += '✔ יש תקציר מנהלים (Teaser) מוכן\n';
    } else if (scores.teaser_ready === 1) {
      analysis += '❌ אין תקציר מנהלים\n';
    } else {
      analysis += '⚠️ יש תקציר חלקי או לא מעודכן\n';
    }
    
    if (scores.kpis_available === 5) {
      analysis += '✔ קיימים מדדים עסקיים שוטפים (KPIs)\n';
    } else if (scores.kpis_available === 1) {
      analysis += '❌ אין הצגה מהירה של KPIs או תיעוד מסודר\n';
    } else {
      analysis += '⚠️ יש מדדים חלקיים או לא מעודכנים\n';
    }
    
    return analysis;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = generateAnalysis();
    setAnalysis(result);
    setShowResults(true);
    
    // Smooth scroll to top after a brief delay to ensure state update
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }, 100);
  };

  const renderCurrentQuestion = () => {
    const currentQuestion = questions[currentQuestionIndex];
    const field = currentQuestion.field as keyof AssessmentForm;
    
    // Binary questions (Yes/No/Don't know)
    const isBinaryQuestion = ['financial_statements', 'expense_separation', 'financing_ready', 'employee_management', 'written_procedures', 'physical_assets', 'intangible_assets', 'asset_management', 'contracts_updated', 'licenses', 'legal_risks', 'loyal_customers', 'crm_data', 'marketing_plan', 'ready_to_show', 'teaser_ready', 'kpis_available'].includes(field);
    
    // Special case for cash flow question
    const isCashFlowQuestion = field === 'cash_flow';
    
    // Special case for owner dependency question
    const isOwnerDependencyQuestion = field === 'owner_dependency';
    
    // Special case for ready_to_show question
    const isReadyToShowQuestion = field === 'ready_to_show';
    
    let options;
    if (isCashFlowQuestion) {
      options = [
        { value: 'yes', label: 'כן', color: 'bg-blue-500 text-white border-blue-500' },
        { value: 'no', label: 'לא', color: 'bg-blue-500 text-white border-blue-500' },
        { value: 'dont_know', label: 'תלוי', color: 'bg-blue-500 text-white border-blue-500' }
      ];
    } else if (isOwnerDependencyQuestion) {
      options = [
        { value: 'excellent', label: 'לא נשען', color: 'bg-blue-500 text-white border-blue-500' },
        { value: 'good', label: 'קצת', color: 'bg-blue-500 text-white border-blue-500' },
        { value: 'poor', label: 'הרבה', color: 'bg-blue-500 text-white border-blue-500' },
        { value: 'very_poor', label: 'אני העסק', color: 'bg-blue-500 text-white border-blue-500' }
      ];
    } else if (isReadyToShowQuestion) {
      options = [
        { value: 'yes', label: 'כן', color: 'bg-blue-500 text-white border-blue-500' },
        { value: 'no', label: 'לא', color: 'bg-blue-500 text-white border-blue-500' },
        { value: 'dont_know', label: 'יכול להיות', color: 'bg-blue-500 text-white border-blue-500' }
      ];
    } else if (isBinaryQuestion) {
      options = [
        { value: 'yes', label: 'כן', color: 'bg-blue-500 text-white border-blue-500' },
        { value: 'no', label: 'לא', color: 'bg-blue-500 text-white border-blue-500' },
        { value: 'dont_know', label: 'בערך', color: 'bg-blue-500 text-white border-blue-500' }
      ];
    } else {
      options = [
        { value: 'excellent', label: 'לא נשען', color: 'bg-blue-500 text-white border-blue-500' },
        { value: 'good', label: 'קצת', color: 'bg-blue-500 text-white border-blue-500' },
        { value: 'average', label: 'בינוני', color: 'bg-blue-500 text-white border-blue-500' },
        { value: 'poor', label: 'הרבה', color: 'bg-blue-500 text-white border-blue-500' },
        { value: 'very_poor', label: 'הרבה מאוד', color: 'bg-blue-500 text-white border-blue-500' }
      ];
    }

    return (
      <div className="bg-white flex flex-col" style={{ minHeight: '60vh' }}>
        {/* Questionnaire Title */}
        <div style={{ textAlign: 'center', paddingTop: '2rem', paddingBottom: '2rem', backgroundColor: '#3b82f6' }}>
          <div style={{ 
            fontSize: '2rem', 
            fontWeight: 'bold', 
            color: '#ffffff',
            textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
          }}>
            שאלון מוכנות למכירת העסק – בדוק את עצמך
          </div>
        </div>
        
        {/* Question Section */}
        <div className="flex-1 flex items-center justify-center px-4 py-2">
          <div className="max-w-4xl w-full text-center">
            <h2 className="text-xl md:text-2xl font-medium text-gray-900 mb-4 leading-relaxed">
              {currentQuestion.question}
            </h2>
            
            <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
              {options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    handleInputChange(field, option.value);
                    // Auto-advance to next question after selection
                    setTimeout(() => {
                      handleNext();
                    }, 300);
                  }}
                  className={`w-full md:w-48 px-8 py-4 rounded-lg border-2 transition-all duration-200 hover:scale-105 font-medium text-lg ${
                    formData[field] === option.value
                      ? `${option.color} border-current shadow-lg`
                      : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Progress Section */}
        <div className="bg-blue-100 px-4 py-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <span className="text-sm text-gray-600">
              הושלם עד כה {getProgressPercentage()}%
            </span>
            <div className="flex-1 mx-4">
              <div className="w-full bg-white rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${getProgressPercentage()}%` }}
                ></div>
              </div>
            </div>
            <span className="text-sm text-gray-600">
              {currentQuestionIndex + 1} / {questions.length}
            </span>
          </div>
        </div>
      </div>
    );
  };

  const renderSpiderChart = () => {
    if (!analysis) return null;

    const categories = [
      { 
        name: 'פיננסים', 
        score: analysis.category_scores.financial,
        analysis: analysis.categoryAnalysis.financial
      },
      { 
        name: 'תלות בבעלים', 
        score: analysis.category_scores.owner_dependency,
        analysis: analysis.categoryAnalysis.owner_dependency
      },
      { 
        name: 'נכסים', 
        score: analysis.category_scores.assets,
        analysis: analysis.categoryAnalysis.assets
      },
      { 
        name: 'משפטי', 
        score: analysis.category_scores.legal,
        analysis: analysis.categoryAnalysis.legal
      },
      { 
        name: 'שיווק', 
        score: analysis.category_scores.marketing,
        analysis: analysis.categoryAnalysis.marketing
      },
      { 
        name: 'הצגה', 
        score: analysis.category_scores.presentation,
        analysis: analysis.categoryAnalysis.presentation
      }
    ];

    return (
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h3 className="text-2xl font-bold text-center mb-8">🔍 ניתוח לפי תחומים</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <div key={index} className="text-center">
              <div className="relative w-24 h-24 mx-auto mb-4">
                <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="2"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="3"
                    strokeDasharray={`${(category.score / 5) * 251.2} 251.2`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold text-blue-600">
                    {Math.round(category.score)}
                  </span>
                </div>
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-3">{category.name}</h4>
              <div className="bg-gray-50 p-4 rounded-lg text-right">
                <pre className="whitespace-pre-wrap font-sans text-sm text-gray-800 leading-relaxed">
                  {category.analysis}
                </pre>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6">
            <FiTarget className="w-16 h-16 text-yellow-300" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            האם העסק שלך מוכן למכירה?
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
            בדוק את רמת המוכנות של העסק שלך למכירה עם כלי ההערכה המתקדם שלנו
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <div className="flex items-center text-blue-100">
              <FiCheckCircle className="w-5 h-5 mr-2" />
              <span>הערכה מקיפה ב-6 תחומים</span>
            </div>
            <div className="flex items-center text-blue-100">
              <FiTrendingUp className="w-5 h-5 mr-2" />
              <span>ניתוח מפורט עם המלצות</span>
            </div>
            <div className="flex items-center text-blue-100">
              <FiAward className="w-5 h-5 mr-2" />
              <span>ציון כללי מ-0 עד 100</span>
            </div>
          </div>
        </div>
      </div>

      {/* Questionnaire Introduction Section */}
      <div className="bg-blue-200 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-lg md:text-xl text-black leading-relaxed space-y-4">
            <p>
              השאלון הבא יעזור לך להבין עד כמה העסק שלך מוכן לתהליך מכירה.
            </p>
            <p>
              מבוסס על ניסיון של מעל 10 שנים בליווי מאות עסקאות בישראל, הוא בודק היבטים פיננסיים, תפעוליים, משפטיים ועוד.
            </p>
            <p>
              מילוי השאלון לוקח 5–10 דקות – ובסופו תדע בדיוק איפה אתה עומד ומה אפשר לשפר.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!showResults ? (
          renderCurrentQuestion()
        ) : (
          <div className="space-y-8">
                         {/* Overall Score */}
             <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white p-8 rounded-2xl shadow-xl text-center">
               <h2 className="text-3xl font-bold mb-4">תוצאות ההערכה</h2>
               <div className="text-6xl font-bold mb-4">{analysis?.overall_score}/100</div>
               <p className="text-xl text-green-100">{analysis?.verbal_assessment}</p>
               <p className="text-lg text-blue-100 mt-2">רמת מוכנות כללית: {analysis?.readiness_level}</p>
             </div>

                         {/* Spider Chart */}
             {renderSpiderChart()}

                          {/* Recommendations */}
             <div className="bg-white p-8 rounded-2xl shadow-xl">
               <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">✅ המלצות להמשך:</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {analysis?.recommendations.map((recommendation, index) => (
                   <div key={index} className="flex items-start p-4 bg-blue-50 rounded-lg">
                     <FiCheckCircle className="w-5 h-5 text-blue-600 mr-3 mt-1 flex-shrink-0" />
                     <span className="text-gray-800">{recommendation}</span>
                   </div>
                 ))}
               </div>
             </div>

                         {/* Contact Form */}
             <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-2xl shadow-xl">
               <div className="text-center mb-6">
                 <h3 className="text-2xl font-bold text-gray-900 mb-2">רוצה לתאם פגישת ייעוץ עם מומחה?</h3>
                 <p className="text-lg text-gray-700">צור עימנו קשר עכשיו:</p>
               </div>
               
               {contactSubmitMessage && (
                 <div className={`mb-6 p-4 rounded-lg ${
                   contactSubmitMessage.type === 'success' 
                     ? 'bg-green-50 text-green-800 border border-green-200' 
                     : 'bg-red-50 text-red-800 border border-red-200'
                 }`}>
                   {contactSubmitMessage.text}
                 </div>
               )}
               
               <form onSubmit={handleContactSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2 text-right">שם מלא *</label>
                   <input
                     type="text"
                     name="fullName"
                     value={contactFormData.fullName}
                     onChange={handleContactInputChange}
                     required
                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right"
                     placeholder="הכנס את שמך המלא"
                   />
                 </div>
                 
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2 text-right">טלפון נייד *</label>
                   <input
                     type="tel"
                     name="mobile"
                     value={contactFormData.mobile}
                     onChange={handleContactInputChange}
                     required
                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right"
                     placeholder="הכנס מספר טלפון"
                   />
                 </div>
                 
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2 text-right">דואר אלקטרוני *</label>
                   <input
                     type="email"
                     name="email"
                     value={contactFormData.email}
                     onChange={handleContactInputChange}
                     required
                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right"
                     placeholder="הכנס כתובת אימייל"
                   />
                 </div>
                 
                 <div>
                   <button
                     type="submit"
                     disabled={isSubmittingContact}
                     className={`w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-bold hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg ${
                       isSubmittingContact ? 'opacity-50 cursor-not-allowed' : ''
                     }`}
                   >
                     {isSubmittingContact ? 'שולח...' : 'שלח'}
                   </button>
                 </div>
               </form>
             </div>

             {/* Action Buttons */}
             <div className="text-center space-y-4">
               <button
                 onClick={() => {
                   setShowResults(false);
                   setAnalysis(null);
                   setCurrentQuestionIndex(0);
                   setFormData({
                     financial_statements: '',
                     expense_separation: '',
                     cash_flow: '',
                     financing_ready: '',
                     owner_dependency: '',
                     employee_management: '',
                     written_procedures: '',
                     physical_assets: '',
                     intangible_assets: '',
                     asset_management: '',
                     contracts_updated: '',
                     licenses: '',
                     legal_risks: '',
                     loyal_customers: '',
                     crm_data: '',
                     marketing_plan: '',
                     ready_to_show: '',
                     teaser_ready: '',
                     kpis_available: ''
                   });
                 }}
                 className="bg-gray-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-700 transition-colors duration-200"
               >
                 עשה הערכה נוספת
               </button>
               <div className="text-gray-600">
                 <p>רוצה לשתף את התוצאות? שמור את הקישור או שלח אותו לחברים</p>
               </div>
             </div>
          </div>
        )}
      </div>

      {/* Footer CTA */}
      <div className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold mb-4">מוכנים למכור את העסק?</h3>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            קבלו הערכה מקצועית ומפורטת שתתן לכם את הכלים הנכונים להכנת העסק למכירה
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="flex items-center text-gray-300">
              <FiCheckCircle className="w-5 h-5 mr-2 text-green-400" />
              <span>הערכה חינמית</span>
            </div>
            <div className="flex items-center text-gray-300">
              <FiCheckCircle className="w-5 h-5 mr-2 text-green-400" />
              <span>תוצאות מיידיות</span>
            </div>
            <div className="flex items-center text-gray-300">
              <FiCheckCircle className="w-5 h-5 mr-2 text-green-400" />
              <span>המלצות מעשיות</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessSaleReadiness;


