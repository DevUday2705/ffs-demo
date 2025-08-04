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

const secondarySchemesTableColumns = [
  { key: "CustomerCode", label: "Customer Code" },
  { key: "SalesGroupCode", label: "Sales Group Code" },
  { key: "SchemePeriodFrom", label: "Scheme Period From" },
  { key: "SchemePeriodTo", label: "Scheme Period To" },
  { key: "SchemeCode", label: "Scheme Code" },
  { key: "SchemeDescription", label: "Scheme Description" },
  { key: "TokenNo", label: "Token No" },
  { key: "OutputValue", label: "Output Value" },
  { key: "CreditNoteNumber", label: "Credit Note Number" },
  { key: "DealerCode", label: "Dealer Code" },
  { key: "DealerName", label: "Dealer Name" },
  { key: "AmountSettled", label: "Amount Settled" },
  { key: "ReferenceNumber", label: "Reference Number" },
  { key: "CreditNoteDate", label: "Credit Note Date" },
];

const secondarySchemesTableData = [
  {
    CustomerCode: "CUST01",
    SalesGroupCode: "SG01",
    SchemePeriodFrom: "2024-04-01",
    SchemePeriodTo: "2024-06-30",
    SchemeCode: "SCHM1001",
    SchemeDescription: "Summer Bonanza",
    TokenNo: "TKN001",
    OutputValue: "₹5,000.00",
    CreditNoteNumber: "CN1001",
    DealerCode: "DLR01",
    DealerName: "ABC Traders",
    AmountSettled: "₹4,800.00",
    ReferenceNumber: "REF001",
    CreditNoteDate: "2024-07-05",
  },
  {
    CustomerCode: "CUST02",
    SalesGroupCode: "SG02",
    SchemePeriodFrom: "2024-05-01",
    SchemePeriodTo: "2024-07-31",
    SchemeCode: "SCHM1002",
    SchemeDescription: "Monsoon Offer",
    TokenNo: "TKN002",
    OutputValue: "₹7,500.00",
    CreditNoteNumber: "CN1002",
    DealerCode: "DLR02",
    DealerName: "XYZ Distributors",
    AmountSettled: "₹7,200.00",
    ReferenceNumber: "REF002",
    CreditNoteDate: "2024-08-10",
  },
  {
    CustomerCode: "CUST03",
    SalesGroupCode: "SG03",
    SchemePeriodFrom: "2024-06-01",
    SchemePeriodTo: "2024-08-31",
    SchemeCode: "SCHM1003",
    SchemeDescription: "Festive Rewards",
    TokenNo: "TKN003",
    OutputValue: "₹10,000.00",
    CreditNoteNumber: "CN1003",
    DealerCode: "DLR03",
    DealerName: "PQR Agencies",
    AmountSettled: "₹9,800.00",
    ReferenceNumber: "REF003",
    CreditNoteDate: "2024-09-15",
  },
];

const pointsBasedTableColumns = [
  { key: "CustomerCode", label: "Customer Code" },
  { key: "DivisionCode", label: "Division Code" },
  { key: "SalesGroupCode", label: "Sales Group Code" },
  { key: "DateOfRedemption", label: "Date of Redemption" },
  { key: "TokenNo", label: "Token No" },
  { key: "TokenValue", label: "Token Value" },
  { key: "CreditNoteDate", label: "Credit Note Date" },
  { key: "CreditNoteNumber", label: "Credit Note Number" },
  { key: "DealerCode", label: "Dealer Code" },
  { key: "DealerName", label: "Dealer Name" },
  { key: "PointsRedeemed", label: "Points Redeemed during the period" },
  { key: "AdjustAmount", label: "Adjust Amount" },
  { key: "ReferenceNumber", label: "Reference Number" },
];

const pointsBasedTableData = [
  {
    CustomerCode: "CUST11",
    DivisionCode: "DIV01",
    SalesGroupCode: "SG01",
    DateOfRedemption: "2024-05-10",
    TokenNo: "PTKN001",
    TokenValue: "₹1,000.00",
    CreditNoteDate: "2024-05-15",
    CreditNoteNumber: "PCN1001",
    DealerCode: "PDLR01",
    DealerName: "Alpha Dealers",
    PointsRedeemed: "100",
    AdjustAmount: "₹950.00",
    ReferenceNumber: "PREF001",
  },
  {
    CustomerCode: "CUST12",
    DivisionCode: "DIV02",
    SalesGroupCode: "SG02",
    DateOfRedemption: "2024-06-12",
    TokenNo: "PTKN002",
    TokenValue: "₹2,500.00",
    CreditNoteDate: "2024-06-18",
    CreditNoteNumber: "PCN1002",
    DealerCode: "PDLR02",
    DealerName: "Beta Distributors",
    PointsRedeemed: "250",
    AdjustAmount: "₹2,400.00",
    ReferenceNumber: "PREF002",
  },
  {
    CustomerCode: "CUST13",
    DivisionCode: "DIV03",
    SalesGroupCode: "SG03",
    DateOfRedemption: "2024-07-20",
    TokenNo: "PTKN003",
    TokenValue: "₹3,000.00",
    CreditNoteDate: "2024-07-25",
    CreditNoteNumber: "PCN1003",
    DealerCode: "PDLR03",
    DealerName: "Gamma Agencies",
    PointsRedeemed: "300",
    AdjustAmount: "₹2,950.00",
    ReferenceNumber: "PREF003",
  },
];

