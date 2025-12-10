import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';

/**
 * 404 Not Found page
 */

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md"
      >
        <div className="mb-8">
          <motion.h1
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-9xl font-bold bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent"
          >
            404
          </motion.h1>
        </div>
        
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Oops! Page not found
        </h2>
        
        <p className="text-gray-600 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/">
            <Button variant="gradient" leftIcon={<Home className="w-4 h-4" />}>
              Go to Homepage
            </Button>
          </Link>
          
          <Button
            variant="outline"
            onClick={() => window.history.back()}
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            Go Back
          </Button>
        </div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12"
        >
          <p className="text-sm text-gray-500">
            Need help? <Link to="/contact" className="text-primary-600 hover:text-primary-700">Contact support</Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};
