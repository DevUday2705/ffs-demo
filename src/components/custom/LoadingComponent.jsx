"use client";

import { Bot, Loader2 } from "lucide-react";

const LoadingComponent = ({ searchProgress, userRole }) => {
  // Generic loading messages that work for all roles
  const getGenericMessage = (stage) => {
    if (!stage) return "Processing your request...";
    
    // Map resume-specific stages to generic ones
    const genericStageMap = {
      "Initializing search...": "Initializing...",
      "Fetching resumes from database...": "Fetching data...",
      "Scanning resumes database...": "Analyzing data...",
      "Analyzing skills and experience...": "Processing information...",
      "Applying AI matching algorithms...": "Applying AI algorithms...",
      "Ranking and shortlisting candidates...": "Generating results...",
      "Finalizing results...": "Finalizing...",
    };

    return genericStageMap[stage] || stage;
  };

  // Role-specific count messages
  const getCountMessage = (count, role) => {
    if (count <= 0) return null;
    
    switch (role) {
      case "HM": // Hiring Manager
        return `Processed ${count.toLocaleString()} records`;
      case "R": // Recruiter
        return `Processed ${count.toLocaleString()} resumes`;
      case "C": // Candidate
        return `Processed ${count.toLocaleString()} records`;
      default:
        return `Processed ${count.toLocaleString()} items`;
    }
  };

  return (
    <div className="flex items-start space-x-4 animate-in slide-in-from-bottom-4 duration-300">
      <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
        <Bot className="w-5 h-5 text-white" />
      </div>
      <div className="flex-1">
        <div className="inline-block px-6 py-5 bg-white border border-gray-200 rounded-2xl shadow-sm">
          <div className="flex items-center space-x-4">
            <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
            <div>
              <p className="text-sm font-semibold text-gray-900">
                {getGenericMessage(searchProgress.stage)}
              </p>
              {searchProgress.count > 0 && (
                <p className="text-xs text-gray-600 mt-1">
                  {getCountMessage(searchProgress.count, userRole)}
                </p>
              )}
            </div>
          </div>
          <div className="flex space-x-1 mt-4">
            <div
              className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
              style={{ animationDelay: "0ms" }}
            ></div>
            <div
              className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
              style={{ animationDelay: "150ms" }}
            ></div>
            <div
              className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
              style={{ animationDelay: "300ms" }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingComponent;
