import React, { useState, useRef } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Upload, File, X, CheckCircle, AlertCircle } from "lucide-react";
import { useUploadDocument } from "@/hooks/useApi";

const WSSBankDetails = ({
  sectionRefs,
  viewedSections,
  reqNo,
  setBankAcknowledged,
  setDocumentUploaded,
}) => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const fileInputRef = useRef(null);

  const uploadDocumentMutation = useUploadDocument();

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        // Remove the data:application/pdf;base64, prefix
        const base64 = reader.result.split(",")[1];
        resolve(base64);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const getMediaType = (fileName) => {
    const extension = fileName.split(".").pop().toLowerCase();
    switch (extension) {
      case "pdf":
        return "application/pdf";
      case "doc":
        return "application/msword";
      case "docx":
        return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
      default:
        return "application/octet-stream";
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (
      !allowedTypes.includes(file.type) &&
      !file.name.match(/\.(pdf|doc|docx)$/i)
    ) {
      alert("Please upload only PDF or DOC files");
      return;
    }

    // Validate file size (e.g., 10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      alert("File size should be less than 10MB");
      return;
    }

    try {
      // Convert to base64
      const base64Content = await convertToBase64(file);

      // Prepare payload
      const uploadData = {
        fileName: file.name,
        content: base64Content,
        Doc_Type: "BANK",
        mediaType: getMediaType(file.name),
        ReqNo_ReqNo: reqNo, // You might want to make this dynamic
      };

      console.log("Upload Data:", uploadData);

      // Use the mutation to upload
      await uploadDocumentMutation.mutateAsync(uploadData);
      setUploadedFile(file);
      setDocumentUploaded(true);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload failed. Please try again.");
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    setDocumentUploaded(false);
    uploadDocumentMutation.reset(); // Reset mutation state
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  function getUploadErrorMessage(error) {
    if (!error) return "Upload failed. Please try again.";
    if (typeof error === "string") return error;
    if (error instanceof Error) return error.message;
    try {
      const parsed = JSON.parse(JSON.stringify(error));
      return parsed.message || parsed.error || "Upload failed.";
    } catch {
      return "Upload failed.";
    }
  }

  return (
    <div
      ref={(el) => (sectionRefs.current["wss-bank-details"] = el)}
      id="wss-bank-details"
      className="scroll-mt-20"
    >
      <Card
        className={`
          shadow-lg transition-all duration-300 border-2
          ${
            viewedSections.has("wss-bank-details")
              ? "border-green-200 bg-gradient-to-br from-green-50 to-white"
              : "border-amber-200 bg-gradient-to-br from-amber-50 to-white"
          }
        `}
      >
        <CardHeader className="pb-4">
          <div className="flex items-center space-x-3">
            <div
              className={`
                w-3 h-3 rounded-full 
                ${
                  viewedSections.has("wss-bank-details")
                    ? "bg-green-500"
                    : "bg-amber-500"
                }
              `}
            />
            <CardTitle className="text-lg font-semibold text-gray-900">
              WSS Bank Details
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label
                htmlFor="bank-name"
                className="text-sm font-medium text-gray-700"
              >
                Bank Name
              </Label>
              <Input
                readOnly
                type="text"
                id="bank-name"
                placeholder="Enter Bank Name"
                className="bg-white/70 border-gray-200"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="account-number"
                className="text-sm font-medium text-gray-700"
              >
                Account Number
              </Label>
              <Input
                readOnly
                type="text"
                id="account-number"
                placeholder="Enter Account Number"
                className="bg-white/70 border-gray-200"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="ifsc-code"
                className="text-sm font-medium text-gray-700"
              >
                IFSC Code
              </Label>
              <Input
                readOnly
                type="text"
                id="ifsc-code"
                placeholder="IFSC Code"
                className="bg-white/70 border-gray-200"
              />
            </div>
          </div>

          {/* Upload Section */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700">
              Upload Bank Document
            </Label>

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileUpload}
              className="hidden"
            />

            {!uploadedFile ? (
              <div
                onClick={handleUploadClick}
                className={`
                  border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer
                  hover:border-blue-400 hover:bg-blue-50/50 transition-colors
                  ${
                    uploadDocumentMutation.isPending
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }
                `}
              >
                <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-600 mb-1">
                  {uploadDocumentMutation.isPending
                    ? "Uploading..."
                    : "Click to upload bank document"}
                </p>
                <p className="text-xs text-gray-500">
                  PDF, DOC files up to 10MB
                </p>
              </div>
            ) : (
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                <div className="flex items-center space-x-3">
                  <File className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {uploadedFile.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  {uploadDocumentMutation.isSuccess && (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  )}
                  {uploadDocumentMutation.isError && (
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  )}
                </div>
                <button
                  onClick={removeFile}
                  className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                >
                  <X className="h-4 w-4 text-gray-500" />
                </button>
              </div>
            )}

            {uploadDocumentMutation.isSuccess && (
              <p className="text-sm text-green-600 flex items-center gap-1">
                <CheckCircle className="h-4 w-4" />
                Document uploaded successfully
              </p>
            )}

            {uploadDocumentMutation.isError && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {getUploadErrorMessage(uploadDocumentMutation.error)}
              </p>
            )}
          </div>

          <Label className="flex items-start gap-3 rounded-lg border-2 border-blue-200 p-4 bg-blue-50/50 hover:bg-blue-50 transition-colors cursor-pointer">
            <Checkbox
              id="bank-acknowledgment"
              onCheckedChange={(checked) => setBankAcknowledged(checked)}
              className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white mt-0.5"
            />
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-900">I Acknowledge</p>
              <p className="text-sm text-gray-600">
                Above bank details are correct to my knowledge
              </p>
            </div>
          </Label>
        </CardContent>
      </Card>
    </div>
  );
};

export default WSSBankDetails;
