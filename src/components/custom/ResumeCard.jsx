"use client";

import { useState } from "react";
import {
  Star,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Code,
  Download,
  ExternalLink,
  RefreshCw,
  Calendar,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import ResumeViewer from "./ResumeViewer";

const ResumeCard = ({
  resume,
  actionLoading,
  onUpdateResume,
  onSendEmail,
  onScheduleMeeting,
}) => {
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  return (
    <>
      <Card className="hover:shadow-lg transition-all duration-300 hover:border-blue-200">
        <CardContent className="p-6">
          {/* Header with name and match score */}
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h3 className="font-bold text-gray-900 text-xl">
                  {resume.metadata.name}
                </h3>
                <Badge
                  variant="secondary"
                  className="bg-yellow-50 text-yellow-700 border-yellow-200"
                >
                  <Star className="w-3 h-3 mr-1 fill-current" />
                  {Math.floor(resume.metadata.relevance_score * 100)}% match
                </Badge>
              </div>

              {/* Contact info */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                {resume.metadata.email && (
                  <div className="flex items-center space-x-1">
                    <Mail className="w-4 h-4" />
                    <span>{resume.metadata.email}</span>
                  </div>
                )}
                {resume.metadata.phone && (
                  <div className="flex items-center space-x-1">
                    <Phone className="w-4 h-4" />
                    <span>{resume.metadata.phone}</span>
                  </div>
                )}
                {resume.metadata.location && (
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{resume.metadata.location}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Experience and Education */}
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Briefcase className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 mb-1">
                  Experience
                </p>
                <p className="text-sm text-gray-600">
                  {resume.experience} Years
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="p-2 bg-purple-50 rounded-lg">
                <GraduationCap className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 mb-1">
                  Education
                </p>
                <p className="text-sm text-gray-600">
                  {resume.metadata.education}
                </p>
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="mb-6">
            <div className="flex items-center space-x-2 mb-3">
              <div className="p-2 bg-green-50 rounded-lg">
                <Code className="w-4 h-4 text-green-600" />
              </div>
              <p className="text-sm font-medium text-gray-900">Skills</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {resume.metadata.skills.map((skill, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border-blue-200"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {/* View Resume */}
            <Button
              onClick={() => setIsViewerOpen(true)}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 flex items-center justify-center space-x-2"
            >
              <ExternalLink className="w-4 h-4" />
              <span>View</span>
            </Button>

            {/* Send Email */}
            <Button
              onClick={() =>
                onSendEmail(
                  resume.id,
                  resume.metadata.name,
                  resume.metadata.email
                )
              }
              disabled={
                actionLoading[`email-${resume.id}`] || !resume.metadata.email
              }
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 flex items-center justify-center space-x-2"
            >
              {actionLoading[`email-${resume.id}`] ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Mail className="w-4 h-4" />
              )}
              <span>Email</span>
            </Button>

            {/* Schedule Meeting */}
            <Button
              onClick={() => onScheduleMeeting(resume.id, resume.metadata.name)}
              disabled={actionLoading[`meeting-${resume.id}`]}
              className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 flex items-center justify-center space-x-2"
            >
              {actionLoading[`meeting-${resume.id}`] ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Calendar className="w-4 h-4" />
              )}
              <span>Schedule</span>
            </Button>

            {/* Download Resume */}
            <Button
              asChild
              className="bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700"
            >
              <a
                href={resume.metadata.download_url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Download</span>
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Resume Viewer Modal */}
      <ResumeViewer
        isOpen={isViewerOpen}
        onClose={() => setIsViewerOpen(false)}
        resume={resume}
      />
    </>
  );
};

export default ResumeCard;
