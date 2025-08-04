"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import DataTable from "./CustomDataTable";

const barcodeTokenTableColumns = [
  { key: "LogID", label: "Log ID" },
  { key: "Posting Date", label: "Posting Date" },
  { key: "Company Code", label: "Company Code" },
  { key: "Reference", label: "Reference" },
  { key: "Document Header Text", label: "Document Header" },
  { key: "Customer Code", label: "Customer Code" },
  { key: "Amount", label: "Amount" },
  { key: "Assignment", label: "Assignment" },
  { key: "Text", label: "Text" },
  { key: "Executed Date", label: "Executed Date" },
  { key: "Status", label: "Status" },
  { key: "SAP CN No", label: "SAP CN No" },
  { key: "SAP CN Date", label: "SAP CN Date" },
  { key: "SAP CN Amount", label: "SAP CN Amount" },
  { key: "SAP CN Status", label: "SAP CN Status" },
  { key: "SAP CN Result", label: "SAP CN Result" },
  { key: "Is Sent", label: "Is Sent" },
  { key: "Is Sent Date", label: "Is Sent Date" },
  { key: "Is Received", label: "Is Received" },
  { key: "Is Received Date", label: "Is Received Date" },
  { key: "Status Intg", label: "Status Intg" },
  { key: "Remark", label: "Remark" },
  { key: "Original Date", label: "Original Date" },
  { key: "Validation Tran ID", label: "Validation Tran ID" },
  { key: "Barcode", label: "Barcode" },
  { key: "Remarks", label: "Remarks" },
  { key: "Transaction ID Mobile", label: "Transaction ID Mobile" },
  { key: "Sales Group", label: "Sales Group" },
];

const barcodeTokenTableData = [
  {
    LogID: "1002",
    "Posting Date": "2024-08-02",
    "Company Code": "C002",
    Reference: "REF124",
    "Document Header Text": "Another Document Header",
    "Customer Code": "CUST02",
    Amount: "₹2,500.00",
    Assignment: "A2",
    Text: "Sample Text 2",
    "Executed Date": "2024-08-03",
    Status: "Pending",
    "SAP CN No": "CN002",
    "SAP CN Date": "2024-08-04",
    "SAP CN Amount": "₹2,400.00",
    "SAP CN Status": "Draft",
    "SAP CN Result": "Pending",
    "Is Sent": "No",
    "Is Sent Date": "-",
    "Is Received": "No",
    "Is Received Date": "-",
    "Status Intg": "PENDING",
    Remark: "Awaiting approval",
    "Original Date": "2024-08-02",
    "Validation Tran ID": "VTID002",
    Barcode: "BC987654321",
    Remarks: "Under review",
    "Transaction ID Mobile": "TIDM002",
    "Sales Group": "SG2",
  },
  // Add more sample data to demonstrate scrolling
  {
    LogID: "1003",
    "Posting Date": "2024-08-03",
    "Company Code": "C003",
    Reference: "REF125",
    "Document Header Text": "Third Document Header",
    "Customer Code": "CUST03",
    Amount: "₹3,750.00",
    Assignment: "A3",
    Text: "Sample Text 3",
    "Executed Date": "2024-08-04",
    Status: "Completed",
    "SAP CN No": "CN003",
    "SAP CN Date": "2024-08-05",
    "SAP CN Amount": "₹3,700.00",
    "SAP CN Status": "Posted",
    "SAP CN Result": "Success",
    "Is Sent": "Yes",
    "Is Sent Date": "2024-08-05",
    "Is Received": "Yes",
    "Is Received Date": "2024-08-05",
    "Status Intg": "OK",
    Remark: "Successfully processed",
    "Original Date": "2024-08-03",
    "Validation Tran ID": "VTID003",
    Barcode: "BC123789456",
    Remarks: "Completed successfully",
    "Transaction ID Mobile": "TIDM003",
    "Sales Group": "SG3",
  },
];

const getStatusBadge = (status) => {
  const variants = {
    Completed: "default",
    Pending: "secondary",
    Failed: "destructive",
    Posted: "default",
    Draft: "outline",
    Rejected: "destructive",
    Success: "default",
    Error: "destructive",
    OK: "default",
    PENDING: "secondary",
    ERROR: "destructive",
  };

  return (
    <Badge variant={variants[status] || "outline"} className="text-xs">
      {status}
    </Badge>
  );
};

const BarcodeTokenApproved = () => {
  return (
    <DataTable
      columns={barcodeTokenTableColumns}
      data={barcodeTokenTableData}
      title="Barcode Token Claims - Approved"
      description="Scroll horizontally and vertically to view all columns and rows"
    />
  );
};

export default BarcodeTokenApproved;
