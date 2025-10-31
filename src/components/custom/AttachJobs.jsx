import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Briefcase, X } from "lucide-react";

export default function AttachJobs({ isOpen, onClose, attachedJobs = [] }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Briefcase className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <span>Attached Jobs ({attachedJobs.length})</span>
              <DialogDescription className="mt-1">
                View details of all jobs linked to this candidate
              </DialogDescription>
            </div>
          </DialogTitle>
        </DialogHeader>

        {/* Job Details Section */}
        <div className="overflow-y-auto max-h-[55vh] pr-2">
          {attachedJobs.length > 0 ? (
           <ul className="divide-y divide-gray-200">
  {attachedJobs.map((job, index) => (
    <li key={index} className="py-3 flex flex-col space-y-2 text-sm text-gray-700">
      <div className="flex justify-between">
        <p className="font-semibold text-gray-900">Job ID: {job.jobId}</p>
        <p className="text-xs text-gray-500">Attached On: {job.attachedOn}</p>
      </div>
      <p><strong>Position:</strong> {job.position}</p>
      <p><strong>Status:</strong> <span className="text-blue-600">{job.status}</span></p>
    </li>
  ))}
</ul>

          ) : (
            <div className="flex flex-col items-center justify-center text-gray-500 py-10">
              <Briefcase className="w-10 h-10 mb-3 opacity-60" />
              <p className="text-sm">No jobs attached yet.</p>
            </div>
          )}
        </div>

        {/* Footer */}
      </DialogContent>
    </Dialog>
  );
}
