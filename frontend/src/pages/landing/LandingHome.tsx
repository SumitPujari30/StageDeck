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
              <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 transition-colors">
                How It Works
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
          
          {/* Hero Dashboard Mockup */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-16"
          >
            <div className="relative mx-auto max-w-6xl">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-200 to-secondary-200 blur-3xl opacity-30" />
              <Card className="relative overflow-hidden shadow-2xl">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-8">
                  {/* Dashboard Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">Featured Events</h3>
                      <p className="text-gray-600">Discover amazing experiences</p>
                    </div>
                    <Badge variant="default" className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white border-0">
                      <Sparkles className="w-3 h-3 mr-1" />
                      Live
                    </Badge>
                  </div>
                  
                  {/* Event Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { 
                        title: 'Tech Conference 2024',
                        category: 'Technology',
                        date: 'Dec 15, 2024',
                        attendees: '500+',
                        gradient: 'from-blue-500 to-cyan-500'
                      },
                      { 
                        title: 'Music Festival',
                        category: 'Entertainment',
                        date: 'Dec 20, 2024',
                        attendees: '1000+',
                        gradient: 'from-purple-500 to-pink-500'
                      },
                      { 
                        title: 'Art Exhibition',
                        category: 'Arts & Culture',
                        date: 'Dec 25, 2024',
                        attendees: '300+',
                        gradient: 'from-orange-500 to-red-500'
                      },
                    ].map((event, idx) => (
                      <div
                        key={idx}
                        className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                      >
                        <div className={`h-32 rounded-lg bg-gradient-to-br ${event.gradient} flex items-center justify-center mb-3`}>
                          <Calendar className="w-12 h-12 text-white" />
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-1">{event.title}</h4>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="text-xs">{event.category}</Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {event.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {event.attendees}
                          </span>
                        </div>
                      </div>
                    ))}
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
      
      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get started in minutes. It's that simple.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[
              {
                step: '1',
                title: 'Create Account',
                description: 'Sign up for free in seconds. No credit card required.',
                icon: Users,
                color: 'from-blue-500 to-cyan-500',
              },
              {
                step: '2',
                title: 'Browse Events',
                description: 'Discover amazing events tailored to your interests.',
                icon: Calendar,
                color: 'from-purple-500 to-pink-500',
              },
              {
                step: '3',
                title: 'Book Tickets',
                description: 'Secure your spot with just a few clicks.',
                icon: Ticket,
                color: 'from-orange-500 to-red-500',
              },
              {
                step: '4',
                title: 'Enjoy Event',
                description: 'Show your digital ticket and experience the magic.',
                icon: Star,
                color: 'from-green-500 to-emerald-500',
              },
            ].map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="relative"
                >
                  <Card className="h-full hover:shadow-soft-lg transition-shadow duration-300">
                    <CardContent className="p-6 text-center">
                      <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center mx-auto mb-4`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold text-sm">
                        {step.step}
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {step.title}
                      </h3>
                      <p className="text-gray-600">
                        {step.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary-500 to-secondary-500">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              Trusted by Thousands
            </h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Join the growing community of event goers and organizers
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[
              { number: '10K+', label: 'Active Users', icon: Users },
              { number: '5K+', label: 'Events Hosted', icon: Calendar },
              { number: '50K+', label: 'Tickets Sold', icon: Ticket },
              { number: '4.9/5', label: 'Average Rating', icon: Star },
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/20 transition-all duration-300">
                    <Icon className="w-12 h-12 text-white mx-auto mb-4" />
                    <div className="text-5xl font-bold text-white mb-2">
                      {stat.number}
                    </div>
                    <div className="text-white/90 font-medium">
                      {stat.label}
                    </div>
                  </div>
                </motion.div>
              );
            })}
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
