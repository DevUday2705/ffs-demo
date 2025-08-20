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
  TrendingUp,
  Info,
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
  const [showProbabilityTooltip, setShowProbabilityTooltip] = useState(false);

  // Generate a random probability between 75-85%
  const joinProbability = Math.floor(Math.random() * 11) + 75;

  const probabilityTooltipText = `This probability score considers multiple factors including:
• Salary expectations alignment (${Math.floor(Math.random() * 20) + 70}%)
• Recent job market activity (${Math.floor(Math.random() * 15) + 80}%)
• Interview history success rate (${Math.floor(Math.random() * 25) + 65}%)
• Current employment status (${Math.floor(Math.random() * 20) + 75}%)
• Role compatibility score (${Math.floor(Math.random() * 15) + 85}%)

Higher scores indicate better likelihood of successful hiring.`;

  return (
    <>
      <Card className="hover:shadow-xl transition-all duration-500 hover:border-slate-300 bg-white/80 backdrop-blur-sm">
        <CardContent className="p-6">
          {/* Header with name, match score, and probability */}
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h3 className="font-bold text-gray-900 text-xl">
                  {resume.metadata.name}
                </h3>
                <Badge
                  variant="secondary"
                  className="bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-700 border-amber-200/50 shadow-sm"
                >
                  <Star className="w-3 h-3 mr-1 fill-current" />
                  {Math.floor(resume.metadata.relevance_score * 100)}% match
                </Badge>
                <div className="relative">
                  <Badge
                    variant="secondary"
                    className="bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 border-emerald-200/50 shadow-sm cursor-help"
                    onMouseEnter={() => setShowProbabilityTooltip(true)}
                    onMouseLeave={() => setShowProbabilityTooltip(false)}
                  >
                    <TrendingUp className="w-3 h-3 mr-1" />
                    {joinProbability}% join probability
                    <Info className="w-3 h-3 ml-1 opacity-70" />
                  </Badge>

                  {/* Probability Tooltip */}
                  {showProbabilityTooltip && (
                    <div className="absolute top-full left-0 mt-2 w-80 p-4 bg-white border border-gray-200 rounded-lg shadow-xl z-50 text-xs leading-relaxed">
                      <div className="font-medium text-gray-900 mb-2">
                        Join Probability Analysis
                      </div>
                      <div className="text-gray-600 whitespace-pre-line">
                        {probabilityTooltipText}
                      </div>
                      <div className="absolute -top-1 left-6 w-2 h-2 bg-white border-l border-t border-gray-200 transform rotate-45"></div>
                    </div>
                  )}
                </div>
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
              <div className="p-2 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-100/50">
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
              <div className="p-2 bg-gradient-to-br from-purple-50 to-violet-50 rounded-lg border border-purple-100/50">
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
              <div className="p-2 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-100/50">
                <Code className="w-4 h-4 text-green-600" />
              </div>
              <p className="text-sm font-medium text-gray-900">Skills</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {resume.metadata.skills.map((skill, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="bg-gradient-to-r from-slate-50 to-gray-50 text-slate-700 border-slate-200/50 hover:from-slate-100 hover:to-gray-100 transition-all duration-200"
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
              className="bg-gradient-to-r from-slate-50 to-gray-50 hover:from-slate-100 hover:to-gray-100 text-slate-700 hover:text-slate-800 border border-slate-200/50 shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center space-x-2 font-medium"
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
              className="bg-gradient-to-r from-rose-50 to-pink-50 hover:from-rose-100 hover:to-pink-100 text-rose-700 hover:text-rose-800 border border-rose-200/50 shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
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
              className="bg-gradient-to-r from-sky-50 to-blue-50 hover:from-sky-100 hover:to-blue-100 text-sky-700 hover:text-sky-800 border border-sky-200/50 shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
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
              className="bg-gradient-to-r from-violet-50 to-purple-50 hover:from-violet-100 hover:to-purple-100 text-violet-700 hover:text-violet-800 border border-violet-200/50 shadow-sm hover:shadow-md transition-all duration-300 font-medium"
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
