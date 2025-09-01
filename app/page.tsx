import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';   

import { 
  Calendar, 
  Users, 
  Brain, 
  Globe, 
  Clock, 
  Shield,
  Sparkles,
  ArrowRight,
  Check
} from 'lucide-react';

export default function HomePage() {
  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Scheduling',
      description: 'Intelligent suggestions for optimal meeting times based on availability patterns',
    },
    {
      icon: Users,
      title: 'Real-time Collaboration',
      description: 'Live calendar sharing with instant updates and conflict resolution',
    },
    {
      icon: Globe,
      title: 'Global Time Zones',
      description: 'Seamless scheduling across different time zones with automatic conversion',
    },
    {
      icon: Clock,
      title: 'Smart Conflicts Detection',
      description: 'Proactive conflict detection with alternative time suggestions',
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'Bank-level security with role-based access control and data encryption',
    },
    {
      icon: Sparkles,
      title: 'Weather Integration',
      description: 'Weather-aware scheduling for outdoor events with smart recommendations',
    },
  ];

  const benefits = [
    'Save 3+ hours per week on scheduling',
    'Reduce meeting conflicts by 85%',
    'Improve team coordination and productivity',
    'Smart travel time calculations',
    'Automated reminder notifications',
    'Seamless external calendar integration'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Navigation */}
      <nav className="border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Calendar className="w-6 h-6 text-blue-600" />
              <span className="ml-2 text-xl font-bold">Smart Event Scheduler</span>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" asChild>
                <Link href="/auth/signin">Sign In</Link>
              </Button>
              <Button asChild>
                <Link href="/auth/signup">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <Badge className="mb-4" variant="secondary">
            <Sparkles className="w-3 h-3 mr-1" />
            AI-Powered Scheduling
          </Badge>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Schedule Smarter,
            <br />
            Not Harder
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto">
            Transform your calendar management with AI-powered scheduling, real-time collaboration, 
            and intelligent conflict resolution. The future of productive scheduling is here.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="text-lg px-8 py-3">
              <Link href="/auth/signup" className="flex items-center gap-2">
                Start Free Trial
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-lg px-8 py-3">
              <Link href="/auth/signin">View Demo</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything You Need for Perfect Scheduling
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Powerful features designed for modern teams and individuals
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <feature.icon className="w-12 h-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Why Teams Choose Our Platform
              </h2>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                      <Check className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-600 rounded-lg transform rotate-3"></div>
              <img
                src="/team.png"
                alt="Team collaboration"
                className="relative rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardContent className="p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Transform Your Scheduling?
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              Join thousands of users who have revolutionized their calendar management
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild className="text-lg px-8 py-3">
                <Link href="/auth/signup">Start Your Free Trial</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-lg px-8 py-3 border-white text-white hover:bg-white hover:text-blue-600">
                <Link href="/auth/signin">Schedule a Demo</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-6 h-6" />
              <span className="text-lg font-semibold">Smart Event Scheduler</span>
            </div>
            <p className="text-gray-400">
              © 2025 Smart Event Scheduler. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}