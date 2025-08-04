"use client";

import { useEffect, useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  LogOut,
  User,
  Paperclip,
  Upload,
  Menu,
  X,
  FileText,
  CreditCard,
  Shield,
  CheckCircle2,
  Clock,
  Currency,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import IndividualAccordions from "@/components/custom/IndividualAccordions";
import { useDashboardData } from "@/hooks/useApi";
import { storage } from "@/shared/utils";

// Mock data
const accordionData = [
  {
    title: "BM Form 1",
    columns: [
      "Stock And Receivable As Company Records",
      "Auto Populated Value(₹)",
      "Actual Confirmation",
      "Discrepancy/Difference(₹)",
      "Remarks",
      "Attachments",
    ],
    rows: [
      {
        label: "Amount Receivable/payable from WSS(SAP Balance of the WSS)",
        field1: "91.49.598.81",
        field2: "0",
        field3: "9149598.81",
        field4: "NA",
        hasAttachment: true,
      },
      {
        label: "Security Deposit (SAP Balance of the WSS)",
        field1: "10.43.47281",
        field2: "0",
        field3: "1043472.81",
        field4: "NA",
        hasAttachment: false,
      },
      {
        label:
          "Details of live stock with WSS (Duly verified by distributor and already debited to WSS)",
        field1: "90.00",
        field2: "0",
        field3: "0",
        field4: "NA",
        hasAttachment: true,
      },
      {
        label:
          "Details to be given to BM to confirm that shortfall is due to Net Offs (NFs) i.e. Details of FCCR / VMI ledger not uploaded to SAP and lying in books of WSS",
        field1: "0",
        field2: "0",
        field3: "0",
        field4: "NA",
        hasAttachment: false,
      },
    ],
  },
  {
    title: "Stock And Receivable",
    columns: [
      "Stock And Receivable As Company Records",
      "Auto Populated Value(₹)",
      "Actual Confirmation",
      "Discrepancy/Difference(₹)",
      "Remarks",
      "Field 5",
      "Field 6",
      "Attachments",
    ],
    rows: [
      {
        label: "Claims for Stock loss amounts (as per defined policy)",
        field1: "NA",
        field2: "0",
        field3: "NA",
        field4: "NA",
        field5: "NA",
        field6: "NA",
        hasAttachment: true,
      },
      {
        label: "Claims for WSS Incentive",
        field1: "NA",
        field2: "0",
        field3: "NA",
        field4: "NA",
        field5: "NA",
        field6: "NA",
        hasAttachment: true,
      },
      {
        label:
          "Site Rebate, Modern trade, Joinery, Sales Return, Product Damage/Disposal, Rate difference and Sample related claims",
        field1: "NA",
        field2: "58023.84",
        field3: "55503.84",
        field4: "2520",
        field5: "0",
        field6: "NA",
        hasAttachment: true,
      },
      {
        label: "Barcode Token claims",
        field1: "NA",
        field2: "20",
        field3: "20",
        field4: "0",
        field5: "0",
        field6: "NA",
        hasAttachment: false,
      },
      {
        label: "Barcode token handling charges",
        field1: "NA",
        field2: "NA",
        field3: "NA",
        field4: "NA",
        field5: "NA",
        field6: "NA",
        hasAttachment: false,
      },
      {
        label: "Primary schemes/TD/CD",
        field1: "NA",
        field2: "0",
        field3: "NA",
        field4: "NA",
        field5: "NA",
        field6: "NA",
        hasAttachment: false,
      },
      {
        label:
          "Debit note reversals related to gift related Schemes due to non-submission of Acknowledgements",
        field1: "NA",
        field2: "0",
        field3: "NA",
        field4: "NA",
        field5: "NA",
        field6: "NA",
        hasAttachment: false,
      },
      {
        label: "Total Claim Values",
        field1: "NA",
        field2: "578444366.850000",
        field3: "562159560.780000",
        field4: "16284806.07",
        field5: "0",
        field6: "NA",
        hasAttachment: false,
      },
    ],
  },
  {
    title: "PIL Liability",
    columns: ["PIL Liability Details", "Amount(₹)", "Remarks", "Attachments"],
    rows: [
      {
        label: "Gift Scheme Debit Reversal - Acknowledgement Submission",
        field1: "0",
        field2: "NA",
        hasAttachment: true,
      },
      {
        label: "Others",
        field1: "0",
        field2: "NA",
        hasAttachment: true,
      },
      {
        label: "Total Fresh Claims - WSS during FFS",
        field1: "0",
        field2: "58023.84",
        hasAttachment: true,
      },
    ],
  },
];

const terms = [
  "All information provided is accurate to the best of my knowledge.",
  "I understand the implications of providing false information.",
  "I agree to the terms and conditions outlined in this document.",
  "I acknowledge that this information will be used for verification purposes.",
];

// Function to normalize titles to consistent IDs
const normalizeId = (str) =>
  str
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-]/g, "");

