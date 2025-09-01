"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  Plus,
  BarChart3,
  Settings,
  Users,
  Tag,
  Clock,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const sidebarItems = [
  { title: "Calendar", href: "/dashboard", icon: Calendar },
  { title: "Analytics", href: "/analytics", icon: BarChart3 },
  { title: "Team Calendar", href: "/team", icon: Users },
  { title: "Categories", href: "/categories", icon: Tag },
  { title: "Settings", href: "/settings", icon: Settings },
];

const quickActions = [
  {
    title: "Quick Meeting",
    description: "30 min meeting",
    icon: Clock,
    action: "create-meeting",
  },
  {
    title: "AI Schedule",
    description: "Smart planning",
    icon: Sparkles,
    action: "ai-schedule",
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const SidebarContent = (
    <div
      className={cn(
        "flex h-full flex-col border-r bg-white dark:bg-gray-900 transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
      <div className="p-4">
        <div className="flex items-center justify-between">
          {!collapsed && <h2 className="text-lg font-semibold">Navigation</h2>}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="ml-auto hidden md:flex"
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </Button>
          {/* Mobile close button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileOpen(false)}
            className="ml-auto md:hidden"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-4 overflow-y-auto">
        <nav className="space-y-2">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  className={cn("w-full justify-start", collapsed && "px-2")}
                >
                  <item.icon className="w-4 h-4 shrink-0" />
                  {!collapsed && (
                    <span className="ml-2 truncate">{item.title}</span>
                  )}
                </Button>
              </Link>
            );
          })}
        </nav>

        {!collapsed && (
          <div className="mt-8">
            <Separator className="my-4" />

            {/* Quick Actions */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Quick Actions
              </h3>

              <Button className="w-full justify-start gap-2" variant="outline">
                <Plus className="w-4 h-4" />
                New Event
              </Button>

              {quickActions.map((action) => (
                <motion.div
                  key={action.action}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-3">
                      <div className="flex items-center gap-3">
                        <action.icon className="w-5 h-5 text-blue-600 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">{action.title}</p>
                          <p className="text-xs text-gray-500">
                            {action.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <Separator className="my-4" />

            {/* Stats */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">This Week</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Events</span>
                  <Badge variant="secondary">12</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Hours</span>
                  <Badge variant="secondary">8.5h</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Meetings</span>
                  <Badge variant="secondary">7</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex">{SidebarContent}</div>

      {/* Mobile Sidebar (overlay) */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="w-64">{SidebarContent}</div>
          <div
            className="flex-1 bg-black/50"
            onClick={() => setMobileOpen(false)}
          />
        </div>
      )}

      {/* Mobile Toggle Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setMobileOpen(true)}
        className="fixed bottom-4 left-4 z-50 rounded-full p-2 shadow-md bg-white dark:bg-gray-800 md:hidden"
      >
        <Menu className="w-5 h-5" />
      </Button>
    </>
  );
}
