"use client";

import { useState } from "react";
import { X, Download, ExternalLink, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const ResumeViewer = ({ isOpen, onClose, resume }) => {
  if (!resume) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <span>Resume Preview - {resume.metadata.name}</span>
              <DialogDescription className="mt-1">
                View candidate's resume
              </DialogDescription>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          {/* Resume Iframe Viewer */}
          <div className="h-[calc(90vh-200px)] border rounded-lg overflow-hidden bg-gray-50">
            <iframe
              src={`${resume.metadata.download_url}#toolbar=0&navpanes=0&scrollbar=0`}
              className="w-full h-full"
              title={`Resume - ${resume.metadata.name}`}
              onError={(e) => {
                // Fallback if iframe fails
                e.target.style.display = "none";
                const fallback = e.target.nextSibling;
                if (fallback) fallback.style.display = "block";
              }}
            />

            {/* Fallback content if iframe fails */}
            <div
              className="w-full h-full flex-col items-center justify-center space-y-4 text-gray-500"
              style={{ display: "none" }}
            >
              <FileText className="w-16 h-16" />
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">
                  Resume Preview Not Available
                </h3>
                <p className="text-sm mb-4">
                  Unable to preview this resume format. Please download to view.
                </p>
                <Button asChild className="bg-blue-500 hover:bg-blue-600">
                  <a
                    href={resume.metadata.download_url}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Resume
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="text-sm text-gray-500">
            {resume.metadata.email && (
              <span>Contact: {resume.metadata.email}</span>
            )}
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={() =>
                window.open(resume.metadata.download_url, "_blank")
              }
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Open in New Tab
            </Button>
            <Button asChild className="bg-blue-500 hover:bg-blue-600">
              <a
                href={resume.metadata.download_url}
                download
                target="_blank"
                rel="noopener noreferrer"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </a>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ResumeViewer;
