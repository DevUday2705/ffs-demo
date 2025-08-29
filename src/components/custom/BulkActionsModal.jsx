"use client";

import { useState, useEffect } from "react";
import {
  Users,
  Mail,
  Calendar,
  Check,
  X,
  ChevronDown,
  Send,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { capitalizeWords } from "@/shared/utils";

const BulkActionsModal = ({
  isOpen,
  onClose,
  candidates,
  onBulkEmail,
  onBulkMeeting,
}) => {
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [activeTab, setActiveTab] = useState("email");
  const [isProcessing, setIsProcessing] = useState(false);

  // Email data for bulk send
  const [emailData, setEmailData] = useState({
    subject: "Job Opportunity - We're Interested in Your Profile",
    body: `Dear Candidate,

We hope this email finds you well. We've reviewed your resume and are impressed with your background and experience.

We have an exciting opportunity that might be of interest to you. Based on your skills and experience, we believe you would be a great fit for our team.

Would you be available for a brief conversation to discuss this opportunity further?

Best regards,
John Doe
Sumo Digitech
9920271866`,
  });

  // Meeting data for bulk scheduling
  const [meetingData, setMeetingData] = useState({
    duration: "30",
    meetingType: "video",
    remarks: `Initial discussion regarding job opportunity.

Meeting agenda:
- Introduction and company overview
- Discussion about your background
- Role requirements and expectations
- Q&A session
- Next steps`,
  });

  // Individual meeting times for each candidate
  const [individualMeetings, setIndividualMeetings] = useState({});

  // Generate time slots
  const timeSlots = [];
  for (let hour = 9; hour <= 17; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const time = `${hour.toString().padStart(2, "0")}:${minute
        .toString()
        .padStart(2, "0")}`;
      timeSlots.push(time);
    }
  }

  const today = new Date().toISOString().split("T")[0];

  // Initialize selected candidates when modal opens
  useEffect(() => {
    if (isOpen && candidates?.length > 0) {
      setSelectedCandidates(candidates.map((c) => c.id));
      // Initialize individual meeting times
      const initialMeetings = {};
      candidates.forEach((candidate) => {
        initialMeetings[candidate.id] = {
          date: "",
          time: "",
          candidateName: candidate.metadata.name,
        };
      });
      setIndividualMeetings(initialMeetings);
    }
  }, [isOpen, candidates]);

  const handleCandidateToggle = (candidateId) => {
    setSelectedCandidates((prev) =>
      prev.includes(candidateId)
        ? prev.filter((id) => id !== candidateId)
        : [...prev, candidateId]
    );
  };

  const handleSelectAll = () => {
    if (selectedCandidates.length === candidates.length) {
      setSelectedCandidates([]);
    } else {
      setSelectedCandidates(candidates.map((c) => c.id));
    }
  };

  const handleBulkEmail = async () => {
    setIsProcessing(true);
    try {
      const selectedCandidateData = candidates.filter((c) =>
        selectedCandidates.includes(c.id)
      );

      // Prepare bulk email payload for the API
      const emailPayload = {
        emails: selectedCandidateData.map((candidate) => ({
          name: candidate.metadata?.name || "Candidate",
          email: "devuday2705@gmail.com", // Hardcoded for now as requested
          subject: emailData.subject,
          body: emailData.body.replace(
            /{candidate\.metadata\.name}/g,
            candidate.metadata?.name || "Candidate"
          ),
        })),
      };

      // Call the internal mail API
      const response = await fetch("/api/mail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(emailPayload),
      });

      if (!response.ok) {
        throw new Error("Failed to send bulk emails");
      }

      const result = await response.json();
      console.log("Bulk emails sent successfully:", result);

      // Call the original onBulkEmail callback if it exists (for any additional handling)
      if (onBulkEmail) {
        await onBulkEmail(selectedCandidateData, emailData);
      }

      onClose();
    } catch (error) {
      console.error("Bulk email error:", error);
      alert("Failed to send bulk emails. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBulkMeeting = async () => {
    setIsProcessing(true);
    try {
      const meetingsToSchedule = selectedCandidates
        .map((candidateId) => {
          const candidate = candidates.find((c) => c.id === candidateId);
          const meetingTime = individualMeetings[candidateId];

          if (!meetingTime.date || !meetingTime.time) return null;

          // Calculate end time based on duration with date
          const [startHour, startMinute] = meetingTime.time.split(':').map(Number);
          const durationMinutes = parseInt(meetingData.duration);
          const endTime = new Date();
          endTime.setHours(startHour, startMinute + durationMinutes);
          const endTimeString = `${endTime.getHours().toString().padStart(2, '0')}:${endTime.getMinutes().toString().padStart(2, '0')}`;

          // Format start and end times with date
          const startDateTime = `${meetingTime.date} ${meetingTime.time}`;
          const endDateTime = `${meetingTime.date} ${endTimeString}`;

          return {
            candidate_name: candidate.metadata?.name || "Candidate",
            candidate_email: "devuday2705@gmail.com", // Hardcoded for now
            subject: `Interview - ${candidate.metadata?.name || "Candidate"}`,
            start_time: startDateTime,
            end_time: endDateTime,
            timezone: "IST",
            description: meetingData.remarks
          };
        })
        .filter(meeting => meeting !== null);

      if (meetingsToSchedule.length === 0) {
        alert("Please select valid meeting times for all candidates");
        return;
      }

      // Prepare bulk meeting payload for the API
      const meetingPayload = {
        meetings: meetingsToSchedule
      };

      // Call the internal meeting API
      const response = await fetch("/api/meet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(meetingPayload),
      });

      if (!response.ok) {
        throw new Error("Failed to schedule bulk meetings");
      }

      const result = await response.json();
      console.log("Bulk meetings scheduled successfully:", result);

      // Call the original onBulkMeeting callback if it exists (for any additional handling)
      if (onBulkMeeting) {
        await onBulkMeeting(meetingsToSchedule);
      }

      onClose();
    } catch (error) {
      console.error("Bulk meeting error:", error);
      alert("Failed to schedule bulk meetings. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const updateMeetingTime = (candidateId, field, value) => {
    setIndividualMeetings((prev) => ({
      ...prev,
      [candidateId]: {
        ...prev[candidateId],
        [field]: value,
      },
    }));
  };

  const validMeetings = selectedCandidates.filter(
    (id) => individualMeetings[id]?.date && individualMeetings[id]?.time
  ).length;

  if (!candidates?.length) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            <div className="p-2 bg-violet-50 rounded-lg">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <span>Bulk Actions</span>
              <DialogDescription className="mt-1">
                Send emails or schedule meetings with multiple candidates
              </DialogDescription>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-6">
          {/* Candidate Selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Select Candidates</h3>
              <Button variant="outline" size="sm" onClick={handleSelectAll}>
                {selectedCandidates.length === candidates.length
                  ? "Deselect All"
                  : "Select All"}
              </Button>
            </div>

            <div className="grid gap-2 max-h-40 overflow-y-auto">
              {candidates.map((candidate) => (
                <Card
                  key={candidate.id}
                  className={`cursor-pointer transition-colors ${
                    selectedCandidates.includes(candidate.id)
                      ? "border-blue-500 bg-blue-50"
                      : "hover:bg-gray-50"
                  }`}
                  onClick={() => handleCandidateToggle(candidate.id)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        checked={selectedCandidates.includes(candidate.id)}
                        onChange={() => handleCandidateToggle(candidate.id)}
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">
                            {candidate.metadata.name}
                          </span>
                          <Badge variant="secondary">
                            {Math.floor(
                              candidate.metadata.relevance_score * 100
                            )}
                            % match
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">
                          {candidate.metadata.email}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-sm text-gray-600">
              {selectedCandidates.length} of {candidates.length} candidates
              selected
            </div>
          </div>

          {/* Action Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger
                value="email"
                className="flex items-center space-x-2"
              >
                <Mail className="w-4 h-4" />
                <span>Bulk Email</span>
              </TabsTrigger>
              <TabsTrigger
                value="meeting"
                className="flex items-center space-x-2"
              >
                <Calendar className="w-4 h-4" />
                <span>Bulk Meeting</span>
              </TabsTrigger>
            </TabsList>

            {/* Email Tab */}
            <TabsContent value="email" className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="bulk-subject">Email Subject</Label>
                  <Input
                    id="bulk-subject"
                    value={emailData.subject}
                    onChange={(e) =>
                      setEmailData({ ...emailData, subject: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bulk-body">Email Message</Label>
                  <Textarea
                    id="bulk-body"
                    value={emailData.body}
                    onChange={(e) =>
                      setEmailData({ ...emailData, body: e.target.value })
                    }
                    rows={8}
                    className="resize-none"
                  />
                </div>

                <div className="flex justify-end">
                  <Button
                    onClick={handleBulkEmail}
                    disabled={isProcessing || selectedCandidates.length === 0}
                    className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send to {selectedCandidates.length} candidates
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* Meeting Tab */}
            <TabsContent value="meeting" className="space-y-4">
              <div className="space-y-4">
                {/* Common Meeting Settings */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Duration</Label>
                    <Select
                      value={meetingData.duration}
                      onValueChange={(value) =>
                        setMeetingData({ ...meetingData, duration: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="45">45 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Meeting Type</Label>
                    <Select
                      value={meetingData.meetingType}
                      onValueChange={(value) =>
                        setMeetingData({ ...meetingData, meetingType: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="video">Video Call</SelectItem>
                        <SelectItem value="phone">Phone Call</SelectItem>
                        <SelectItem value="in-person">In Person</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Individual Meeting Times */}
                <div className="space-y-3">
                  <h4 className="font-medium flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>Individual Meeting Times</span>
                  </h4>

                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {selectedCandidates.map((candidateId) => {
                      const candidate = candidates.find(
                        (c) => c.id === candidateId
                      );
                      const meeting = individualMeetings[candidateId] || {};

                      return (
                        <Card key={candidateId} className="p-3">
                          <div className="space-y-3">
                            <div className="font-medium text-sm">
                              {capitalizeWords(candidate.metadata.name)}
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <Label className="text-xs">Date</Label>
                                <Input
                                  type="date"
                                  min={today}
                                  value={meeting.date || ""}
                                  onChange={(e) =>
                                    updateMeetingTime(
                                      candidateId,
                                      "date",
                                      e.target.value
                                    )
                                  }
                                  className="h-8 text-sm"
                                />
                              </div>
                              <div>
                                <Label className="text-xs">Time</Label>
                                <Select
                                  value={meeting.time || ""}
                                  onValueChange={(value) =>
                                    updateMeetingTime(
                                      candidateId,
                                      "time",
                                      value
                                    )
                                  }
                                >
                                  <SelectTrigger className="h-8 text-sm">
                                    <SelectValue placeholder="Select time" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {timeSlots.map((time) => (
                                      <SelectItem key={time} value={time}>
                                        {time}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    {validMeetings} of {selectedCandidates.length} meetings
                    configured
                  </div>
                  <Button
                    onClick={handleBulkMeeting}
                    disabled={isProcessing || validMeetings === 0}
                    className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                        Scheduling...
                      </>
                    ) : (
                      <>
                        <Calendar className="w-4 h-4 mr-2" />
                        Schedule {validMeetings} meetings
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BulkActionsModal;
