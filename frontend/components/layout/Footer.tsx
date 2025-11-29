'use client';

import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { 
  MapPinIcon, 
  PhoneIcon, 
  EnvelopeIcon,
  HeartIcon 
} from '@heroicons/react/24/outline';

const footerLinks = {
  product: [
    { key: 'features', href: '/features' },
    { key: 'pricing', href: '/pricing' },
    { key: 'demo', href: '/demo' },
    { key: 'api', href: '/api-docs' },
  ],
  company: [
    { key: 'about', href: '/about' },
    { key: 'careers', href: '/careers' },
    { key: 'blog', href: '/blog' },
    { key: 'contact', href: '/contact' },
  ],
  resources: [
    { key: 'documentation', href: '/docs' },
    { key: 'help_center', href: '/help' },
    { key: 'community', href: '/forum' },
    { key: 'status', href: '/status' },
  ],
  legal: [
    { key: 'privacy', href: '/privacy' },
    { key: 'terms', href: '/terms' },
    { key: 'security', href: '/security' },
    { key: 'cookies', href: '/cookies' },
  ],
};

const socialLinks = [
  { name: 'Twitter', href: '#', icon: '🐦' },
  { name: 'Facebook', href: '#', icon: '📘' },
  { name: 'LinkedIn', href: '#', icon: '💼' },
  { name: 'YouTube', href: '#', icon: '📺' },
];

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main footer content */}
        <div className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
            {/* Company info */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Link href="/" className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">🌾</span>
                  </div>
                  <span className="text-xl font-bold font-display">AgriSense</span>
                </Link>
                
                <p className="text-gray-300 mb-6 leading-relaxed">
                  {t('footer.description', 'Empowering farmers worldwide with AI-driven agricultural solutions for sustainable and profitable farming.')}
                </p>

                {/* Contact info */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-gray-300">
                    <MapPinIcon className="w-5 h-5 text-primary-400" />
                    <span className="text-sm">
                      {t('footer.address', 'Bangalore, Karnataka, India')}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-300">
                    <PhoneIcon className="w-5 h-5 text-primary-400" />
                    <span className="text-sm">+91 80 1234 5678</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-300">
                    <EnvelopeIcon className="w-5 h-5 text-primary-400" />
                    <span className="text-sm">hello@agrisense.ai</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Footer links */}
            {Object.entries(footerLinks).map(([category, links], index) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <h3 className="text-lg font-semibold mb-4 text-white">
                  {t(`footer.${category}`, category.charAt(0).toUpperCase() + category.slice(1))}
                </h3>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link.key}>
                      <Link
                        href={link.href}
                        className="text-gray-300 hover:text-primary-400 transition-colors text-sm"
                      >
                        {t(`footer.links.${link.key}`, link.key.replace('_', ' '))}
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Newsletter signup */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="py-8 border-t border-gray-800"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">
                {t('footer.newsletter.title', 'Stay Updated')}
              </h3>
              <p className="text-gray-300 text-sm">
                {t('footer.newsletter.description', 'Get the latest agricultural insights and product updates.')}
              </p>
            </div>
            
            <div className="flex gap-2 w-full md:w-auto">
              <input
                type="email"
                placeholder={t('footer.newsletter.placeholder', 'Enter your email')}
                className="flex-1 md:w-64 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-white placeholder-gray-400"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 bg-primary-600 hover:bg-primary-700 rounded-lg font-medium transition-colors"
              >
                {t('footer.newsletter.subscribe', 'Subscribe')}
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Bottom footer */}
        <div className="py-6 border-t border-gray-800">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="flex items-center gap-2 text-gray-400 text-sm"
            >
              <span>© 2024 AgriSense. Made with</span>
              <HeartIcon className="w-4 h-4 text-red-500" />
              <span>for farmers worldwide.</span>
            </motion.div>

            {/* Social links */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="flex items-center gap-4"
            >
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center transition-colors"
                  title={social.name}
                >
                  <span className="text-lg">{social.icon}</span>
                </motion.a>
              ))}
            </motion.div>

            {/* Language selector */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="flex items-center gap-2"
            >
              <span className="text-gray-400 text-sm">🌐</span>
              <select className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option value="en">English</option>
                <option value="hi">हिंदी</option>
              </select>
            </motion.div>
          </div>
        </div>
      </div>
    </footer>
  );
}