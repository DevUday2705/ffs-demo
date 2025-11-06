"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MapPin,
  Calendar,
  Users,
  Target,
  FileText,
  Briefcase,
  Eye,
  Copy,
  UserCheck,
} from "lucide-react";

const JobDetailsComponent = ({
  jobDetails,
  onViewJR,
  onCopyJR,
  onRoleSelection,
}) => {
  const [approvalActors, setApprovalActors] = useState({
    recruiter: [],
    approver_1: [],
    approver_2: [],
    approver_3: [],
  });
  const [loadingActors, setLoadingActors] = useState({
    recruiter: false,
    approver_1: false,
    approver_2: false,
    approver_3: false,
  });
  const [selectedRoles, setSelectedRoles] = useState({
    recruiter: null,
    approver_1: null,
    approver_2: null,
    approver_3: null,
  });
  const [isAssigning, setIsAssigning] = useState(false);

  if (!jobDetails || Object.keys(jobDetails).length === 0) {
    return null;
  }

  // Extract existing role assignments from jobDetails
  const existingRoleIds = {
    recruiter: jobDetails["Recruiter ID"],
    approver_1: jobDetails["Approver 1 ID"],
    approver_2: jobDetails["Approver 2 ID"],
    approver_3: jobDetails["Approver 3 ID"],
  };

  // Debug logging
  console.log("JobDetails received:", jobDetails);
  console.log("Existing role IDs:", existingRoleIds);
  console.log("Current selected roles:", selectedRoles);
  console.log("Current approval actors:", approvalActors);

  // Effect to prefill dropdowns when jobDetails change or actors are loaded
  useEffect(() => {
    const prefillExistingRoles = () => {
      const newSelectedRoles = { ...selectedRoles };
      let hasChanges = false;

      // Check each role type
      Object.keys(existingRoleIds).forEach((roleType) => {
        const roleId = existingRoleIds[roleType];
        if (roleId && approvalActors[roleType].length > 0) {
          // Find the employee data for this role ID
          const employee = approvalActors[roleType].find(
            (emp) => emp.emp_id === roleId
          );
          if (employee && selectedRoles[roleType]?.emp_id !== roleId) {
            newSelectedRoles[roleType] = employee;
            hasChanges = true;
          }
        }
      });

      if (hasChanges) {
        setSelectedRoles(newSelectedRoles);
      }
    };

    prefillExistingRoles();
  }, [approvalActors, jobDetails]); // Re-run when actors are loaded or jobDetails change

  // Effect to auto-fetch actors for roles that have existing assignments
  useEffect(() => {
    Object.keys(existingRoleIds).forEach((roleType) => {
      const roleId = existingRoleIds[roleType];
      if (
        roleId &&
        approvalActors[roleType].length === 0 &&
        !loadingActors[roleType]
      ) {
        // Auto-fetch actors for this role since we have an existing assignment
        fetchApprovalActors(roleType);
      }
    });
  }, [jobDetails]); // Run when jobDetails change

  // Fetch approval actors for a specific role
  const fetchApprovalActors = async (role) => {
    if (approvalActors[role].length > 0) {
      return; // Already loaded
    }

    setLoadingActors((prev) => ({ ...prev, [role]: true }));

    try {
      const response = await fetch(`/api/jr-approval-actors?role=${role}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${role} actors`);
      }

      const data = await response.json();
      console.log(`${role} actors data:`, data);

      // Extract the array from the response based on the role
      const actorList = data[role] || [];

      setApprovalActors((prev) => ({
        ...prev,
        [role]: actorList,
      }));
    } catch (error) {
      console.error(`Error fetching ${role} actors:`, error);
    } finally {
      setLoadingActors((prev) => ({ ...prev, [role]: false }));
    }
  };

  // Handle role selection - store selection instead of immediate API call
  const handleRoleSelection = (role, employeeData) => {
    setSelectedRoles((prev) => ({
      ...prev,
      [role]: employeeData,
    }));
  };

  // Handle assign button click - build combined query and make API call
  const handleAssign = async () => {
    const selections = Object.entries(selectedRoles)
      .filter(([role, employee]) => employee !== null)
      .map(([role, employee]) => {
        const roleLabels = {
          recruiter: "recruiter",
          approver_1: "Approver 1",
          approver_2: "Approver 2",
          approver_3: "Approver 3",
        };
        return `Set ${roleLabels[role]} as ${employee.emp_id}`;
      });

    if (selections.length === 0) {
      return; // No selections made
    }

    const combinedQuery = selections.join(", ");
    console.log("Combined assignment query:", combinedQuery);

    setIsAssigning(true);

    if (onRoleSelection) {
      await onRoleSelection(combinedQuery);
    }

    // Reset selections after assignment
    setSelectedRoles({
      recruiter: null,
      approver_1: null,
      approver_2: null,
      approver_3: null,
    });

    setIsAssigning(false);
  };

  const {
    "Job Title": jobTitle,
    "Job Description": jobDescription,
    Location: locations,
    "Mandatory Skills": skillsRequired,
    "Optional Skills": skillsOptional,
     "Min Experience": minExperience,
  "Max Experience": maxExperience,
    "Resume Count": resumeCount,
    "Match Threshold": matchThreshold,
  } = jobDetails;

 const experience = [];

