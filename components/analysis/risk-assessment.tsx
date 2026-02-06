// components/analysis/risk-assessment.tsx
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Shield, CheckCircle } from 'lucide-react';
import { RiskAssessment as RiskAssessmentType } from '@/types';

interface RiskAssessmentProps {
  assessment: RiskAssessmentType;
}

export function RiskAssessment({ assessment }: RiskAssessmentProps) {
  // Determine risk icon and color
  const getRiskIcon = () => {
    switch (assessment.risk_level) {
      case 'HIGH':
        return <AlertTriangle className="h-8 w-8 text-red-600" />;
      case 'MEDIUM':
        return <Shield className="h-8 w-8 text-yellow-600" />;
      case 'LOW':
        return <CheckCircle className="h-8 w-8 text-green-600" />;
      default:
        return <Shield className="h-8 w-8 text-gray-600" />;
    }
  };

  const getRiskColor = () => {
    switch (assessment.risk_level) {
      case 'HIGH':
        return 'bg-red-500';
      case 'MEDIUM':
        return 'bg-yellow-500';
      case 'LOW':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getRiskBadgeColor = () => {
    switch (assessment.risk_level) {
      case 'HIGH':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'LOW':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRiskEmoji = () => {
    switch (assessment.risk_level) {
      case 'HIGH':
        return '🔴';
      case 'MEDIUM':
        return '🟡';
      case 'LOW':
        return '🟢';
      default:
        return '⚪';
    }
  };

  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Risk Assessment</span>
          {getRiskIcon()}
        </CardTitle>
        <CardDescription>Analysis of potential risks and concerns in the document</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Risk Score */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Risk Score</span>
            <span className="text-2xl font-bold text-gray-900">{assessment.risk_score}/100</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all ${getRiskColor()}`}
              style={{ width: `${assessment.risk_score}%` }}
            />
          </div>
        </div>

        {/* Risk Level */}
        <div className="flex items-center justify-between py-4 border-y border-gray-200">
          <span className="text-sm font-medium text-gray-700">Risk Level</span>
          <Badge className={`${getRiskBadgeColor()} border`}>
            {getRiskEmoji()} {assessment.risk_level}
          </Badge>
        </div>

        {/* Description */}
        {assessment.description && (
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Assessment</h4>
            <p className="text-sm text-gray-700">{assessment.description}</p>
          </div>
        )}

        {/* Keywords Found */}
        {assessment.keywords_found && (
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Keywords Found</h4>
            <div className="space-y-3">
              {/* High Risk Keywords */}
              {assessment.keywords_found.high_risk &&
                assessment.keywords_found.high_risk.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-red-700 mb-2">High Risk</p>
                    <div className="flex flex-wrap gap-2">
                      {assessment.keywords_found.high_risk.map((keyword, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-red-100 text-red-800"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              {/* Medium Risk Keywords */}
              {assessment.keywords_found.medium_risk &&
                assessment.keywords_found.medium_risk.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-yellow-700 mb-2">Medium Risk</p>
                    <div className="flex flex-wrap gap-2">
                      {assessment.keywords_found.medium_risk.map((keyword, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-yellow-100 text-yellow-800"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              {/* Administrative Keywords */}
              {assessment.keywords_found.administrative &&
                assessment.keywords_found.administrative.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-blue-700 mb-2">Administrative</p>
                    <div className="flex flex-wrap gap-2">
                      {assessment.keywords_found.administrative.map((keyword, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          </div>
        )}

        {/* Recommendations */}
        {assessment.recommendations && assessment.recommendations.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Recommendations</h4>
            <ul className="space-y-2">
              {assessment.recommendations.map((recommendation, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span className="text-sm text-gray-700">{recommendation}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}