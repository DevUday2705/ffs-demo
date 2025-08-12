"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Send, User } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";

const EmailModal = ({ isOpen, onClose, candidate, onSend }) => {
  const [emailData, setEmailData] = useState({
    to: "",
    subject: "",
    body: "",
  });
  const [sending, setSending] = useState(false);

  // Update email data when candidate changes and modal opens
  useEffect(() => {
    if (candidate && isOpen) {
      setEmailData({
        to: candidate.metadata?.email || "",
        subject: `Job Opportunity - ${candidate.metadata?.name || "Candidate"}`,
        body: `Dear ${candidate.metadata?.name || "Candidate"},

I hope this email finds you well. We came across your resume and are impressed with your background and experience.

We have an exciting opportunity that might be of interest to you. Based on your skills and experience, we believe you would be a great fit for our team.

Would you be available for a brief conversation to discuss this opportunity further?

Best regards,
[Your Name]
[Your Company]
[Your Contact Information]`,
      });
    }
  }, [candidate, isOpen]);

  const handleSend = async () => {
    setSending(true);
    try {
      await onSend(candidate.id, candidate.metadata.name, emailData);
      onClose();
      // Reset form data
      setEmailData({
        to: "",
        subject: "",
        body: "",
      });
    } catch (error) {
      console.error("Error sending email:", error);
    } finally {
      setSending(false);
    }
  };

  if (!candidate) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Mail className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <span>Send Email</span>
              <DialogDescription className="mt-1">
                Compose email to candidate
              </DialogDescription>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="overflow-y-auto max-h-[calc(90vh-200px)] space-y-6">
          {/* Candidate Info */}
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">
                  {candidate.metadata.name}
                </h3>
                <p className="text-sm text-gray-600">
                  {candidate.metadata.email}
                </p>
                {candidate.metadata.location && (
                  <p className="text-xs text-gray-500">
                    {candidate.metadata.location}
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

          {/* Email Form */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email-to">To</Label>
              <Input
                id="email-to"
                type="email"
                value={emailData.to}
                onChange={(e) =>
                  setEmailData({ ...emailData, to: e.target.value })
                }
                placeholder="recipient@example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email-subject">Subject</Label>
              <Input
                id="email-subject"
                value={emailData.subject}
                onChange={(e) =>
                  setEmailData({ ...emailData, subject: e.target.value })
                }
                placeholder="Email subject"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email-body">Message</Label>
              <Textarea
                id="email-body"
                value={emailData.body}
                onChange={(e) =>
                  setEmailData({ ...emailData, body: e.target.value })
                }
                rows={12}
                placeholder="Type your message here..."
                className="resize-none"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t">
          <p className="text-sm text-gray-500">
            This email will be sent to {candidate.metadata.name}
          </p>
          <div className="flex items-center space-x-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleSend}
              disabled={sending || !emailData.to || !emailData.subject}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
            >
              {sending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send Email
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EmailModal;
