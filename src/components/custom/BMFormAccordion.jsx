"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Paperclip, AlignLeft } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import FieldInfoModal from "./FieldInfoModal";
import {
  mapStockReceivableApiToUi,
  bmFormInfoFieldsMap,
} from "./fieldInfoMappings";

export const BMForm1Accordion = ({
  sectionRef,
  sectionId,
  isViewed,
  onFileUpload,
  apiData, // New prop for API data
}) => {
  const [rows, setRows] = useState([]);
  const [modalState, setModalState] = useState({
    open: false,
    content: "",
    title: "Field Information",
  });

  // Map API data to UI structure when apiData changes
  useEffect(() => {
    if (apiData && apiData.Stock_Receivables) {
      const mappedRows = mapStockReceivableApiToUi(
        apiData.Stock_Receivables,
        bmFormInfoFieldsMap
      );
      setRows(mappedRows);
    } else {
      // Fallback to mock data if no API data
      setRows([
        {
          id: "1",
          label: "Amount Receivable/payable from WSS(SAP Balance of the WSS)",
          autoPopulated: "91.49.598.81",
          actualConfirmation: "0",
          discrepancy: "9149598.81",
          remarks: "NA",
          hasAttachment: true,
          infoFields: bmFormInfoFieldsMap[0] || {},
        },
        {
          id: "2",
          label: "Security Deposit (SAP Balance of the WSS)",
          autoPopulated: "10.43.47281",
          actualConfirmation: "0",
          discrepancy: "1043472.81",
          remarks: "NA",
          hasAttachment: false,
          infoFields: bmFormInfoFieldsMap[1] || {},
        },
        {
          id: "3",
          label:
            "Details of live stock with WSS (Duly verified by distributor and already debited to WSS)",
          autoPopulated: "90.00",
          actualConfirmation: "0",
          discrepancy: "0",
          remarks: "NA",
          hasAttachment: true,
          infoFields: {},
        },
        {
          id: "4",
          label:
            "Details to be given to BM to confirm that shortfall is due to Net Offs (NFs) i.e. Details of FCCR / VMI ledger not uploaded to SAP and lying in books of WSS",
          autoPopulated: "0",
          actualConfirmation: "0",
          discrepancy: "0",
          remarks: "NA",
          hasAttachment: false,
          infoFields: {},
        },
      ]);
    }
  }, [apiData]);

  const handleInfoClick = (field, content, rowLabel) => {
    setModalState({
      open: true,
      content,
      title: `${field} - ${rowLabel}`,
    });
  };

  const data = {
    title: "BM Form 1",
    rows: rows,
  };

  return (
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
            <AccordionContent className=" pb-6">
              {/* Desktop View */}
              <div className="hidden md:block overflow-x-auto">
                <div className="min-w-[1200px]">
                  {/* Headers */}
                  <div className="grid grid-cols-6 gap-4 px-4 py-3 bg-gradient-to-r from-gray-100 to-gray-50 rounded-lg border border-gray-200 mb-4">
                    <div className="col-span-2">
                      <Label className="font-semibold text-gray-800 text-sm">
                        Stock And Receivable As Company Records
                      </Label>
                    </div>
                    <div>
                      <Label className="font-semibold text-gray-800 text-sm">
                        Auto Populated Value(₹)
                      </Label>
                    </div>
                    <div>
                      <Label className="font-semibold text-gray-800 text-sm">
                        Actual Confirmation
                      </Label>
                    </div>
                    <div>
                      <Label className="font-semibold text-gray-800 text-sm">
                        Discrepancy/Difference(₹)
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
                      key={row.id || index}
                      className="grid grid-cols-6 gap-4 p-4 bg-white/80 rounded-lg border border-gray-100 hover:bg-white/90 transition-colors mb-2"
                    >
                      <div className="col-span-2 flex items-center">
                        <Label className="font-medium text-gray-700 text-sm leading-tight">
                          {row.label}
                        </Label>
                      </div>
                      <div className="flex items-center">
                        <Input
                          readOnly
                          value={row.autoPopulated}
                          disabled
                          className="bg-white/70 border-gray-200 text-sm"
                        />
                        {row.infoFields?.autoPopulated && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="ml-1 w-8 h-8"
                            onClick={() =>
                              handleInfoClick(
                                "Auto Populated Value",
                                row.infoFields.autoPopulated,
                                row.label
                              )
                            }
                          >
                            <AlignLeft className="w-4 h-4 text-blue-500" />
                          </Button>
                        )}
                      </div>
                      <div className="flex items-center">
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
                            className="ml-1 w-8 h-8"
                            onClick={() =>
                              handleInfoClick(
                                "Actual Confirmation",
                                row.infoFields.actualConfirmation,
                                row.label
                              )
                            }
                          >
                            <AlignLeft className="w-4 h-4 text-blue-500" />
                          </Button>
                        )}
                      </div>
                      <div className="flex items-center">
                        <Input
                          readOnly
                          value={row.discrepancy}
                          disabled
                          className="bg-white/70 border-gray-200 text-sm"
                        />
                        {row.infoFields?.discrepancy && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="ml-1 w-8 h-8"
                            onClick={() =>
                              handleInfoClick(
                                "Discrepancy/Difference",
                                row.infoFields.discrepancy,
                                row.label
                              )
                            }
                          >
                            <AlignLeft className="w-4 h-4 text-blue-500" />
                          </Button>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Input
                          readOnly
                          value={row.remarks}
                          disabled
                          className="bg-white/70 border-gray-200 text-sm flex-1"
                        />
                        {row.infoFields?.remarks && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="w-8 h-8"
                            onClick={() =>
                              handleInfoClick(
                                "Remarks",
                                row.infoFields.remarks,
                                row.label
                              )
                            }
                          >
                            <AlignLeft className="w-4 h-4 text-blue-500" />
                          </Button>
                        )}
                        {row.hasAttachment && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onFileUpload(0, index)}
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
                    key={row.id || index}
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
                        <div className="flex items-center">
                          <Input
                            readOnly
                            value={row.autoPopulated}
                            disabled
                            className="bg-white/70 border-gray-200 text-sm flex-1"
                          />
                          {row.infoFields?.autoPopulated && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="ml-1 w-8 h-8"
                              onClick={() =>
                                handleInfoClick(
                                  "Auto Populated Value",
                                  row.infoFields.autoPopulated,
                                  row.label
                                )
                              }
                            >
                              <AlignLeft className="w-4 h-4 text-blue-500" />
                            </Button>
                          )}
                        </div>
                      </div>
                      <div>
                        <Label className="font-medium text-gray-600 text-xs mb-1 block">
                          Actual Confirmation
                        </Label>
                        <div className="flex items-center">
                          <Input
                            readOnly
                            value={row.actualConfirmation}
                            disabled
                            className="bg-white/70 border-gray-200 text-sm flex-1"
                          />
                          {row.infoFields?.actualConfirmation && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="ml-1 w-8 h-8"
                              onClick={() =>
                                handleInfoClick(
                                  "Actual Confirmation",
                                  row.infoFields.actualConfirmation,
                                  row.label
                                )
                              }
                            >
                              <AlignLeft className="w-4 h-4 text-blue-500" />
                            </Button>
                          )}
                        </div>
                      </div>
                      <div>
                        <Label className="font-medium text-gray-600 text-xs mb-1 block">
                          Discrepancy/Difference(₹)
                        </Label>
                        <div className="flex items-center">
                          <Input
                            readOnly
                            value={row.discrepancy}
                            disabled
                            className="bg-white/70 border-gray-200 text-sm flex-1"
                          />
                          {row.infoFields?.discrepancy && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="ml-1 w-8 h-8"
                              onClick={() =>
                                handleInfoClick(
                                  "Discrepancy/Difference",
                                  row.infoFields.discrepancy,
                                  row.label
                                )
                              }
                            >
                              <AlignLeft className="w-4 h-4 text-blue-500" />
                            </Button>
                          )}
                        </div>
                      </div>
                      <div>
                        <Label className="font-medium text-gray-600 text-xs mb-1 block">
                          Remarks
                        </Label>
                        <div className="flex items-center space-x-2">
                          <Input
                            readOnly
                            value={row.remarks}
                            disabled
                            className="bg-white/70 border-gray-200 text-sm flex-1"
                          />
                          {row.infoFields?.remarks && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="w-8 h-8"
                              onClick={() =>
                                handleInfoClick(
                                  "Remarks",
                                  row.infoFields.remarks,
                                  row.label
                                )
                              }
                            >
                              <AlignLeft className="w-4 h-4 text-blue-500" />
                            </Button>
                          )}
                          {row.hasAttachment && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onFileUpload(0, index)}
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

      {/* Info Modal */}
      <FieldInfoModal
        open={modalState.open}
        onOpenChange={(open) => setModalState((s) => ({ ...s, open }))}
        content={modalState.content}
        title={modalState.title}
      />
    </Card>
  );
};
