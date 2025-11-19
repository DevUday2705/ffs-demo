"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Eye,
  EyeOff,
  User,
  Lock,
  Bot,
  CheckCircle,
  Users,
  Search,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    selectedRole: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [roleSelectionRequired, setRoleSelectionRequired] = useState(false);
  const [availableRoles, setAvailableRoles] = useState([]);
  const [roleSelectionMessage, setRoleSelectionMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Simple validation for demo
    if (!formData.username || !formData.password) {
      setError("Please fill in all fields");
      setIsLoading(false);
      return;
    }

    // If role selection is required but no role selected
    if (roleSelectionRequired && !formData.selectedRole) {
      setError("Please select a role to continue");
      setIsLoading(false);
      return;
    }

    try {
      const payload = {
        email_id: formData.username,
        password: formData.password,
      };

      // Add agent_type if role is selected (second call)
      if (roleSelectionRequired && formData.selectedRole) {
        payload.agent_type = formData.selectedRole;
      }

      console.log("Sending login request:", payload);

      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log("Login API response:", data);

      if (!response.ok) {
        setError(data.message || data.error || "Login failed");
        setIsLoading(false);
        return;
      }

      // Handle role selection required
      if (data.role_selection_required) {
        setRoleSelectionRequired(true);
        setAvailableRoles(data.available_roles || []);
        setRoleSelectionMessage(
          data.message || "Multiple roles found. Please select one."
        );
        setIsLoading(false);
        return;
      }

      // Handle successful login
      if (data.success && data.session_id) {
        // Store user data in localStorage
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userEmail", data.email);
        localStorage.setItem("userRole", data.role);
        localStorage.setItem("userRoleLabel", data.roleLabel);
        localStorage.setItem("sessionId", data.session_id);
        localStorage.setItem("isAuthenticated", "true");

        // Simulate loading before redirect
        setTimeout(() => {
          router.push("/chatbot");
        }, 1000);
      } else {
        setError("Login failed. Please try again.");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Network error. Please try again.");
      setIsLoading(false);
    }
  };

  const features = [
    {
      icon: Search,
      title: "Smart Search",
      description: "AI-powered resume matching",
    },
    {
      icon: Users,
      title: "Candidate Management",
      description: "Organize and track applicants",
    },
    {
      icon: Zap,
      title: "Instant Results",
      description: "Get matches in seconds",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding & Features */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden lg:block space-y-8"
        >
          {/* Logo & Title */}
          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Bot className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  RecDXAI
                </h1>
                <p className="text-gray-600 text-sm">
                  AI-powered Recruitment & Onboarding.
                </p>
              </div>
            </div>
            <p className="text-gray-700 text-lg leading-relaxed max-w-md">
              Transform your hiring process with AI-powered tool for recruitment
              and onboarding.
            </p>
          </div>

          {/* Features */}
          <div className="space-y-4">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                className="flex items-center space-x-4 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/40"
              >
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                  <feature.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">10K+</div>
              <div className="text-sm text-gray-600">Resumes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">95%</div>
              <div className="text-sm text-gray-600">Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">2s</div>
              <div className="text-sm text-gray-600">Avg. Search</div>
            </div>
          </div>
        </motion.div>

        {/* Right Side - Login Form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md mx-auto"
        >
          <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-4 lg:hidden">
                <Bot className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Welcome Back
              </CardTitle>
              <CardDescription className="text-gray-600">
                Sign in to access your AI Resume Search Assistant
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Username Field */}
                <div className="space-y-2">
                  <Label
                    htmlFor="username"
                    className="text-sm font-medium text-gray-700"
                  >
                    Email
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="username"
                      type="email"
                      value={formData.username}
                      onChange={(e) =>
                        setFormData({ ...formData, username: e.target.value })
                      }
                      placeholder="Enter your email"
                      className="pl-10 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="text-sm font-medium text-gray-700"
                  >
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      placeholder="Enter your password"
                      className="pl-10 pr-10 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Role Selection (shown when multiple roles are available) */}
                {roleSelectionRequired && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ duration: 0.3 }}
                    className="space-y-3"
                  >
                    <Label className="text-sm font-medium text-gray-700">
                      Select Role
                    </Label>
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 text-sm mb-3">
                      {roleSelectionMessage}
                    </div>
                    <div className="space-y-2">
                      {availableRoles.map((role) => (
                        <label
                          key={role}
                          className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                        >
                          <input
                            type="radio"
                            name="role"
                            value={role}
                            checked={formData.selectedRole === role}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                selectedRole: e.target.value,
                              })
                            }
                            className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                          />
                          <span className="text-sm font-medium text-gray-700 capitalize">
                            {role.replace("_", " ")}
                          </span>
                        </label>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm"
                  >
                    {error}
                  </motion.div>
                )}

                {/* Demo Credentials */}
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 text-sm">
                  <div className="flex items-center space-x-2 mb-1">
                    <CheckCircle className="w-4 h-4" />
                    <span className="font-medium">Demo Credentials:</span>
                  </div>
                  <div className="text-xs space-y-1 ml-6">
                    <div>
                      Single Role:{" "}
                      <code className="bg-blue-100 px-1 rounded">
                        alok.raj@sumodigitech.com
                      </code>
                    </div>
                    <div>
                      Multi Role:{" "}
                      <code className="bg-blue-100 px-1 rounded">
                        uday.kulkarni@sumodigitech.com
                      </code>
                    </div>
                    <div>
                      Password:{" "}
                      <code className="bg-blue-100 px-1 rounded">password</code>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-200"
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>

              {/* Footer */}
              <div className="mt-6 text-center">
                <p className="text-xs text-gray-500">
                  Powered by AI • Secure • Fast
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
