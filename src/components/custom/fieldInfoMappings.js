// Info field mappings for different accordions
// Map by index or by unique identifier

export const bmFormInfoFieldsMap = {
    0: { // First row - Amount Receivable/payable from WSS
        actualConfirmation: "This field shows the actual confirmed amount by the WSS. Enter the verified amount as per your records.",
        discrepancy: "This shows the difference between auto-populated SAP balance and actual confirmation. Review any discrepancies carefully.",
    },
    1: { // Second row - Security Deposit
        autoPopulated: "This is the SAP balance for security deposit as per system records.",
        discrepancy: "Any difference in security deposit amount needs to be investigated and documented.",
    },
    // Add more mappings as needed
};

export const stockReceivableInfoFieldsMap = {
    0: { // Claims for Stock loss amounts
        actualConfirmation: "Enter the actual stock loss claim amount as per your policy guidelines.",
        discrepancy: "Review any differences in stock loss claims and provide justification.",
    },
    2: { // Site Rebate, Modern trade, etc.
        actualConfirmation: "Total amount for site rebate, modern trade, joinery, sales return, product damage/disposal, rate difference and sample related claims.",
        remarks: "Provide detailed remarks explaining the nature of these claims.",
    },
    // Add more mappings as needed
};

export const pilLiabilityInfoFieldsMap = {
    0: { // First row - Gift Scheme Debit Reversal
        amount: "This represents the amount for gift scheme debit reversals pending acknowledgement submission.",
        remarks: "Additional remarks or notes for this liability item.",
    },
    1: { // Second row - Others
        amount: "Other miscellaneous PIL liability amounts not covered in specific categories.",
    },
    // Add more rows as needed
};

// Utility function to map API data to UI structure
export function mapStockReceivableApiToUi(apiRows, infoFieldsMap = {}) {
    return apiRows.map((row, idx) => ({
        id: row.ID,
        label: row.StockReceivableTxt,
        autoPopulated: row.AutoPopulatedVal || "N/A",
        actualConfirmation: row.ActualVal || "0",
        discrepancy: row.DifferenceVal || "0",
        remarks: row.Remarks || "N/A",
        hasAttachment: true, // You can determine this based on your business logic
        infoFields: infoFieldsMap[idx] || {},
        // Include original API data for reference
        _original: row,
    }));
}

export function mapPILLiabilityApiToUi(apiRows, infoFieldsMap = {}) {
    return apiRows.map((row, idx) => ({
        id: row.ID,
        label: row.PendingPILLiabilityTxt,
        amount: row.TotalClaimAsWSS,
        remarks: row.Remarks,
        hasAttachment: true, // You can make this dynamic based on your business logic
        infoFields: infoFieldsMap[idx] || {},
    }));
}