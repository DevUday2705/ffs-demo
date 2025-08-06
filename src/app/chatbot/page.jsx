"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  Bot,
  User,
  Loader2,
  Download,
  ExternalLink,
  GraduationCap,
  Code,
  Clock,
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
  const [completedAnimations, setCompletedAnimations] = useState(new Set([1])); // Track completed animations, start with initial message
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const inputValue = useRef(""); // Use ref for input value to avoid re-renders

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Mock resume data - replace with actual API response
  const fetchResumesFromAPI = async (query) => {
    try {
      const response = await fetch("/api/resume-search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch resumes");
      }

      const data = await response.json();

      return data?.ranked_resumes || []; // Adjust key if needed
    } catch (error) {
      console.error("Error fetching resumes:", error);
      throw error;
    }
  };

  // Simulated API call with progress updates
  const searchResumes = async (query) => {
    const stages = [
      { stage: "Initializing search...", delay: 1000 },
      { stage: "Fetching resumes from database...", delay: 3000 },
      { stage: "Scanning resumes database...", delay: 4000, count: 1247 },
      { stage: "Analyzing skills and experience...", delay: 3000, count: 892 },
      { stage: "Applying AI matching algorithms...", delay: 3000, count: 156 },
      {
        stage: "Ranking and shortlisting candidates...",
        delay: 2000,
        count: 25,
      },
      { stage: "Finalizing results...", delay: 1500 },
    ];

    for (const { stage, delay, count } of stages) {
      setSearchProgress({ stage, count: count || 0 });
      await new Promise((resolve) => setTimeout(resolve, delay));
    }

    // Fetch actual data from API
    const resumeData = await fetchResumesFromAPI(query);
    return resumeData;
  };

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

    setIsTypingComplete(false); // Add this line before setMessages
    setMessages((prev) => [...prev, userMessage]);

    // Clear input
    inputValue.current = "";
    if (inputRef.current) {
      inputRef.current.value = "";
      inputRef.current.style.height = "auto";
    }

    setIsLoading(true);
    setSearchProgress({ stage: "", count: 0 });

    try {
      const resumes = await searchResumes(currentInput);
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

  const handleDownload = (resumeUrl, candidateName) => {
    window.open(resumeUrl);
  };

  const TypewriterText = ({ text, messageId }) => {
    const [displayText, setDisplayText] = useState("");
    const [currentIndex, setCurrentIndex] = useState(0);

    // Check if this message should animate
    const shouldAnimate = !completedAnimations.has(messageId);

    useEffect(() => {
      if (shouldAnimate) {
        setDisplayText("");
        setCurrentIndex(0);
      } else {
        // If animation is already completed, show full text immediately
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
        // Mark animation as completed
        setCompletedAnimations((prev) => new Set([...prev, messageId]));
        // Add this line:
        setIsTypingComplete(true);
      }
    }, [currentIndex, text, shouldAnimate, messageId]);

    return (
      <span>
        {displayText}
        {shouldAnimate && currentIndex < text.length && (
          <span className="inline-block w-0.5 h-4 bg-gray-400 ml-1 animate-pulse" />
        )}
      </span>
    );
  };

  const ResumeCard = ({ resume }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 text-lg">
            {resume.metadata.name}
          </h3>
          <div className="flex items-center text-sm text-gray-600 mt-1">
            <Clock className="w-4 h-4 mr-1" />
            {resume.experience} experience
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
            {Math.floor(resume.metadata.relevance_score * 100)}% match
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-start space-x-2">
          <Code className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm text-gray-600 mb-1">Skills</p>
            <div className="flex flex-wrap gap-1">
              {resume.metadata.skills.map((skill, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-start space-x-2">
          <GraduationCap className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm text-gray-600 mb-1">Education</p>
            <p className="text-sm text-gray-800">{resume.metadata.education}</p>
          </div>
        </div>

        <div className="flex space-x-2 pt-2">
          <button className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center space-x-1">
            <Download className="w-4 h-4" />
            <a target="_blank" href={resume.metadata.download_url}>
              <span>Download</span>
            </a>
          </button>
          <button
            onClick={() => window.open(resume.resumeUrl, "_blank")}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center space-x-1"
          >
            <ExternalLink className="w-4 h-4" />
            <span>View</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">
              AI Resume Search
            </h1>
            <p className="text-sm text-gray-500">
              Find the perfect candidates instantly
            </p>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((message, index) => (
            <div
              key={message.id}
              className={`flex items-start space-x-3 ${
                message.type === "user"
                  ? "flex-row-reverse space-x-reverse"
                  : ""
              } animate-in slide-in-from-bottom-4 duration-300`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Avatar */}
              <div
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  message.type === "user"
                    ? "bg-gradient-to-r from-green-500 to-emerald-600"
                    : "bg-gradient-to-r from-blue-500 to-purple-600"
                }`}
              >
                {message.type === "user" ? (
                  <User className="w-4 h-4 text-white" />
                ) : (
                  <Bot className="w-4 h-4 text-white" />
                )}
              </div>

              {/* Message Content */}
              <div
                className={`flex-1 ${
                  message.type === "user" ? "text-right" : "text-left"
                }`}
              >
                {message.type === "user" ? (
                  <div className="inline-block px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl shadow-sm max-w-xs sm:max-w-md md:max-w-lg">
                    <p className="text-sm leading-relaxed">{message.content}</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="inline-block px-4 py-3 bg-white border border-gray-200 rounded-2xl shadow-sm max-w-full">
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
                          className="grid gap-4 mt-4"
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
                <p className="text-xs text-gray-500 mt-1 px-1">
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ))}

          {/* Enhanced Loading indicator with progress */}
          {isLoading && (
            <div className="flex items-start space-x-3 animate-in slide-in-from-bottom-4 duration-300">
              <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <div className="inline-block px-6 py-4 bg-white border border-gray-200 rounded-2xl shadow-sm">
                  <div className="flex items-center space-x-3">
                    <Loader2 className="w-5 h-5 animate-spin text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {searchProgress.stage || "Processing your request..."}
                      </p>
                      {searchProgress.count > 0 && (
                        <p className="text-xs text-gray-500 mt-1">
                          Processed {searchProgress.count} resumes
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-1 mt-3">
                    <div
                      className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
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

      {/* Input Form */}
      <div className="bg-white border-t border-gray-200 px-4 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <div className="flex items-end space-x-3">
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
                  className="w-full px-4 py-3 pr-12 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm transition-all duration-200"
                  rows={1}
                  style={{
                    minHeight: "48px",
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
                  className="absolute right-2 bottom-4 p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-500 text-center mt-2">
            Press Enter to search, Shift + Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResumeSearchChatBot;
