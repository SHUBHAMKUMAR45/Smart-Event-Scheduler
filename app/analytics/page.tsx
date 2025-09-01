'use client';

import { AnalyticsDashboard } from '@/components/dashboard/analytics-dashboard';
import { motion } from 'framer-motion';

export default function AnalyticsPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Analytics & Insights</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Understand your scheduling patterns and optimize your productivity
        </p>
      </div>

      <AnalyticsDashboard />
    </motion.div>
  );
}