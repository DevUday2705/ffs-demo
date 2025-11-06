"use client";

import { useEffect, useState } from "react";
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
  Link2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
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
import AttachJobs from "./AttachJobs";
import { capitalizeWords } from "@/shared/utils";

const ResumeCard = ({
  resume,
  actionLoading,
  onUpdateResume,
  onSendEmail,
  onScheduleMeeting,
  onAttachCandidate,
  userRole,
  context,
  sessionId,
}) => {
  console.log("Resume found", resume);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [isProbabilityModalOpen, setIsProbabilityModalOpen] = useState(false);
  const [isJobSelectionModalOpen, setIsJobSelectionModalOpen] = useState(false);
  const [availableJobs, setAvailableJobs] = useState([]);
  const [isLoadingJobs, setIsLoadingJobs] = useState(false);
  const [isAttachedJobsModel, setIsAttachedJobsModel] = useState(false);
  const [attachedJobs, setAttachedJobs] = useState([]);

  // Fixed probability calculation - calculate once and memoize based on resume ID
  const baseScore = resume.metadata.relevance_score || 0.7;
  const fixedProbability = Math.floor(
    (baseScore + (parseInt(resume.id.slice(-2), 16) % 30) / 100) * 100
  );

  //Mapping Count
  const mappingCount = resume?.metadata?.mappingCount;
  console.log(mappingCount)
  // Generate consistent summary based on resume data
  const candidateSummary =
    resume.metadata.summary ||
    `Experienced professional with ${
      resume.experience
    } years in the field. Skilled in ${resume.metadata.skills
      ?.slice(0, 3)
      .join(", ")} with a proven track record of delivering results.`;

  // Function to fetch available job requisitions
  const fetchJobRequisitions = async () => {
    setIsLoadingJobs(true);
    try {
      const response = await fetch(
        `/api/recruiter/job-requisitions?session_id=${sessionId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch job requisitions");
      }
      const data = await response.json();
      setAvailableJobs(data.jobs || []);
      setIsJobSelectionModalOpen(true);
      setAttachedJobs(attachedJobs.length)
    } catch (error) {
      console.error("Error fetching job requisitions:", error);
      // Could add error toast here
    } finally {
      setIsLoadingJobs(false);
    }
  };

 const handleOpenModal = async () => {
  try {
    if (!resume?.id || !sessionId) return;

    const response = await fetch(
      `/api/recruiter/attach-jobs?candidate_id=${resume.id}&session_id=${sessionId}`
    );

    if (!response.ok) {
      toast("No Jobs Allocated", { position: "top-center" });
      setAttachedJobs([]);
      return;
    }

    const data = await response.json();
    console.log("📦 API Response:", data);

    // ✅ Ensure mappings exist
    if (!Array.isArray(data.mappings) || data.mappings.length === 0) {
      toast("No Jobs Allocated", { position: "top-center" });
      setAttachedJobs([]);
      return;
    }

    // ✅ Filter out non-object / nested arrays
    const validMappings = data.mappings.filter(
      (item) => item && !Array.isArray(item) && typeof item === "object" && item.jr_id
    );

    if (validMappings.length === 0) {
      toast("No Jobs Allocated", { position: "top-center" });
      setAttachedJobs([]);
      return;
    }

    // ✅ Format only the valid mapping objects
    const formattedData = validMappings.map((map) => ({
      jobId: map.jr_id || "N/A",
      position: map.job_title || "Unknown Role",
      status: map.status || "N/A",
      attachedOn: map.mapped_date
        ? new Date(map.mapped_date).toLocaleDateString()
        : "Not Available",
    }));

    setAttachedJobs(formattedData);
    setIsAttachedJobsModel(true);
  } catch (error) {
    console.error("❌ Error fetching jobs:", error);
    setAttachedJobs([]);
  }
};


  // Handle attach button click
  const handleAttachClick = () => {
    if (context?.jr_id) {
      // Direct attach if jr_id is available in context
      onAttachCandidate(resume.id, resume.metadata.name, context.jr_id);
    } else {
      // Show job selection modal if no jr_id in context
      fetchJobRequisitions();
    }
  };

  // Handle job selection from modal
  const handleJobSelection = (selectedJob) => {
    setIsJobSelectionModalOpen(false);
    onAttachCandidate(resume.id, resume.metadata.name, selectedJob.jr_id);
  };

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
               <Button
  onClick={handleOpenModal}
  className="absolute cursor-pointer top-8 right-3 flex items-center justify-center gap-1 text-gray-700 hover:text-white-600 transition-all bg-gray-100 hover:bg-gray-200 rounded-full p-2 shadow-sm"
>
  <Briefcase size={25} />
  <span className="text-lg font-semibold">
    {attachedJobs.length || mappingCount || 0}
  </span>
</Button>

              </div>
             <AttachJobs
  isOpen={isAttachedJobsModel}
  onClose={() => setIsAttachedJobsModel(false)}
  attachedJobs={attachedJobs}
/>

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
          <div
            className={`grid gap-3 ${
              userRole === "R" && onAttachCandidate
                ? "grid-cols-2 lg:grid-cols-5"
                : "grid-cols-2 lg:grid-cols-4"
            }`}
          >
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

            {/* Attach Candidate (for recruiters only) */}
            {userRole === "R" && onAttachCandidate && (
              <Button
                onClick={handleAttachClick}
                disabled={actionLoading[`attach-${resume.id}`] || isLoadingJobs}
                className="bg-gradient-to-r from-purple-50 to-indigo-50 hover:from-purple-100 hover:to-indigo-100 text-purple-700 hover:text-purple-800 border border-purple-200/50 shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {actionLoading[`attach-${resume.id}`] || isLoadingJobs ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Link2 className="w-4 h-4" />
                )}
                <span>{context?.jr_id ? "Attach" : "Attach to Job"}</span>
              </Button>
            )}
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

      {/* Job Selection Modal */}
      <JobSelectionModal
        isOpen={isJobSelectionModalOpen}
        onClose={() => setIsJobSelectionModalOpen(false)}
        availableJobs={availableJobs}
        onJobSelect={handleJobSelection}
        candidateName={resume.metadata.name}
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
                {Math.max(calculatedProbability, 100)}%
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

// Job Selection Modal Component
const JobSelectionModal = ({
  isOpen,
  onClose,
  availableJobs,
  onJobSelect,
  candidateName,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Briefcase className="w-5 h-5 text-purple-600" />
            <span>
              Select Job Requisition for {capitalizeWords(candidateName)}
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Please select a job requisition to attach this candidate to:
          </p>

          <div className="max-h-96 overflow-y-auto space-y-2">
            {availableJobs.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Briefcase className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No job requisitions available</p>
              </div>
            ) : (
              availableJobs.map((job) => (
                <div
                  key={job.jr_id}
                  className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => onJobSelect(job)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">
                        {job.job_title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        JR ID: {job.jr_id}
                      </p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        <span>
                          Min Experience: {job.min_experience_years || "N/A"}{" "}
                          years
                        </span>
                        <span>
                          Max Experience:{" "}
                          {job.max_experience_years || "No limit"} years
                        </span>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-purple-600 border-purple-200 hover:bg-purple-50"
                    >
                      Select
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="flex justify-end pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ResumeCard;
