'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '../../components/auth/ProtectedRoute';
import { 
  SparklesIcon, 
  SunIcon,
  CloudIcon,
  BeakerIcon,
  ChartBarIcon,
  UserGroupIcon,
  ShoppingBagIcon,
  ChatBubbleLeftRightIcon,
  CalendarDaysIcon,
  BellAlertIcon,
  CurrencyDollarIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';

function DashboardContent() {
  const { user } = useAuth();

  const featureCards = [
    {
      title: 'Plantation Guidance',
      description: 'Receive expert advice on plantation techniques, crop selection, and sustainable farming methods.',
      emoji: '🌾',
      icon: AcademicCapIcon,
      badge: 'Expert Tips',
      tags: ['Free', 'Offline Mode'],
      gradient: 'from-emerald-400 to-green-600',
      bgGradient: 'from-emerald-50 to-green-50',
      iconColor: 'text-emerald-600',
      href: '/features/plantation'
    },
    {
      title: 'Crop Planning',
      description: 'Plan your season with confidence and unlock your farm\'s true potential for a more profitable and sustainable future.',
      emoji: '🚜',
      icon: CalendarDaysIcon,
      badge: 'Strategic',
      tags: ['Smart Planning', 'Seasonal'],
      gradient: 'from-blue-400 to-indigo-600',
      bgGradient: 'from-blue-50 to-indigo-50',
      iconColor: 'text-blue-600',
      href: '/features/crop-planning'
    },
    {
      title: 'Labour Scheduling & Management',
      description: 'Optimize workforce allocation, track shifts, and get automated alerts for labor shortages and overtime.',
      emoji: '👷',
      icon: BellAlertIcon,
      badge: 'AI-Powered',
      tags: ['Auto-Scheduling', 'Predictive Analytics'],
      gradient: 'from-orange-400 to-red-600',
      bgGradient: 'from-orange-50 to-red-50',
      iconColor: 'text-orange-600',
      href: '/features/labor-scheduling'
    },
    {
      title: 'Farmer Forum',
      description: 'Connect with farmers, share knowledge, buy/sell equipment, read expert articles, and join live sessions.',
      emoji: '💬',
      icon: ChatBubbleLeftRightIcon,
      badge: 'NEW',
      tags: ['Discussions', 'Marketplace', 'Experts'],
      gradient: 'from-green-400 to-emerald-600',
      bgGradient: 'from-green-50 to-emerald-50',
      iconColor: 'text-green-600',
      href: '/features/farmer-forum'
    },
    {
      title: 'Weather Check',
      description: 'Check current weather of your place and weather for upcoming hours and days to plan your farming practices.',
      emoji: '🌤️',
      icon: CloudIcon,
      badge: 'Real-time',
      tags: ['7-Day Forecast', 'Hourly Updates'],
      gradient: 'from-sky-400 to-blue-600',
      bgGradient: 'from-sky-50 to-blue-50',
      iconColor: 'text-sky-600',
      href: '/weather'
    },
    {
      title: 'Farmer Connection',
      description: 'Connect with fellow farmers, share experiences, resources to improve your farming practices.',
      emoji: '🤝',
      icon: UserGroupIcon,
      badge: 'Community',
      tags: ['Local Network', 'Verified Farmers'],
      gradient: 'from-indigo-400 to-purple-600',
      bgGradient: 'from-indigo-50 to-purple-50',
      iconColor: 'text-indigo-600',
      href: '/features/farmer-network'
    },
    {
      title: 'Shopkeeper Listings',
      description: 'Discover local shopkeepers offering quality agricultural products and services tailored to your needs.',
      emoji: '🏪',
      icon: ShoppingBagIcon,
      badge: 'Local Network',
      tags: ['Verified Sellers', 'Best Prices'],
      gradient: 'from-pink-400 to-rose-600',
      bgGradient: 'from-pink-50 to-rose-50',
      iconColor: 'text-pink-600',
      href: '/marketplace'
    },
    {
      title: 'AI ChatBot',
      description: 'Get instant answers to your farming questions with our intelligent chatbot. Cultivating knowledge, Harvesting Growth.',
      emoji: '🤖',
      icon: SparklesIcon,
      badge: '24/7 Support',
      tags: ['Voice Input', 'Multi-language'],
      gradient: 'from-teal-400 to-cyan-600',
      bgGradient: 'from-teal-50 to-cyan-50',
      iconColor: 'text-teal-600',
      href: '/features/chatbot'
    },
    {
      title: 'Crop Recommendation',
      description: 'Find the best crops to cultivate based on your soil and weather conditions for optimal yield.',
      emoji: '🌱',
      icon: SparklesIcon,
      badge: 'AI Powered',
      tags: ['Instant Results', '95% Accuracy'],
      gradient: 'from-green-500 to-emerald-700',
      bgGradient: 'from-green-50 to-emerald-50',
      iconColor: 'text-green-700',
      href: '/features/crop-recommendation'
    },
    {
      title: 'Yield Prediction',
      description: 'Predict the expected yield for different crops using advanced machine learning models.',
      emoji: '📊',
      icon: ChartBarIcon,
      badge: 'ML Analytics',
      tags: ['Data-Driven', 'Historical Data'],
      gradient: 'from-blue-500 to-indigo-700',
      bgGradient: 'from-blue-50 to-indigo-50',
      iconColor: 'text-blue-700',
      href: '/features/yield-prediction'
    },
    {
      title: 'Disease Prediction',
      description: 'Detect plant diseases early and get preventive measures and treatment recommendations.',
      emoji: '🔬',
      icon: BeakerIcon,
      badge: 'Early Detection',
      tags: ['Image Recognition', 'Instant Diagnosis'],
      gradient: 'from-red-500 to-rose-700',
      bgGradient: 'from-red-50 to-rose-50',
      iconColor: 'text-red-700',
      href: '/features/disease-detection'
    },
    {
      title: 'Organic Farming Guide',
      description: 'Learn sustainable organic practices—from soil preparation to eco-friendly pest control.',
      emoji: '🌿',
      icon: SunIcon,
      badge: 'Sustainable',
      tags: ['Eco-Friendly', 'Chemical-Free'],
      gradient: 'from-lime-500 to-green-700',
      bgGradient: 'from-lime-50 to-green-50',
      iconColor: 'text-lime-700',
      href: '/features/organic-farming'
    },
    {
      title: 'Crop Price Tracker',
      description: 'Track real-time mandi prices for crops across states and markets to make informed selling decisions.',
      emoji: '💰',
      icon: CurrencyDollarIcon,
      badge: 'Market Data',
      tags: ['Live Prices', 'All States'],
      gradient: 'from-yellow-500 to-amber-700',
      bgGradient: 'from-yellow-50 to-amber-50',
      iconColor: 'text-yellow-700',
      href: '/features/price-tracker'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-green-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-200/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mb-8"
          >
            {/* Premium Badge */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center space-x-2 px-5 py-2 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full mb-6 border border-green-200 shadow-sm"
            >
              <SparklesIcon className="w-5 h-5 text-green-600" />
              <span className="text-sm font-semibold text-green-800">Premium Agricultural Platform</span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-green-700 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Comprehensive
              </span>
              <br />
              <span className="text-gray-800">Agricultural Solutions</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-light">
              Explore our cutting-edge tools designed to revolutionize your farming experience with{' '}
              <span className="font-semibold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">AI-powered insights</span> and{' '}
              <span className="font-semibold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">community collaboration</span>
            </p>
          </motion.div>
          
          {user && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="inline-flex items-center space-x-3 px-8 py-4 bg-white rounded-2xl shadow-lg border border-green-100"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-2xl shadow-md">
                👋
              </div>
              <div className="text-left">
                <p className="text-sm text-gray-500 font-medium">Welcome back,</p>
                <p className="text-lg font-bold text-gray-800">{user.firstName}!</p>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {featureCards.map((card, index) => {
            const IconComponent = card.icon;
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03, duration: 0.3 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group"
              >
                <Link href={card.href} prefetch={false}>
                  <div className="relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-gray-100 h-full backdrop-blur-sm cursor-pointer">
                    {/* Gradient Background Header */}
                    <div className={`relative h-48 bg-gradient-to-br ${card.bgGradient} flex flex-col items-center justify-center p-6 overflow-hidden`}>
                      {/* Decorative circles */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full -mr-16 -mt-16"></div>
                      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/20 rounded-full -ml-12 -mb-12"></div>
                      
                      {/* Badge */}
                      <div className={`absolute top-4 left-4 bg-gradient-to-r ${card.gradient} text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm`}>
                        {card.badge}
                      </div>
                      
                      {/* Icon Container */}
                      <div className="relative z-10">
                        <div className="w-20 h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center mb-3 group-hover:shadow-xl transition-all duration-200 group-hover:scale-105">
                          <IconComponent className={`w-10 h-10 ${card.iconColor} transition-transform duration-200`} />
                        </div>
                      </div>
                      
                      {/* Emoji */}
                      <span className="text-4xl group-hover:scale-110 transition-transform duration-200">
                        {card.emoji}
                      </span>
                    </div>
                    
                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-green-600 group-hover:to-emerald-600 group-hover:bg-clip-text transition-all duration-300 line-clamp-2 min-h-[3.5rem]">
                        {card.title}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-4">
                        {card.description}
                      </p>
                      
                      {/* Action Button */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <span className="text-green-600 font-semibold text-sm group-hover:text-green-700">
                          Explore Now
                        </span>
                        <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:translate-x-1 transition-all duration-200">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    
                    {/* Hover Glow Effect */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none`}></div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-20"
        >
          <div className="relative bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 rounded-[2.5rem] p-12 md:p-16 shadow-2xl overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full -ml-32 -mb-32 blur-2xl"></div>
            
            {/* Pattern Overlay */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}></div>
            </div>
            
            <div className="relative z-10 text-center">
              {/* Icon - Smaller */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1, type: "spring", stiffness: 200 }}
                className="inline-flex items-center justify-center w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl mb-4 shadow-xl"
              >
                <SparklesIcon className="w-7 h-7 text-white" />
              </motion.div>
              
              {/* Heading - Smaller */}
              <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-3 leading-tight">
                Ready to Transform Your Farming?
              </h2>
              
              {/* Description - Shorter */}
              <p className="text-green-50 text-sm md:text-base mb-6 max-w-2xl mx-auto leading-relaxed">
                Join thousands of farmers using AI-powered insights to increase yields and reduce costs.
              </p>
              
              {/* Buttons - Smaller */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-8">
                <Link href="/features/crop-recommendation">
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="group px-6 py-3 bg-white text-green-700 rounded-xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center space-x-2 text-sm"
                  >
                    <span>Get Started Now</span>
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </motion.button>
                </Link>
                
                <Link href="/contact">
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-6 py-3 bg-transparent text-white rounded-xl font-bold border-2 border-white hover:bg-white/10 backdrop-blur-sm transition-all duration-300 shadow-lg text-sm"
                  >
                    Contact Support
                  </motion.button>
                </Link>
              </div>
              
              {/* Stats - Compact */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="grid grid-cols-3 gap-6 max-w-xl mx-auto"
              >
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-white mb-0.5">10K+</div>
                  <div className="text-green-100 text-xs font-medium">Active Farmers</div>
                </div>
                <div className="text-center border-x border-white/30">
                  <div className="text-2xl md:text-3xl font-bold text-white mb-0.5">50+</div>
                  <div className="text-green-100 text-xs font-medium">AI Features</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-white mb-0.5">98%</div>
                  <div className="text-green-100 text-xs font-medium">Satisfaction</div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Footer Section */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-20 bg-gradient-to-br from-green-50 via-emerald-50 to-green-50 rounded-3xl shadow-xl border border-green-100 overflow-hidden"
        >
          <div className="p-12">
            {/* Main Footer Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
              {/* About Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-white text-xl font-bold">A</span>
                  </div>
                  <h3 className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    AgriSense
                  </h3>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Empowering farmers with AI-driven insights for smarter, sustainable, and profitable farming.
                </p>
              </div>

              {/* Quick Links */}
              <div className="space-y-4">
                <h4 className="text-lg font-bold text-gray-800 mb-4">Quick Links</h4>
                <ul className="space-y-2">
                  {[
                    { name: 'Dashboard', href: '/dashboard' },
                    { name: 'Crop Recommendation', href: '/features/crop-recommendation' },
                    { name: 'Weather Forecast', href: '/weather' },
                    { name: 'Price Tracker', href: '/features/price-tracker' },
                    { name: 'Support', href: '/contact' }
                  ].map((link) => (
                    <li key={link.name}>
                      <Link 
                        href={link.href}
                        className="text-gray-600 hover:text-green-600 text-sm transition-colors duration-200 flex items-center gap-2 group"
                      >
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full group-hover:scale-150 transition-transform"></span>
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <h4 className="text-lg font-bold text-gray-800 mb-4">Contact Us</h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Email</p>
                      <a href="mailto:support@agrisense.com" className="text-sm text-gray-700 hover:text-green-600 transition-colors">
                        support@agrisense.com
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Phone</p>
                      <a href="tel:+911234567890" className="text-sm text-gray-700 hover:text-green-600 transition-colors">
                        +91 123 456 7890
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="space-y-4">
                <h4 className="text-lg font-bold text-gray-800 mb-4">Follow Us</h4>
                <p className="text-gray-600 text-sm mb-4">
                  Stay connected for updates and farming tips
                </p>
                <div className="flex gap-3">
                  {[
                    { name: 'Facebook', icon: 'M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z', color: 'from-blue-500 to-blue-600' },
                    { name: 'Instagram', icon: 'M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01M6.5 6.5h11a2 2 0 012 2v11a2 2 0 01-2 2h-11a2 2 0 01-2-2v-11a2 2 0 012-2z', color: 'from-pink-500 to-purple-600' },
                    { name: 'YouTube', icon: 'M23 7s-.2-1.4-.8-2c-.8-.8-1.6-.8-2-.9C17.3 4 12 4 12 4s-5.3 0-8.2.1c-.4.1-1.2.1-2 .9-.6.6-.8 2-.8 2S1 8.5 1 10.5v1.5c0 2 .2 3.5.2 3.5s.2 1.4.8 2c.8.8 1.8.8 2.2.9 1.6.1 8 .2 8 .2s5.3 0 8.2-.1c.4-.1 1.2-.1 2-.9.6-.6.8-2 .8-2s.2-1.5.2-3.5v-1.5c0-2-.2-3.5-.2-3.5zM9.5 15.5v-7l6.5 3.5-6.5 3.5z', color: 'from-red-500 to-red-600' }
                  ].map((social) => (
                    <a
                      key={social.name}
                      href="#"
                      className={`w-10 h-10 bg-gradient-to-br ${social.color} rounded-xl flex items-center justify-center shadow-md hover:shadow-lg hover:scale-110 transition-all duration-200 group`}
                      title={social.name}
                    >
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={social.icon} />
                      </svg>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="pt-8 border-t border-green-200">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-sm text-gray-600">
                  © {new Date().getFullYear()} AgriSense. All rights reserved.
                </p>
                <div className="flex items-center gap-6">
                  <Link href="/privacy" className="text-sm text-gray-600 hover:text-green-600 transition-colors">
                    Privacy Policy
                  </Link>
                  <Link href="/terms" className="text-sm text-gray-600 hover:text-green-600 transition-colors">
                    Terms of Service
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </motion.footer>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
