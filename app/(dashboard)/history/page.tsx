// app/(dashboard)/history/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { History } from 'lucide-react';
import { useAuth } from '@/lib/contexts/auth-context';
import { apiClient } from '@/lib/api/client';
import toast from 'react-hot-toast';

export default function HistoryPage() {
  const { isAuthenticated } = useAuth();
  const [analyses, setAnalyses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      loadHistory();
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const loadHistory = async () => {
    try {
      const response = await apiClient.getUserHistory(10);
      setAnalyses(response.analyses || []);
    } catch (error: any) {
      if (error.response?.status !== 503) {
        toast.error('Failed to load history');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analysis History</h1>
          <p className="text-gray-600 mt-2">View all your past document analyses and reports</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Analyses</CardTitle>
            <CardDescription>
              {isAuthenticated
                ? 'Your document analysis history'
                : 'Sign in to view your analysis history'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="py-12">
                <LoadingSpinner text="Loading history..." />
              </div>
            ) : !isAuthenticated ? (
              <EmptyState
                icon={History}
                title="Authentication Required"
                description="Please sign in to view your analysis history."
                actionLabel="Go to Login"
                onAction={() => (window.location.href = '/login')}
              />
            ) : analyses.length === 0 ? (
              <EmptyState
                icon={History}
                title="No analysis history yet"
                description="Start analyzing documents to see your history here."
                actionLabel="Start Analyzing"
                onAction={() => (window.location.href = '/legal-analyzer')}
              />
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  You have {analyses.length} past analysis(es)
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
