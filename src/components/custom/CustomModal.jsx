"use client";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export default function FieldInfoModal({ open, onOpenChange, content }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <div className="p-2">
          <div className="text-base text-gray-900 font-semibold mb-2">
            Field Info
          </div>
          <div className="text-gray-700 whitespace-pre-line">{content}</div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
