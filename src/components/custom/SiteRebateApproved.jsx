import React from "react";
import DataTable from "./CustomDataTable";

const SiteRebateApproved = () => {
  const siteRebateTableColumns = [
    { key: "ClaimNo", label: "Claim No" },
    { key: "ClaimCategory", label: "Claim Category" },
    { key: "FinancialYear", label: "Financial Year" },
    { key: "Month", label: "Month" },
    { key: "ClaimDate", label: "Claim Date" },
    { key: "ClaimValue", label: "Claim Value" },
    { key: "ClaimStatus", label: "Claim Status" },
    { key: "CustomerCode", label: "Customer Code" },
    { key: "CNNumber", label: "CN Number" },
    { key: "CNDate", label: "CN Date" },
    { key: "SalesGroup", label: "Sales Group" },
    { key: "PendingAt", label: "Pending At" },
  ];
  const siteRebateTableData = [
    {
      ClaimNo: "CLM001",
      ClaimCategory: "Site Rebate",
      FinancialYear: "2024-25",
      Month: "April",
      ClaimDate: "2024-04-15",
      ClaimValue: "₹10,000.00",
      ClaimStatus: "Approved",
      CustomerCode: "CUST01",
      CNNumber: "CN1001",
      CNDate: "2024-04-20",
      SalesGroup: "SG1",
      PendingAt: "-",
    },
    {
      ClaimNo: "CLM002",
      ClaimCategory: "Modern Trade",
      FinancialYear: "2024-25",
      Month: "May",
      ClaimDate: "2024-05-10",
      ClaimValue: "₹7,500.00",
      ClaimStatus: "Approved",
      CustomerCode: "CUST02",
      CNNumber: "CN1002",
      CNDate: "2024-05-15",
      SalesGroup: "SG2",
      PendingAt: "-",
    },
    {
      ClaimNo: "CLM003",
      ClaimCategory: "Joinery",
      FinancialYear: "2024-25",
      Month: "June",
      ClaimDate: "2024-06-05",
      ClaimValue: "₹12,000.00",
      ClaimStatus: "Approved",
      CustomerCode: "CUST03",
      CNNumber: "CN1003",
      CNDate: "2024-06-10",
      SalesGroup: "SG3",
      PendingAt: "-",
    },
  ];
  return (
    <DataTable
      columns={siteRebateTableColumns}
      data={siteRebateTableData}
      title="Site Rebate Claims - Approved"
      description="Scroll horizontally and vertically to view all columns and rows"
    />
  );
};

export default SiteRebateApproved;
