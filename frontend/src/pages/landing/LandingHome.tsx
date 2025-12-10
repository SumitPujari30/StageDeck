import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Users, 
  Ticket, 
  Star, 
  ArrowRight, 
  CheckCircle,
  Sparkles,
  Globe,
  Shield,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

/**
 * Landing page component
 */

const features = [
  {
    icon: Calendar,
    title: 'Event Management',
    description: 'Create, manage, and promote events with our intuitive dashboard',
  },
  {
    icon: Ticket,
    title: 'Easy Booking',
    description: 'Seamless ticket booking experience for your attendees',
  },
  {
    icon: Users,
    title: 'Attendee Management',
    description: 'Track registrations and manage attendee information',
  },
  {
    icon: Zap,
    title: 'Real-time Updates',
    description: 'Get instant notifications about bookings and updates',
  },
  {
    icon: Globe,
    title: 'Global Reach',
    description: 'Reach audiences worldwide with our platform',
  },
  {
    icon: Shield,
    title: 'Secure Payments',
    description: 'Safe and secure payment processing for all transactions',
  },
];

const pricingPlans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    features: [
      'Up to 3 events',
      'Basic analytics',
      'Email support',
      '50 attendees per event',
    ],
    cta: 'Get Started',
    variant: 'outline' as const,
  },
  {
    name: 'Premium',
    price: '$29',
    period: 'per month',
    features: [
      'Unlimited events',
      'Advanced analytics',
      'Priority support',
      'Unlimited attendees',
      'Custom branding',
      'Export data',
    ],
    cta: 'Start Free Trial',
    variant: 'gradient' as const,
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: 'contact us',
    features: [
      'Everything in Premium',
      'Dedicated account manager',
      'Custom integrations',
      'SLA guarantee',
      'Advanced security',
      'API access',
    ],
    cta: 'Contact Sales',
    variant: 'outline' as const,
  },
];

export const LandingHome: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold">
                S
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
                StageDeck
              </span>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">
                Features
              </a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">
                Pricing
              </a>
              <a href="#about" className="text-gray-600 hover:text-gray-900 transition-colors">
                About
              </a>
            </div>
            
            <div className="flex items-center gap-4">
              <Link to="/auth/user/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link to="/auth/user/register">
                <Button variant="gradient">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>
      
      {/* Hero Section */}
      <section className="pt-20 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="secondary" className="mb-4">
              <Sparkles className="w-3 h-3 mr-1" />
              New: AI-powered event recommendations
            </Badge>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6">
              Manage Events
              <span className="block bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
                Like Never Before
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Create, manage, and promote your events with our all-in-one platform. 
              From small meetups to large conferences, we've got you covered.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth/user/register">
                <Button size="xl" variant="gradient" rightIcon={<ArrowRight className="w-5 h-5" />}>
                  Start Free Trial
                </Button>
              </Link>
              <Link to="/auth/admin/register">
                <Button size="xl" variant="outline">
                  Admin Access
                </Button>
              </Link>
            </div>
            
            <div className="mt-12 flex items-center justify-center gap-8 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>14-day free trial</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </motion.div>
          
          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-16"
          >
            <div className="relative mx-auto max-w-6xl">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-200 to-secondary-200 blur-3xl opacity-30" />
              <Card className="relative overflow-hidden shadow-2xl">
                <div className="aspect-video bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center">
                  <div className="text-center">
                    <Calendar className="w-24 h-24 text-primary-500 mx-auto mb-4" />
                    <p className="text-2xl font-semibold text-gray-700">Event Dashboard Preview</p>
                    <p className="text-gray-500 mt-2">Your events, beautifully organized</p>
                  </div>
                </div>
              </Card>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Powerful features to help you create memorable events
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full hover:shadow-soft-lg transition-shadow duration-300">
                    <CardContent className="p-6">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center mb-4">
                        <Icon className="w-6 h-6 text-primary-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
      
      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the plan that fits your needs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={plan.popular ? 'relative' : ''}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                    <Badge variant="default" className="shadow-lg">
                      <Star className="w-3 h-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <Card className={`h-full ${plan.popular ? 'border-primary-500 shadow-soft-lg' : ''}`}>
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {plan.name}
                    </h3>
                    <div className="mb-6">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      <span className="text-gray-600 ml-2">/{plan.period}</span>
                    </div>
                    
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <Link to="/auth/user/register" className="block">
                      <Button 
                        className="w-full" 
                        variant={plan.variant}
                        size="lg"
                      >
                        {plan.cta}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary-500 to-secondary-500">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of event organizers who trust StageDeck
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth/user/register">
              <Button size="xl" variant="secondary">
                Start Your Free Trial
              </Button>
            </Link>
            <Link to="/auth/admin/login">
              <Button size="xl" variant="outline" className="bg-white/10 text-white border-white/30 hover:bg-white/20">
                Admin Portal
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold">
                S
              </div>
              <span className="text-xl font-bold text-white">StageDeck</span>
            </div>
            
            <div className="text-center md:text-right">
              <p>&copy; 2024 StageDeck. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
