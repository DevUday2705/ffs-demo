"use client";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export default function FieldInfoModal({ open, onOpenChange, content }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-[80vw] !w-[80vw]  overflow-hidden flex flex-col p-0">
        {/* Header */}
        <div className="px-6 pb-2 border-b bg-background flex-shrink-0">
          <div className="text-lg font-semibold text-gray-900">Field Info</div>
        </div>

        {/* Table content area */}
        <div className="flex-1 overflow-auto px-6 pb-6">{content}</div>
      </DialogContent>
    </Dialog>
  );
}
