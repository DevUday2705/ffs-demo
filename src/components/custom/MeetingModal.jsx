"use client";

import { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  MessageSquare,
  User,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { Badge } from "@/components/ui/badge";

const MeetingModal = ({ isOpen, onClose, candidate, onSchedule }) => {
  const [meetingData, setMeetingData] = useState({
    date: "",
    time: "",
    duration: "30",
    remarks: "",
    meetingType: "video",
  });
  const [scheduling, setScheduling] = useState(false);

  // Update meeting data when candidate changes and modal opens
  useEffect(() => {
    if (candidate && isOpen) {
      setMeetingData({
        date: "",
        time: "",
        duration: "30",
        remarks: `Initial discussion with ${
          candidate.metadata?.name || "Candidate"
        } regarding job opportunity.

Meeting agenda:
- Introduction and company overview
- Discussion about the candidate's background
- Role requirements and expectations
- Q&A session
- Next steps`,
        meetingType: "video",
      });
    }
  }, [candidate, isOpen]);

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

  // Get today's date for min date
  const today = new Date().toISOString().split("T")[0];

  const handleSchedule = async () => {
    setScheduling(true);
    try {
      await onSchedule(candidate.id, candidate.metadata.name, meetingData);
      onClose();
      setMeetingData({
        date: "",
        time: "",
        duration: "30",
        remarks: "",
        meetingType: "video",
      });
    } catch (error) {
      console.error("Error scheduling meeting:", error);
    } finally {
      setScheduling(false);
    }
  };

  if (!candidate) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Calendar className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <span>Schedule Meeting</span>
              <DialogDescription className="mt-1">
                Set up a meeting with the candidate
              </DialogDescription>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="overflow-y-auto max-h-[calc(90vh-200px)] space-y-6">
          {/* Candidate Info */}
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <User className="w-5 h-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">
                  {candidate.metadata.name}
                </h3>
                <p className="text-sm text-gray-600">
                  {candidate.metadata.email}
                </p>
                {candidate.metadata.phone && (
                  <p className="text-xs text-gray-500">
                    {candidate.metadata.phone}
                  </p>
                )}
              </div>
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-700"
              >
                {Math.floor(candidate.metadata.relevance_score * 100)}% match
              </Badge>
            </div>
          </div>

          {/* Meeting Form */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="meeting-date">Date</Label>
                <Input
                  id="meeting-date"
                  type="date"
                  value={meetingData.date}
                  min={today}
                  onChange={(e) =>
                    setMeetingData({ ...meetingData, date: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="meeting-time">Time</Label>
                <Select
                  value={meetingData.time}
                  onValueChange={(value) =>
                    setMeetingData({ ...meetingData, time: value })
                  }
                >
                  <SelectTrigger>
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

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="meeting-duration">Duration (minutes)</Label>
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
                    <SelectItem value="90">1.5 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="meeting-type">Meeting Type</Label>
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

            <div className="space-y-2">
              <Label htmlFor="meeting-remarks">Meeting Agenda & Remarks</Label>
              <Textarea
                id="meeting-remarks"
                value={meetingData.remarks}
                onChange={(e) =>
                  setMeetingData({ ...meetingData, remarks: e.target.value })
                }
                rows={8}
                placeholder="Enter meeting agenda and any remarks..."
                className="resize-none"
              />
            </div>

            {/* Meeting Summary */}
            <div className="bg-blue-50 rounded-xl p-4">
              <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
                <CheckCircle className="w-4 h-4 mr-2" />
                Meeting Summary
              </h4>
              <div className="space-y-2 text-sm text-blue-800">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {meetingData.date
                      ? new Date(meetingData.date).toLocaleDateString()
                      : "Select date"}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>
                    {meetingData.time || "Select time"} ({meetingData.duration}{" "}
                    minutes)
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <MessageSquare className="w-4 h-4" />
                  <span className="capitalize">
                    {meetingData.meetingType} meeting
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t">
          <p className="text-sm text-gray-500">
            Calendar invite will be sent to {candidate.metadata.name}
          </p>
          <div className="flex items-center space-x-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleSchedule}
              disabled={scheduling || !meetingData.date || !meetingData.time}
              className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
            >
              {scheduling ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Scheduling...
                </>
              ) : (
                <>
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Meeting
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MeetingModal;