if (minExperience && minExperience !== "Not specified") {
  experience[0] = minExperience.replace(" years", "");
}
if (maxExperience && maxExperience !== "Not specified") {
  experience[1] = maxExperience.replace(" years", "");
}


  return (
    <Card className="w-full mb-4 border-l-4 border-l-blue-500 shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Briefcase className="w-5 h-5 text-blue-600" />
            <CardTitle className="text-xl text-gray-900">
              {jobTitle || "Job Details"}
            </CardTitle>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <Button
              onClick={() => onViewJR && onViewJR(jobDetails)}
              variant="outline"
              size="sm"
              className="flex items-center space-x-2 text-blue-600 border-blue-200 hover:bg-blue-50"
            >
              <Eye className="w-4 h-4" />
              <span>View JR</span>
            </Button>
            <Button
              onClick={() => onCopyJR && onCopyJR(jobDetails)}
              variant="outline"
              size="sm"
              className="flex items-center space-x-2 text-green-600 border-green-200 hover:bg-green-50"
            >
              <Copy className="w-4 h-4" />
              <span>Copy Link</span>
            </Button>
          </div>
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
              <p className="text-gray-700 whitespace-pre-wrap">
                {jobDescription}
              </p>
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
    {(experience[0] || experience[1]) && (
  <div className="space-y-2">
    <div className="flex items-center space-x-2">
      <Calendar className="w-4 h-4 text-gray-600" />
      <h3 className="font-semibold text-gray-900">Experience Required</h3>
    </div>
    <div className="bg-purple-50 p-3 rounded-lg">
      <p className="text-purple-800 font-medium">
        {experience[0] ? `${experience[0]}` : "N/A"} -{" "}
        {experience[1] ? `${experience[1]} years` : "N/A"}
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
                <h3 className="font-semibold text-gray-900">
                  Target Resume Count
                </h3>
              </div>
              <div className="bg-orange-50 p-3 rounded-lg">
                <p className="text-orange-800 font-medium">
                  {resumeCount} resumes
                </p>
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
                <p className="text-indigo-800 font-medium">{matchThreshold * 100}%</p>
              </div>
            </div>
          )}
        </div>

        {/* Approval Role Selectors */}
        <div className="space-y-4 border-t pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <UserCheck className="w-4 h-4 text-gray-600" />
              <h3 className="font-semibold text-gray-900">Approval Workflow</h3>
            </div>
            <Button
              onClick={handleAssign}
              disabled={
                isAssigning ||
                Object.values(selectedRoles).every((role) => role === null)
              }
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
              size="sm"
            >
              {isAssigning ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Assigning...</span>
                </>
              ) : (
                <>
                  <UserCheck className="w-4 h-4" />
                  <span>Assign Roles</span>
                </>
              )}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Recruiter Selector */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Recruiter
              </label>
              <Select
                value={selectedRoles.recruiter?.emp_id || ""}
                onOpenChange={(open) =>
                  open && fetchApprovalActors("recruiter")
                }
                onValueChange={(value) => {
                  const selectedEmployee = approvalActors.recruiter.find(
                    (emp) => emp.emp_id === value
                  );
                  if (selectedEmployee)
                    handleRoleSelection("recruiter", selectedEmployee);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue
                    placeholder={
                      selectedRoles.recruiter
                        ? `${selectedRoles.recruiter.emp_first_name} ${selectedRoles.recruiter.emp_last_name}`
                        : loadingActors.recruiter
                        ? "Loading..."
                        : "Select Recruiter"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {loadingActors.recruiter ? (
                    <SelectItem value="loading" disabled>
                      Loading recruiters...
                    </SelectItem>
                  ) : approvalActors.recruiter.length > 0 ? (
                    approvalActors.recruiter.map((employee) => (
                      <SelectItem key={employee.emp_id} value={employee.emp_id}>
                        {employee.emp_first_name} {employee.emp_last_name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="empty" disabled>
                      No recruiters available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Approver 1 Selector */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Approver 1
              </label>
              <Select
                value={selectedRoles.approver_1?.emp_id || ""}
                onOpenChange={(open) =>
                  open && fetchApprovalActors("approver_1")
                }
                onValueChange={(value) => {
                  const selectedEmployee = approvalActors.approver_1.find(
                    (emp) => emp.emp_id === value
                  );
                  if (selectedEmployee)
                    handleRoleSelection("approver_1", selectedEmployee);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue
                    placeholder={
                      selectedRoles.approver_1
                        ? `${selectedRoles.approver_1.emp_first_name} ${selectedRoles.approver_1.emp_last_name}`
                        : loadingActors.approver_1
                        ? "Loading..."
                        : "Select Approver 1"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {loadingActors.approver_1 ? (
                    <SelectItem value="loading" disabled>
                      Loading approvers...
                    </SelectItem>
                  ) : approvalActors.approver_1.length > 0 ? (
                    approvalActors.approver_1.map((employee) => (
                      <SelectItem key={employee.emp_id} value={employee.emp_id}>
                        {employee.emp_first_name} {employee.emp_last_name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="empty" disabled>
                      No approvers available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Approver 2 Selector */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Approver 2
              </label>
              <Select
                value={selectedRoles.approver_2?.emp_id || ""}
                onOpenChange={(open) =>
                  open && fetchApprovalActors("approver_2")
                }
                onValueChange={(value) => {
                  const selectedEmployee = approvalActors.approver_2.find(
                    (emp) => emp.emp_id === value
                  );
                  if (selectedEmployee)
                    handleRoleSelection("approver_2", selectedEmployee);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue
                    placeholder={
                      selectedRoles.approver_2
                        ? `${selectedRoles.approver_2.emp_first_name} ${selectedRoles.approver_2.emp_last_name}`
                        : loadingActors.approver_2
                        ? "Loading..."
                        : "Select Approver 2"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {loadingActors.approver_2 ? (
                    <SelectItem value="loading" disabled>
                      Loading approvers...
                    </SelectItem>
                  ) : approvalActors.approver_2.length > 0 ? (
                    approvalActors.approver_2.map((employee) => (
                      <SelectItem key={employee.emp_id} value={employee.emp_id}>
                        {employee.emp_first_name} {employee.emp_last_name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="empty" disabled>
                      No approvers available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Approver 3 Selector */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Approver 3
              </label>
              <Select
                value={selectedRoles.approver_3?.emp_id || ""}
                onOpenChange={(open) =>
                  open && fetchApprovalActors("approver_3")
                }
                onValueChange={(value) => {
                  const selectedEmployee = approvalActors.approver_3.find(
                    (emp) => emp.emp_id === value
                  );
                  if (selectedEmployee)
                    handleRoleSelection("approver_3", selectedEmployee);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue
                    placeholder={
                      selectedRoles.approver_3
                        ? `${selectedRoles.approver_3.emp_first_name} ${selectedRoles.approver_3.emp_last_name}`
                        : loadingActors.approver_3
                        ? "Loading..."
                        : "Select Approver 3"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {loadingActors.approver_3 ? (
                    <SelectItem value="loading" disabled>
                      Loading approvers...
                    </SelectItem>
                  ) : approvalActors.approver_3.length > 0 ? (
                    approvalActors.approver_3.map((employee) => (
                      <SelectItem key={employee.emp_id} value={employee.emp_id}>
                        {employee.emp_first_name} {employee.emp_last_name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="empty" disabled>
                      No approvers available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default JobDetailsComponent;
