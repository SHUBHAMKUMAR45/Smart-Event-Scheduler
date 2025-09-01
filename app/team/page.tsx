"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Users, Plus, Mail, Shield, Calendar, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface TeamMember {
  _id: string;
  name: string;
  email: string;
  image?: string;
  permissions: "read" | "write" | "admin";
  joinedAt: string; // keep as string from API
}

export default function TeamPage() {
  const { data: session } = useSession();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteEmail, setInviteEmail] = useState("");
  const [invitePermission, setInvitePermission] = useState<
    "read" | "write" | "admin"
  >("read");

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      const res = await fetch("/api/team"); // 🔗 your backend endpoint
      if (!res.ok) throw new Error("Failed to fetch");
      const data: TeamMember[] = await res.json();
      setTeamMembers(data);
    } catch (error) {
      console.error("Failed to fetch team members:", error);
      toast.error("Failed to load team members");
    } finally {
      setLoading(false);
    }
  };

  const inviteTeamMember = async () => {
    if (!inviteEmail || !inviteEmail.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      const res = await fetch("/api/team/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: inviteEmail,
          permissions: invitePermission,
        }),
      });

      if (!res.ok) throw new Error("Failed to invite");

      const newMember: TeamMember = await res.json();
      setTeamMembers((prev) => [...prev, newMember]);
      setInviteEmail("");
      toast.success(`Invitation sent to ${inviteEmail}`);
    } catch (error) {
      console.error("Failed to invite team member:", error);
      toast.error("Failed to send invitation");
    }
  };

  const updatePermissions = async (
    memberId: string,
    newPermissions: "read" | "write" | "admin"
  ) => {
    try {
      const res = await fetch(`/api/team/${memberId}/permissions`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ permissions: newPermissions }),
      });

      if (!res.ok) throw new Error("Failed to update permissions");

      setTeamMembers((prev) =>
        prev.map((m) =>
          m._id === memberId ? { ...m, permissions: newPermissions } : m
        )
      );
      toast.success("Permissions updated");
    } catch (error) {
      console.error("Failed to update permissions:", error);
      toast.error("Failed to update permissions");
    }
  };

  const removeMember = async (memberId: string) => {
    try {
      const res = await fetch(`/api/team/${memberId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to remove member");
      setTeamMembers((prev) => prev.filter((m) => m._id !== memberId));
      toast.success("Team member removed");
    } catch (error) {
      console.error("Failed to remove member:", error);
      toast.error("Failed to remove team member");
    }
  };

  const getPermissionColor = (permission: string) => {
    switch (permission) {
      case "admin":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "write":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "read":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="grid gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse flex items-center space-x-4">
                  <div className="rounded-full bg-gray-200 h-12 w-12"></div>
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Users className="w-8 h-8" />
          Team Calendar
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Manage team members and calendar sharing permissions
        </p>
      </div>

      {/* Invite New Member */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Invite Team Member
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              placeholder="Enter email address..."
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && inviteTeamMember()}
              className="flex-1"
            />
            <Select
              value={invitePermission}
              onValueChange={setInvitePermission}
            >
              <SelectTrigger className="w-full sm:w-32">
                <SelectValue placeholder="Permission" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="read">Read</SelectItem>
                <SelectItem value="write">Write</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
            <Button className="w-full sm:w-auto" onClick={inviteTeamMember}>
              <Mail className="w-4 h-4 mr-2" />
              Invite
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Team Members */}
      <Card>
        <CardHeader>
          <CardTitle>Team Members ({teamMembers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 border rounded-lg"
              >
                {/* Left side */}
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={member.image} alt={member.name} />
                    <AvatarFallback>
                      {member.name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{member.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {member.email}
                    </p>
                    <p className="text-xs text-gray-500">
                      Joined {new Date(member.joinedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Right side */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <Badge className={getPermissionColor(member.permissions)}>
                    <Shield className="w-3 h-3 mr-1" />
                    {member.permissions}
                  </Badge>

                  {member.email !== session?.user?.email && (
                    <>
                      <Select
                        value={member.permissions}
                        onValueChange={(v: "read" | "write" | "admin") =>
                          updatePermissions(member._id, v)
                        }
                      >
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="read">Read</SelectItem>
                          <SelectItem value="write">Write</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>

                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => removeMember(member._id)}
                      >
                        Remove
                      </Button>
                    </>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Team Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Shared Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              This month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Team Hours
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0h</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Scheduled time
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Active Members
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teamMembers.length}</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Total members
            </p>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
