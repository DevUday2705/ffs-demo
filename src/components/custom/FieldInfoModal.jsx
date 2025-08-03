"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function FieldInfoModal({
  open,
  onOpenChange,
  content,
  title = "Field Information",
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base text-gray-900 font-semibold">
            {title}
          </DialogTitle>
        </DialogHeader>
        <div className="p-2">
          <div className="text-gray-700 whitespace-pre-line text-sm leading-relaxed">
            {content}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
