"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlignLeft, Badge, List, Paperclip, Search } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useState } from "react";
import FieldInfoModal from "./CustomModal";
import BarcodeTokenApproved from "../custom/BarcodeTokenApproved";
import BarcodeTokenPending from "../custom/BarcodeTokenPending";
import BarcodeTokenRejected from "./BarcodeTokenRejected";
import SiteRebateApproved from "./SiteRebateApproved";
import SiteRebatePending from "./SiteRebatePending";
import SiteRebateRejected from "./SiteRebateRejected";
import SecondarySchemesApproved from "./SecondarySchemesApproved";
import SecondarySchemesPending from "./SecondarySchemesPending";
import SecondarySchemesRejected from "./SecondarySchemesRejected";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { ScrollArea } from "@radix-ui/react-scroll-area";

export const StockReceivableAccordion = ({
  sectionRef,
  sectionId,
  isViewed,
  onFileUpload,
  docsData = { value: [] },
}) => {
  const [modalState, setModalState] = useState({
    open: false,
    docs: [],
    title: "",
  });

  const getDocsForRow = (rowLabel) => {
    if (!docsData.value || !Array.isArray(docsData.value)) return [];
    if (
      rowLabel ===
      "Debit note reversals related to gift related Schemes due to non-submission of Acknowledgements"
    ) {
      return docsData.value.filter(
        (doc) => doc.Doc_Type?.toUpperCase() === "DN1"
      );
    }
    if (rowLabel === "Barcode token handling charges") {
      return docsData.value.filter(
        (doc) => doc.Doc_Type?.toUpperCase() === "BarCode"
      );
    }
    if (rowLabel === "Primary schemes/TD/CD") {
      return docsData.value.filter(
        (doc) => doc.Doc_Type?.toUpperCase() === "PRIMARY_TDCD"
      );
    }
    if (rowLabel === "Last claim received post NCC ref no. & date") {
      return docsData.value.filter(
        (doc) => doc.Doc_Type?.toUpperCase() === "LCR"
      );
    }
    if (rowLabel === "Claims for Stock loss amounts (as per defined policy)") {
      return docsData.value.filter(
        (doc) => doc.Doc_Type?.toUpperCase() === "STOCK_LOSS"
      );
    }
    if (rowLabel === "Claims for WSS Incentive") {
      return docsData.value.filter(
        (doc) => doc.Doc_Type?.toUpperCase() === "WSS_INCENTIVE"
      );
    }
    return [];
  };
  const [attachmentModal, setAttachmentModal] = useState({
    open: false,
    docs: [],
    title: "",
  });

  const rowDocTypeMap = {
    "Debit note reversals related to gift related Schemes due to non-submission of Acknowledgements":
      "DN1",
    "Barcode token handling charges": "BarCode",
    "Primary schemes/TD/CD": "PRIMARY_TDCD",
    "Last claim received post NCC ref no. & date": "LCR",
    "Claims for Stock loss amounts (as per defined policy)": "STOCK_LOSS",
    "Claims for WSS Incentive": "WSS_INCENTIVE",
  };
  const handleAttachmentClick = (rowLabel) => {
    const docs = getDocsForRow(rowLabel);
    setAttachmentModal({
      open: true,
      docs,
      title: `Attachments - ${rowLabel}`,
    });
  };

  // Close dialog
  const handleCloseDialog = () => {
    setAttachmentModal((prev) => ({ ...prev, open: false }));
  };

  const getInfoComponent = (rowLabel, columnLabel) => {
    switch (`${rowLabel}__${columnLabel}`) {
      case "secondary schemes settled through credit notes, Gift, Trips, Discounts, etc__Claim Approved":
        return <SecondarySchemesApproved />;
      case "secondary schemes settled through credit notes, Gift, Trips, Discounts, etc__Claim Pending":
        return <SecondarySchemesPending />;
      case "secondary schemes settled through credit notes, Gift, Trips, Discounts, etc__Claim Rejected":
        return <SecondarySchemesRejected />;
      case "Site Rebate, Modern trade, Joinery, Sales Return, Product Damage/Disposal, Rate difference and Sample related claims__Claim Approved":
        return <SiteRebateApproved />;
      case "Site Rebate, Modern trade, Joinery, Sales Return, Product Damage/Disposal, Rate difference and Sample related claims__Claim Pending":
        return <SiteRebatePending />;
      case "Site Rebate, Modern trade, Joinery, Sales Return, Product Damage/Disposal, Rate difference and Sample related claims__Claim Rejected":
        return <SiteRebateRejected />;
      case "Barcode Token claims__Claim Approved":
        return <BarcodeTokenApproved />;
      case "Barcode Token claims__Claim Pending":
        return <BarcodeTokenPending />;
      case "Barcode Token claims__Claim Rejected":
        return <BarcodeTokenRejected />;
      default:
        return <div>No additional information available.</div>;
    }
  };

  const handleInfoClick = (rowIndex, field, rowLabel, columnLabel) => {
    setModalState({
      open: true,
      row: rowIndex,
      field: field,
      content: getInfoComponent(rowLabel, columnLabel),
      title: `${columnLabel} - ${rowLabel}`,
    });
  };

  // Function to get info content based on row and column
  const getInfoContent = (rowLabel, columnLabel) => {
    const infoMap = {
      "secondary schemes settled through credit notes, Gift, Trips, Discounts, etc":
        {
          "Claim Approved":
            "Information about approved claims for secondary schemes including credit notes, gifts, trips, and discounts.",
          "Claim Pending":
            "Details about pending claims for secondary schemes that are awaiting approval or processing.",
          "Claim Rejected":
            "Information about rejected claims for secondary schemes and the reasons for rejection.",
        },
      "Site Rebate, Modern trade, Joinery, Sales Return, Product Damage/Disposal, Rate difference and Sample related claims":
        {
          "Claim Approved":
            "Information about approved claims for site rebates, modern trade, joinery, sales returns, product damage/disposal, rate differences and sample related claims.",
          "Claim Pending":
            "Details about pending claims for site rebates, modern trade, joinery, sales returns, product damage/disposal, rate differences and sample related claims.",
          "Claim Rejected":
            "Information about rejected claims for site rebates, modern trade, joinery, sales returns, product damage/disposal, rate differences and sample related claims.",
        },
      "Barcode Token claims": {
        "Claim Approved":
          "Information about approved claims for barcode token claims.",
        "Claim Pending":
          "Details about pending claims for barcode token claims.",
        "Claim Rejected":
          "Information about rejected claims for barcode token claims.",
      },
    };

    return (
      infoMap[rowLabel]?.[columnLabel] || "No additional information available."
    );
  };

  // Function to check if a cell should have an info icon
  const shouldShowInfoIcon = (rowLabel, columnLabel) => {
    const infoRows = [
      "secondary schemes settled through credit notes, Gift, Trips, Discounts, etc",
      "Site Rebate, Modern trade, Joinery, Sales Return, Product Damage/Disposal, Rate difference and Sample related claims",
      "Barcode Token claims",
    ];
    const infoCols = ["Claim Approved", "Claim Pending", "Claim Rejected"];

    return infoRows.includes(rowLabel) && infoCols.includes(columnLabel);
  };

  const data = {
    title: "Stock And Receivable",
    rows: [
      {
        label: "Last NCC ref no & date",
        autoPopulated: "NA",
        actualConfirmation: "0",
        discrepancy: "NA",
        remarks: "NA",
        field5: "NA",
        field6: "NA",
      },
      {
        label: "Last claim received post NCC ref no. & date",
        autoPopulated: "NA",
        actualConfirmation: "0",
        discrepancy: "NA",
        remarks: "NA",
        field5: "NA",
        field6: "NA",
      },
      {
        label:
          "secondary schemes settled through credit notes, Gift, Trips, Discounts, etc",
        autoPopulated: "NA",
        actualConfirmation: "0",
        discrepancy: "NA",
        remarks: "NA",
        field5: "NA",
        field6: "NA",
      },
      {
        label: "Claims for Stock loss amounts (as per defined policy)",
        autoPopulated: "NA",
        actualConfirmation: "0",
        discrepancy: "NA",
        remarks: "NA",
        field5: "NA",
        field6: "NA",
      },
      {
        label: "Claims for WSS Incentive",
        autoPopulated: "NA",
        actualConfirmation: "0",
        discrepancy: "NA",
        remarks: "NA",
        field5: "NA",
        field6: "NA",
      },
      {
        label:
          "Site Rebate, Modern trade, Joinery, Sales Return, Product Damage/Disposal, Rate difference and Sample related claims",
        autoPopulated: "NA",
        actualConfirmation: "58023.84",
        discrepancy: "55503.84",
        remarks: "2520",
        field5: "0",
        field6: "NA",
      },
      {
        label: "Barcode Token claims",
        autoPopulated: "NA",
        actualConfirmation: "20",
        discrepancy: "20",
        remarks: "0",
        field5: "0",
        field6: "NA",
      },
      {
        label: "Barcode token handling charges",
        autoPopulated: "NA",
        actualConfirmation: "NA",
        discrepancy: "NA",
        remarks: "NA",
        field5: "NA",
        field6: "NA",
      },
      {
        label: "Primary schemes/TD/CD",
        autoPopulated: "NA",
        actualConfirmation: "0",
        discrepancy: "NA",
        remarks: "NA",
        field5: "NA",
        field6: "NA",
      },
      {
        label:
          "Debit note reversals related to gift related Schemes due to non-submission of Acknowledgements",
        autoPopulated: "NA",
        actualConfirmation: "0",
        discrepancy: "NA",
        remarks: "NA",
        field5: "NA",
        field6: "NA",
      },
      {
        label: "Total Claim Values",
        autoPopulated: "NA",
        actualConfirmation: "578444366.850000",
        discrepancy: "562159560.780000",
        remarks: "16284806.07",
        field5: "0",
        field6: "NA",
      },
    ],
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
                  <div className="min-w-[1400px]">
                    {/* Headers */}
                    <div className="grid grid-cols-8 gap-3 px-4 py-3 bg-gradient-to-r from-gray-100 to-gray-50 rounded-lg border border-gray-200 mb-4">
                      <div className="col-span-2">
                        <Label className="font-semibold text-gray-800 text-sm">
                          Claim status prior to date
                        </Label>
                      </div>
                      <div>
                        <Label className="font-semibold text-gray-800 text-sm">
                          Date and Reference No
                        </Label>
                      </div>
                      <div>
                        <Label className="font-semibold text-gray-800 text-sm">
                          Claim Received
                        </Label>
                      </div>
                      <div>
                        <Label className="font-semibold text-gray-800 text-sm">
                          Claim Approved
                        </Label>
                      </div>
                      <div>
                        <Label className="font-semibold text-gray-800 text-sm">
                          Claim Pending
                        </Label>
                      </div>
                      <div>
                        <Label className="font-semibold text-gray-800 text-sm">
                          Claim Rejected
                        </Label>
                      </div>
                      <div>
                        <Label className="font-semibold text-gray-800 text-sm">
                          Remarks
                        </Label>
                      </div>
                    </div>

                    {/* Data Rows */}
                    {data.rows.map((row, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-8 gap-3 p-4 bg-white/80 rounded-lg border border-gray-100 hover:bg-white/90 transition-colors mb-2"
                      >
                        <div className="col-span-2 flex items-center">
                          <Label className="font-medium text-gray-700 text-sm leading-tight">
                            {row.label}
                          </Label>
                        </div>

                        {/* Date and Reference No */}
                        <div className="flex items-center space-x-1">
                          <Input
                            readOnly
                            value={row.autoPopulated}
                            disabled
                            className="bg-white/70 border-gray-200 text-sm flex-1"
                          />
                        </div>

                        {/* Claim Received */}
                        <div className="flex items-center space-x-1">
                          <Input
                            readOnly
                            value={row.actualConfirmation}
                            disabled
                            className="bg-white/70 border-gray-200 text-sm flex-1"
                          />
                        </div>

                        {/* Claim Approved */}
                        <div className="flex items-center space-x-1">
                          <Input
                            readOnly
                            value={row.discrepancy}
                            disabled
                            className="bg-white/70 border-gray-200 text-sm flex-1"
                          />
                          {shouldShowInfoIcon(row.label, "Claim Approved") && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="flex-shrink-0 w-8 h-8"
                              onClick={() =>
                                handleInfoClick(
                                  index,
                                  "discrepancy",
                                  row.label,
                                  "Claim Approved"
                                )
                              }
                            >
                              <List className="w-4 h-4 text-blue-500" />
                            </Button>
                          )}
                        </div>

                        {/* Claim Pending */}
                        <div className="flex items-center space-x-1">
                          <Input
                            readOnly
                            value={row.remarks}
                            disabled
                            className="bg-white/70 border-gray-200 text-sm flex-1"
                          />
                          {shouldShowInfoIcon(row.label, "Claim Pending") && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="flex-shrink-0 w-8 h-8"
                              onClick={() =>
                                handleInfoClick(
                                  index,
                                  "remarks",
                                  row.label,
                                  "Claim Pending"
                                )
                              }
                            >
                              <List className="w-4 h-4 text-blue-500" />
                            </Button>
                          )}
                        </div>

                        {/* Claim Rejected */}
                        <div className="flex items-center space-x-1">
                          <Input
                            readOnly
                            value={row.field5}
                            disabled
                            className="bg-white/70 border-gray-200 text-sm flex-1"
                          />
                          {shouldShowInfoIcon(row.label, "Claim Rejected") && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="flex-shrink-0 w-8 h-8"
                              onClick={() =>
                                handleInfoClick(
                                  index,
                                  "field5",
                                  row.label,
                                  "Claim Rejected"
                                )
                              }
                            >
                              <List className="w-4 h-4 text-blue-500" />
                            </Button>
                          )}
                        </div>

                        {/* Remarks */}
                        <div className="flex items-center space-x-1">
                          <Input
                            readOnly
                            value={row.field6}
                            disabled
                            className="bg-white/70 border-gray-200 text-sm flex-1"
                          />
                          {getDocsForRow(row.label).length > 0 && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleAttachmentClick(row.label)}
                              className="flex items-center justify-center hover:bg-blue-50 hover:border-blue-300 flex-shrink-0 w-8 h-8"
                              title="View Attachments"
                            >
                              <Paperclip className="w-4 h-4" />
                              <span className="sr-only">View Attachments</span>
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mobile View */}
                <div className="block md:hidden">
                  {data.rows.map((row, index) => (
                    <div
                      key={index}
                      className="bg-white/80 rounded-lg border border-gray-100 p-4 mb-3"
                    >
                      <div className="font-medium text-gray-700 text-sm mb-3 pb-2 border-b border-gray-200">
                        {row.label}
                      </div>
                      <div className="space-y-3">
                        <div>
                          <Label className="font-medium text-gray-600 text-xs mb-1 block">
                            Date and Reference No
                          </Label>
                          <div className="flex items-center space-x-1">
                            <Input
                              readOnly
                              value={row.autoPopulated}
                              disabled
                              className="bg-white/70 border-gray-200 text-sm flex-1"
                            />
                          </div>
                        </div>
                        <div>
                          <Label className="font-medium text-gray-600 text-xs mb-1 block">
                            Claim Received
                          </Label>
                          <div className="flex items-center space-x-1">
                            <Input
                              readOnly
                              value={row.actualConfirmation}
                              disabled
                              className="bg-white/70 border-gray-200 text-sm flex-1"
                            />
                          </div>
                        </div>
                        <div>
                          <Label className="font-medium text-gray-600 text-xs mb-1 block">
                            Claim Approved
                          </Label>
                          <div className="flex items-center space-x-1">
                            <Input
                              readOnly
                              value={row.discrepancy}
                              disabled
                              className="bg-white/70 border-gray-200 text-sm flex-1"
                            />
                            {shouldShowInfoIcon(
                              row.label,
                              "Claim Approved"
                            ) && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="flex-shrink-0 w-8 h-8"
                                onClick={() =>
                                  handleInfoClick(
                                    index,
                                    "discrepancy",
                                    row.label,
                                    "Claim Approved"
                                  )
                                }
                              >
                                <List className="w-4 h-4 text-blue-500" />
                              </Button>
                            )}
                          </div>
                        </div>
                        <div>
                          <Label className="font-medium text-gray-600 text-xs mb-1 block">
                            Claim Pending
                          </Label>
                          <div className="flex items-center space-x-1">
                            <Input
                              readOnly
                              value={row.remarks}
                              disabled
                              className="bg-white/70 border-gray-200 text-sm flex-1"
                            />
                            {shouldShowInfoIcon(row.label, "Claim Pending") && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="flex-shrink-0 w-8 h-8"
                                onClick={() =>
                                  handleInfoClick(
                                    index,
                                    "remarks",
                                    row.label,
                                    "Claim Pending"
                                  )
                                }
                              >
                                <List className="w-4 h-4 text-blue-500" />
                              </Button>
                            )}
                          </div>
                        </div>
                        <div>
                          <Label className="font-medium text-gray-600 text-xs mb-1 block">
                            Claim Rejected
                          </Label>
                          <div className="flex items-center space-x-1">
                            <Input
                              readOnly
                              value={row.field5}
                              disabled
                              className="bg-white/70 border-gray-200 text-sm flex-1"
                            />
                            {shouldShowInfoIcon(
                              row.label,
                              "Claim Rejected"
                            ) && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="flex-shrink-0 w-8 h-8"
                                onClick={() =>
                                  handleInfoClick(
                                    index,
                                    "field5",
                                    row.label,
                                    "Claim Rejected"
                                  )
                                }
                              >
                                <List className="w-4 h-4 text-blue-500" />
                              </Button>
                            )}
                          </div>
                        </div>
                        <div>
                          <Label className="font-medium text-gray-600 text-xs mb-1 block">
                            Remarks
                          </Label>
                          <div className="flex items-center space-x-1">
                            <Input
                              readOnly
                              value={row.field6}
                              disabled
                              className="bg-white/70 border-gray-200 text-sm flex-1"
                            />
                            {row.hasAttachment && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onFileUpload(1, index)}
                                className="flex items-center justify-center hover:bg-blue-50 hover:border-blue-300 flex-shrink-0 w-8 h-8"
                              >
                                <Paperclip className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      <FieldInfoModal
        open={modalState.open}
        onOpenChange={(open) => setModalState((s) => ({ ...s, open }))}
        content={modalState.content}
        title={modalState.title}
      />
      <Dialog open={attachmentModal.open} onOpenChange={handleCloseDialog}>
        <DialogContent className="max-w-lg w-full">
          <DialogHeader>
            <DialogTitle>{attachmentModal.title}</DialogTitle>
            <DialogDescription>
              {attachmentModal.docs.length === 0
                ? "No attachments found."
                : "Below are the documents attached for this section."}
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-72">
            {attachmentModal.docs.length > 0 ? (
              <div className="space-y-4">
                {attachmentModal.docs.map((doc) => (
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
