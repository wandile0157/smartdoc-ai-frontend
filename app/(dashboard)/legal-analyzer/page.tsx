// app/(dashboard)/legal-analyzer/page.tsx
'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { FileText, Upload, Loader2 } from 'lucide-react';
import { apiClient } from '@/lib/api/client';
import { LegalAnalysisResponse } from '@/types';
import toast from 'react-hot-toast';
import { getRiskColor, getRiskEmoji } from '@/lib/utils/formatters';

export default function LegalAnalyzerPage() {
  const [text, setText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<LegalAnalysisResponse | null>(null);

  const handleAnalyze = async () => {
    if (!text.trim()) {
      toast.error('Please enter some text to analyze');
      return;
    }

    if (text.trim().length < 50) {
      toast.error('Text must be at least 50 characters long');
      return;
    }

    setIsAnalyzing(true);
    try {
      const response = await apiClient.analyzeLegalDocument(text);
      setResults(response);
      toast.success('Analysis completed successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Analysis failed');
      console.error(error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleClear = () => {
    setText('');
    setResults(null);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Legal Document Analyzer</h1>
          <p className="text-gray-600 mt-2">
            Analyze contracts, agreements, and legal documents with AI
          </p>
        </div>

        {/* Input Card */}
        <Card>
          <CardHeader>
            <CardTitle>Document Text</CardTitle>
            <CardDescription>
              Paste your legal document text below or upload a file
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="text">Document Content</Label>
              <Textarea
                id="text"
                placeholder="Paste your legal document here... (minimum 50 characters)"
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={12}
                className="font-mono text-sm"
              />
              <p className="text-sm text-gray-500">
                {text.length} characters {text.length >= 50 ? '✓' : '(minimum 50)'}
              </p>
            </div>

            <div className="flex space-x-4">
              <Button
                onClick={handleAnalyze}
                disabled={isAnalyzing || text.length < 50}
                className="flex-1"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <FileText className="mr-2 h-4 w-4" />
                    Analyze Document
                  </>
                )}
              </Button>
              <Button onClick={handleClear} variant="outline">
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {results && (
          <div className="space-y-6">
            {/* Document Info */}
            <Card>
              <CardHeader>
                <CardTitle>Document Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Document Type</p>
                    <p className="text-lg font-semibold">{results.document_info.document_type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Word Count</p>
                    <p className="text-lg font-semibold">
                      {results.text_statistics.basic_stats.word_count}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Risk Assessment */}
            <Card>
              <CardHeader>
                <CardTitle>Risk Assessment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Risk Level</p>
                      <Badge className={getRiskColor(results.risk_assessment.risk_level)}>
                        {getRiskEmoji(results.risk_assessment.risk_level)}{' '}
                        {results.risk_assessment.risk_level}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Risk Score</p>
                      <p className="text-2xl font-bold">{results.risk_assessment.risk_score}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">High Risk Terms</p>
                      <p className="text-lg font-semibold">
                        {results.risk_assessment.high_risk_terms_found}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Medium Risk Terms</p>
                      <p className="text-lg font-semibold">
                        {results.risk_assessment.medium_risk_terms_found}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Parties */}
            {results.parties.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Parties Identified</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {results.parties.slice(0, 5).map((party, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{party.name}</p>
                          <p className="text-sm text-gray-600">
                            {party.type} • {party.role}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Monetary Amounts */}
            {results.monetary_amounts.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Monetary Amounts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {results.monetary_amounts.slice(0, 5).map((amount, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-semibold text-gray-900">{amount.amount}</p>
                          <p className="text-sm text-gray-600">{amount.currency}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Clauses */}
            {Object.keys(results.identified_clauses).length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Identified Clauses</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {Object.entries(results.identified_clauses).map(([clause, count]) => (
                      <div key={clause} className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm font-medium text-gray-900 capitalize">
                          {clause.replace(/_/g, ' ')}
                        </p>
                        <p className="text-xs text-gray-600">{count} occurrence(s)</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Sentiment */}
            <Card>
              <CardHeader>
                <CardTitle>Document Sentiment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Sentiment</p>
                    <p className="text-lg font-semibold">
                      {results.text_statistics.sentiment.sentiment}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Polarity</p>
                    <p className="text-lg font-semibold">
                      {results.text_statistics.sentiment.polarity.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Readability</p>
                    <p className="text-lg font-semibold">
                      {results.text_statistics.readability.readability_level}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}