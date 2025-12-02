// app/(dashboard)/dashboard/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, TrendingUp, Clock, CheckCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { apiClient } from '@/lib/api/client';
import { useAuth } from '@/lib/contexts/auth-context';
import toast from 'react-hot-toast';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export default function DashboardPage() {
  const { isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState({
    total_documents: 0,
    total_analyses: 0,
    avg_risk_score: 0,
  });

  useEffect(() => {
    if (isAuthenticated) {
      loadUserStats();
    }
  }, [isAuthenticated]);

  const loadUserStats = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.getUserStats();
      setStats({
        total_documents: response.stats?.total_documents || 0,
        total_analyses: response.stats?.total_analyses || 0,
        avg_risk_score: Math.round(response.stats?.avg_risk_score || 0),
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const statsDisplay = [
    {
      title: 'Documents Analyzed',
      value: isAuthenticated ? stats.total_documents.toString() : '0',
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Risk Assessments',
      value: isAuthenticated ? stats.total_analyses.toString() : '0',
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Avg Risk Score',
      value: isAuthenticated ? `${stats.avg_risk_score}%` : '0%',
      icon: Clock,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Completed',
      value: isAuthenticated ? stats.total_analyses.toString() : '0',
      icon: CheckCircle,
      color: 'text-teal-600',
      bgColor: 'bg-teal-50',
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Welcome to SmartDoc AI. Start analyzing legal documents with AI-powered insights.
          </p>
        </div>

        {/* Stats Grid */}
        {isLoading ? (
          <div className="py-12">
            <LoadingSpinner text="Loading statistics..." />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statsDisplay.map((stat, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                      <stat.icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-2 border-blue-200 hover:border-blue-400 transition-colors">
            <CardHeader>
              <CardTitle>Legal Document Analyzer</CardTitle>
              <CardDescription>
                Analyze contracts, agreements, and legal documents. Extract parties, dates,
                amounts, and assess risks.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/legal-analyzer">
                <Button className="w-full">
                  Start Analysis <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-200 hover:border-green-400 transition-colors">
            <CardHeader>
              <CardTitle>Feedback Analyzer</CardTitle>
              <CardDescription>
                Analyze customer feedback, reviews, and social media posts. Get sentiment
                analysis and insights.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/feedback-analyzer">
                <Button className="w-full" variant="outline">
                  Start Analysis <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Info Card */}
        <Card>
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
            <CardDescription>
              Tips for using SmartDoc AI effectively
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Upload Documents</h4>
                  <p className="text-sm text-gray-600">
                    Support for PDF, DOCX, and TXT files up to 10MB
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Get Instant Results</h4>
                  <p className="text-sm text-gray-600">
                    Comprehensive analysis in seconds with risk scoring
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Track History</h4>
                  <p className="text-sm text-gray-600">
                    All your analyses are saved and accessible in History
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}