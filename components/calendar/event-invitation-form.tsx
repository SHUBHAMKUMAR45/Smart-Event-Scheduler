"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Mail, Users, Send, UserPlus, X } from "lucide-react"; // ✅ Added X
import { Attendee } from "@/types";
import { toast } from "sonner";

interface EventInvitationFormProps {
  attendees: Attendee[];
  onChange: (attendees: Attendee[]) => void;
  eventTitle?: string;
}

export function EventInvitationForm({
  attendees,
  onChange,
  eventTitle,
}: EventInvitationFormProps) {
  const [newAttendeeEmail, setNewAttendeeEmail] = useState("");
  const [newAttendeeName, setNewAttendeeName] = useState("");
  const [customMessage, setCustomMessage] = useState("");
  const [sendInvitations, setSendInvitations] = useState(true);

  const addAttendee = () => {
    if (!newAttendeeEmail || !newAttendeeEmail.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (attendees.find((a) => a.email === newAttendeeEmail)) {
      toast.error("This person is already invited");
      return;
    }

    const newAttendee: Attendee = {
      email: newAttendeeEmail,
      name: newAttendeeName || newAttendeeEmail.split("@")[0],
      status: "pending",
      isOptional: false,
    };

    onChange([...attendees, newAttendee]);
    setNewAttendeeEmail("");
    setNewAttendeeName("");
    toast.success("Attendee added");
  };

  const removeAttendee = (email: string) => {
    onChange(attendees.filter((a) => a.email !== email));
  };

  const toggleOptional = (email: string) => {
    onChange(
      attendees.map((a) =>
        a.email === email ? { ...a, isOptional: !a.isOptional } : a
      )
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "declined":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "tentative":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
    }
  };

  const sendInvitationEmails = async () => {
    try {
      // Mock email sending - replace with real service integration
      toast.success(`Invitations sent to ${attendees.length} attendees`);
    } catch (error) {
      console.error("Failed to send invitations:", error);
      toast.error("Failed to send invitations");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-4 h-4" />
          Event Invitations
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add Attendee */}
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <Label htmlFor="attendeeEmail">Email Address</Label>
              <Input
                id="attendeeEmail"
                type="email"
                placeholder="attendee@example.com"
                value={newAttendeeEmail}
                onChange={(e) => setNewAttendeeEmail(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addAttendee()}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="attendeeName">Name (Optional)</Label>
              <Input
                id="attendeeName"
                placeholder="Attendee name"
                value={newAttendeeName}
                onChange={(e) => setNewAttendeeName(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addAttendee()}
                className="mt-1"
              />
            </div>
          </div>
          <Button onClick={addAttendee} className="w-full md:w-auto">
            <UserPlus className="w-4 h-4 mr-2" />
            Add Attendee
          </Button>
        </div>

        {/* Attendees List */}
        {attendees.length > 0 && (
          <div className="space-y-3">
            <Label>Attendees ({attendees.length})</Label>
            <div className="space-y-2">
              {attendees.map((attendee) => (
                <div
                  key={attendee.email}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="font-medium">{attendee.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {attendee.email}
                      </p>
                    </div>
                    {attendee.isOptional && (
                      <Badge variant="outline">Optional</Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(attendee.status)}>
                      {attendee.status}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleOptional(attendee.email)}
                    >
                      {attendee.isOptional ? "Required" : "Optional"}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeAttendee(attendee.email)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" /> {/* ✅ Fixed */}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Invitation Settings */}
        {attendees.length > 0 && (
          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center space-x-2">
              <Switch
                checked={sendInvitations}
                onCheckedChange={setSendInvitations}
              />
              <Label>Send email invitations</Label>
            </div>

            {sendInvitations && (
              <div>
                <Label htmlFor="customMessage">Custom Message (Optional)</Label>
                <Textarea
                  id="customMessage"
                  placeholder="Add a personal message to the invitation..."
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  className="mt-1"
                  rows={3}
                />
              </div>
            )}

            <Button
              onClick={sendInvitationEmails}
              disabled={!sendInvitations}
              className="w-full"
            >
              <Send className="w-4 h-4 mr-2" />
              Send Invitations
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
