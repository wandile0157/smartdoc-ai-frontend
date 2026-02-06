// app/(dashboard)/feedback-analyzer/page.tsx
'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { FileUpload } from '@/components/analysis/file-upload';
import { MessageSquare, TrendingUp, Hash, BarChart3, Upload, Type, FileText } from 'lucide-react';
import { apiClient } from '@/lib/api/client';
import { BasicAnalysisResponse } from '@/types';
import toast from 'react-hot-toast';

export default function FeedbackAnalyzerPage() {
  const [activeTab, setActiveTab] = useState<'text' | 'upload'>('text');
  const [text, setText] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<BasicAnalysisResponse | null>(null);

  const handleTextAnalysis = async () => {
    if (!text.trim()) {
      toast.error('Please enter some text to analyze');
      return;
    }

    if (text.trim().length < 10) {
      toast.error('Text must be at least 10 characters long');
      return;
    }

    setIsAnalyzing(true);
    setAnalysis(null);

    try {
      const result = await apiClient.analyzeText(text);
      setAnalysis(result);
      toast.success('Analysis completed successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Analysis failed');
      console.error(error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFileAnalysis = async () => {
    if (!selectedFile) {
      toast.error('Please select a file to analyze');
      return;
    }

    setIsAnalyzing(true);
    setAnalysis(null);

    try {
      // Read file content
      const text = await selectedFile.text();
      const result = await apiClient.analyzeText(text);
      setAnalysis(result);
      toast.success('File analyzed successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'File analysis failed');
      console.error(error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setText('');
    setSelectedFile(null);
    setAnalysis(null);
  };

  const loadSampleFeedback = () => {
    setText(
      `Check out our NEW product launch! 🚀 
#TechInnovation #AI #MachineLearning #ProductLaunch 
Amazing features that will change everything! 
@TechGuru @InnovationHub really amazing work! 
Like and share if you love innovation! ❤️
#Innovation #Tech #Amazing #Future 
Visit our website for more amazing details!`
    );
  };

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    toast.success(`File selected: ${file.name}`);
  };

  const handleFileRemove = () => {
    setSelectedFile(null);
    toast.success('File removed');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Feedback Analyzer</h1>
          <p className="text-gray-600 mt-2">
            Analyze customer feedback, reviews, and social media posts. Extract insights and
            sentiment from text.
          </p>
        </div>

        {/* Input Section - Only show if no analysis */}
        {!analysis && (
          <Card>
            <CardHeader>
              <CardTitle>Enter Text to Analyze</CardTitle>
              <CardDescription>
                Paste customer feedback, reviews, social media posts, or upload a text file
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'text' | 'upload')}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="text" className="flex items-center space-x-2">
                    <Type className="h-4 w-4" />
                    <span>Paste Text</span>
                  </TabsTrigger>
                  <TabsTrigger value="upload" className="flex items-center space-x-2">
                    <Upload className="h-4 w-4" />
                    <span>Upload File</span>
                  </TabsTrigger>
                </TabsList>

                {/* Text Input Tab */}
                <TabsContent value="text" className="space-y-4">
                  <Textarea
                    placeholder="Paste your feedback or social media post here..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    rows={8}
                    disabled={isAnalyzing}
                    className="font-mono text-sm"
                  />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <p className="text-sm text-gray-500">
                        {text.length} characters {text.length >= 10 ? '✓' : '(minimum 10)'}
                      </p>
                      <Button
                        variant="link"
                        size="sm"
                        onClick={loadSampleFeedback}
                        disabled={isAnalyzing}
                      >
                        Load Sample
                      </Button>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" onClick={handleReset} disabled={isAnalyzing}>
                        Clear
                      </Button>
                      <Button
                        onClick={handleTextAnalysis}
                        disabled={isAnalyzing || text.length < 10}
                      >
                        {isAnalyzing ? 'Analyzing...' : 'Analyze Text'}
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                {/* File Upload Tab */}
                <TabsContent value="upload" className="space-y-4">
                  <FileUpload
                    onFileSelect={handleFileSelect}
                    maxSizeMB={10}
                    acceptedTypes={['.txt', '.csv']}
                    disabled={isAnalyzing}
                  />

                  {selectedFile && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="bg-blue-100 p-2 rounded">
                            <FileText className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {selectedFile.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {(selectedFile.size / 1024).toFixed(2)} KB
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleFileRemove}
                          disabled={isAnalyzing}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="flex space-x-2">
                    <Button variant="outline" onClick={handleReset} disabled={isAnalyzing}>
                      Clear
                    </Button>
                    <Button
                      onClick={handleFileAnalysis}
                      disabled={isAnalyzing || !selectedFile}
                      className="flex-1"
                    >
                      {isAnalyzing ? 'Analyzing...' : 'Analyze File'}
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}

        {/* Loading State */}
        {isAnalyzing && (
          <Card>
            <CardContent className="py-12">
              <LoadingSpinner text="Analyzing text... This may take a few seconds." />
            </CardContent>
          </Card>
        )}

        {/* Analysis Results */}
        {analysis && !isAnalyzing && (
          <div className="space-y-6">
            {/* Statistics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Words</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">
                        {analysis.statistics.total_words}
                      </p>
                    </div>
                    <MessageSquare className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Unique Words</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">
                        {analysis.statistics.unique_words}
                      </p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Avg Word Length</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">
                        {analysis.statistics.average_word_length}
                      </p>
                    </div>
                    <BarChart3 className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Characters</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">
                        {analysis.statistics.total_characters}
                      </p>
                    </div>
                    <Hash className="h-8 w-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Top Words */}
            <Card>
              <CardHeader>
                <CardTitle>Top Keywords</CardTitle>
                <CardDescription>Most frequently used words in the text</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  {Object.entries(analysis.top_words)
                    .sort(([, a], [, b]) => b - a)
                    .map(([word, count]) => (
                      <div
                        key={word}
                        className="flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-lg"
                      >
                        <span className="text-sm font-semibold text-blue-900">{word}</span>
                        <Badge variant="default" className="bg-blue-600">
                          {count}
                        </Badge>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            {/* Word Frequency Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Word Frequency Distribution</CardTitle>
                <CardDescription>Visual representation of word occurrences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(analysis.top_words)
                    .sort(([, a], [, b]) => b - a)
                    .map(([word, count]) => {
                      const maxCount = Math.max(...Object.values(analysis.top_words));
                      const percentage = (count / maxCount) * 100;
                      return (
                        <div key={word}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-gray-700">{word}</span>
                            <span className="text-sm text-gray-500">{count} times</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                </div>
              </CardContent>
            </Card>

            {/* Analysis Metadata */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>Analysis ID: {analysis.analysis_id}</span>
                  <span>
                    Processing Time:{' '}
                    {analysis.processing_time_ms
                      ? `${analysis.processing_time_ms.toFixed(2)}ms`
                      : 'N/A'}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex justify-center">
              <Button size="lg" onClick={handleReset}>
                <MessageSquare className="mr-2 h-5 w-5" />
                Analyze Another Text
              </Button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}