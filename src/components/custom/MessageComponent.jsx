"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Bot } from "lucide-react";
import ResumeCard from "./ResumeCard";

const TypewriterText = ({
  text,
  messageId,
  completedAnimations,
  setCompletedAnimations,
  setIsTypingComplete,
}) => {
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
  }, [
    currentIndex,
    text,
    shouldAnimate,
    messageId,
    setCompletedAnimations,
    setIsTypingComplete,
  ]);

  return (
    <span>
      {displayText}
      {shouldAnimate && currentIndex < text.length && (
        <span className="inline-block w-0.5 h-4 bg-blue-500 ml-1 animate-pulse" />
      )}
    </span>
  );
};

const MessageComponent = ({
  message,
  index,
  completedAnimations,
  setCompletedAnimations,
  isTypingComplete,
  setIsTypingComplete,
  actionLoading,
  onUpdateResume,
  onSendEmail,
  onScheduleMeeting,
}) => {
  return (
    <div
      className={`flex items-start space-x-4 ${
        message.type === "user" ? "flex-row-reverse space-x-reverse" : ""
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
                  completedAnimations={completedAnimations}
                  setCompletedAnimations={setCompletedAnimations}
                  setIsTypingComplete={setIsTypingComplete}
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
                  {message.resumes.map((resume, resumeIndex) => (
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
                      <ResumeCard
                        resume={resume}
                        actionLoading={actionLoading}
                        onUpdateResume={onUpdateResume}
                        onSendEmail={onSendEmail}
                        onScheduleMeeting={onScheduleMeeting}
                      />
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
  );
};

export default MessageComponent;
