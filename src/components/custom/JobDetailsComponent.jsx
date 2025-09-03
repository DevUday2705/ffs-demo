"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Users, Target, FileText, Briefcase } from 'lucide-react';

const JobDetailsComponent = ({ jobDetails }) => {
  if (!jobDetails || Object.keys(jobDetails).length === 0) {
    return null;
  }

  const {
    "Job Title": jobTitle,
    "Job Description": jobDescription,
    "Location": locations,
    "Skills Required": skillsRequired,
    "Skills Optional": skillsOptional,
    "Experience": experience,
    "Resume Count": resumeCount,
    "Match Threshold": matchThreshold
  } = jobDetails;

  return (
    <Card className="w-full mb-4 border-l-4 border-l-blue-500 shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-2">
          <Briefcase className="w-5 h-5 text-blue-600" />
          <CardTitle className="text-xl text-gray-900">
            {jobTitle || "Job Details"}
          </CardTitle>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Job Description */}
        {jobDescription && (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4 text-gray-600" />
              <h3 className="font-semibold text-gray-900">Job Description</h3>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700 whitespace-pre-wrap">{jobDescription}</p>
            </div>
          </div>
        )}

        {/* Locations */}
        {locations && locations.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-gray-600" />
              <h3 className="font-semibold text-gray-900">Locations</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {locations.map((location, index) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className="bg-green-100 text-green-800 hover:bg-green-200"
                >
                  {location}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Skills Required */}
        {skillsRequired && skillsRequired.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Target className="w-4 h-4 text-gray-600" />
              <h3 className="font-semibold text-gray-900">Required Skills</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {skillsRequired.map((skill, index) => (
                <Badge 
                  key={index} 
                  className="bg-red-100 text-red-800 hover:bg-red-200"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Skills Optional */}
        {skillsOptional && skillsOptional.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Target className="w-4 h-4 text-gray-600" />
              <h3 className="font-semibold text-gray-900">Optional Skills</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {skillsOptional.map((skill, index) => (
                <Badge 
                  key={index} 
                  variant="outline"
                  className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Experience Range */}
        {experience && experience.length === 2 && (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-gray-600" />
              <h3 className="font-semibold text-gray-900">Experience Required</h3>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <p className="text-purple-800 font-medium">
                {experience[0]} - {experience[1]} years
              </p>
            </div>
          </div>
        )}

        {/* Resume Count and Match Threshold */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {resumeCount !== undefined && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-gray-600" />
                <h3 className="font-semibold text-gray-900">Target Resume Count</h3>
              </div>
              <div className="bg-orange-50 p-3 rounded-lg">
                <p className="text-orange-800 font-medium">{resumeCount} resumes</p>
              </div>
            </div>
          )}

          {matchThreshold !== undefined && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Target className="w-4 h-4 text-gray-600" />
                <h3 className="font-semibold text-gray-900">Match Threshold</h3>
              </div>
              <div className="bg-indigo-50 p-3 rounded-lg">
                <p className="text-indigo-800 font-medium">{matchThreshold}%</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default JobDetailsComponent;
