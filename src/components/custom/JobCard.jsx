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
} from "lucide-react";

const JobCard = ({ job, onApply }) => {
  console.log(job, onApply);
  const [isApplied, setIsApplied] = useState(false);
  const [isApplying, setIsApplying] = useState(false);

  console.log("JobCard received job data:", job);

  const {
    id,
    score,
    metadata: {
      "Job Title": jobTitle,
      "Job Description": jobDescription,
      Location: locationString,
      "Skills Required": skillsRequiredString,
      "Skills Optional": skillsOptionalString,
      Experience: experienceString,
      "Match Threshold": matchThreshold,
      "Resume Count": resumeCount,
    },
  } = job;

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
    if (!str) return [0, 0];
    try {
      return JSON.parse(str);
    } catch (error) {
      console.error("Error parsing experience:", str, error);
      return [0, 0];
    }
  };

  const locations = parseStringArray(locationString);
  const skillsRequired = parseStringArray(skillsRequiredString);
  const skillsOptional = parseStringArray(skillsOptionalString);
  const experience = parseExperience(experienceString);

  // Calculate match percentage
  const matchPercentage = Math.round(score * 100);

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
            </div>
          </div>

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
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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
        {experience.length === 2 && (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-gray-600" />
              <h3 className="font-semibold text-gray-900 text-sm">
                Experience Required
              </h3>
            </div>
            <div className="bg-purple-50 p-2 rounded-lg">
              <p className="text-purple-800 font-medium text-sm">
                {experience[0]} - {experience[1]} years
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
