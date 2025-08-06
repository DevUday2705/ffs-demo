import { useState, useEffect } from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlignLeft, Paperclip } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  mapPILLiabilityApiToUi,
  pilLiabilityInfoFieldsMap,
} from "./fieldInfoMappings";

export const PILLiabilityAccordion = ({
  sectionRef,
  sectionId,
  isViewed,
  onFileUpload,
  apiData,
  docsData = [],
}) => {
  const [rows, setRows] = useState([]);
  const [modalState, setModalState] = useState({
    open: false,
    docs: [],
    title: "",
  });

  // Map API data to rows
  useEffect(() => {
    if (apiData && Array.isArray(apiData)) {
      const mappedRows = mapPILLiabilityApiToUi(
        apiData,
        pilLiabilityInfoFieldsMap
      );
      setRows(mappedRows);
    } else {
      setRows([
        {
          id: "1",
          label: "Gift Scheme Debit Reversal - Acknowledgement Submission",
          amount: "0",
          remarks: "NA",
        },
        {
          id: "2",
          label: "Others",
          amount: "0",
          remarks: "NA",
        },
        {
          id: "3",
          label: "Total Fresh Claims - WSS during FFS",
          amount: "0",
          remarks: "58023.84",
        },
      ]);
    }
  }, [apiData]);

  // Helper to get docs for a row
  const getDocsForRow = (rowLabel) => {
    if (!docsData.value || !Array.isArray(docsData.value)) return [];
    if (rowLabel === "Others") {
      return docsData.value.filter(
        (doc) => doc.Doc_Type?.toUpperCase() === "OTHER_CLAIMS"
      );
    }
    if (
      rowLabel === "Gift Scheme Debit Reversal - Acknowledgement Submission"
    ) {
      return docsData.value.filter(
        (doc) => doc.Doc_Type?.toUpperCase() === "DN2"
      );
    }
    return [];
  };

  // Handler for attachment icon click
  const handleAttachmentClick = (rowLabel) => {
    const docs = getDocsForRow(rowLabel);
    console.log("Docs for row:", rowLabel, docs);
    setModalState({
      open: true,
      docs,
      title: `Attachments - ${rowLabel}`,
    });
  };

  // Close dialog
  const handleCloseDialog = () => {
    setModalState((prev) => ({ ...prev, open: false }));
  };

  const data = {
    title: "PIL Liability",
    rows: rows,
  };

  return (
    <>
      <Card
        ref={sectionRef}
        id={sectionId}
        className={`scroll-mt-20 shadow-lg transition-all duration-300 border-2 ${
          isViewed
            ? "border-green-200 bg-gradient-to-br from-green-50 to-white"
            : "border-amber-200 bg-gradient-to-br from-amber-50 to-white"
        }`}
      >
        <CardContent className="p-0">
          <Accordion
            type="single"
            defaultValue="item-0"
            collapsible
            className="w-full"
          >
            <AccordionItem value="item-0" className="border-0">
              <AccordionTrigger className="px-6 py-4 hover:no-underline">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      isViewed ? "bg-green-500" : "bg-amber-500"
                    }`}
                  />
                  <CardTitle className="text-lg font-semibold text-gray-900">
                    {data.title}
                  </CardTitle>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6">
                {/* Desktop View */}
                <div className="hidden md:block overflow-x-auto">
                  <div className="min-w-[800px]">
                    {/* Headers */}
                    <div className="grid grid-cols-4 gap-4 px-4 py-3 bg-gradient-to-r from-gray-100 to-gray-50 rounded-lg border border-gray-200 mb-4">
                      <div className="col-span-2">
                        <Label className="font-semibold text-gray-800 text-sm">
                          PIL Liability Details
                        </Label>
                      </div>
                      <div>
                        <Label className="font-semibold text-gray-800 text-sm">
                          Amount(₹)
                        </Label>
                      </div>
                      <div>
                        <Label className="font-semibold text-gray-800 text-sm">
                          Remarks
                        </Label>
                      </div>
                    </div>

                    {/* Data Rows */}
                    {data.rows.map((row, index) => {
                      const docsForRow = getDocsForRow(row.label);
                      return (
                        <div
                          key={row.id || index}
                          className="grid grid-cols-4 gap-4 p-4 bg-white/80 rounded-lg border border-gray-100 hover:bg-white/90 transition-colors mb-2"
                        >
                          <div className="col-span-2 flex items-center">
                            <Label className="font-medium text-gray-700 text-sm leading-tight">
                              {row.label}
                            </Label>
                          </div>
                          {/* Amount */}
                          <div className="flex items-center space-x-1">
                            <Input
                              readOnly
                              value={row.amount}
                              disabled
                              className="bg-white/70 border-gray-200 text-sm flex-1"
                            />
                          </div>
                          {/* Remarks + Attachment */}
                          <div className="flex items-center space-x-1">
                            <Input
                              readOnly
                              value={row.remarks}
                              disabled
                              className="bg-white/70 border-gray-200 text-sm flex-1"
                            />
                            {docsForRow.length > 0 && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleAttachmentClick(row.label)}
                                className="flex items-center justify-center hover:bg-blue-50 hover:border-blue-300 flex-shrink-0 w-8 h-8"
                                title="View Attachments"
                              >
                                <Paperclip className="w-4 h-4" />
                                <span className="sr-only">
                                  View Attachments
                                </span>
                              </Button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                {/* Mobile View */}
                <div className="block md:hidden">
                  {data.rows.map((row, index) => {
                    const docsForRow = getDocsForRow(row.label);
                    return (
                      <div
                        key={row.id || index}
                        className="bg-white/80 rounded-lg border border-gray-100 p-4 mb-3"
                      >
                        <div className="font-medium text-gray-700 text-sm mb-3 pb-2 border-b border-gray-200">
                          {row.label}
                        </div>
                        <div className="space-y-3">
                          <div>
                            <Label className="font-medium text-gray-600 text-xs mb-1 block">
                              Amount(₹)
                            </Label>
                            <div className="flex items-center space-x-1">
                              <Input
                                readOnly
                                value={row.amount}
                                disabled
                                className="bg-white/70 border-gray-200 text-sm flex-1"
                              />
                            </div>
                          </div>
                          <div>
                            <Label className="font-medium text-gray-600 text-xs mb-1 block">
                              Remarks
                            </Label>
                            <div className="flex items-center space-x-1">
                              <Input
                                readOnly
                                value={row.remarks}
                                disabled
                                className="bg-white/70 border-gray-200 text-sm flex-1"
                              />
                              {docsForRow.length > 0 && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    handleAttachmentClick(row.label)
                                  }
                                  className="flex items-center justify-center hover:bg-blue-50 hover:border-blue-300 flex-shrink-0 w-8 h-8"
                                  title="View Attachments"
                                >
                                  <Paperclip className="w-4 h-4" />
                                  <span className="sr-only">
                                    View Attachments
                                  </span>
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      {/* Attachments Modal */}
      <Dialog open={modalState.open} onOpenChange={handleCloseDialog}>
        <DialogContent className="max-w-2xl w-full">
          <DialogHeader>
            <DialogTitle>{modalState.title}</DialogTitle>
            <DialogDescription>
              {modalState.docs.length === 0
                ? "No attachments found."
                : "Below are the documents attached for this section."}
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-72">
            {modalState.docs.length > 0 ? (
              <div className="space-y-4">
                {modalState.docs.map((doc) => (
                  <div
                    key={doc.ID}
                    className="flex items-center justify-between rounded-lg border border-gray-200 p-3 bg-white shadow-sm"
                  >
                    <div>
                      <div className="font-medium text-gray-900 text-sm flex items-center gap-2">
                        <Paperclip className="w-4 h-4 text-gray-500" />
                        {doc.fileName}
                        <Badge variant="outline" className="ml-2 text-xs">
                          {doc.mediaType}
                        </Badge>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Uploaded: {new Date(doc.createdAt).toLocaleString()}
                      </div>
                    </div>
                    <a
                      href={`${
                        process.env.NEXT_PUBLIC_DOCS_DOWNLOAD_URL || "#"
                      }/${doc.ID}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-4"
                    >
                      <Button size="sm" variant="secondary">
                        View
                      </Button>
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                No documents available.
              </div>
            )}
          </ScrollArea>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
