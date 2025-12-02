// types/index.ts

// Analysis Types
export type AnalysisType = 'text' | 'legal' | 'feedback';

export type DocumentType = 
  | 'employment_contract'
  | 'lease_agreement'
  | 'nda'
  | 'service_agreement'
  | 'sales_agreement'
  | 'other';

export type RiskLevel = 'Low Risk' | 'Medium Risk' | 'High Risk';

// Basic Stats
export interface BasicStats {
  word_count: number;
  sentence_count: number;
  character_count: number;
  character_count_no_spaces: number;
  average_word_length: number;
  average_sentence_length: number;
}

// Readability
export interface ReadabilityScore {
  flesch_reading_ease: number;
  readability_level: string;
}

// Sentiment
export interface SentimentAnalysis {
  polarity: number;
  subjectivity: number;
  sentiment: string;
}

// Keyword
export interface Keyword {
  word: string;
  frequency: number;
}

// Text Analysis Response
export interface BasicAnalysisResponse {
  success: boolean;
  message?: string;
  timestamp: string;
  basic_stats: BasicStats;
  readability: ReadabilityScore;
  sentiment: SentimentAnalysis;
  top_keywords: Keyword[];
}

// Legal Document Structures
export interface Party {
  name: string;
  type: string;
  role: string;
}

export interface DateInfo {
  date: string;
  format: string;
  context: string;
}

export interface MonetaryAmount {
  amount: string;
  currency: string;
  context: string;
}

export interface RiskAssessment {
  risk_score: number;
  risk_level: RiskLevel;
  color: string;
  high_risk_terms_found: number;
  medium_risk_terms_found: number;
  total_risk_terms: number;
}

export interface DocumentInfo {
  document_type: string;
  analysis_date: string;
}

// Legal Analysis Response
export interface LegalAnalysisResponse {
  success: boolean;
  message?: string;
  timestamp: string;
  document_info: DocumentInfo;
  parties: Party[];
  key_dates: DateInfo[];
  monetary_amounts: MonetaryAmount[];
  identified_clauses: Record<string, number>;
  risk_assessment: RiskAssessment;
  text_statistics: {
    basic_stats: BasicStats;
    readability: ReadabilityScore;
    sentiment: SentimentAnalysis;
    top_keywords: Keyword[];
  };
}

// Feedback Analysis Response
export interface FeedbackAnalysisResponse {
  success: boolean;
  message?: string;
  timestamp: string;
  sentiment: SentimentAnalysis;
  key_points: string[];
  word_count: number;
  readability: ReadabilityScore;
}

// Sample Document
export interface SampleDocumentInfo {
  key: string;
  title: string;
  description: string;
  type: string;
  date: string;
}

// User Stats
export interface UserStats {
  total_analyses: number;
  text_analyses: number;
  legal_analyses: number;
  feedback_analyses: number;
  total_documents_processed: number;
  average_document_length: number;
  last_analysis_date: string | null;
}

// API Error
export interface ApiError {
  success: false;
  error: string;
  details?: Array<{
    field: string;
    message: string;
    type: string;
  }>;
  timestamp: string;
}