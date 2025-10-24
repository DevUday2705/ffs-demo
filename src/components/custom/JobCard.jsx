"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Calendar,
  Users,
  Target,
  Briefcase,
  Star,
  CheckCircle,
  Link2,
  Loader2,
} from "lucide-react";

const JobCard = ({ job, onApply, onAttachCandidate, userRole, context }) => {
  console.log("Job", job);
  const [isApplied, setIsApplied] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [isAttaching, setIsAttaching] = useState(false);

  console.log("JobCard received job data:", job);

  // Handle both old and new job data structures
  const isNewStructure = job.jr_id !== undefined;

  let jobTitle,
    jobDescription,
    locations,
    skillsRequired,
    skillsOptional,
    experience,
    matchPercentage,
    id,
    status;

  if (isNewStructure) {
    // New structure from /hiring-manager/run-workflow
    id = job.jr_id;
    jobTitle = job.job_title;
    jobDescription = job.job_description;
    locations = job.location || [];
    skillsRequired = job.mandatory_skills || [];
    skillsOptional = job.optional_skills || [];
    experience = [
      job.min_experience_years ? parseFloat(job.min_experience_years) : 0,
      job.max_experience_years ? parseFloat(job.max_experience_years) : null,
    ];
    matchPercentage = job.match_threshold
      ? Math.round(parseFloat(job.match_threshold) * 100)
      : 0;
    status = job.status;
  } else {
    // Old structure (transformed data)
    const {
      id: oldId,
      score,
      metadata: {
        "Job Title": oldJobTitle,
        "Job Description": oldJobDescription,
        Location: locationString,
        "Skills Required": skillsRequiredString,
        "Skills Optional": skillsOptionalString,
        Experience: experienceString,
        "Match Threshold": matchThreshold,
        "Resume Count": resumeCount,
        Status: statusFromMetadata, // Try to get status from metadata
      },
    } = job;

    id = oldId;
    jobTitle = oldJobTitle;
    jobDescription = oldJobDescription;
    status = statusFromMetadata || job.status || null; // Try multiple places for status

    // Parse the string arrays and other data with better error handling
    const parseStringArray = (str) => {
      if (!str || str === "[]") return [];
      try {
        return JSON.parse(str.replace(/'/g, '"'));
      } catch (error) {
        console.error("Error parsing string array:", str, error);
        return [];
      }
    };

    const parseExperience = (str) => {
      if (!str) return [0, null];
      try {
        // Handle formats like "3.00-Any years" or "3.00-5.00 years"
        if (str.includes("-")) {
          const parts = str.split("-");
          const min = parseFloat(parts[0]);
          const max = parts[1].toLowerCase().includes("any")
            ? null
            : parseFloat(parts[1].replace(" years", ""));
          return [min, max];
        }
        return JSON.parse(str);
      } catch (error) {
        console.error("Error parsing experience:", str, error);
        return [0, null];
      }
    };

    locations = parseStringArray(locationString);
    skillsRequired = parseStringArray(skillsRequiredString);
    skillsOptional = parseStringArray(skillsOptionalString);
    experience = parseExperience(experienceString);
    matchPercentage = Math.round(score * 100);
  }
  const handleApply = async () => {
    setIsApplying(true);
    try {
      await onApply(id, jobTitle);
      setIsApplied(true);
    } catch (error) {
      console.error("Error applying to job:", error);
    } finally {
      setIsApplying(false);
    }
  };

  const handleAttach = async () => {
    if (!onAttachCandidate || !context?.jr_id) return;

    setIsAttaching(true);
    try {
      await onAttachCandidate(id, jobTitle, context.jr_id);
    } catch (error) {
      console.error("Error attaching candidate to job:", error);
    } finally {
      setIsAttaching(false);
    }
  };

  return (
    <Card className="w-full mb-4 border-l-4 border-l-green-500 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Briefcase className="w-5 h-5 text-green-600" />
            <div>
              <CardTitle className="text-lg text-gray-900">
                {jobTitle}
              </CardTitle>
              <div className="flex items-center space-x-2 mt-1">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="text-sm font-medium text-green-700">
                  {matchPercentage}% Match
                </span>
              </div>
              {/* Status Display */}
              {status && (
                <div className="flex items-center space-x-2 mt-1">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      status === "Open"
                        ? "bg-green-500"
                        : status === "Closed"
                        ? "bg-red-500"
                        : "bg-yellow-500"
                    }`}
                  />
                  <span
                    className={`text-xs font-medium ${
                      status === "Open"
                        ? "text-green-700"
                        : status === "Closed"
                        ? "text-red-700"
                        : "text-yellow-700"
                    }`}
                  >
                    Status: {status}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Apply Button - Only for Candidates */}
          {userRole === "C" && (
            <Button
              onClick={handleApply}
              disabled={isApplied || isApplying}
              className={`${
                isApplied
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-blue-600 hover:bg-blue-700"
              } text-white`}
            >
              {isApplying ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Applying...</span>
                </div>
              ) : isApplied ? (
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>Applied</span>
                </div>
              ) : (
                "Apply Now"
              )}
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Job Description */}
        <div className="space-y-2">
          <h3 className="font-semibold text-gray-900 text-sm">
            Job Description
          </h3>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-gray-700 text-sm leading-relaxed">
              {jobDescription}
            </p>
          </div>
        </div>

        {/* Locations */}
        {locations.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-gray-600" />
              <h3 className="font-semibold text-gray-900 text-sm">Locations</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {locations.map((location, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="bg-green-100 text-green-800 hover:bg-green-200 text-xs"
                >
                  {location}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Skills Required */}
        {skillsRequired.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Target className="w-4 h-4 text-gray-600" />
              <h3 className="font-semibold text-gray-900 text-sm">
                Required Skills
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {skillsRequired.map((skill, index) => (
                <Badge
                  key={index}
                  className="bg-red-100 text-red-800 hover:bg-red-200 text-xs"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Skills Optional */}
        {skillsOptional.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Target className="w-4 h-4 text-gray-600" />
              <h3 className="font-semibold text-gray-900 text-sm">
                Preferred Skills
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {skillsOptional.map((skill, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 text-xs"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Experience Range */}
        {experience.length === 2 && experience[0] !== undefined && (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-gray-600" />
              <h3 className="font-semibold text-gray-900 text-sm">
                Experience Required
              </h3>
            </div>
            <div className="bg-purple-50 p-2 rounded-lg">
              <p className="text-purple-800 font-medium text-sm">
                {experience[0]}
                {experience[1] ? ` - ${experience[1]}` : "+"} years
              </p>
            </div>
          </div>
        )}

        {/* Additional Info */}
        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-100">
          <div className="text-center">
            <div className="text-xs text-gray-500">Job ID</div>
            <div className="text-sm font-medium text-gray-800">{id}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-500">Match Score</div>
            <div className="text-sm font-medium text-green-600">
              {matchPercentage}%
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default JobCard;
