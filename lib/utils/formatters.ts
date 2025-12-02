// lib/utils/formatters.ts
import { RiskLevel } from '@/types';

/**
 * Format a date string to readable format
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-ZA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

/**
 * Get risk color based on risk level
 */
export function getRiskColor(riskLevel: RiskLevel): string {
  switch (riskLevel) {
    case 'Low Risk':
      return 'bg-green-100 text-green-800';
    case 'Medium Risk':
      return 'bg-orange-100 text-orange-800';
    case 'High Risk':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

/**
 * Get risk emoji
 */
export function getRiskEmoji(riskLevel: RiskLevel): string {
  switch (riskLevel) {
    case 'Low Risk':
      return '✅';
    case 'Medium Risk':
      return '⚠️';
    case 'High Risk':
      return '🚨';
    default:
      return '❓';
  }
}

/**
 * Format currency (Rands)
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
  }).format(amount);
}

/**
 * Truncate text
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

/**
 * Get sentiment color
 */
export function getSentimentColor(sentiment: string): string {
  switch (sentiment.toLowerCase()) {
    case 'positive':
      return 'text-green-600';
    case 'negative':
      return 'text-red-600';
    case 'neutral':
      return 'text-gray-600';
    default:
      return 'text-gray-600';
  }
}

/**
 * Get sentiment emoji
 */
export function getSentimentEmoji(sentiment: string): string {
  switch (sentiment.toLowerCase()) {
    case 'positive':
      return '😊';
    case 'negative':
      return '😞';
    case 'neutral':
      return '😐';
    default:
      return '🤔';
  }
}
