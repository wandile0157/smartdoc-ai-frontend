import axios, {
  AxiosInstance,
  AxiosError,
  AxiosRequestConfig,
  AxiosHeaders,
} from 'axios';

interface RetryAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
  _retryCount?: number;
}

class ApiClient {
  private client: AxiosInstance;
  private maxRetries = 1;

  constructor() {
    const baseURL = `${process.env.NEXT_PUBLIC_API_URL || 'https://smartdoc-ai-backend-production.up.railway.app'}${
      process.env.NEXT_PUBLIC_API_PREFIX || '/api/v1'
    }`;

    console.log('API Client initialized:', baseURL);

    this.client = axios.create({
      baseURL,
      timeout: 30000,
      headers: {
        // KEEPING THIS (per your requirement: do not remove code)
        // We will safely override/delete this header automatically for FormData requests in the request interceptor below.
        'Content-Type': 'application/json',
      },
      withCredentials: false,
    });

    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const config = error.config as RetryAxiosRequestConfig;

        if (!config) {
          return Promise.reject(error);
        }

        if (!config._retryCount) {
          config._retryCount = 0;
        }

        const shouldRetry =
          error.message === 'Network Error' &&
          config._retryCount < this.maxRetries &&
          config.method === 'get';

        if (shouldRetry) {
          config._retryCount++;
          console.log(`Retry ${config._retryCount}/${this.maxRetries}`);
          await new Promise((resolve) => setTimeout(resolve, 2000));

          try {
            return await this.client(config);
          } catch (retryError) {
            return Promise.reject(retryError);
          }
        }

        return Promise.reject(error);
      }
    );

    this.client.interceptors.request.use(
      (config) => {
        // Log every request
        console.log(`→ ${config.method?.toUpperCase()} ${config.url}`);

        // ✅ CRITICAL FIX (Axios v1+ typing safe):
        // Normalize headers into AxiosHeaders so we can .set()/.delete() safely
        const headers = AxiosHeaders.from(config.headers);

        // If we're sending FormData, we MUST NOT force Content-Type to application/json,
        // and we SHOULD NOT force multipart/form-data either (browser sets correct boundary).
        const isFormData =
          typeof FormData !== 'undefined' && config.data instanceof FormData;

        if (isFormData) {
          // Remove any Content-Type that might have been set globally or per-request
          // so the browser can set the multipart boundary correctly.
          headers.delete('Content-Type');
          headers.delete('content-type');
        } else {
          // For JSON requests, ensure Content-Type is JSON
          headers.set('Content-Type', 'application/json');
        }

        config.headers = headers;
        return config;
      },
      (error) => Promise.reject(error)
    );
  }

  async health() {
    try {
      const response = await this.client.get('/health');
      return response.data;
    } catch (error) {
      console.error('Health check failed:', error);
      throw error;
    }
  }

  async analyzeText(text: string) {
    try {
      const response = await this.client.post('/analyze/text', { text });
      return response.data;
    } catch (error) {
      console.error('Text analysis failed:', error);
      throw error;
    }
  }

  async analyzeLegalDocument(file: File) {
    try {
      const formData = new FormData();
      formData.append('file', file);

      console.log('Uploading file:', file.name, file.type, file.size);

      const response = await this.client.post('/analyze/legal', formData, {
        // ✅ Increased timeout for Railway + OCR + model latency
        timeout: 120000,
      });

      console.log('Legal analysis successful');
      return response.data;
    } catch (error) {
      console.error('Legal analysis failed:', error);
      throw error;
    }
  }

  async uploadAndAnalyze(file: File) {
    return this.analyzeLegalDocument(file);
  }

  async analyzeDocument(file: File) {
    return this.analyzeLegalDocument(file);
  }

  async getSampleDocuments() {
    try {
      const response = await this.client.get('/samples');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch samples:', error);
      throw error;
    }
  }

  async analyzeSampleDocument(key: string) {
    try {
      console.log('Analyzing sample:', key);
      const response = await this.client.get(`/samples/${key}`);
      return response.data;
    } catch (error) {
      console.error('Sample analysis failed:', error);
      throw error;
    }
  }

  async getUserStats() {
    try {
      const response = await this.client.get('/stats');
      return response.data;
    } catch (error: any) {
      console.warn('Stats unavailable, using demo data');

      return {
        success: true,
        stats: {
          total_analyses: 127,
          documents_processed: 89,
          avg_risk_score: 42,
          total_processing_time_ms: 456789,
          analysis_by_type: {
            legal: 45,
            feedback: 32,
            basic: 12,
          },
        },
        is_demo: true,
        message: 'Demo data',
      };
    }
  }

  async getSupportedTypes() {
    try {
      const response = await this.client.get('/supported-types');
      return response.data;
    } catch (error) {
      return {
        file_types: ['.txt', '.pdf', '.docx', '.doc'],
        max_size_mb: 10,
      };
    }
  }

  async batchAnalyze(files: File[]) {
    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('files', file);
      });

      // ✅ IMPORTANT:
      // Your backend route "/analyze/batch" currently expects JSON (texts),
      // so we call a dedicated compatibility endpoint that accepts file uploads.
      const response = await this.client.post('/analyze/batch-files', formData, {
        headers: {
          // KEEPING THIS OBJECT (per your requirement: do not remove code)
          // Interceptor will delete Content-Type so the browser sets boundary correctly.
          'Content-Type': 'multipart/form-data',
        },
        timeout: 120000,
      });

      return response.data;
    } catch (error) {
      console.error('Batch analysis failed:', error);
      throw error;
    }
  }

  async downloadLegalReport(analysis: any, filename = 'smartdoc-report.pdf'): Promise<Blob> {
    const response = await this.client.post(
      '/report/legal',
      { analysis, filename },
      { responseType: 'blob', timeout: 60000 }
    );

    return response.data as Blob;
  }

  async analyzeFeedback(text: string) {
    try {
      const response = await this.client.post('/analyze/feedback', { text });
      return response.data;
    } catch (error) {
      console.error('Feedback analysis failed:', error);
      throw error;
    }
  }

  async compareDocuments(file1: File, file2: File) {
    try {
      const formData = new FormData();
      formData.append('file1', file1);
      formData.append('file2', file2);

      // ✅ IMPORTANT:
      // Your backend currently has "/analyze/compare" for JSON bodies (DocumentComparisonRequest).
      // This client uses "/compare" for file uploads, so we add a backend compatibility endpoint.
      const response = await this.client.post('/compare', formData, {
        headers: {
          // KEEPING THIS OBJECT (per your requirement: do not remove code)
          // Interceptor will delete Content-Type so the browser sets boundary correctly.
          'Content-Type': 'multipart/form-data',
        },
        timeout: 60000,
      });

      return response.data;
    } catch (error) {
      console.error('Document comparison failed:', error);
      throw error;
    }
  }

  async wakeUpBackend(): Promise<boolean> {
    try {
      await this.health();
      return true;
    } catch (error) {
      return false;
    }
  }
}

export const apiClient = new ApiClient();
export { ApiClient };

