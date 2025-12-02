// app/page.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FileText, CheckCircle, Shield, Zap } from 'lucide-react';

export default function HomePage() {
  const features = [
    {
      icon: FileText,
      title: 'Legal Document Analysis',
      description:
        'Analyze contracts, agreements, and legal documents. Extract parties, dates, amounts, and assess risks.',
    },
    {
      icon: Shield,
      title: 'Risk Assessment',
      description:
        'Automatic risk scoring based on legal terms and clauses. Identify potential issues before they become problems.',
    },
    {
      icon: Zap,
      title: 'Instant Insights',
      description:
        'Get comprehensive analysis in seconds. Save time and make informed decisions faster.',
    },
    {
      icon: CheckCircle,
      title: 'South African Context',
      description:
        'Built for SA businesses. Recognizes Pty Ltd, CC companies, Rands (R), and SA legal frameworks.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="bg-blue-600 text-white p-2 rounded-lg">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  SmartDoc AI
                </h1>
                <p className="text-xs text-gray-500">Powered by CenturionAI</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/signup">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            AI-Powered Legal Document Analysis
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Transform how you analyze legal documents. Get instant insights,
            risk assessments, and comprehensive analysis for South African
            businesses.
          </p>
          <div className="flex justify-center space-x-4">
            <Link href="/signup">
              <Button size="lg" className="text-lg px-8">
                Start Analyzing Free
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="text-lg px-8">
                Try Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            Why SmartDoc AI?
          </h3>
          <p className="text-lg text-gray-600">
            Built specifically for South African businesses and legal
            professionals
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <feature.icon className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                {feature.title}
              </h4>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-blue-600 rounded-2xl p-12 text-center text-white">
          <h3 className="text-3xl font-bold mb-4">
            Ready to Transform Your Document Analysis?
          </h3>
          <p className="text-xl mb-8 opacity-90">
            Join South African businesses using SmartDoc AI today
          </p>
          <Link href="/signup">
            <Button
              size="lg"
              variant="secondary"
              className="text-lg px-8 bg-white text-blue-600 hover:bg-gray-100"
            >
              Get Started - It's Free
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>
              © 2024 SmartDoc AI by CenturionAI. Built for South African
              Businesses.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}