// Generate all section IDs dynamically
const dynamicSectionIds = accordionData.map((item) => normalizeId(item.title));
const staticSectionIds = [
  "wss-bank-details",
  "net-payable",
  "terms-conditions",
];
const allSectionIds = [...dynamicSectionIds, ...staticSectionIds];

// Navigation items that match all sections
const sectionNavItems = [
  { id: "bm-form-1", label: "BM Form 1", icon: FileText },
  { id: "stock-and-receivable", label: "Stock And Receivable", icon: FileText },
  { id: "pil-liability", label: "PIL Liability", icon: FileText },
  { id: "net-payable", label: "Net Payable", icon: Currency },
  { id: "wss-bank-details", label: "WSS Bank Details", icon: CreditCard },
  { id: "terms-conditions", label: "Terms & Conditions", icon: Shield },
];

export default function Dashboard() {
  const [userName] = useState("Bhima White");

  const [mounted, setMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [viewedSections, setViewedSections] = useState(new Set());
  const [allSectionsViewed, setAllSectionsViewed] = useState(false);
  const [reqNo, setReqNo] = useState(null);
  const { data: dashboardData, isLoading, error } = useDashboardData(reqNo);
  const [loading, setLoading] = useState(false);
  const sectionRefs = useRef({});

  useEffect(() => {
    const userData = storage.getUserData();
    if (userData && userData.ReqNo) {
      setReqNo(userData.ReqNo);
    }
  }, []);
  console.log(reqNo);
  const handleSubmit = () => {
    alert("Submit Clicked");
  };

  // Update allSectionsViewed when viewedSections changes
  useEffect(() => {
    setAllSectionsViewed(viewedSections.size === allSectionIds.length);
  }, [viewedSections]);

  // Initialize mounted state
  useEffect(() => {
    setMounted(true);
  }, []);

  // Intersection Observer to track viewed sections
  useEffect(() => {
    if (!mounted) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
            const sectionId = entry.target.id;
            if (sectionId && allSectionIds.includes(sectionId)) {
              setViewedSections((prev) => new Set([...prev, sectionId]));
            }
          }
        });
      },
      {
        threshold: 0.3,
        rootMargin: "-50px 0px -50px 0px",
      }
    );

    // Observe all section elements
    allSectionIds.forEach((sectionId) => {
      const element = sectionRefs.current[sectionId];
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [mounted, dashboardData]);

  const scrollToSection = (sectionId) => {
    const element = sectionRefs.current[sectionId];
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      // Mark section as viewed when manually navigated to
      setViewedSections((prev) => new Set([...prev, sectionId]));
    }
    setSidebarOpen(false);
  };

  const handleLogout = () => {};

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => setError("")}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Mobile Navbar */}
      <nav className="lg:hidden bg-white/90 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="px-4 sm:px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden"
              >
                {sidebarOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </Button>
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-sm">
                <User className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="flex items-center space-x-2"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex">
        {/* Sidebar */}
        <div
          className={`
          fixed lg:static inset-y-0 left-0 z-50 w-80 bg-white/95 backdrop-blur-md border-r border-gray-200 
          transform ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 transition-transform duration-300 ease-in-out
          lg:block overflow-y-auto
        `}
        >
          {/* Desktop Header */}
          <div className="hidden lg:flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-sm text-gray-600">Welcome, {userName}</p>
              </div>
            </div>
          </div>

          {/* Mobile Header */}
          <div className="lg:hidden flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Navigation</h1>
                <p className="text-sm text-gray-600">Form Sections</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Navigation */}
          <div className="p-6">
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">
                Form Sections
              </h3>
              <div className="space-y-2">
                {sectionNavItems.map((item) => {
                  const Icon = item.icon;
                  const isViewed = viewedSections.has(item.id);

                  return (
                    <button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className={`
                        w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200
                        ${
                          isViewed
                            ? "bg-green-50 border-2 border-green-200 text-green-800 shadow-sm"
                            : "bg-amber-50 border-2 border-amber-200 text-amber-800 hover:bg-amber-100"
                        }
                      `}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      <span className="font-medium">{item.label}</span>
                      <div className="ml-auto">
                        {isViewed ? (
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                        ) : (
                          <Clock className="w-4 h-4 text-amber-600" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Progress Section */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
              <h4 className="font-semibold text-gray-900 mb-2">Progress</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Sections Viewed</span>
                  <span className="font-medium text-blue-600">
                    {viewedSections.size}/{allSectionIds.length}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${
                        (viewedSections.size / allSectionIds.length) * 100
                      }%`,
                    }}
                  />
                </div>
                {allSectionsViewed && (
                  <p className="text-sm text-green-600 font-medium flex items-center space-x-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>All sections reviewed!</span>
                  </p>
                )}
              </div>
            </div>

            {/* Desktop Logout */}
            <div className="hidden lg:block mt-6">
              <Button
                variant="outline"
                onClick={handleLogout}
                className="w-full flex items-center justify-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 lg:ml-0 h-screen overflow-y-auto">
          <div
            style={{ maxWidth: "96rem" }}
            className="mx-auto px-4 sm:px-6 lg:px-8 py-8 "
          >
            {/* Welcome Section */}
            <div className="mb-8">
              <Card className="border-0 shadow-lg bg-gradient-to-r from-white to-blue-50">
                <CardContent className="p-8">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center border-2 border-blue-300">
                      <User className="w-8 h-8 text-blue-700" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold mb-2 text-gray-900">
                        BM Form 1
                      </h2>
                      <p className="text-gray-600 text-lg">
                        Manage your information and documents seamlessly
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Form Sections */}
            <div className="space-y-8">
              {/* Dynamic Forms */}

              <IndividualAccordions
                viewedSections={viewedSections}
                setViewedSections={setViewedSections}
                sectionRefs={sectionRefs}
                dashboardData={dashboardData}
              />

              <div
                ref={(el) => (sectionRefs.current["net-payable"] = el)}
                id="net-payable"
                className="scroll-mt-20"
              >
                <Card
                  className={`
                    shadow-lg transition-all duration-300 border-2
                    ${
                      viewedSections.has("net-payable")
                        ? "border-green-200 bg-gradient-to-br from-green-50 to-white"
                        : "border-amber-200 bg-gradient-to-br from-amber-50 to-white"
                    }
                  `}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`
                          w-3 h-3 rounded-full 
                          ${
                            viewedSections.has("wss-bank-details")
                              ? "bg-green-500"
                              : "bg-amber-500"
                          }
                        `}
                      />
                      <CardTitle className="text-lg font-semibold text-gray-900">
                        Net Payable/Receivable Statement
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label
                          htmlFor="bank-name"
                          className="text-sm font-medium text-gray-700"
                        >
                          Amount Receivable / Payable from WSS:
                        </Label>
                        <Input
                          readOnly
                          type="text"
                          id="bank-name"
                          placeholder="9149598.81"
                          className="bg-white/70 border-gray-200"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="account-number"
                          className="text-sm font-medium text-gray-700"
                        >
                          Credit Note for the Stock Handed Over to Company:
                        </Label>
                        <Input
                          readOnly
                          type="text"
                          id="account-number"
                          placeholder="NA"
                          className="bg-white/70 border-gray-200"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label
                          htmlFor="bank-name"
                          className="text-sm font-medium text-gray-700"
                        >
                          Details of Scheme Gifts Lying with WSS:
                        </Label>
                        <Input
                          readOnly
                          type="text"
                          id="bank-name"
                          placeholder="NA"
                          className="bg-white/70 border-gray-200"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="account-number"
                          className="text-sm font-medium text-gray-700"
                        >
                          Pending Settlement - Fresh Claims by WSS (Part B):
                        </Label>
                        <Input
                          readOnly
                          type="text"
                          id="account-number"
                          placeholder="0"
                          className="bg-white/70 border-gray-200"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label
                          htmlFor="bank-name"
                          className="text-sm font-medium text-gray-700"
                        >
                          Security Deposit:
                        </Label>
                        <Input
                          readOnly
                          type="text"
                          id="bank-name"
                          placeholder="0"
                          className="bg-white/70 border-gray-200"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="account-number"
                          className="text-sm font-medium text-gray-700"
                        >
                          Details of FCCR Gifts Lying with WSS - Discrepancy:
                        </Label>
                        <Input
                          readOnly
                          type="text"
                          id="account-number"
                          placeholder="0"
                          className="bg-white/70 border-gray-200"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label
                          htmlFor="bank-name"
                          className="text-sm font-medium text-gray-700"
                        >
                          Pending Claims to be Settled by PIL as per Part A
                          above:
                        </Label>
                        <Input
                          readOnly
                          type="text"
                          id="bank-name"
                          placeholder="1628406.07"
                          className="bg-white/70 border-gray-200"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="account-number"
                          className="text-sm font-medium text-gray-700"
                        >
                          Net Payable/Receivable - Full and Final Settlement:
                        </Label>
                        <Input
                          readOnly
                          type="text"
                          id="account-number"
                          placeholder="-8178680.07"
                          className="bg-white/70 border-gray-200"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* WSS Bank Details */}
              <div
                ref={(el) => (sectionRefs.current["wss-bank-details"] = el)}
                id="wss-bank-details"
                className="scroll-mt-20"
              >
                <Card
                  className={`
                    shadow-lg transition-all duration-300 border-2
                    ${
                      viewedSections.has("wss-bank-details")
                        ? "border-green-200 bg-gradient-to-br from-green-50 to-white"
                        : "border-amber-200 bg-gradient-to-br from-amber-50 to-white"
                    }
                  `}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`
                          w-3 h-3 rounded-full 
                          ${
                            viewedSections.has("wss-bank-details")
                              ? "bg-green-500"
                              : "bg-amber-500"
                          }
                        `}
                      />
                      <CardTitle className="text-lg font-semibold text-gray-900">
                        WSS Bank Details
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <Label
                          htmlFor="bank-name"
                          className="text-sm font-medium text-gray-700"
                        >
                          Bank Name
                        </Label>
                        <Input
                          readOnly
                          type="text"
                          id="bank-name"
                          placeholder="Enter Bank Name"
                          className="bg-white/70 border-gray-200"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="account-number"
                          className="text-sm font-medium text-gray-700"
                        >
                          Account Number
                        </Label>
                        <Input
                          readOnly
                          type="text"
                          id="account-number"
                          placeholder="Enter Account Number"
                          className="bg-white/70 border-gray-200"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="ifsc-code"
                          className="text-sm font-medium text-gray-700"
                        >
                          IFSC Code
                        </Label>
                        <Input
                          readOnly
                          type="text"
                          id="ifsc-code"
                          placeholder="IFSC Code"
                          className="bg-white/70 border-gray-200"
                        />
                      </div>
                    </div>

                    <Label className="flex items-start gap-3 rounded-lg border-2 border-blue-200 p-4 bg-blue-50/50 hover:bg-blue-50 transition-colors cursor-pointer">
                      <Checkbox
                        id="bank-acknowledgment"
                        className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white mt-0.5"
                      />
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-900">
                          I Acknowledge
                        </p>
                        <p className="text-sm text-gray-600">
                          Above bank details are correct to my knowledge
                        </p>
                      </div>
                    </Label>
                  </CardContent>
                </Card>
              </div>

              {/* Terms and Conditions */}
              <div
                ref={(el) => (sectionRefs.current["terms-conditions"] = el)}
                id="terms-conditions"
                className="scroll-mt-20"
              >
                <Card
                  className={`
                    shadow-lg transition-all duration-300 border-2
                    ${
                      viewedSections.has("terms-conditions")
                        ? "border-green-200 bg-gradient-to-br from-green-50 to-white"
                        : "border-amber-200 bg-gradient-to-br from-amber-50 to-white"
                    }
                  `}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`
                          w-3 h-3 rounded-full 
                          ${
                            viewedSections.has("terms-conditions")
                              ? "bg-green-500"
                              : "bg-amber-500"
                          }
                        `}
                      />
                      <CardTitle className="text-lg font-semibold text-gray-900">
                        I Agree, And I confirm that
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-3 p-4 bg-white/50 rounded-lg border border-gray-200">
                      {terms.map((term, index) => (
                        <p
                          key={index}
                          className="text-sm text-gray-700 leading-relaxed"
                        >
                          • {term}
                        </p>
                      ))}
                    </div>

                    <Label className="flex items-start gap-3 rounded-lg border-2 border-blue-200 p-4 bg-blue-50/50 hover:bg-blue-50 transition-colors cursor-pointer">
                      <Checkbox
                        id="terms-agreement"
                        className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white mt-0.5"
                      />
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-900">
                          I Agree
                        </p>
                        <p className="text-sm text-gray-600">
                          I have read and agree to all terms and conditions
                        </p>
                      </div>
                    </Label>

                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                      <Button
                        disabled={!allSectionsViewed}
                        className={`
                          flex-1 h-12 text-base font-medium transition-all duration-200
                          ${
                            allSectionsViewed
                              ? "bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl"
                              : "bg-gray-300 text-gray-500 cursor-not-allowed"
                          }
                        `}
                      >
                        {allSectionsViewed ? (
                          <div
                            onClick={handleSubmit}
                            className="flex items-center space-x-2"
                          >
                            <CheckCircle2 className="w-5 h-5" />
                            <span>Agree</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <Clock className="w-5 h-5" />
                            <span>Review All Sections First</span>
                          </div>
                        )}
                      </Button>
                      <Button
                        variant="destructive"
                        className="flex-1 h-12 text-base font-medium shadow-lg hover:shadow-xl"
                      >
                        Disagree
                      </Button>
                    </div>

                    {!allSectionsViewed && (
                      <div className="text-center p-3 bg-amber-50 border border-amber-200 rounded-lg">
                        <p className="text-sm text-amber-800">
                          Please review all sections before proceeding. Use the
                          sidebar navigation to visit each section.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
