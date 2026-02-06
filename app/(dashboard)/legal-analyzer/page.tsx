'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { FileUpload } from '@/components/analysis/file-upload';
import { RiskAssessment } from '@/components/analysis/risk-assessment';
import { DocumentInfo } from '@/components/analysis/document-info';
import { FileText, Upload, Type, Download } from 'lucide-react';
import { apiClient } from '@/lib/api/client';
import type { LegalAnalysisResponse } from '@/types';
import toast from 'react-hot-toast';

export default function LegalAnalyzerPage() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<'text' | 'upload'>('upload');

  const [text, setText] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<LegalAnalysisResponse | null>(null);

  useEffect(() => {
    const sampleKey = searchParams.get('sample');
    if (sampleKey) {
      loadAndAnalyzeSample(sampleKey);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const loadAndAnalyzeSample = async (sampleKey: string) => {
    setIsAnalyzing(true);
    setAnalysis(null);

    try {
      const result = await apiClient.analyzeSampleDocument(sampleKey);
      setAnalysis(result);
      toast.success('Sample document analyzed successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to analyze sample document');
      console.error(error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleTextAnalysis = async () => {
    toast.error('Text mode not enabled for /analyze/legal yet. Upload a file for now.');
  };

  const handleFileAnalysis = async () => {
    if (!selectedFile) {
      toast.error('Please select a file to analyze');
      return;
    }

    setIsAnalyzing(true);
    setAnalysis(null);

    try {
      const result = await apiClient.uploadAndAnalyze(selectedFile);
      setAnalysis(result);
      toast.success('File analyzed successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'File analysis failed');
      console.error(error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDownloadReport = async () => {
    if (!analysis) {
      toast.error('No analysis available to export');
      return;
    }

    try {
      const blob = await apiClient.downloadLegalReport(analysis, 'smartdoc-report.pdf');

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'smartdoc-report.pdf';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      toast.success('Report downloaded');
    } catch (error: any) {
      console.error(error);
      toast.error('Failed to download report');
    }
  };

  const handleReset = () => {
    setText('');
    setSelectedFile(null);
    setAnalysis(null);
  };

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    toast.success(`File selected: ${file.name}`);
  };

  const handleFileRemove = () => {
    setSelectedFile(null);
    toast.success('File removed');
  };

  // Defensive values so UI never crashes
  const safeSummary =
    (analysis as any)?.summary && typeof (analysis as any).summary === 'string'
      ? ((analysis as any).summary as string).replace(/\*\*/g, '')
      : 'No summary returned yet.';

  const safeKeyPoints: string[] = Array.isArray((analysis as any)?.key_points)
    ? ((analysis as any).key_points as string[])
    : [];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Legal Document Analyzer</h1>
          <p className="text-gray-600 mt-2">
            Upload a legal document to extract key info and generate a readable summary.
          </p>
        </div>

        {!analysis && (
          <Card>
            <CardHeader>
              <CardTitle>Document Input</CardTitle>
              <CardDescription>
                Upload a file (PDF, DOCX, TXT). Text mode can be enabled later.
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

                <TabsContent value="text" className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Document Content</label>
                    <Textarea
                      placeholder="(Disabled for now) Upload a file instead."
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      rows={8}
                      disabled
                      className="font-mono text-sm"
                    />
                  </div>

                  <div className="flex space-x-2">
                    <Button onClick={handleReset} variant="outline" disabled={isAnalyzing}>
                      Clear
                    </Button>
                    <Button onClick={handleTextAnalysis} disabled className="flex-1">
                      Analyze Document
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="upload" className="space-y-4">
                  <FileUpload
                    onFileSelect={handleFileSelect}
                    maxSizeMB={10}
                    acceptedTypes={['.pdf', '.docx', '.doc', '.txt']}
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
                            <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
                            <p className="text-xs text-gray-500">
                              {(selectedFile.size / 1024).toFixed(2)} KB
                            </p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" onClick={handleFileRemove} disabled={isAnalyzing}>
                          Remove
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="flex space-x-2">
                    <Button onClick={handleReset} variant="outline" disabled={isAnalyzing}>
                      Clear
                    </Button>
                    <Button onClick={handleFileAnalysis} disabled={isAnalyzing || !selectedFile} className="flex-1">
                      {isAnalyzing ? 'Analyzing...' : 'Analyze File'}
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}

        {isAnalyzing && (
          <Card>
            <CardContent className="py-12">
              <LoadingSpinner size="lg" text="Analyzing document... This may take a few seconds." />
            </CardContent>
          </Card>
        )}

        {analysis && !isAnalyzing && (
          <div className="space-y-6">
            <RiskAssessment assessment={(analysis as any).risk_assessment} />

            {/* Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Summary</CardTitle>
                <CardDescription>High-level overview of what this document is about</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="prose max-w-none">
                  <p>{safeSummary}</p>
                </div>

                {safeKeyPoints.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-gray-900">Key points</p>
                    <ul className="list-disc ml-5 space-y-1 text-sm text-gray-700">
                      {safeKeyPoints.slice(0, 10).map((p, i) => (
                        <li key={i}>{p}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>

            <DocumentInfo
              documentInfo={(analysis as any).document_info}
              parties={(analysis as any).parties}
              dates={(analysis as any).dates}
              financial={(analysis as any).financial}
            />

            {/* Clauses */}
            {(analysis as any).clauses && Object.keys((analysis as any).clauses?.counts || {}).length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Detected Clauses</CardTitle>
                  <CardDescription>Clause signals and sample matches</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries((analysis as any).clauses.counts)
                    .sort(([, a]: any, [, b]: any) => (b as number) - (a as number))
                    .slice(0, 8)
                    .map(([name, count]: any) => (
                      <div key={name} className="border rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <p className="font-semibold text-sm">{name}</p>
                          <Badge>{count as any}</Badge>
                        </div>
                        {(((analysis as any).clauses.examples?.[name] as string[]) || []).slice(0, 2).map((ex, idx) => (
                          <p key={idx} className="text-xs text-gray-600 mt-2">
                            {ex}
                          </p>
                        ))}
                      </div>
                    ))}
                </CardContent>
              </Card>
            )}

            {/* Metadata */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>Analysis ID: {(analysis as any).analysis_id ?? 'N/A'}</span>
                  <span>
                    Processing Time:{' '}
                    {typeof (analysis as any).processing_time_ms === 'number'
                      ? `${(analysis as any).processing_time_ms.toFixed(2)}ms`
                      : 'N/A'}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* ACTION BUTTONS (this is where your Download button MUST be) */}
            <div className="flex justify-center gap-3">
              <Button size="lg" variant="outline" onClick={handleDownloadReport}>
                <Download className="mr-2 h-5 w-5" />
                Download PDF Report
              </Button>

              <Button size="lg" onClick={handleReset}>
                <FileText className="mr-2 h-5 w-5" />
                Analyze Another Document
              </Button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
