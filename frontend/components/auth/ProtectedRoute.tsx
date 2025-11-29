'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-lime-50 to-emerald-50 flex items-center justify-center">
        <motion.div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-gray-600 font-medium">Loading...</p>
        </motion.div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-lime-50 to-emerald-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-md w-full"
        >
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-green-100 p-8 text-center">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-20 h-20 bg-gradient-to-br from-green-600 to-lime-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-200"
            >
              <span className="text-white text-3xl">🔒</span>
            </motion.div>
            
            <h2 className="text-3xl font-bold bg-gradient-to-r from-green-700 via-green-600 to-lime-600 bg-clip-text text-transparent mb-4">
              Authentication Required
            </h2>
            
            <p className="text-gray-600 mb-8">
              Please sign in to access AgriSense features and start optimizing your farming operations.
            </p>
            
            <div className="space-y-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push('/auth/login')}
                className="w-full bg-gradient-to-r from-green-600 to-lime-600 text-white py-3.5 px-6 rounded-xl font-bold shadow-lg shadow-green-200 hover:shadow-xl transition-all"
              >
                Sign In
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push('/auth/register')}
                className="w-full bg-white text-green-700 py-3.5 px-6 rounded-xl font-semibold border-2 border-green-200 hover:bg-green-50 transition-all"
              >
                Create Account
              </motion.button>
            </div>
            
            <p className="text-sm text-gray-500 mt-6">
              New to AgriSense? Sign up for free and get access to all features!
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return <>{children}</>;
}