const inBillBasedTableColumns = [
  { key: "CustomerCode", label: "Customer Code" },
  { key: "SalesGroup", label: "Sales Group" },
  { key: "StartDate", label: "Start Date" },
  { key: "EndDate", label: "End Date" },
  { key: "PilWinSchemeCode", label: "Pil win scheme code" },
  { key: "SchemeCode", label: "Scheme code" },
  { key: "SchemeName", label: "Scheme Name" },
  { key: "SapCNNo", label: "Sap CN no" },
  { key: "SapCNAmount", label: "SAP CN Amount" },
  { key: "SapCNDate", label: "SAP CN Date" },
  { key: "DealerCode", label: "Dealer Code" },
  { key: "DealerName", label: "Dealer Name" },
  { key: "DiscountPassedInDarpan", label: "Discount passed in Darpan" },
  { key: "TextFileRefNo", label: "Text file ref no" },
  { key: "DarpanInvoiceNumbers", label: "Darpan invoice numbers" },
  { key: "TransactionDate", label: "Transaction Date" },
];

const inBillBasedTableData = [
  {
    CustomerCode: "CUST21",
    SalesGroup: "SG01",
    StartDate: "2024-04-01",
    EndDate: "2024-06-30",
    PilWinSchemeCode: "PILWIN001",
    SchemeCode: "SCHM2001",
    SchemeName: "Inbill Summer",
    SapCNNo: "SAPCN001",
    SapCNAmount: "₹5,000.00",
    SapCNDate: "2024-07-05",
    DealerCode: "DLR11",
    DealerName: "Sunrise Traders",
    DiscountPassedInDarpan: "₹500.00",
    TextFileRefNo: "TXT001",
    DarpanInvoiceNumbers: "INV001, INV002",
    TransactionDate: "2024-07-06",
  },
  {
    CustomerCode: "CUST22",
    SalesGroup: "SG02",
    StartDate: "2024-05-01",
    EndDate: "2024-07-31",
    PilWinSchemeCode: "PILWIN002",
    SchemeCode: "SCHM2002",
    SchemeName: "Inbill Monsoon",
    SapCNNo: "SAPCN002",
    SapCNAmount: "₹7,200.00",
    SapCNDate: "2024-08-10",
    DealerCode: "DLR12",
    DealerName: "Rainy Distributors",
    DiscountPassedInDarpan: "₹800.00",
    TextFileRefNo: "TXT002",
    DarpanInvoiceNumbers: "INV003, INV004",
    TransactionDate: "2024-08-12",
  },
  {
    CustomerCode: "CUST23",
    SalesGroup: "SG03",
    StartDate: "2024-06-01",
    EndDate: "2024-08-31",
    PilWinSchemeCode: "PILWIN003",
    SchemeCode: "SCHM2003",
    SchemeName: "Inbill Festive",
    SapCNNo: "SAPCN003",
    SapCNAmount: "₹9,800.00",
    SapCNDate: "2024-09-15",
    DealerCode: "DLR13",
    DealerName: "Festival Agencies",
    DiscountPassedInDarpan: "₹1,000.00",
    TextFileRefNo: "TXT003",
    DarpanInvoiceNumbers: "INV005, INV006",
    TransactionDate: "2024-09-17",
  },
];

const giftBasedTableColumns = [
  { key: "CustomerCode", label: "Customer Code" },
  { key: "GiftName", label: "Gift Name" },
  { key: "GiftValue", label: "Gift Value" },
  { key: "HOFinanceStatus", label: "HO Finance Status" },
  { key: "GiftDispatchDate", label: "Gift Dispatch Date" },
];

const giftBasedTableData = [
  {
    CustomerCode: "CUST31",
    GiftName: "Bluetooth Speaker",
    GiftValue: "₹2,000.00",
    HOFinanceStatus: "Approved",
    GiftDispatchDate: "2024-07-10",
  },
  {
    CustomerCode: "CUST32",
    GiftName: "Smart Watch",
    GiftValue: "₹3,500.00",
    HOFinanceStatus: "Pending",
    GiftDispatchDate: "2024-08-01",
  },
  {
    CustomerCode: "CUST33",
    GiftName: "Travel Bag",
    GiftValue: "₹1,200.00",
    HOFinanceStatus: "Rejected",
    GiftDispatchDate: "2024-08-15",
  },
];

const SecondarySchemesRejected = () => {
  return (
    <DataTable
      title="Secondary Schemes Pending"
      description="Scroll horizontally and vertically to view all columns and rows"
      isTabs={true}
      tabs={[
        {
          tabName: "Value Based",
          columns: secondarySchemesTableColumns,
          data: secondarySchemesTableData,
          icon: "users",
        },
        {
          tabName: "Points Based",
          columns: pointsBasedTableColumns,
          data: pointsBasedTableData,
          icon: "list",
        },
        {
          tabName: "In Bill Based",
          columns: inBillBasedTableColumns,
          data: inBillBasedTableData,
          icon: "chart",
        },
        {
          tabName: "Gift Based",
          columns: giftBasedTableColumns,
          icon: "gift",
          data: giftBasedTableData,
        },
      ]}
    />
  );
};

export default SecondarySchemesRejected;
