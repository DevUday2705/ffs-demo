import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { User } from "lucide-react";
import { toast } from "sonner";

export default function CandidateTotalJobs({ isOpen, onClose, candidateId, sessionId }) {
  const [candidates, setCandidates] = useState([]);
  const [statusMap, setStatusMap] = useState({});
  const [remarksMap, setRemarksMap] = useState({});
  const [showRemarksMap, setShowRemarksMap] = useState({}); // track per candidate

  // 🧠 Load candidate list when modal opens
  useEffect(() => {
    if (!isOpen || !candidateId) return;

    const mappings = candidateId.mappings || [];
    const candidateArray = mappings.find(
      (item) => Array.isArray(item) && item[0]?.metadata
    );

    if (Array.isArray(candidateArray)) {
      setCandidates(candidateArray);

      const initialStatuses = {};
      candidateArray.forEach((cand) => {
        const mapping = mappings.find((m) => m.candidate_id === cand.id);
        initialStatuses[cand.id] = mapping?.status || "Invited";
      });
      setStatusMap(initialStatuses);
    }
  }, [isOpen, candidateId]);

  // Handle when user changes status
  const handleStatusChange = (cand, newStatus) => {
    setStatusMap((prev) => ({
      ...prev,
      [cand.id]: newStatus,
    }));
    setShowRemarksMap((prev) => ({
      ...prev,
      [cand.id]: true, // show remarks box
    }));
  };

  // 💾 Save button → Update API
  const handleSave = async (cand) => {
    const newStatus = statusMap[cand.id];
    const remarks = remarksMap[cand.id] || "";

    try {
      const mapping = candidateId.mappings.find((m) => m.candidate_id === cand.id);
      if (!mapping) {
        toast.error("Mapping not found", { position: "top-center" });
        return;
      }

      const formData = new URLSearchParams();
      formData.append("jr_id", mapping.jr_id);
      formData.append("candidate_id", cand.id);
      formData.append("session_id", sessionId);
      formData.append("status", newStatus);
      formData.append("remarks", remarks);
      formData.append("is_invited", true);

      const response = await fetch("/api/recruiter/update-candidate-status", {
        method: "PUT",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData.toString(),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Failed to update status", { position: "top-center" });
        return;
      }

      toast.success(`Status updated to "${newStatus}"`, { position: "top-center" });

      //  Update local mapping and hide remarks
      const mappingIndex = candidateId.mappings.findIndex(
        (m) => m.candidate_id === cand.id
      );
      if (mappingIndex !== -1) {
        candidateId.mappings[mappingIndex].status = newStatus;
      }

      setShowRemarksMap((prev) => ({ ...prev, [cand.id]: false }));
      setRemarksMap((prev) => ({ ...prev, [cand.id]: "" }));
    } catch (err) {
      console.error("🔥 Error updating status:", err);
      toast.error("Error updating status", { position: "top-center" });
    }
  };

  if (!candidateId || candidates.length === 0) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto rounded-2xl shadow-lg p-6 bg-white">
        <DialogHeader className="border-b pb-4 mb-4">
          <DialogTitle className="flex items-center gap-3 text-2xl font-semibold text-gray-800">
            <User className="w-6 h-6 text-blue-600" />
            <span>
              Total Candidates Applied{" "}
              <span className="text-blue-600">({candidates.length})</span>
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-6">
          {candidates.map((cand, idx) => {
            const info = cand.metadata || {};
            const showRemarks = showRemarksMap[cand.id];
            return (
              <div
                key={cand.id || idx}
                className="border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow duration-200 bg-gray-50"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg capitalize font-semibold text-gray-800">
                    {info.full_name || "Unknown Candidate"}
                  </h3>
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-medium ${
                      (statusMap[cand.id] || "Invited") === "Selected"
                        ? "bg-green-100 text-green-700"
                        : (statusMap[cand.id] || "Invited") === "Rejected"
                        ? "bg-red-100 text-red-700"
                        : (statusMap[cand.id] || "Invited") === "Interview"
                        ? "bg-blue-100 text-blue-700"
                        : (statusMap[cand.id] || "Invited") === "Screening"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {statusMap[cand.id] || "Invited"}
                  </span>
                </div>

                <div className="space-y-3 text-sm text-gray-700">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6">
                    {/* <p><strong>Email:</strong> {info.email || "N/A"}</p>
                    <p><strong>Phone:</strong> {info.phone_number || "N/A"}</p> */}
                    <p className="capitalize"><strong>Job Title:</strong> {info.job_title || "N/A"}</p>
                    <p className="capitalize"><strong>Location:</strong> {info.location || "N/A"}</p>
                    <p className="sm:col-span-2 capitalize"><strong>Experience:</strong> {info.total_experience || "N/A"} years</p>
                    <p className="sm:col-span-2 capitalize"><strong>Education:</strong> {info.education || "N/A"}</p>
                  </div>

                  <div>
                    <strong>Skills:</strong>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {info.skills?.length > 0 ? (
                        info.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="bg-gray-100 capitalize text-gray-800 px-2 py-1 rounded-full text-xs"
                          >
                            {skill}
                          </span>
                        ))
                      ) : (
                        <span>N/A</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-5">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Update Candidate Status
                  </label>
                  <select
                    className="border border-gray-300 px-4 py-2 rounded-lg w-full bg-white text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    value={statusMap[cand.id] || "Invited"}
                    onChange={(e) => handleStatusChange(cand, e.target.value)}
                  >
                    <option value="Invited">Invited</option>
                    <option value="Screening">Screening</option>
                    <option value="Interview">Interview</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Selected">Selected</option>
                  </select>
                </div>

                {/* Remarks section (hidden until status changes) */}
                {showRemarks && (
                  <div className="flex flex-col gap-2 mt-3">
                    <label htmlFor="remarks" className="font-medium">
                      Remarks:
                    </label>
                    <textarea
                      id="remarks"
                      rows="2"
                      placeholder="Add remarks (optional)"
                      className="border capitalize rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                      value={remarksMap[cand.id] || ""}
                      onChange={(e) =>
                        setRemarksMap((prev) => ({
                          ...prev,
                          [cand.id]: e.target.value,
                        }))
                      }
                    />
                    <button
                      onClick={() => handleSave(cand)}
                      className="self-end cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition-all"
                    >
                      Save
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
