"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { useState } from "react";
import FieldInfoModal from "./CustomModal";
export const StockReceivableAccordion = ({
  sectionRef,
  sectionId,
  isViewed,
  onFileUpload,
}) => {
  const [modalState, setModalState] = useState({
    open: false,
    row: null,
    field: null,
    content: "",
  });
  const handleInfoClick = (row, col) => {
    // You can customize this logic to fetch/generate info based on row/col
    setModalState({
      open: true,
      row,
      col,
      content: row.info || "No additional info available.",
    });
  };
  const data = {
    title: "Stock And Receivable",
    rows: [
      {
        label: "Claims for Stock loss amounts (as per defined policy)",
        autoPopulated: "NA",
        actualConfirmation: "0",
        discrepancy: "NA",
        remarks: "NA",
        field5: "NA",
        field6: "NA",
        hasAttachment: true,
        infoFields: {
          actualConfirmation:
            "This is the actual confirmation info for this row.",
          discrepancy: "This is the discrepancy info for this row.",
        },
      },
      {
        label: "Claims for WSS Incentive",
        autoPopulated: "NA",
        actualConfirmation: "0",
        discrepancy: "NA",
        remarks: "NA",
        field5: "NA",
        field6: "NA",
        hasAttachment: true,
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
        hasAttachment: true,
      },
      {
        label: "Barcode Token claims",
        autoPopulated: "NA",
        actualConfirmation: "20",
        discrepancy: "20",
        remarks: "0",
        field5: "0",
        field6: "NA",
        hasAttachment: false,
      },
      {
        label: "Barcode token handling charges",
        autoPopulated: "NA",
        actualConfirmation: "NA",
        discrepancy: "NA",
        remarks: "NA",
        field5: "NA",
        field6: "NA",
        hasAttachment: false,
      },
      {
        label: "Primary schemes/TD/CD",
        autoPopulated: "NA",
        actualConfirmation: "0",
        discrepancy: "NA",
        remarks: "NA",
        field5: "NA",
        field6: "NA",
        hasAttachment: false,
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
        hasAttachment: false,
      },
      {
        label: "Total Claim Values",
        autoPopulated: "NA",
        actualConfirmation: "578444366.850000",
        discrepancy: "562159560.780000",
        remarks: "16284806.07",
        field5: "0",
        field6: "NA",
        hasAttachment: false,
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
              <AccordionTrigger className=" py-4 hover:no-underline">
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
                        <div>
                          <Input
                            readOnly
                            value={row.autoPopulated}
                            disabled
                            className="bg-white/70 border-gray-200 text-sm"
                          />
                        </div>
                        <div>
                          <Input
                            readOnly
                            value={row.actualConfirmation}
                            disabled
                            className="bg-white/70 border-gray-200 text-sm"
                          />
                          {row.infoFields?.actualConfirmation && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="ml-1"
                              onClick={() =>
                                setModalState({
                                  open: true,
                                  row: index,
                                  field: "actualConfirmation",
                                  content: row.infoFields.actualConfirmation,
                                })
                              }
                            >
                              <AlignLeft className="w-4 h-4 text-blue-500" />
                            </Button>
                          )}
                        </div>
                        <div>
                          <Input
                            readOnly
                            value={row.discrepancy}
                            disabled
                            className="bg-white/70 border-gray-200 text-sm"
                          />
                        </div>
                        <div>
                          <Input
                            readOnly
                            value={row.remarks}
                            disabled
                            className="bg-white/70 border-gray-200 text-sm"
                          />
                        </div>
                        <div>
                          <Input
                            readOnly
                            value={row.field5}
                            disabled
                            className="bg-white/70 border-gray-200 text-sm"
                          />
                        </div>
                        <div className="flex items-center space-x-2">
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
                              className="flex items-center justify-center hover:bg-blue-50 hover:border-blue-300 w-10 h-8"
                            >
                              <Paperclip className="w-4 h-4" />
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
                            Auto Populated Value(₹)
                          </Label>
                          <Input
                            readOnly
                            value={row.autoPopulated}
                            disabled
                            className="bg-white/70 border-gray-200 text-sm"
                          />
                        </div>
                        <div>
                          <Label className="font-medium text-gray-600 text-xs mb-1 block">
                            Actual Confirmation
                          </Label>
                          <Input
                            readOnly
                            value={row.actualConfirmation}
                            disabled
                            className="bg-white/70 border-gray-200 text-sm"
                          />
                        </div>
                        <div>
                          <Label className="font-medium text-gray-600 text-xs mb-1 block">
                            Discrepancy/Difference(₹)
                          </Label>
                          <Input
                            readOnly
                            value={row.discrepancy}
                            disabled
                            className="bg-white/70 border-gray-200 text-sm"
                          />
                        </div>
                        <div>
                          <Label className="font-medium text-gray-600 text-xs mb-1 block">
                            Remarks
                          </Label>
                          <Input
                            readOnly
                            value={row.remarks}
                            disabled
                            className="bg-white/70 border-gray-200 text-sm"
                          />
                        </div>
                        <div>
                          <Label className="font-medium text-gray-600 text-xs mb-1 block">
                            Field 5
                          </Label>
                          <Input
                            readOnly
                            value={row.field5}
                            disabled
                            className="bg-white/70 border-gray-200 text-sm"
                          />
                        </div>
                        <div>
                          <Label className="font-medium text-gray-600 text-xs mb-1 block">
                            Field 6
                          </Label>
                          <div className="flex items-center space-x-2">
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
                                className="flex items-center justify-center hover:bg-blue-50 hover:border-blue-300 w-10 h-8"
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
      />
    </>
  );
};
