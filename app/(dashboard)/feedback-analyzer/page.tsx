// app/(dashboard)/feedback-analyzer/page.tsx
'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { MessageSquare, Loader2 } from 'lucide-react';
import { apiClient } from '@/lib/api/client';
import { FeedbackAnalysisResponse } from '@/types';
import toast from 'react-hot-toast';
import { getSentimentColor, getSentimentEmoji } from '@/lib/utils/formatters';

export default function FeedbackAnalyzerPage() {
  const [text, setText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<FeedbackAnalysisResponse | null>(null);

  const handleAnalyze = async () => {
    if (!text.trim()) {
      toast.error('Please enter some text to analyze');
      return;
    }

    if (text.trim().length < 10) {
      toast.error('Text must be at least 10 characters long');
      return;
    }

    setIsAnalyzing(true);
    try {
      const response = await apiClient.analyzeFeedback(text);
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
          <h1 className="text-3xl font-bold text-gray-900">Feedback Analyzer</h1>
          <p className="text-gray-600 mt-2">
            Analyze customer feedback, reviews, and comments with AI-powered sentiment analysis
          </p>
        </div>

        {/* Input Card */}
        <Card>
          <CardHeader>
            <CardTitle>Feedback Text</CardTitle>
            <CardDescription>
              Paste customer feedback, reviews, or comments below
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="text">Feedback Content</Label>
              <Textarea
                id="text"
                placeholder="Paste customer feedback here... (minimum 10 characters)"
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={8}
              />
              <p className="text-sm text-gray-500">
                {text.length} characters {text.length >= 10 ? '✓' : '(minimum 10)'}
              </p>
            </div>

            <div className="flex space-x-4">
              <Button
                onClick={handleAnalyze}
                disabled={isAnalyzing || text.length < 10}
                className="flex-1"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Analyze Feedback
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
            {/* Sentiment */}
            <Card>
              <CardHeader>
                <CardTitle>Sentiment Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-2">Overall Sentiment</p>
                    <div className={`text-4xl mb-2 ${getSentimentColor(results.sentiment.sentiment)}`}>
                      {getSentimentEmoji(results.sentiment.sentiment)}
                    </div>
                    <p className="text-xl font-bold">{results.sentiment.sentiment}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-2">Polarity</p>
                    <p className="text-3xl font-bold">{results.sentiment.polarity.toFixed(2)}</p>
                    <p className="text-xs text-gray-500">-1 (negative) to +1 (positive)</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-2">Subjectivity</p>
                    <p className="text-3xl font-bold">{results.sentiment.subjectivity.toFixed(2)}</p>
                    <p className="text-xs text-gray-500">0 (objective) to 1 (subjective)</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Key Points */}
            {results.key_points.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Key Points</CardTitle>
                  <CardDescription>Main points extracted from the feedback</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {results.key_points.map((point, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                          {index + 1}
                        </div>
                        <p className="text-gray-700">{point}</p>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Statistics */}
            <Card>
              <CardHeader>
                <CardTitle>Text Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Word Count</p>
                    <p className="text-2xl font-bold">{results.word_count}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Readability</p>
                    <p className="text-2xl font-bold">{results.readability.readability_level}</p>
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