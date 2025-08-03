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
import { useEffect, useState } from "react";
import FieldInfoModal from "./CustomModal";
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
}) => {
  const [rows, setRows] = useState([]);
  const [modalState, setModalState] = useState({
    open: false,
    content: "",
    title: "Field Information",
  });
  useEffect(() => {
    if (apiData && Array.isArray(apiData)) {
      const mappedRows = mapPILLiabilityApiToUi(
        apiData,
        pilLiabilityInfoFieldsMap
      );
      setRows(mappedRows);
    } else {
      // Fallback to mock data if no API data
      setRows([
        {
          id: "1",
          label: "Gift Scheme Debit Reversal - Acknowledgement Submission",
          amount: "0",
          remarks: "NA",
          hasAttachment: true,
          infoFields: pilLiabilityInfoFieldsMap[0] || {},
        },
        {
          id: "2",
          label: "Others",
          amount: "0",
          remarks: "NA",
          hasAttachment: true,
          infoFields: pilLiabilityInfoFieldsMap[1] || {},
        },
        {
          id: "3",
          label: "Total Fresh Claims - WSS during FFS",
          amount: "0",
          remarks: "58023.84",
          hasAttachment: true,
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
                    {data.rows.map((row, index) => (
                      <div
                        key={row.id || index}
                        className="grid grid-cols-4 gap-4 p-4 bg-white/80 rounded-lg border border-gray-100 hover:bg-white/90 transition-colors mb-2"
                      >
                        <div className="col-span-2 flex items-center">
                          <Label className="font-medium text-gray-700 text-sm leading-tight">
                            {row.label}
                          </Label>
                        </div>

                        {/* Amount field with info icon - Match BM Form exactly */}
                        <div className="flex items-center space-x-1">
                          <Input
                            readOnly
                            value={row.amount}
                            disabled
                            className="bg-white/70 border-gray-200 text-sm flex-1"
                          />
                          {row.infoFields?.amount && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="flex-shrink-0 w-8 h-8"
                              onClick={() =>
                                handleInfoClick(
                                  "Amount",
                                  row.infoFields.amount,
                                  row.label
                                )
                              }
                            >
                              <AlignLeft className="w-4 h-4 text-blue-500" />
                            </Button>
                          )}
                        </div>

                        {/* Remarks field with info icon and attachment - Match BM Form exactly */}
                        <div className="flex items-center space-x-1">
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
                              className="flex-shrink-0 w-8 h-8"
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
                              onClick={() => onFileUpload(2, index)}
                              className="flex items-center justify-center hover:bg-blue-50 hover:border-blue-300 flex-shrink-0 w-8 h-8"
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
                            Amount(₹)
                          </Label>
                          <div className="flex items-center space-x-1">
                            <Input
                              readOnly
                              value={row.amount}
                              disabled
                              className="bg-white/70 border-gray-200 text-sm flex-1"
                            />
                            {row.infoFields?.amount && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="flex-shrink-0 w-8 h-8"
                                onClick={() =>
                                  handleInfoClick(
                                    "Amount",
                                    row.infoFields.amount,
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
                          <div className="flex items-center space-x-1">
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
                                className="flex-shrink-0 w-8 h-8"
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
                                onClick={() => onFileUpload(2, index)}
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
    </>
  );
};
