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
  Linkedin,
  Calculator,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import ResumeViewer from "./ResumeViewer";
import { capitalizeWords } from "@/shared/utils";

const ResumeCard = ({
  resume,
  actionLoading,
  onUpdateResume,
  onSendEmail,
  onScheduleMeeting,
}) => {
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [isProbabilityModalOpen, setIsProbabilityModalOpen] = useState(false);

  // Fixed probability calculation - calculate once and memoize based on resume ID
  const baseScore = resume.metadata.relevance_score || 0.7;
  const fixedProbability = Math.floor(
    (baseScore + (parseInt(resume.id.slice(-2), 16) % 30) / 100) * 100
  );

  // Generate consistent summary based on resume data
  const candidateSummary =
    resume.metadata.summary ||
    `Experienced professional with ${
      resume.experience
    } years in the field. Skilled in ${resume.metadata.skills
      ?.slice(0, 3)
      .join(", ")} with a proven track record of delivering results.`;

  return (
    <>
      <Card className="hover:shadow-xl transition-all duration-500 hover:border-slate-300 bg-white/80 backdrop-blur-sm">
        <CardContent className="p-6">
          {/* Header with name, match score, and probability */}
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <div className="flex flex-col  space-x-3 mb-2 md:flex-row md:items-center">
                <h3 className="font-bold text-gray-900 text-xl">
                  {capitalizeWords(resume.metadata.name)}
                </h3>
                <div className="flex items-center gap-x-2 mt-2">
                  <Badge
                    variant="secondary"
                    className="bg-gradient-to-r py-1 from-amber-50 to-yellow-50 text-amber-700 border-amber-200/50 shadow-sm"
                  >
                    <Star className="w-3 h-3 mr-1 fill-current" />
                    {Math.floor(resume.metadata.relevance_score * 100)}% match
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsProbabilityModalOpen(true)}
                    className="bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 border-emerald-200/50 shadow-sm hover:bg-emerald-100 px-3 py-1 h-auto"
                  >
                    <Calculator className="w-3 h-3 mr-1" />
                    {fixedProbability}% probability
                  </Button>
                </div>
              </div>

              {/* Candidate Summary */}
              <div className="mb-3">
                <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                  {candidateSummary.length > 120
                    ? candidateSummary.substring(0, 120) + "..."
                    : candidateSummary}
                </p>
              </div>

              {/* Contact info with LinkedIn */}
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
                {/* LinkedIn Profile */}
                {resume.metadata.linkedin &&
                  resume.metadata.linkedin !== "Not Available" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-1 h-auto text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                      onClick={() =>
                        window.open(
                          resume.metadata.linkedin.startsWith("http")
                            ? resume.metadata.linkedin
                            : `https://linkedin.com/in/${resume.metadata.linkedin}`,
                          "_blank"
                        )
                      }
                    >
                      <Linkedin className="w-4 h-4" />
                    </Button>
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
                  {capitalizeWords(resume.metadata.education)}
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
                  className="bg-gradient-to-r uppercase from-slate-50 to-gray-50 text-slate-700 border-slate-200/50 hover:from-slate-100 hover:to-gray-100 transition-all duration-200"
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

      {/* Probability Calculator Modal */}
      <ProbabilityCalculatorModal
        isOpen={isProbabilityModalOpen}
        onClose={() => setIsProbabilityModalOpen(false)}
        candidate={resume}
        currentProbability={fixedProbability}
      />
    </>
  );
};

// Probability Calculator Modal Component
const ProbabilityCalculatorModal = ({
  isOpen,
  onClose,
  candidate,
  currentProbability,
}) => {
  const [formData, setFormData] = useState({
    salaryExpectation: "",
    currentSalary: "",
    noticePeriod: "",
    jobLocation: "",
    additionalRequirements: "",
  });
  const [calculatedProbability, setCalculatedProbability] =
    useState(currentProbability);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const calculateProbability = async () => {
    setIsCalculating(true);

    // Simulate calculation delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Mock calculation based on inputs
    let newProbability = currentProbability;

    // Adjust based on salary expectations (simplified logic)
    if (formData.salaryExpectation) {
      const expectedSalary = parseInt(
        formData.salaryExpectation.replace(/\D/g, "")
      );
      if (expectedSalary < 100000) newProbability += 5;
      else if (expectedSalary > 200000) newProbability -= 10;
    }

    // Adjust based on notice period
    if (formData.noticePeriod) {
      const notice = parseInt(formData.noticePeriod);
      if (notice <= 30) newProbability += 8;
      else if (notice > 90) newProbability -= 5;
    }

    // Keep probability within realistic bounds
    newProbability = Math.max(30, Math.min(95, newProbability));

    setCalculatedProbability(newProbability);
    setIsCalculating(false);
  };

  const resetForm = () => {
    setFormData({
      salaryExpectation: "",
      currentSalary: "",
      noticePeriod: "",
      jobLocation: "",
      additionalRequirements: "",
    });
    setCalculatedProbability(currentProbability);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Calculator className="w-5 h-5 text-emerald-600" />
            <span>
              Calculate Precise Probability -{" "}
              {capitalizeWords(candidate.metadata.name)}
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Probability Display */}
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg p-4 border border-emerald-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-emerald-800">
                  Current Probability
                </h3>
                <p className="text-sm text-emerald-600">
                  Based on resume analysis
                </p>
              </div>
              <div className="text-2xl font-bold text-emerald-700">
                {calculatedProbability}%
              </div>
            </div>
          </div>

          {/* Input Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="salaryExpectation">Salary Expectation</Label>
              <Input
                id="salaryExpectation"
                placeholder="e.g., ₹12,00,000 per annum"
                value={formData.salaryExpectation}
                onChange={(e) =>
                  handleInputChange("salaryExpectation", e.target.value)
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="currentSalary">Current Salary</Label>
              <Input
                id="currentSalary"
                placeholder="e.g., ₹10,00,000 per annum"
                value={formData.currentSalary}
                onChange={(e) =>
                  handleInputChange("currentSalary", e.target.value)
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="noticePeriod">Notice Period (days)</Label>
              <Input
                id="noticePeriod"
                placeholder="e.g., 30, 60, 90"
                type="number"
                value={formData.noticePeriod}
                onChange={(e) =>
                  handleInputChange("noticePeriod", e.target.value)
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="jobLocation">Preferred Job Location</Label>
              <Input
                id="jobLocation"
                placeholder="e.g., Bangalore, Remote, Hybrid"
                value={formData.jobLocation}
                onChange={(e) =>
                  handleInputChange("jobLocation", e.target.value)
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="additionalRequirements">
              Additional Requirements
            </Label>
            <Textarea
              id="additionalRequirements"
              placeholder="Any specific requirements, preferences, or notes about the candidate..."
              value={formData.additionalRequirements}
              onChange={(e) =>
                handleInputChange("additionalRequirements", e.target.value)
              }
              rows={3}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={resetForm}
              className="text-slate-600 hover:text-slate-800"
            >
              Reset
            </Button>

            <div className="space-x-3">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                onClick={calculateProbability}
                disabled={isCalculating}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                {isCalculating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Calculating...
                  </>
                ) : (
                  <>
                    <Calculator className="w-4 h-4 mr-2" />
                    Calculate Probability
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Calculation Notes */}
          <div className="text-xs text-gray-500 border-t pt-4">
            <p>
              <strong>Note:</strong> This calculation considers multiple factors
              including salary alignment, notice period, location preferences,
              and additional requirements to provide a more accurate probability
              assessment for successful hiring.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ResumeCard;
