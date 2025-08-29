"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Send, Bot, User, Loader2, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import MessageComponent from "@/components/custom/MessageComponent";
import LoadingComponent from "@/components/custom/LoadingComponent";
import EmailModal from "@/components/custom/EmailModal";
import MeetingModal from "@/components/custom/MeetingModal";
import BulkActionsModal from "@/components/custom/BulkActionsModal";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const ResumeSearchChatBot = () => {
  const router = useRouter();

  // All hooks must be declared at the top level, before any conditional returns
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [threadId, setThreadId] = useState(null);
  const [isInitializingSession, setIsInitializingSession] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "bot",
      content:
        "Hello! I'm your AI-powered resume search assistant. Tell me what kind of candidates you're looking for and I'll scan through thousands of resumes to find the best matches. For example: 'I want 10 React developers' or 'Find me 5 Python engineers with 3+ years experience'.",
      timestamp: new Date(),
    },
  ]);
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchProgress, setSearchProgress] = useState({ stage: "", count: 0 });
  const [completedAnimations, setCompletedAnimations] = useState(new Set([1]));
  const [actionLoading, setActionLoading] = useState({});

  // Modal states
  const [emailModal, setEmailModal] = useState({
    isOpen: false,
    candidate: null,
  });
  const [meetingModal, setMeetingModal] = useState({
    isOpen: false,
    candidate: null,
  });
  const [bulkModal, setBulkModal] = useState({
    isOpen: false,
    candidates: [],
  });

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const inputValue = useRef("");
  const messagesContainerRef = useRef(null);

  // Improved scroll behavior
  const scrollToBottom = useCallback((behavior = "smooth") => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior,
        block: "end",
        inline: "nearest",
      });
    }
  }, []);

  // Check authentication on component mount
  useEffect(() => {
    const checkAuth = () => {
      const isLoggedIn = localStorage.getItem("isLoggedIn");
      const userToken = localStorage.getItem("userToken");
      const isAuthenticated = localStorage.getItem("isAuthenticated");

      if (isLoggedIn || userToken || isAuthenticated) {
        setIsAuthenticated(true);
      } else {
        router.push("/");
      }
      setIsCheckingAuth(false);
    };

    checkAuth();
  }, [router]);

  // Initialize session when authenticated
  useEffect(() => {
    if (isAuthenticated && !threadId && !isInitializingSession) {
      initializeSession();
    }
  }, [isAuthenticated, threadId, isInitializingSession]);

  // Initialize session with the API
  const initializeSession = async () => {
    setIsInitializingSession(true);
    try {
      console.log("Initializing session...");
      const response = await fetch("/api/session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Session initialization failed: ${response.status}`);
      }

      const data = await response.json();
      console.log("Session initialized:", data);
      setThreadId(data.thread_id);
    } catch (error) {
      console.error("Failed to initialize session:", error);
      // Add error message to chat
      setMessages(prev => [...prev, {
        id: Date.now(),
        type: "bot",
        content: "I'm having trouble connecting to the service. Please refresh the page to try again.",
        timestamp: new Date(),
      }]);
    } finally {
      setIsInitializingSession(false);
    }
  };

  // Auto-scroll when new messages are added, but only if user is near bottom
  useEffect(() => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } =
        messagesContainerRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;

      if (isNearBottom) {
        setTimeout(() => scrollToBottom(), 100);
      }
    }
  }, [messages, scrollToBottom]);

  // Scroll to bottom when typing completes
  useEffect(() => {
    if (isTypingComplete) {
      setTimeout(() => scrollToBottom(), 200);
    }
  }, [isTypingComplete, scrollToBottom]);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userToken");
    localStorage.removeItem("userData");
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userLoginId");
    router.push("/");
  };

  // Mock resume data - replace with actual API response

  // Show loading while checking authentication
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying access...</p>
        </div>
      </div>
    );
  }

  // Don't render chatbot if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  // Show loading while initializing session
  if (isInitializingSession || (isAuthenticated && !threadId)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Initializing session...</p>
        </div>
      </div>
    );
  }

  // New API implementation for resume search
  const fetchResumesFromAPI = async (query) => {
    try {
      console.log("Sending query to API:", query, "Thread ID:", threadId);

      if (!threadId) {
        throw new Error("Session not initialized. Please refresh the page.");
      }

      const formData = new URLSearchParams();
      formData.append("query", query);
      formData.append("thread_id", threadId);

      const response = await fetch("/api/invoke", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: query,
          thread_id: threadId,
        }),
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      console.log("API Response data:", data);

      // Scenario 1: Direct results with resumes.matches
      if (data.resumes && data.resumes.matches) {
        const matches = data.resumes.matches;
        
        if (matches.length === 0) {
          return {
            isEmpty: true,
            message: "I couldn't find any candidates matching your specific criteria. Try adjusting your search parameters or providing different skills/requirements.",
          };
        }

        // Transform the data to match component's expected format
        const transformedMatches = matches.map((match, index) => ({
          id: match.id,
          metadata: {
            name: match.metadata.full_name || `Candidate ${index + 1}`,
            email: match.metadata.email,
            phone: match.metadata.phone_number,
            location: match.metadata.location,
            education: match.metadata.education || "Information not available",
            skills: Array.isArray(match.metadata.skills) ? match.metadata.skills : [],
            relevance_score: match.score,
            download_url: match.metadata.download_url,
            job_title: match.metadata.job_title,
            summary: match.metadata.summary,
            linkedin: match.metadata.linkedin,
            filename: match.metadata.filename,
          },
          experience: match.metadata.total_experience || "Experience not specified",
          resumeUrl: match.metadata.download_url,
        }));

        return {
          matches: transformedMatches,
          message: `Great! I found ${matches.length} excellent candidate${matches.length > 1 ? 's' : ''} matching your requirements.`,
        };
      } 
      // Scenario 1b: Fallback for old ranking_pipeline_response structure
      else if (data.ranking_pipeline_response && data.ranking_pipeline_response.response) {
        const matches = data.ranking_pipeline_response.response;
        
        if (matches.length === 0) {
          return {
            isEmpty: true,
            message: "I couldn't find any candidates matching your specific criteria. Try adjusting your search parameters or providing different skills/requirements.",
          };
        }

        // Transform the data to match component's expected format
        const transformedMatches = matches.map((match, index) => ({
          id: match.id,
          metadata: {
            name: match.metadata.full_name || `Candidate ${index + 1}`,
            email: match.metadata.email,
            phone: match.metadata.phone_number,
            location: match.metadata.location,
            education: match.metadata.education || "Information not available",
            skills: Array.isArray(match.metadata.skills) ? match.metadata.skills : [],
            relevance_score: match.score,
            download_url: match.metadata.download_url,
            job_title: match.metadata.job_title,
            summary: match.metadata.summary,
            linkedin: match.metadata.linkedin,
            filename: match.metadata.filename,
          },
          experience: match.metadata.total_experience || "Experience not specified",
          resumeUrl: match.metadata.download_url,
        }));

        return {
          matches: transformedMatches,
          message: `Great! I found ${matches.length} excellent candidate${matches.length > 1 ? 's' : ''} matching your requirements.`,
        };
      } 
      // Scenario 2: No results found
      else if (data.message && data.message.includes("No results found")) {
        return {
          isEmpty: true,
          message: "I couldn't find any candidates matching your specific criteria. Try adjusting your search parameters or providing different skills/requirements.",
        };
      }
      // Scenario 3: Supervisor message (invalid query)
      else if (data.message === "Follow-up or pre-handled case.") {
        throw new Error("This query is beyond the scope of this application. Let's discuss about candidate requirements for skills or share job reference number you need candidates for.");
      } 
      // Handle case where no resumes were generated (unrelated query)
      else if (data.supervisor_message) {
        throw new Error(data.supervisor_message);
      } 
      // Fallback for unexpected response format
      else {
        throw new Error("I'm having trouble processing your request. Could you please rephrase your query?");
      }
    } catch (error) {
      console.error("Error fetching resumes:", error);
      throw error;
    }
  };

  // Also update your searchResumes function to handle errors better
  const searchResumes = async (query) => {
    const stages = [
      { stage: "Initializing search...", delay: 500 },
      { stage: "Fetching resumes from database...", delay: 800 },
      { stage: "Scanning resumes database...", delay: 600, count: 1247 },
    ];

    // Start the API call early
    const apiCallPromise = fetchResumesFromAPI(query);
    let apiCompleted = false;
    let resumeData = null;

    try {
      // Run initial stages
      for (const { stage, delay, count } of stages) {
        setSearchProgress({ stage, count: count || 0 });

        // Check if API call completed during this stage
        try {
          const raceResult = await Promise.race([
            new Promise((resolve) =>
              setTimeout(() => resolve("timeout"), delay)
            ),
            apiCallPromise.then((data) => ({ type: "api", data })),
          ]);

          if (raceResult.type === "api") {
            resumeData = raceResult.data;
            apiCompleted = true;
            break; // Exit early if API completed
          }
        } catch (error) {
          console.error("API call failed during stage:", stage, error);
          // Continue with remaining stages for user experience
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }

      // If API hasn't completed yet, show final stages with shorter delays
      if (!apiCompleted) {
        const remainingStages = [
          {
            stage: "Analyzing skills and experience...",
            delay: 400,
            count: 892,
          },
          {
            stage: "Applying AI matching algorithms...",
            delay: 300,
            count: 156,
          },
          {
            stage: "Ranking and shortlisting candidates...",
            delay: 200,
            count: 25,
          },
        ];

        for (const { stage, delay, count } of remainingStages) {
          setSearchProgress({ stage, count });

          try {
            const raceResult = await Promise.race([
              new Promise((resolve) =>
                setTimeout(() => resolve("timeout"), delay)
              ),
              apiCallPromise.then((data) => ({ type: "api", data })),
            ]);

            if (raceResult.type === "api") {
              resumeData = raceResult.data;
              apiCompleted = true;
              break;
            }
          } catch (error) {
            console.error("API call failed during stage:", stage, error);
            await new Promise((resolve) => setTimeout(resolve, delay));
          }
        }
      }

      // Final stage - ensure we have the data
      if (!apiCompleted) {
        setSearchProgress({ stage: "Finalizing results...", count: 0 });
        try {
          resumeData = await apiCallPromise;
        } catch (error) {
          console.error("Final API call failed:", error);
          throw error; // Re-throw to be handled by the calling function
        }
      } else {
        // Show brief finalizing stage even if API completed early
        setSearchProgress({ stage: "Finalizing results...", count: 0 });
        await new Promise((resolve) => setTimeout(resolve, 300));
      }

      return resumeData;
    } catch (error) {
      console.error("Search resumes error:", error);
      throw error;
    }
  };

  // Simulated API call with progress updates

  const handleSubmit = async (e) => {
    e.preventDefault();
    const currentInput = inputValue.current.trim();
    if (!currentInput || isLoading) return;

    // Check if session is initialized
    if (!threadId) {
      const errorMessage = {
        id: Date.now(),
        type: "bot",
        content: "Please wait while I initialize the session, or refresh the page if this persists.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      return;
    }

    const userMessage = {
      id: Date.now(),
      type: "user",
      content: currentInput,
      timestamp: new Date(),
    };

    setIsTypingComplete(false);
    setMessages((prev) => [...prev, userMessage]);

    inputValue.current = "";
    if (inputRef.current) {
      inputRef.current.value = "";
      inputRef.current.style.height = "auto";
    }

    setIsLoading(true);
    setSearchProgress({ stage: "", count: 0 });

    try {
      const apiResponse = await searchResumes(currentInput);
      console.log("API Response:", apiResponse);

      const botMessageId = Date.now() + 1;
      let botMessage;

      // Handle different response types
      if (apiResponse.isEmpty) {
        // No matches found but query was valid
        botMessage = {
          id: botMessageId,
          type: "bot",
          content: apiResponse.message,
          timestamp: new Date(),
          shouldType: true,
        };
      } else if (apiResponse.matches && apiResponse.matches.length > 0) {
        // Successful search with results
        botMessage = {
          id: botMessageId,
          type: "bot",
          content: apiResponse.message + " Here are the top results, ranked by relevance:",
          resumes: apiResponse.matches,
          timestamp: new Date(),
          shouldType: true,
        };
      } else {
        // Fallback for unexpected response structure
        botMessage = {
          id: botMessageId,
          type: "bot",
          content: "I received a response but couldn't process the results. Please try rephrasing your query.",
          timestamp: new Date(),
          shouldType: true,
        };
      }

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      let errorMessage = "Sorry, I encountered an error while searching for resumes. Please try again.";

      // Use the specific error message if it's from our API validation
      if (error.message && !error.message.includes("fetch")) {
        errorMessage = error.message;
      }

      const botErrorMessage = {
        id: Date.now() + 1,
        type: "bot",
        content: errorMessage,
        timestamp: new Date(),
        shouldType: true,
      };
      setMessages((prev) => [...prev, botErrorMessage]);
      console.error("Resume search error:", error);
    } finally {
      setIsLoading(false);
      setSearchProgress({ stage: "", count: 0 });
      inputRef.current?.focus();
    }
  };

  // New action handlers
  const handleUpdateResume = async (candidateId, candidateName) => {
    setActionLoading((prev) => ({ ...prev, [`update-${candidateId}`]: true }));

    try {
      const response = await fetch("/api/update-resume", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ candidateId }),
      });

      if (!response.ok) {
        throw new Error("Failed to update resume");
      }

      const data = await response.json();

      // Show success message
      const successMessage = {
        id: Date.now(),
        type: "bot",
        content: `✅ Successfully updated ${candidateName}'s resume to better match your requirements. You can now download the enhanced version.`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, successMessage]);
    } catch (error) {
      console.error("Error updating resume:", error);
      // Show error message
      const errorMessage = {
        id: Date.now(),
        type: "bot",
        content: `❌ Failed to update ${candidateName}'s resume. Please try again later.`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setActionLoading((prev) => ({
        ...prev,
        [`update-${candidateId}`]: false,
      }));
    }
  };

  const handleSendEmail = (candidateId, candidateName, email) => {
    const candidate = messages
      .flatMap((msg) => msg.resumes || [])
      .find((resume) => resume.id === candidateId);

    if (candidate) {
      setEmailModal({ isOpen: true, candidate });
    }
  };

  const handleScheduleMeeting = (candidateId, candidateName) => {
    const candidate = messages
      .flatMap((msg) => msg.resumes || [])
      .find((resume) => resume.id === candidateId);

    if (candidate) {
      setMeetingModal({ isOpen: true, candidate });
    }
  };

  // Simulation handlers for modals
  const handleEmailSend = async (candidateId, candidateName, emailData) => {
    // Simulate email sending
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const successMessage = {
      id: Date.now(),
      type: "bot",
      content: `📧 Email sent successfully to ${candidateName} at ${emailData.to}! The candidate will receive your message shortly.`,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, successMessage]);
  };

  const handleMeetingSchedule = async (
    candidateId,
    candidateName,
    meetingData
  ) => {
    // Simulate meeting scheduling
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const meetingDate = new Date(meetingData.date).toLocaleDateString();
    const successMessage = {
      id: Date.now(),
      type: "bot",
      content: `📅 Meeting scheduled successfully with ${candidateName} on ${meetingDate} at ${meetingData.time} (${meetingData.duration} minutes). Calendar invite has been sent!`,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, successMessage]);
  };

  // Handle bulk actions
  const handleBulkActions = (candidates) => {
    setBulkModal({ isOpen: true, candidates });
  };

  const handleBulkEmail = async (candidates, emailData) => {
    console.log(
      "Bulk email sent to:",
      candidates.map((c) => c.metadata?.name || c.name).join(", ")
    );
    console.log("Email data:", emailData);

    // Simulate bulk email sending
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setBulkModal({ isOpen: false, candidates: [] });

    // Add confirmation message
    const successMessage = {
      id: Date.now(),
      type: "bot",
      content: `📧 Bulk email successfully sent to ${
        candidates.length
      } candidates: ${candidates
        .map((c) => c.metadata?.name || c.name)
        .join(", ")}`,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, successMessage]);
  };

  const handleBulkMeeting = async (scheduleData) => {
    console.log("Bulk meetings scheduled:", scheduleData);

    // Simulate bulk meeting scheduling
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setBulkModal({ isOpen: false, candidates: [] });

    // Add confirmation message
    const candidateCount = Object.keys(scheduleData).length;
    const successMessage = {
      id: Date.now(),
      type: "bot",
      content: `📅 Meetings successfully scheduled for ${candidateCount} candidates. Calendar invites have been sent!`,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, successMessage]);
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Enhanced Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                AI Resume Search Assistant
              </h1>
              <p className="text-sm text-gray-600">
                Find, enhance, and connect with perfect candidates instantly
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>AI Powered</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="flex items-center space-x-2 text-gray-600 hover:text-red-600 hover:border-red-300"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto px-4 py-6 space-y-6"
      >
        <div className="max-w-5xl mx-auto space-y-6">
          {messages.map((message, index) => (
            <MessageComponent
              key={message.id}
              message={message}
              index={index}
              completedAnimations={completedAnimations}
              setCompletedAnimations={setCompletedAnimations}
              isTypingComplete={isTypingComplete}
              setIsTypingComplete={setIsTypingComplete}
              actionLoading={actionLoading}
              onUpdateResume={handleUpdateResume}
              onSendEmail={handleSendEmail}
              onScheduleMeeting={handleScheduleMeeting}
              onBulkActions={handleBulkActions}
            />
          ))}

          {/* Enhanced Loading indicator */}
          {isLoading && <LoadingComponent searchProgress={searchProgress} />}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Enhanced Input Form */}
      <div className="bg-white border-t border-gray-200 px-4 py-5 shadow-lg">
        <div className="max-w-5xl mx-auto">
          <div className="relative">
            <div className="flex items-end space-x-4">
              <div className="flex-1 relative">
                <Textarea
                  ref={inputRef}
                  onChange={(e) => {
                    inputValue.current = e.target.value;
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e);
                    }
                  }}
                  placeholder="e.g., 'I want 10 React developers' or 'Find me 5 Python engineers with machine learning experience'"
                  className="w-full pr-14 resize-none min-h-[56px] max-h-[120px]"
                  disabled={isLoading}
                  onInput={(e) => {
                    inputValue.current = e.target.value;
                    e.target.style.height = "auto";
                    e.target.style.height =
                      Math.min(e.target.scrollHeight, 120) + "px";
                  }}
                />
                <Button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  size="sm"
                  className="absolute right-3 bottom-3 h-10 w-10 p-0 bg-slate-600 hover:bg-slate-700 text-white"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </Button>
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-500 text-center mt-3">
            Press Enter to search • Shift + Enter for new line • Powered by AI
          </p>
        </div>
      </div>

      {/* Modals */}
      <EmailModal
        isOpen={emailModal.isOpen}
        onClose={() => setEmailModal({ isOpen: false, candidate: null })}
        candidate={emailModal.candidate}
        onSend={handleEmailSend}
      />

      <MeetingModal
        isOpen={meetingModal.isOpen}
        onClose={() => setMeetingModal({ isOpen: false, candidate: null })}
        candidate={meetingModal.candidate}
        onSchedule={handleMeetingSchedule}
      />

      <BulkActionsModal
        isOpen={bulkModal.isOpen}
        onClose={() => setBulkModal({ isOpen: false, candidates: [] })}
        candidates={bulkModal.candidates}
        onBulkEmail={handleBulkEmail}
        onBulkMeeting={handleBulkMeeting}
      />
    </div>
  );
};

export default ResumeSearchChatBot;
