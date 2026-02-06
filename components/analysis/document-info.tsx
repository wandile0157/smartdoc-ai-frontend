'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Users, Calendar, DollarSign } from 'lucide-react';
import { DocumentInfo as DocumentInfoType, PartiesData, DatesData, FinancialData } from '@/types';

interface DocumentInfoProps {
  documentInfo: DocumentInfoType;
  parties?: PartiesData;
  dates?: DatesData;
  financial?: FinancialData;
}

export function DocumentInfo({ documentInfo, parties, dates, financial }: DocumentInfoProps) {
  const safeNumber = (v: any) => (typeof v === 'number' && !Number.isNaN(v) ? v : 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <div className="bg-blue-100 p-2 rounded-lg">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-lg">Document Information</CardTitle>
              <CardDescription>Type and statistics</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Type</span>
            <span className="text-sm font-semibold text-gray-900">{documentInfo.type}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Title</span>
            <span className="text-sm font-semibold text-gray-900 text-right ml-4">{documentInfo.title}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Confidence</span>
            <span className="text-sm font-semibold text-gray-900">
              {(safeNumber(documentInfo.confidence) * 100).toFixed(0)}%
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Word Count</span>
            <span className="text-sm font-semibold text-gray-900">
              {safeNumber(documentInfo.word_count).toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Unique Words</span>
            <span className="text-sm font-semibold text-gray-900">
              {safeNumber(documentInfo.unique_words).toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Characters</span>
            <span className="text-sm font-semibold text-gray-900">
              {safeNumber(documentInfo.total_characters).toLocaleString()}
            </span>
          </div>
        </CardContent>
      </Card>

      {parties && parties.identified && parties.identified.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <div className="bg-green-100 p-2 rounded-lg">
                <Users className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Parties Identified</CardTitle>
                <CardDescription>{parties.count} parties found</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {parties.identified.map((party, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span className="text-sm text-gray-900">{party}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {dates && dates.found && dates.found.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <div className="bg-purple-100 p-2 rounded-lg">
                <Calendar className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Important Dates</CardTitle>
                <CardDescription>{dates.count} dates found</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {dates.found.slice(0, 8).map((date, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <span className="text-purple-600 mt-1">•</span>
                  <span className="text-sm text-gray-900">{date}</span>
                </li>
              ))}
              {dates.found.length > 8 && (
                <li className="text-sm text-gray-500">... and {dates.found.length - 8} more</li>
              )}
            </ul>
          </CardContent>
        </Card>
      )}

      {financial && financial.amounts && financial.amounts.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <div className="bg-orange-100 p-2 rounded-lg">
                <DollarSign className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Financial Amounts</CardTitle>
                <CardDescription>{financial.count} amounts found</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {financial.amounts.slice(0, 8).map((amount, index) => (
                <li key={index} className="flex items-start justify-between gap-3">
                  <span className="text-sm text-gray-600 line-clamp-2">{amount.context || 'Amount'}</span>
                  <span className="text-sm font-semibold text-gray-900">{amount.formatted}</span>
                </li>
              ))}
              {financial.amounts.length > 8 && (
                <li className="text-sm text-gray-500">
                  ... and {financial.amounts.length - 8} more
                </li>
              )}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
