"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  Calendar,
  Users,
  Target,
  FileText,
  Briefcase,
  DollarSign,
  Clock,
  Building,
  User,
  Mail,
  Phone,
  Copy,
  ExternalLink,
} from "lucide-react";

const JRDetailsModal = ({ isOpen, onClose, jobDetails, onCopyJR }) => {
  if (!jobDetails) return null;

  const {
    "Job Title": jobTitle,
    "Job Description": jobDescription,
    Location: locations,
    "Skills Required": skillsRequired,
    "Skills Optional": skillsOptional,
    Experience: experience,
    "Resume Count": resumeCount,
    "Match Threshold": matchThreshold,
  } = jobDetails;

  // Generate a sample JR ID and other details
  const jrId = `JR-${Date.now().toString().slice(-6)}`;
  const postedDate = new Date().toLocaleDateString();
  const expiryDate = new Date(
    Date.now() + 30 * 24 * 60 * 60 * 1000
  ).toLocaleDateString();

  const handleCopyJR = () => {
    const jrLink = `${window.location.origin}/job-requisition/${jrId}`;
    navigator.clipboard.writeText(jrLink);
    onCopyJR && onCopyJR(jobDetails);
  };

  const handleViewFullJR = () => {
    // Open in new tab
    const jrLink = `/job-requisition/${jrId}`;
    window.open(jrLink, "_blank");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold text-gray-900">
                  {jobTitle || "Job Requisition"}
                </DialogTitle>
                <DialogDescription className="text-lg text-gray-600">
                  Job Requisition ID: {jrId}
                </DialogDescription>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                onClick={handleViewFullJR}
                variant="outline"
                size="sm"
                className="flex items-center space-x-2"
              >
                <ExternalLink className="w-4 h-4" />
                <span>View Full Page</span>
              </Button>
              <Button
                onClick={handleCopyJR}
                size="sm"
                className="flex items-center space-x-2 bg-green-600 hover:bg-green-700"
              >
                <Copy className="w-4 h-4" />
                <span>Copy JR Link</span>
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* JR Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <span>Job Requisition Overview</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-600">
                    Posted Date
                  </p>
                  <p className="text-lg font-semibold text-gray-900">
                    {postedDate}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-600">
                    Application Deadline
                  </p>
                  <p className="text-lg font-semibold text-gray-900">
                    {expiryDate}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-600">
                    Target Hires
                  </p>
                  <p className="text-lg font-semibold text-gray-900">
                    {resumeCount || 5} candidates
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Job Description */}
          {jobDescription && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <span>Job Description</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {jobDescription}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Requirements & Qualifications */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Locations */}
            {locations && locations.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    <span>Work Locations</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {locations.map((location, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="bg-green-100 text-green-800 hover:bg-green-200 px-3 py-1"
                      >
                        {location}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Experience */}
            {experience && experience.length === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <span>Experience Required</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <p className="text-purple-800 font-semibold text-lg">
                      {experience[0]} - {experience[1]} years
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Skills Requirements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Required Skills */}
            {skillsRequired && skillsRequired.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="w-5 h-5 text-red-600" />
                    <span>Required Skills</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {skillsRequired.map((skill, index) => (
                      <Badge
                        key={index}
                        className="bg-red-100 text-red-800 hover:bg-red-200 px-3 py-1"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Optional Skills */}
            {skillsOptional && skillsOptional.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="w-5 h-5 text-blue-600" />
                    <span>Preferred Skills</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {skillsOptional.map((skill, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 px-3 py-1"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Hiring Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-blue-600" />
                <span>Hiring Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Target Resume Count:</span>
                    <span className="font-semibold">
                      {resumeCount || 5} resumes
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Match Threshold:</span>
                    <span className="font-semibold">
                      {matchThreshold || 60}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Job Type:</span>
                    <span className="font-semibold">Full-time</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Hiring Manager:</span>
                    <span className="font-semibold">John Doe</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Department:</span>
                    <span className="font-semibold">Engineering</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Priority:</span>
                    <Badge className="bg-orange-100 text-orange-800">
                      High
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="w-5 h-5 text-blue-600" />
                <span>Contact Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Hiring Manager</p>
                    <p className="font-medium">john.doe@company.com</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">HR Department</p>
                    <p className="font-medium">+1 (555) 123-4567</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default JRDetailsModal;
