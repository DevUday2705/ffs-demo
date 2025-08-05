import { BMForm1Accordion } from "./BMFormAccordion";
import { PILLiabilityAccordion } from "./PILLiabilityAccordion";
import { StockReceivableAccordion } from "./StockReceivableAccordion";

export default function IndividualAccordions({
  viewedSections,
  sectionRefs,
  dashboardData,
  docsData,
}) {
  const handleFileUpload = (accordionIndex, rowIndex) => {
    console.log(`Upload file for accordion ${accordionIndex}, row ${rowIndex}`);
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 to-blue-50 ">
      <div style={{ maxWidth: "96rem" }} className="mx-auto space-y-8">
        {/* BM Form 1 - 5 columns */}
        <BMForm1Accordion
          sectionId="bm-form-1"
          sectionRef={(el) => (sectionRefs.current["bm-form-1"] = el)}
          isViewed={viewedSections.has("bm-form-1")}
          onFileUpload={handleFileUpload}
          apiData={dashboardData?.data?.Stock_Receivables || []}
        />

        {/* Stock And Receivable - 7 columns */}
        <StockReceivableAccordion
          sectionId="stock-and-receivable"
          sectionRef={(el) =>
            (sectionRefs.current["stock-and-receivable"] = el)
          }
          isViewed={viewedSections.has("stock-and-receivable")}
          onFileUpload={handleFileUpload}
          docsData={docsData}
        />

        {/* PIL Liability - 4 columns */}
        <PILLiabilityAccordion
          docsData={docsData}
          sectionId="pil-liability"
          sectionRef={(el) => (sectionRefs.current["pil-liability"] = el)}
          isViewed={viewedSections.has("pil-liability")}
          onFileUpload={handleFileUpload}
          apiData={dashboardData?.data?.PendingPILLiability || []}
        />
      </div>
    </div>
  );
}
