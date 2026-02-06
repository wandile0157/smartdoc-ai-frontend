export type RiskAssessment = {
  risk_score: number;
  risk_level: string;
  color: string;
  high_risk_terms_found: number;
  medium_risk_terms_found: number;
  total_risk_terms: number;
};

export type DocumentInfo = {
  family: 'contract' | 'legislation' | 'other' | string;
  type: string;
  title: string;
  confidence: number;
  word_count: number;
  unique_words: number;
  total_characters: number;
  analyzed_at: string;
};

export type PartiesData = {
  identified: string[];
  count: number;
};

export type DatesData = {
  found: string[];
  count: number;
};

export type FinancialAmount = {
  raw: string;
  formatted: string;
  context: string;
};

export type FinancialData = {
  amounts: FinancialAmount[];
  count: number;
};

export type ClausesData = {
  counts: Record<string, number>;
  examples: Record<string, string[]>;
};

export type LegislationExtras = {
  sections: string[];
  amendments: string[];
  commencement: string[];
  penalties: string[];
};

export type LegalAnalysisResponse = {
  success: boolean;
  message?: string;
  timestamp?: string;

  analysis_id: string;
  processing_time_ms: number;

  document_info: DocumentInfo;

  summary: string;
  key_points: string[];

  parties: PartiesData;
  dates: DatesData;
  financial: FinancialData;

  clauses: ClausesData;
  legislation: LegislationExtras;

  risk_assessment: RiskAssessment;

  text_statistics: any;
};
