import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Briefcase } from "lucide-react";

export default function AppliedJobs({ isOpen, onClose, appliedData = [] }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto rounded-2xl bg-gray-50 p-6 border border-gray-200">
        {/* Header */}
        <DialogHeader className="mb-6">
          <DialogTitle className="flex items-center gap-2 text-xl font-semibold text-gray-900">
            <Briefcase className="w-5 h-5 text-blue-600" />
            Applied Jobs{" "}
            <span className="text-gray-500 text-base font-normal">
              ({appliedData.length})
            </span>
          </DialogTitle>
          <DialogDescription className="text-gray-500 text-sm mt-1">
            View all the roles you’ve applied for along with their current status and details.
          </DialogDescription>
        </DialogHeader>

        {/* Jobs List */}
        <div className="space-y-6">
          {appliedData.length === 0 ? (
            <div className="text-center text-gray-500 py-10">
              You haven’t applied to any jobs yet.
            </div>
          ) : (
            appliedData.map((job, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-2xl p-6 bg-white shadow-sm hover:shadow-md transition-all duration-200"
              >
                {/* Header Row */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 leading-snug">
                      {job.job_title || "Untitled Job"}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      JR ID:{" "}
                      <span className="font-medium text-gray-700">
                        {job.jr_id}
                      </span>
                    </p>
                  </div>

                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full capitalize ${
                      job.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : job.status === "Invited"
                        ? "bg-blue-100 text-blue-700"
                        : job.status === "Interview"
                        ? "bg-yellow-100 text-yellow-700"
                        : job.status === "Selected"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {job.status}
                  </span>
                </div>

                {/* Job Info */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-3 gap-x-4 text-sm text-gray-700 border-t border-gray-100 pt-4">
                  <p>
                    <span className="text-gray-500">Experience:</span>{" "}
                    <span className="font-medium">
                      {job.min_experience_years
                        ? `${job.min_experience_years} yrs`
                        : "N/A"}
                    </span>
                  </p>
                  <p>
                    <span className="text-gray-500">Applied On:</span>{" "}
                    <span className="font-medium">
                      {new Date(job.mapped_date).toLocaleDateString()}
                    </span>
                  </p>
                  <p>
                    <span className="text-gray-500">Location:</span>{" "}
                    <span className="font-medium capitalize">
                      {job.location?.length > 0
                        ? job.location.join(", ")
                        : "Not specified"}
                    </span>
                  </p>
                </div>

                {/* Skills Section */}
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-800 mb-2">
                    Skills:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {job.mandatory_skills?.length > 0 ? (
                      job.mandatory_skills.map((skill, index) => (
                        <span
                          key={index}
                          className="bg-blue-50 text-blue-700 px-3 py-1 text-xs rounded-full font-medium border border-blue-100 capitalize"
                        >
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500 text-sm">N/A</span>
                    )}
                  </div>
                </div>

                {/* Remarks */}
                <div className="mt-4">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium text-gray-700">Remarks:</span>{" "}
                    {job.remarks || "No remarks available"}
                  </p>
                </div>

                {/* Description */}
                {job.job_description && (
                  <p className="text-sm text-gray-600 mt-4 leading-relaxed line-clamp-4">
                    {job.job_description}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
