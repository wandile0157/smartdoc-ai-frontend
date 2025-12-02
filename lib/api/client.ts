// lib/api/client.ts
import axios, { AxiosInstance, AxiosError } from 'axios';
import {
  LegalAnalysisResponse,
  BasicAnalysisResponse,
  FeedbackAnalysisResponse,
  SampleDocumentInfo,
} from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const API_PREFIX = process.env.NEXT_PUBLIC_API_PREFIX || '/api/v1';

class ApiClient {
  public client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: `${API_URL}${API_PREFIX}`,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    });

    // Request interceptor - Add auth token
    this.client.interceptors.request.use(
      async (config) => {
        try {
          if (typeof window !== 'undefined') {
            const { createClient } = await import('@/lib/supabase/client');
            const supabase = createClient();
            const {
              data: { session },
            } = await supabase.auth.getSession();

            if (session?.access_token) {
              config.headers.Authorization = `Bearer ${session.access_token}`;
            }
          }
        } catch (error) {
          console.error('Error getting auth token:', error);
        }

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        if (error.response?.status === 401) {
          if (typeof window !== 'undefined') {
            const { createClient } = await import('@/lib/supabase/client');
            const supabase = createClient();
            await supabase.auth.signOut();
            window.location.href = '/login';
          }
        }
        return Promise.reject(error);
      }
    );
  }

  // Health check
  async healthCheck() {
    const response = await this.client.get('/health');
    return response.data;
  }

  // Text analysis
  async analyzeText(text: string): Promise<BasicAnalysisResponse> {
    const response = await this.client.post('/analyze/text', {
      text,
      analysis_type: 'text',
    });
    return response.data;
  }

  // Legal document analysis
  async analyzeLegalDocument(
    text: string,
    documentType?: string
  ): Promise<LegalAnalysisResponse> {
    const response = await this.client.post('/analyze/legal', {
      text,
      document_type: documentType,
    });
    return response.data;
  }

  // Feedback analysis
  async analyzeFeedback(
    text: string,
    source?: string
  ): Promise<FeedbackAnalysisResponse> {
    const response = await this.client.post('/analyze/feedback', {
      text,
      source,
    });
    return response.data;
  }

  // Get sample documents
  async getSampleDocuments(): Promise<{
    documents: SampleDocumentInfo[];
    count: number;
  }> {
    const response = await this.client.get('/samples');
    return response.data;
  }

  // Analyze sample document
  async analyzeSampleDocument(
    documentKey: string
  ): Promise<LegalAnalysisResponse> {
    const response = await this.client.get(`/samples/${documentKey}`);
    return response.data;
  }

  // Get user stats (protected)
  async getUserStats() {
    const response = await this.client.get('/stats');
    return response.data;
  }

  // Get user history (protected)
  async getUserHistory(limit: number = 10) {
    const response = await this.client.get('/history', {
      params: { limit },
    });
    return response.data;
  }
}

export const apiClient = new ApiClient();