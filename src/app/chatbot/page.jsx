"use client";
import { useState, useRef, useEffect } from "react";
import {
  Send,
  Bot,
  User,
  Loader2,
  Download,
  ExternalLink,
  GraduationCap,
  Code,
  RefreshCw,
  Mail,
  Calendar,
  Star,
  MapPin,
  Phone,
  Briefcase,
} from "lucide-react";
import { motion } from "framer-motion";

const ResumeSearchChatBot = () => {
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
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const inputValue = useRef("");

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Mock resume data - replace with actual API response
  const fetchResumesFromAPI = async (query) => {
    try {
      console.log("Sending query to API:", query); // Debug log

      const response = await fetch("/api/resume-search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });

      console.log("Response status:", response.status); // Debug log
      console.log("Response headers:", response.headers); // Debug log

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ error: "Unknown error" }));
        console.error("API Error Response:", errorData);
        throw new Error(`API Error: ${errorData.error || response.statusText}`);
      }

      const data = await response.json();
      console.log("API Response data:", data); // Debug log

      // Validate response structure
      if (
        !data.ranking_pipeline_response ||
        !data.ranking_pipeline_response.response
      ) {
        console.error("Invalid response structure:", data);
        throw new Error("Invalid response structure from API");
      }

      const matches = data.ranking_pipeline_response.response.matches || [];
      console.log("Extracted matches:", matches); // Debug log

      // Transform the data to match your component's expected format
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
        },
        experience:
          match.metadata.total_experience || "Experience not specified",
        resumeUrl: match.metadata.download_url, // For the "View" button
      }));

      console.log("Transformed matches:", transformedMatches); // Debug log
      return transformedMatches;
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
      const resumes = await searchResumes(currentInput);
      console.log("Resumes found:", resumes);
      const botMessageId = Date.now() + 1;
      const botMessage = {
        id: botMessageId,
        type: "bot",
        content: `Great! I found ${resumes.length} excellent candidates matching your criteria. Here are the top results, ranked by relevance:`,
        resumes: resumes,
        timestamp: new Date(),
        shouldType: true,
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        type: "bot",
        content:
          "Sorry, I encountered an error while fetching resumes from the database. Please check your connection and try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
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

  const handleSendEmail = async (candidateId, candidateName, email) => {
    setActionLoading((prev) => ({ ...prev, [`email-${candidateId}`]: true }));

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ candidateId, email }),
      });

      if (!response.ok) {
        throw new Error("Failed to send email");
      }

      const successMessage = {
        id: Date.now(),
        type: "bot",
        content: `📧 Email sent successfully to ${candidateName} at ${email}`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, successMessage]);
    } catch (error) {
      console.error("Error sending email:", error);
      const errorMessage = {
        id: Date.now(),
        type: "bot",
        content: `❌ Failed to send email to ${candidateName}. Please try again later.`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setActionLoading((prev) => ({
        ...prev,
        [`email-${candidateId}`]: false,
      }));
    }
  };

  const handleScheduleMeeting = async (candidateId, candidateName) => {
    setActionLoading((prev) => ({ ...prev, [`meeting-${candidateId}`]: true }));

    try {
      const response = await fetch("/api/schedule-meeting", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ candidateId }),
      });

      if (!response.ok) {
        throw new Error("Failed to schedule meeting");
      }

      const data = await response.json();

      const successMessage = {
        id: Date.now(),
        type: "bot",
        content: `📅 Meeting invitation sent to ${candidateName}. They will receive a calendar invite shortly.`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, successMessage]);
    } catch (error) {
      console.error("Error scheduling meeting:", error);
      const errorMessage = {
        id: Date.now(),
        type: "bot",
        content: `❌ Failed to schedule meeting with ${candidateName}. Please try again later.`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setActionLoading((prev) => ({
        ...prev,
        [`meeting-${candidateId}`]: false,
      }));
    }
  };

  const TypewriterText = ({ text, messageId }) => {
    const [displayText, setDisplayText] = useState("");
    const [currentIndex, setCurrentIndex] = useState(0);

    const shouldAnimate = !completedAnimations.has(messageId);

    useEffect(() => {
      if (shouldAnimate) {
        setDisplayText("");
        setCurrentIndex(0);
      } else {
        setDisplayText(text);
        setCurrentIndex(text.length);
      }
    }, [messageId, shouldAnimate, text]);

    useEffect(() => {
      if (shouldAnimate && currentIndex < text.length) {
        const timeout = setTimeout(() => {
          setDisplayText((prev) => prev + text[currentIndex]);
          setCurrentIndex((prev) => prev + 1);
        }, 30);
        return () => clearTimeout(timeout);
      } else if (shouldAnimate && currentIndex === text.length) {
        setCompletedAnimations((prev) => new Set([...prev, messageId]));
        setIsTypingComplete(true);
      }
    }, [currentIndex, text, shouldAnimate, messageId]);

    return (
      <span>
        {displayText}
        {shouldAnimate && currentIndex < text.length && (
          <span className="inline-block w-0.5 h-4 bg-blue-500 ml-1 animate-pulse" />
        )}
      </span>
    );
  };

  const ResumeCard = ({ resume }) => (
    <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:border-blue-200">
      {/* Header with name and match score */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="font-bold text-gray-900 text-xl">
              {resume.metadata.name}
            </h3>
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
              <span className="text-sm font-medium text-gray-700">
                {Math.floor(resume.metadata.relevance_score * 100)}% match
              </span>
            </div>
          </div>

          {/* Contact info */}
          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
            {resume.metadata.email && (
              <div className="flex items-center space-x-1">
                <Mail className="w-4 h-4" />
                <span>{resume.metadata.email}</span>
              </div>
            )}
            {resume.metadata.phone && (
              <div className="flex items-center space-x-1">
                <Phone className="w-4 h-4" />
                <span>{resume.metadata.phone}</span>
              </div>
            )}
            {resume.metadata.location && (
              <div className="flex items-center space-x-1">
                <MapPin className="w-4 h-4" />
                <span>{resume.metadata.location}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Experience and Education */}
      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div className="flex items-start space-x-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Briefcase className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900 mb-1">Experience</p>
            <p className="text-sm text-gray-600">{resume.experience}</p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <div className="p-2 bg-purple-50 rounded-lg">
            <GraduationCap className="w-4 h-4 text-purple-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900 mb-1">Education</p>
            <p className="text-sm text-gray-600">{resume.metadata.education}</p>
          </div>
        </div>
      </div>

      {/* Skills */}
      <div className="mb-6">
        <div className="flex items-center space-x-2 mb-3">
          <div className="p-2 bg-green-50 rounded-lg">
            <Code className="w-4 h-4 text-green-600" />
          </div>
          <p className="text-sm font-medium text-gray-900">Skills</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {resume.metadata.skills.map((skill, index) => (
            <span
              key={index}
              className="bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium border border-blue-200"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {/* Download Resume */}
        <button className="col-span-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center space-x-2 shadow-sm hover:shadow-md">
          <Download className="w-4 h-4" />
          <a
            target="_blank"
            href={resume.metadata.download_url}
            rel="noreferrer"
          >
            <span>Download</span>
          </a>
        </button>

        {/* View Resume */}
        <button
          onClick={() => window.open(resume.resumeUrl, "_blank")}
          className="col-span-1 bg-gray-50 hover:bg-gray-100 text-gray-700 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center space-x-2 border border-gray-200 hover:border-gray-300"
        >
          <ExternalLink className="w-4 h-4" />
          <span>View</span>
        </button>

        {/* Update Resume */}
        <button
          onClick={() => handleUpdateResume(resume.id, resume.metadata.name)}
          disabled={actionLoading[`update-${resume.id}`]}
          className="col-span-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center space-x-2 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {actionLoading[`update-${resume.id}`] ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4" />
          )}
          <span>Update</span>
        </button>

        {/* Send Email */}
        <button
          onClick={() =>
            handleSendEmail(
              resume.id,
              resume.metadata.name,
              resume.metadata.email
            )
          }
          disabled={
            actionLoading[`email-${resume.id}`] || !resume.metadata.email
          }
          className="col-span-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center space-x-2 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {actionLoading[`email-${resume.id}`] ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Mail className="w-4 h-4" />
          )}
          <span>Email</span>
        </button>

        {/* Schedule Meeting */}
        <button
          onClick={() => handleScheduleMeeting(resume.id, resume.metadata.name)}
          disabled={actionLoading[`meeting-${resume.id}`]}
          className="col-span-1 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center space-x-2 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {actionLoading[`meeting-${resume.id}`] ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Calendar className="w-4 h-4" />
          )}
          <span>Schedule</span>
        </button>
      </div>
    </div>
  );

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
          <div className="hidden md:flex items-center space-x-2 text-sm text-gray-500">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>AI Powered</span>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        <div className="max-w-5xl mx-auto space-y-6">
          {messages.map((message, index) => (
            <div
              key={message.id}
              className={`flex items-start space-x-4 ${
                message.type === "user"
                  ? "flex-row-reverse space-x-reverse"
                  : ""
              } animate-in slide-in-from-bottom-4 duration-300`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Enhanced Avatar */}
              <div
                className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center shadow-lg ${
                  message.type === "user"
                    ? "bg-gradient-to-r from-green-500 to-emerald-600"
                    : "bg-gradient-to-r from-blue-500 to-purple-600"
                }`}
              >
                {message.type === "user" ? (
                  <User className="w-5 h-5 text-white" />
                ) : (
                  <Bot className="w-5 h-5 text-white" />
                )}
              </div>

              {/* Message Content */}
              <div
                className={`flex-1 ${
                  message.type === "user" ? "text-right" : "text-left"
                }`}
              >
                {message.type === "user" ? (
                  <div className="inline-block px-5 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl shadow-lg max-w-xs sm:max-w-md md:max-w-lg">
                    <p className="text-sm leading-relaxed">{message.content}</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="inline-block px-5 py-4 bg-white border border-gray-200 rounded-2xl shadow-sm max-w-full">
                      {message.shouldType ? (
                        <TypewriterText
                          text={message.content}
                          messageId={message.id}
                        />
                      ) : (
                        <p className="text-sm leading-relaxed text-gray-800">
                          {message.content}
                        </p>
                      )}
                    </div>

                    {/* Resume Results */}
                    {message.resumes &&
                      message.resumes.length > 0 &&
                      isTypingComplete && (
                        <motion.div
                          className="grid gap-6 mt-6"
                          initial="hidden"
                          animate="visible"
                          variants={{
                            visible: {
                              transition: {
                                staggerChildren: 0.1,
                              },
                            },
                          }}
                        >
                          {message.resumes.map((resume, index) => (
                            <motion.div
                              key={resume.id}
                              variants={{
                                hidden: {
                                  opacity: 0,
                                  y: 20,
                                  scale: 0.95,
                                },
                                visible: {
                                  opacity: 1,
                                  y: 0,
                                  scale: 1,
                                  transition: {
                                    duration: 0.4,
                                    ease: "easeOut",
                                  },
                                },
                              }}
                            >
                              <ResumeCard resume={resume} />
                            </motion.div>
                          ))}
                        </motion.div>
                      )}
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-2 px-1">
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ))}

          {/* Enhanced Loading indicator */}
          {isLoading && (
            <div className="flex items-start space-x-4 animate-in slide-in-from-bottom-4 duration-300">
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <div className="inline-block px-6 py-5 bg-white border border-gray-200 rounded-2xl shadow-sm">
                  <div className="flex items-center space-x-4">
                    <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {searchProgress.stage || "Processing your request..."}
                      </p>
                      {searchProgress.count > 0 && (
                        <p className="text-xs text-gray-600 mt-1">
                          Processed {searchProgress.count.toLocaleString()}{" "}
                          resumes
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-1 mt-4">
                    <div
                      className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Enhanced Input Form */}
      <div className="bg-white border-t border-gray-200 px-4 py-5 shadow-lg">
        <div className="max-w-5xl mx-auto">
          <div className="relative">
            <div className="flex items-end space-x-4">
              <div className="flex-1 relative">
                <textarea
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
                  className="w-full px-5 py-4 pr-14 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm transition-all duration-200 shadow-sm"
                  rows={1}
                  style={{
                    minHeight: "56px",
                    maxHeight: "120px",
                  }}
                  onInput={(e) => {
                    inputValue.current = e.target.value;
                    e.target.style.height = "auto";
                    e.target.style.height =
                      Math.min(e.target.scrollHeight, 120) + "px";
                  }}
                  disabled={isLoading}
                />
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="absolute right-3 bottom-4 p-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-500 text-center mt-3">
            Press Enter to search • Shift + Enter for new line • Powered by AI
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResumeSearchChatBot;
