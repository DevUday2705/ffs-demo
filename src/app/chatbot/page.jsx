"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Send,
  Bot,
  User,
  Loader2,
  LogOut,
  Upload,
  FileText,
  X,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import MessageComponent from "@/components/custom/MessageComponent";
import LoadingComponent from "@/components/custom/LoadingComponent";
import EmailModal from "@/components/custom/EmailModal";
import MeetingModal from "@/components/custom/MeetingModal";
import BulkActionsModal from "@/components/custom/BulkActionsModal";
import JobDetailsComponent from "@/components/custom/JobDetailsComponent";
import JobCard from "@/components/custom/JobCard";
import JRDetailsModal from "@/components/custom/JRDetailsModal";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const roles = {
  HM: "hiring_manager",
  R: "recruiter",
  C: "candidate",
};

const ResumeSearchChatBot = () => {
  const router = useRouter();

  // All hooks must be declared at the top level, before any conditional returns
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [userRoleLabel, setUserRoleLabel] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchProgress, setSearchProgress] = useState({ stage: "", count: 0 });
  const [completedAnimations, setCompletedAnimations] = useState(new Set([1]));
  const [actionLoading, setActionLoading] = useState({});
  const [currentContext, setCurrentContext] = useState(null); // Store context data from API responses

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
  const [jrModal, setJrModal] = useState({
    isOpen: false,
    jobDetails: null,
  });

  // File upload state
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

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
      const storedUserRole = localStorage.getItem("userRole");
      const storedUserEmail = localStorage.getItem("userEmail");
      const storedUserRoleLabel = localStorage.getItem("userRoleLabel");
      const storedSessionId = localStorage.getItem("sessionId");

      if (isLoggedIn || userToken || isAuthenticated) {
        setIsAuthenticated(true);
        setUserRole(storedUserRole);
        setUserEmail(storedUserEmail);
        setUserRoleLabel(storedUserRoleLabel);

        // Use the session ID created during login
        if (storedSessionId) {
          setSessionId(storedSessionId);
          console.log("Using existing session from login:", storedSessionId);
        } else {
          console.error("No session ID found - redirecting to login");
          router.push("/login");
          return;
        }
      } else {
        router.push("/login");
      }
      setIsCheckingAuth(false);
    };

    checkAuth();
  }, [router]);

  // Set initial message based on user role
  useEffect(() => {
    if (userRole && messages.length === 0) {
      let initialMessage = "";

      switch (userRole) {
        case "HM": // Hiring Manager
          initialMessage =
            "Hello! I'm your AI-powered job description assistant. I can help you create comprehensive job descriptions and find the right candidates. For example, try: 'Create a JD for a Senior React Developer' or 'I need a job description for a Python engineer with 3+ years experience'.";
          break;
        case "R": // Recruiter
          initialMessage =
            "Hello! I'm your AI-powered resume search assistant. Tell me what kind of candidates you're looking for and I'll scan through thousands of resumes to find the best matches. For example: 'I want 10 React developers' or 'Find me 5 Python engineers with 3+ years experience'.";
          break;
        case "C": // Candidate
          initialMessage =
            "Hello! I'm your AI assistant. I can help you with various queries related to your job search and career development. Feel free to ask me anything!";
          break;
        default:
          initialMessage =
            "Hello! I'm your AI assistant. How can I help you today?";
      }

      setMessages([
        {
          id: 1,
          type: "bot",
          content: initialMessage,
          timestamp: new Date(),
        },
      ]);
      setCompletedAnimations(new Set([1]));
    }
  }, [userRole, messages.length]);

  // Session cleanup function - only used on logout now
  const cleanupSession = () => {
    if (sessionId) {
      console.log("Cleaning up session with session_id:", sessionId);

      // Use navigator.sendBeacon for reliable cleanup
      const data = new FormData();
      data.append("session_id", sessionId);

      if (navigator.sendBeacon) {
        navigator.sendBeacon("/api/session/cleanup", data);
      } else {
        // Fallback for older browsers
        fetch("/api/session/cleanup", {
          method: "POST",
          body: data,
          keepalive: true,
        }).catch(() => {}); // Ignore errors during cleanup
      }
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
    // Clean up session before logout
    cleanupSession();

    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userToken");
    localStorage.removeItem("userData");
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userLoginId");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userRoleLabel");
    router.push("/login");
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

  // Show loading while checking authentication or if no session available
  if (isCheckingAuth || (isAuthenticated && !sessionId)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">
            {isCheckingAuth ? "Verifying access..." : "Loading session..."}
          </p>
        </div>
      </div>
    );
  }

  // New API implementation for hiring manager workflow
  const fetchHiringManagerWorkflow = async (query, file = null) => {
    try {
      console.log(
        "Sending hiring manager query:",
        query,
        "Session ID:",
        sessionId
      );

      if (!sessionId) {
        throw new Error("Session not initialized. Please refresh the page.");
      }

      // Always use FormData (as required by the API)
      const formData = new FormData();
      formData.append("session_id", sessionId);
      formData.append("query", query);

      // Add file if provided
      if (file) {
        formData.append("file", file);
        console.log(
          "Adding file to FormData:",
          file.name,
          file.type,
          file.size
        );
      }

      // Debug: Log what we're sending
      console.log("FormData entries:");
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      console.log("Sending FormData request to /api/run-workflow");

      const response = await fetch("/api/run-workflow", {
        method: "POST",
        body: formData, // Let browser set Content-Type with boundary
      });

      console.log("Hiring Manager Workflow Response status:", response.status);

      if (!response.ok) {
        throw new Error(
          `Workflow request failed with status ${response.status}`
        );
      }

      const data = await response.json();
      console.log("=== Hiring Manager Workflow Response ===", data);

      // Handle the new response format from final_state
      if (data.final_state) {
        const { draft_jr, jobs, response: botResponse } = data.final_state;

        // Handle jobs array for viewing all jobs
        if (jobs && jobs.length > 0) {
          // Transform jobs to the format expected by JobCard components
          const jobMatches = jobs.map((job) => ({
            id: job.jr_id,
            score: 0.95, // Default high score for all jobs when listing
            metadata: {
              "Job Title": job.job_title,
              "Job Description": job.job_description,
              Location: JSON.stringify(job.location || []),
              "Skills Required": JSON.stringify(job.mandatory_skills || []),
              "Skills Optional": JSON.stringify(job.optional_skills || []),
              Experience: `${job.min_experience_years || 0}-${
                job.max_experience_years || "Any"
              } years`,
              "Match Threshold": job.match_threshold || 0.5,
              "Resume Count": job.resume_count || 0,
              Status: job.status, // Add status to metadata
            },
          }));

          return {
            jobDetails: { matches: jobMatches },
            message:
              botResponse ||
              `Found ${jobs.length} job${
                jobs.length > 1 ? "s" : ""
              } matching your query.`,
            hasJobDetails: true,
            showAsJobList: true,
          };
        }

        if (draft_jr) {
          // Transform draft_jr to jobDetails format expected by JobDetailsComponent
          const jobDetails = {
            "Job Title": draft_jr.job_title,
            "JR ID": draft_jr.jr_id,
            "Job Description": draft_jr.job_description,
            "Min Experience": draft_jr.min_experience_years
              ? `${draft_jr.min_experience_years} years`
              : "Not specified",
            "Max Experience": draft_jr.max_experience_years
              ? `${draft_jr.max_experience_years} years`
              : "Not specified",
            "Mandatory Skills": draft_jr.mandatory_skills || [],
            "Optional Skills": draft_jr.optional_skills || [],
            Location:
              draft_jr.location && draft_jr.location.length > 0
                ? draft_jr.location
                : ["Location to be specified"],
            "Number of Openings": draft_jr.number_of_openings || 1,
            Status: draft_jr.status || "Open",
            "Approval Status": draft_jr.approval_status || "Pending",
            "Created At": draft_jr.created_at,
            "Match Threshold": draft_jr.match_threshold || 0.5,
            // Add role assignment fields for dropdown prefilling
            "Recruiter ID": draft_jr.recruiter_id,
            "Approver 1 ID": draft_jr.approver1_id,
            "Approver 2 ID": draft_jr.approver2_id,
            "Approver 3 ID": draft_jr.approver3_id,
          };

          return {
            jobDetails: jobDetails,
            message: botResponse || "Job requisition created successfully!",
            hasJobDetails: true,
          };
        } else {
          return {
            message: botResponse || "Job requirements processed successfully.",
            hasJobDetails: false,
          };
        }
      }

      // Fallback for old response format
      return {
        jobDetails: data.job_details || data.jobDetails,
        message:
          data.supervisor_message ||
          data.message ||
          "Job requirements processed successfully.",
        hasJobDetails: !!(data.job_details || data.jobDetails),
      };
    } catch (error) {
      console.error("Hiring Manager Workflow Error:", error);
      throw error;
    }
  };

  // New API implementation for resume search
  const fetchResumesFromAPI = async (query) => {
    try {
      console.log("Sending query to API:", query, "Session ID:", sessionId);

      if (!sessionId) {
        throw new Error("Session not initialized. Please refresh the page.");
      }

      const formData = new URLSearchParams();
      formData.append("query", query);
      formData.append("session_id", sessionId);

      const response = await fetch("/api/invoke", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: query,
          session_id: sessionId,
          role: userRole,
        }),
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      console.log("=== API Response data ===", data);
      console.log("Has job_details?", !!data.job_details);
      console.log("Has supervisor_message?", !!data.supervisor_message);
      console.log("Has jobDetails?", !!data.jobDetails);
      console.log("Has jobDetails.matches?", !!data.jobDetails?.matches);
      console.log("Has hasJobDetails?", !!data.hasJobDetails);
      console.log("Has message?", !!data.message);

      // Extract and store context if it exists in the response
      if (data.context && data.context.jr_id) {
        console.log("🔹 Found context with jr_id:", data.context.jr_id);
        setCurrentContext(data.context);
      } else {
        console.log("🔹 No context found in response");
        setCurrentContext(null);
      }

      // New Scenario: Job Details Response (for Hiring Managers)
      if (data.job_details && data.supervisor_message) {
        console.log("🔹 Taking HIRING MANAGER path");
        return {
          jobDetails: data.job_details,
          message: data.supervisor_message,
          hasJobDetails: Object.keys(data.job_details).length > 0,
        };
      }
      // Handle case where only supervisor_message is present
      else if (data.supervisor_message && !data.job_details) {
        console.log("🔹 Taking SUPERVISOR MESSAGE ONLY path");
        return {
          message: data.supervisor_message,
          hasJobDetails: false,
        };
      }

      // New Scenario: Job Search Results (for Candidates)
      if (data.jobDetails && data.jobDetails.matches && data.hasJobDetails) {
        console.log("🔹 Taking CANDIDATE JOB SEARCH path");
        const jobMatches = data.jobDetails.matches;
        console.log("Job matches found:", jobMatches.length, jobMatches);

        if (jobMatches.length === 0) {
          return {
            isEmpty: true,
            message:
              "I couldn't find any job openings matching your criteria. Try adjusting your search parameters or exploring different skills/locations.",
          };
        }

        return {
          jobs: jobMatches,
          message: data.message,
          hasJobs: true,
        };
      }

      // Scenario 1: Direct results with resumes.matches
      if (data.resumes && data.resumes.matches) {
        const matches = data.resumes.matches;

        if (matches.length === 0) {
          return {
            isEmpty: true,
            message:
              "I couldn't find any candidates matching your specific criteria. Try adjusting your search parameters or providing different skills/requirements.",
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
            skills: Array.isArray(match.metadata.skills)
              ? match.metadata.skills
              : [],
            relevance_score: match.score,
            download_url: match.metadata.download_url,
            job_title: match.metadata.job_title,
            summary: match.metadata.summary,
            linkedin: match.metadata.linkedin,
            filename: match.metadata.filename,
          },
          experience:
            match.metadata.total_experience || "Experience not specified",
          resumeUrl: match.metadata.download_url,
        }));

        return {
          matches: transformedMatches,
          message:
            data.message ||
            `Great! I found ${matches.length} excellent candidate${
              matches.length > 1 ? "s" : ""
            } matching your requirements.`,
        };
      }
      // Scenario 1b: Fallback for old ranking_pipeline_response structure
      else if (
        data.ranking_pipeline_response &&
        data.ranking_pipeline_response.response
      ) {
        const matches = data.ranking_pipeline_response.response;

        if (matches.length === 0) {
          return {
            isEmpty: true,
            message:
              "I couldn't find any candidates matching your specific criteria. Try adjusting your search parameters or providing different skills/requirements.",
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
            skills: Array.isArray(match.metadata.skills)
              ? match.metadata.skills
              : [],
            relevance_score: match.score,
            download_url: match.metadata.download_url,
            job_title: match.metadata.job_title,
            summary: match.metadata.summary,
            linkedin: match.metadata.linkedin,
            filename: match.metadata.filename,
          },
          experience:
            match.metadata.total_experience || "Experience not specified",
          resumeUrl: match.metadata.download_url,
        }));

        return {
          matches: transformedMatches,
          message: `Great! I found ${matches.length} excellent candidate${
            matches.length > 1 ? "s" : ""
          } matching your requirements.`,
        };
      }
      // Scenario 2: No results found
      else if (data.message && data.message.includes("No results found")) {
        return {
          isEmpty: true,
          message:
            "I couldn't find any candidates matching your specific criteria. Try adjusting your search parameters or providing different skills/requirements.",
        };
      }
      // Scenario 3: Supervisor message (invalid query)
      else if (data.message === "Follow-up or pre-handled case.") {
        throw new Error(
          "This query is beyond the scope of this application. Let's discuss about candidate requirements for skills or share job reference number you need candidates for."
        );
      }
      // Handle case where no resumes were generated (unrelated query)
      else if (data.supervisor_message) {
        throw new Error(data.supervisor_message);
      }
      // Fallback for unexpected response format
      else {
        throw new Error(
          "I'm having trouble processing your request. Could you please rephrase your query?"
        );
      }
    } catch (error) {
      console.error("Error fetching resumes:", error);
      throw error;
    }
  };

  // Also update your searchResumes function to handle errors better
  const searchResumes = async (query) => {
    const stages = [
      { stage: "Initializing...", delay: 500 },
      { stage: "Fetching data...", delay: 800 },
      { stage: "Analyzing data...", delay: 600, count: 1247 },
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
            stage: "Processing information...",
            delay: 400,
            count: 892,
          },
          {
            stage: "Applying AI algorithms...",
            delay: 300,
            count: 156,
          },
          {
            stage: "Generating results...",
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
        setSearchProgress({ stage: "Finalizing...", count: 0 });
        try {
          resumeData = await apiCallPromise;
        } catch (error) {
          console.error("Final API call failed:", error);
          throw error; // Re-throw to be handled by the calling function
        }
      } else {
        // Show brief finalizing stage even if API completed early
        setSearchProgress({ stage: "Finalizing...", count: 0 });
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
    if (!sessionId) {
      const errorMessage = {
        id: Date.now(),
        type: "bot",
        content:
          "Please wait while I initialize the session, or refresh the page if this persists.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      return;
    }

    const userMessage = {
      id: Date.now(),
      type: "user",
      content: selectedFile
        ? `${currentInput} 📎 ${selectedFile.name}`
        : currentInput,
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
      let apiResponse;

      // Use different API based on user role
      if (userRole === "HM" || userEmail === "manager@gmail.com") {
        // For hiring managers, use the run-workflow API with file if attached
        apiResponse = await fetchHiringManagerWorkflow(
          currentInput,
          selectedFile
        );
      } else {
        // For recruiters and candidates, use the existing search API
        apiResponse = await searchResumes(currentInput);
      }

      console.log("API Response:", apiResponse);

      const botMessageId = Date.now() + 1;
      let botMessage;

      // Handle different response types
      if (apiResponse.jobDetails && apiResponse.hasJobDetails) {
        // Job details response with job data
        botMessage = {
          id: botMessageId,
          type: "bot",
          content: selectedFile
            ? `✅ Successfully processed your file "${selectedFile.name}" along with your query. ${apiResponse.message}`
            : apiResponse.message,
          jobDetails: apiResponse.jobDetails,
          timestamp: new Date(),
          shouldType: true,
        };
      } else if (apiResponse.jobs && apiResponse.hasJobs) {
        // Job search results for candidates
        console.log("Processing job results:", apiResponse.jobs.length, "jobs");
        botMessage = {
          id: botMessageId,
          type: "bot",
          content: apiResponse.message,
          jobs: apiResponse.jobs,
          timestamp: new Date(),
          shouldType: true,
        };
      } else if (
        apiResponse.message &&
        !apiResponse.hasJobDetails &&
        !apiResponse.matches
      ) {
        // Supervisor message only (no job details yet)
        botMessage = {
          id: botMessageId,
          type: "bot",
          content: selectedFile
            ? `✅ Successfully processed your file "${selectedFile.name}". ${apiResponse.message}`
            : apiResponse.message,
          timestamp: new Date(),
          shouldType: true,
        };
      } else if (apiResponse.isEmpty) {
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
          content:
            apiResponse.message +
            " Here are the top results, ranked by relevance:",
          resumes: apiResponse.matches,
          timestamp: new Date(),
          shouldType: true,
        };
      } else {
        // Fallback for unexpected response structure
        botMessage = {
          id: botMessageId,
          type: "bot",
          content:
            "I received a response but couldn't process the results. Please try rephrasing your query.",
          timestamp: new Date(),
          shouldType: true,
        };
      }

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      let errorMessage =
        "Sorry, I encountered an error while searching for resumes. Please try again.";

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
      // Clear the selected file after sending
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      inputRef.current?.focus();
    }
  };

  // New action handlers
  const handleAttachCandidate = async (candidateId, candidateName, jrId) => {
    setActionLoading((prev) => ({ ...prev, [`attach-${candidateId}`]: true }));

    try {
      const response = await fetch("/api/recruiter/attach-candidate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jr_id: jrId,
          candidate_id: candidateId,
          session_id: sessionId,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Add success message to chat
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now(),
            type: "bot",
            content: `Successfully attached ${candidateName} to the job requisition.`,
            timestamp: new Date(),
            shouldType: true,
          },
        ]);
      } else {
        throw new Error(data.error || "Failed to attach candidate");
      }
    } catch (error) {
      console.error("Error attaching candidate:", error);
      // Add error message to chat
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          type: "bot",
          content: `Sorry, I couldn't attach ${candidateName} to the job requisition. Please try again.`,
          timestamp: new Date(),
          shouldType: true,
        },
      ]);
    } finally {
      setActionLoading((prev) => ({
        ...prev,
        [`attach-${candidateId}`]: false,
      }));
    }
  };

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

  // Handle job applications (for candidates)
  const handleJobApply = async (jobId, jobTitle) => {
    try {
      // Simulate job application
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const successMessage = {
        id: Date.now(),
        type: "bot",
        content: `🎉 Successfully applied to ${jobTitle}! Your application has been submitted and the hiring team will review it shortly. Good luck!`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, successMessage]);
    } catch (error) {
      console.error("Error applying to job:", error);
      const errorMessage = {
        id: Date.now(),
        type: "bot",
        content: `❌ Failed to apply to ${jobTitle}. Please try again later.`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  // Handle JR modal actions
  const handleViewJR = (jobDetails) => {
    setJrModal({ isOpen: true, jobDetails });
  };

  const handleCopyJR = (jobDetails) => {
    // Generate JR link based on job title or ID
    const jrId =
      jobDetails["Job Title"]?.replace(/\s+/g, "-").toLowerCase() ||
      "jr-123456";
    const jrLink = `${window.location.origin}/job-requisition/${jrId}`;

    navigator.clipboard
      .writeText(jrLink)
      .then(() => {
        toast.success("JR Link Copied!", {
          description: "Job requisition link has been copied to clipboard.",
          duration: 3000,
        });
      })
      .catch(() => {
        toast.error("Copy Failed", {
          description: "Failed to copy link. Please try again.",
          duration: 3000,
        });
      });
  };

  // Handle role selection from JR dropdowns
  const handleRoleSelection = async (message) => {
    // Don't prefill anymore, directly send the API call
    console.log("Role selection message:", message);

    // Check if session is initialized
    if (!sessionId) {
      const errorMessage = {
        id: Date.now(),
        type: "bot",
        content:
          "Please wait while I initialize the session, or refresh the page if this persists.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      return;
    }

    // Add user message showing what was assigned
    const userMessage = {
      id: Date.now(),
      type: "user",
      content: message,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    setIsLoading(true);
    setSearchProgress({ stage: "", count: 0 });

    try {
      // Use the hiring manager workflow API for role assignments
      const apiResponse = await fetchHiringManagerWorkflow(message);
      console.log("Role assignment API Response:", apiResponse);

      const botMessageId = Date.now() + 1;
      let botMessage;

      // Handle the response
      if (apiResponse.jobDetails && apiResponse.hasJobDetails) {
        // Job details response with updated assignments
        botMessage = {
          id: botMessageId,
          type: "bot",
          content: apiResponse.message,
          jobDetails: apiResponse.jobDetails,
          timestamp: new Date(),
          shouldType: true,
        };
      } else {
        // Just a confirmation message
        botMessage = {
          id: botMessageId,
          type: "bot",
          content:
            apiResponse.message ||
            "Role assignments have been processed successfully.",
          timestamp: new Date(),
          shouldType: true,
        };
      }

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Role assignment error:", error);
      const errorMessage = {
        id: Date.now() + 1,
        type: "bot",
        content:
          "Sorry, I encountered an error while processing the role assignments. Please try again.",
        timestamp: new Date(),
        shouldType: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setSearchProgress({ stage: "", count: 0 });
    }
  };

  // File upload handlers
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Check file type (optional - you can restrict to specific types)
      const allowedTypes = [".pdf", ".doc", ".docx", ".txt"];
      const fileExtension = "." + file.name.split(".").pop().toLowerCase();

      if (allowedTypes.includes(fileExtension)) {
        setSelectedFile(file);
      } else {
        alert("Please select a valid file type (.pdf, .doc, .docx, .txt)");
        event.target.value = ""; // Reset file input
      }
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Enhanced Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-32  flex items-center justify-center ">
              <img
                src="/logo.webp"
                alt="Description"
                className="w-full h-full"
              />
            </div>
            <div>
              <div></div>
              <h1 className="text-xl font-bold text-gray-900">
                {userRole === "HM"
                  ? "AI Job Description Assistant"
                  : userRole === "R"
                  ? "AI Resume Search Assistant"
                  : userRole === "C"
                  ? "AI Career Assistant"
                  : "AI Assistant"}
              </h1>
              <p className="text-sm text-gray-600">
                {userRole === "HM"
                  ? "Create comprehensive job descriptions and find the right candidates"
                  : userRole === "R"
                  ? "Find, enhance, and connect with perfect candidates instantly"
                  : userRole === "C"
                  ? "Get help with your job search and career development"
                  : "How can I help you today?"}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>AI Powered</span>
              </div>
              {userRoleLabel && (
                <div className="flex items-center space-x-2 px-2 py-1 bg-blue-50 rounded-full">
                  <User className="w-3 h-3 text-blue-600" />
                  <span className="text-blue-700 font-medium">
                    {userRoleLabel}
                  </span>
                </div>
              )}
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
              userRole={userRole}
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
              onJobApply={handleJobApply}
              onViewJR={handleViewJR}
              onCopyJR={handleCopyJR}
              onRoleSelection={handleRoleSelection}
              onAttachCandidate={handleAttachCandidate}
              context={currentContext}
              sessionId={sessionId}
            />
          ))}

          {/* Enhanced Loading indicator */}
          {isLoading && (
            <LoadingComponent
              searchProgress={searchProgress}
              userRole={userRole}
            />
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Enhanced Input Form */}
      <div className="bg-white border-t border-gray-200 px-4 py-5 shadow-lg">
        <div className="max-w-5xl mx-auto">
          {/* File Attachment Preview */}
          {(userRole === "HM" || userEmail === "manager@gmail.com") &&
            selectedFile && (
              <div className="mb-3 p-2 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">
                      {selectedFile.name}
                    </span>
                    <span className="text-xs text-blue-600">
                      ({(selectedFile.size / 1024).toFixed(1)} KB)
                    </span>
                  </div>
                  <Button
                    onClick={handleRemoveFile}
                    disabled={isLoading}
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            )}

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
                  placeholder={
                    userRole === "HM"
                      ? "e.g., 'Create a JD for Senior React Developer' or 'I need a job description for Python engineer with 3+ years' • Attach files for analysis"
                      : userRole === "R"
                      ? "e.g., 'I want 10 React developers' or 'Find me 5 Python engineers with machine learning experience'"
                      : userRole === "C"
                      ? "e.g., 'Help me improve my resume' or 'What skills should I learn for a React developer role?'"
                      : "How can I help you today?"
                  }
                  className="w-full pr-14 resize-none min-h-[56px] max-h-[120px]"
                  disabled={isLoading}
                  onInput={(e) => {
                    inputValue.current = e.target.value;
                    e.target.style.height = "auto";
                    e.target.style.height =
                      Math.min(e.target.scrollHeight, 120) + "px";
                  }}
                />
                <div className="absolute right-3 bottom-3 flex items-center space-x-2">
                  {/* File Upload Button for Hiring Managers */}
                  {(userRole === "HM" || userEmail === "manager@gmail.com") && (
                    <>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,.doc,.docx,.txt"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                      <Button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isLoading}
                        size="sm"
                        variant="outline"
                        className="h-10 w-10 p-0 border-gray-300 hover:border-blue-400 hover:bg-blue-50"
                      >
                        <Upload className="w-5 h-5 text-gray-600" />
                      </Button>
                    </>
                  )}

                  <Button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    size="sm"
                    className="h-10 w-10 p-0 bg-slate-600 hover:bg-slate-700 text-white"
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
          </div>
          <p className="text-xs text-gray-500 text-center mt-3">
            Press Enter to search • Shift + Enter for new line •
            {(userRole === "HM" || userEmail === "manager@gmail.com") &&
              " Click 📎 to attach files •"}{" "}
            Powered by AI
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

      <JRDetailsModal
        isOpen={jrModal.isOpen}
        onClose={() => setJrModal({ isOpen: false, jobDetails: null })}
        jobDetails={jrModal.jobDetails}
      />
    </div>
  );
};

export default ResumeSearchChatBot;
