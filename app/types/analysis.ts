export type AnalysisStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface RiskScores {
  overall: number;
  business: number;
  financial: number;
  market: number;
  swot: number;
}

export interface AnalysisSection {
  title: string;
  content: string;
  riskScore?: number;
  charts?: {
    type: 'bar' | 'pie' | 'line';
    data: any; // Will be properly typed based on chart library
    options?: any;
  }[];
}

export interface AnalysisContent {
  executiveSummary: {
    quickRecommendation: string;
    keyHighlights: string[];
  };
  businessFundamentals: AnalysisSection;
  financialAnalysis: AnalysisSection;
  marketAnalysis: AnalysisSection;
  swotAnalysis: AnalysisSection;
  recommendations: {
    actionItems: string[];
    riskMitigation: string[];
    investmentConsiderations: string[];
  };
}

export interface Analysis {
  id: string;
  assessmentId: string;
  userId: string;
  status: AnalysisStatus;
  riskScores: RiskScores;
  content: AnalysisContent;
  pdfUrl?: string;
  createdAt: string;
  updatedAt: string;
  errorMessage?: string;
}

export interface AnalysisRequest {
  assessmentId: string;
} 