"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  TrendingUp,
  Users,
  Target,
  Brain,
  Loader2,
} from "lucide-react";
import { motion } from "framer-motion";

interface AnalyticsData {
  busyHours: number[];
  preferredDays: number[];
  averageMeetingDuration: number;
  productivityInsights: string[];
  weeklyStats: {
    totalEvents: number;
    totalHours: number;
    collaborativeEvents: number;
    privateEvents: number;
  };
}

export function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch("/api/analytics");
        if (response.ok) {
          const data = await response.json();
          setAnalytics(data);
        } else {
          loadMockData();
        }
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
        loadMockData();
      } finally {
        setLoading(false);
      }
    };

    const loadMockData = () => {
      setAnalytics({
        busyHours: [9, 10, 14, 15],
        preferredDays: [1, 2, 3, 4],
        averageMeetingDuration: 45,
        productivityInsights: [
          "You schedule most meetings between 9-11 AM",
          "Tuesday is your most productive day",
          "You prefer 45-minute meetings over 60-minute ones",
          "Back-to-back meetings reduce your availability by 15%",
        ],
        weeklyStats: {
          totalEvents: 23,
          totalHours: 18.5,
          collaborativeEvents: 15,
          privateEvents: 8,
        },
      });
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
      </div>
    );
  }

  if (!analytics) return null;

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const Sparkles = ({ className }: { className?: string }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-blue-600" />
        <h2 className="text-xl md:text-2xl font-bold">
          Productivity Analytics
        </h2>
      </div>

      {/* Weekly Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: "Total Events",
            value: analytics.weeklyStats.totalEvents,
            icon: Calendar,
            note: "This week",
          },
          {
            title: "Total Hours",
            value: `${analytics.weeklyStats.totalHours}h`,
            icon: Clock,
            note: "Scheduled time",
          },
          {
            title: "Collaborative",
            value: analytics.weeklyStats.collaborativeEvents,
            icon: Users,
            note: "Team events",
          },
          {
            title: "Avg Duration",
            value: `${analytics.averageMeetingDuration}m`,
            icon: Target,
            note: "Per meeting",
          },
        ].map((stat, idx) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-xl md:text-2xl font-bold">
                  {stat.value}
                </div>
                <p className="text-xs text-muted-foreground">{stat.note}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Peak Hours + Preferred Days */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-4 h-4" /> Peak Hours
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {analytics.busyHours.map((hour) => (
                  <Badge key={hour} variant="secondary">
                    {hour}:00 - {hour + 1}:00
                  </Badge>
                ))}
              </div>
              <p className="text-sm text-muted-foreground mt-3">
                Your most scheduled hours of the day
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Preferred Days
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {analytics.preferredDays.map((day) => (
                  <Badge key={day} variant="outline">
                    {dayNames[day]}
                  </Badge>
                ))}
              </div>
              <p className="text-sm text-muted-foreground mt-3">
                Days when you schedule the most events
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* AI Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-4 h-4" /> AI Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.productivityInsights.map((insight, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20"
                >
                  <Sparkles className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm">{insight}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
