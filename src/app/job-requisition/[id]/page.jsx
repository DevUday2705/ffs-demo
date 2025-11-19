"use client";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Calendar,
  Users,
  Target,
  FileText,
  Briefcase,
  Clock,
  Building,
  User,
  Mail,
  Phone,
  Copy,
  ArrowLeft,
  Share2,
  CheckCircle,
  Star,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";

const JobRequisitionPage = () => {
  const params = useParams();
  const router = useRouter();
  const jrId = params?.id || "JR-123456";

  // Sample job details - in real app, this would be fetched based on jrId
  const jobDetails = {
    "Job Title": "Senior React Developer",
    "Job Description":
      "We are looking for a skilled Senior React Developer to join our dynamic team. The ideal candidate will be responsible for developing and maintaining robust web applications using React and working closely with cross-functional teams to deliver high-quality software solutions.\n\nKey Responsibilities:\n• Develop and maintain web applications using React and modern JavaScript\n• Collaborate with designers and product managers to implement user-friendly interfaces\n• Write clean, maintainable, and efficient code\n• Participate in code reviews and contribute to team best practices\n• Optimize applications for maximum speed and scalability\n• Stay up-to-date with the latest React developments and industry trends\n\nWe offer competitive compensation, comprehensive benefits, and opportunities for professional growth in a collaborative environment.",
    Location: ["Mumbai", "Pune", "Remote"],
    "Skills Required": ["React", "JavaScript", "TypeScript", "HTML", "CSS"],
    "Skills Optional": ["Redux", "Next.js", "Node.js", "GraphQL"],
    Experience: [3, 7],
    "Resume Count": 10,
    "Match Threshold": 75,
  };

  const postedDate = new Date().toLocaleDateString();
  const expiryDate = new Date(
    Date.now() + 30 * 24 * 60 * 60 * 1000
  ).toLocaleDateString();

  const handleCopyLink = () => {
    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl);
    toast.success("Link Copied!", {
      description: "Job requisition link has been copied to clipboard.",
      duration: 3000,
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${jobDetails["Job Title"]} - Job Requisition`,
        text: `Check out this job opportunity: ${jobDetails["Job Title"]}`,
        url: window.location.href,
      });
    } else {
      handleCopyLink();
    }
  };

  const handleApply = () => {
    toast.success("Application Started", {
      description: "Redirecting to application form...",
      duration: 3000,
    });
    // In real app, redirect to application form
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
            <div className="flex items-center space-x-4 sm:space-x-6 w-full sm:w-auto">
              <Button
                onClick={() => router.back()}
                variant="outline"
                size="sm"
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Back</span>
              </Button>
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Briefcase className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                    Job Requisition
                  </h1>
                  <p className="text-sm sm:text-base text-gray-600">
                    ID: <span className="font-mono text-blue-600">{jrId}</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-3 w-full sm:w-auto justify-end">
              <Button
                onClick={handleShare}
                variant="outline"
                size="sm"
                className="flex items-center space-x-2"
              >
                <Share2 className="w-4 h-4" />
                <span className="hidden sm:inline">Share</span>
              </Button>
              <Button
                onClick={handleCopyLink}
                variant="outline"
                size="sm"
                className="flex items-center space-x-2"
              >
                <Copy className="w-4 h-4" />
                <span className="hidden lg:inline">Copy Link</span>
              </Button>
              <Button
                onClick={handleApply}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700"
              >
                <User className="w-4 h-4" />
                <span>Apply Now</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="space-y-8 sm:space-y-12">
          {/* Job Overview */}
          <Card className="border-l-4 py-4 border-l-blue-500 shadow-lg">
            <CardHeader className="pb-6 sm:pb-8">
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                <div className="space-y-4 flex-1">
                  <div>
                    <CardTitle className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
                      {jobDetails["Job Title"]}
                    </CardTitle>
                    <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-6 text-gray-600">
                      <div className="flex items-center space-x-2">
                        <Building className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                        <span className="font-medium">TechCorp Inc.</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                        <span className="text-sm sm:text-base">
                          Posted {postedDate}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                        <span className="text-sm sm:text-base">
                          Deadline {expiryDate}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 pt-4">
                    <Badge className="bg-green-100 text-green-800 border-green-200 px-3 py-1.5">
                      <CheckCircle className="w-3 h-3 mr-1.5" />
                      Active Hiring
                    </Badge>
                    <Badge className="bg-blue-100 text-blue-800 border-blue-200 px-3 py-1.5">
                      <Star className="w-3 h-3 mr-1.5" />
                      Premium Role
                    </Badge>
                    <Badge className="bg-purple-100 text-purple-800 border-purple-200 px-3 py-1.5">
                      <TrendingUp className="w-3 h-3 mr-1.5" />
                      High Growth
                    </Badge>
                  </div>
                </div>
                <div className="flex lg:flex-col items-start lg:items-end gap-4 lg:space-y-3 lg:text-right">
                  <Badge className="bg-green-100 text-green-800 border-green-200 px-4 py-2 text-sm font-semibold">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Active
                  </Badge>
                  <div className="text-sm text-gray-600">
                    Priority:{" "}
                    <span className="font-semibold text-red-600 bg-red-50 px-2 py-1 rounded">
                      High
                    </span>
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Job Description */}
          <Card className="shadow-lg">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center space-x-3 text-xl sm:text-2xl">
                <FileText className="w-6 h-6 text-blue-600" />
                <span className="text-gray-900">About This Role</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-6 sm:p-8 rounded-lg border">
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed text-base sm:text-lg">
                  {jobDetails["Job Description"]}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Requirements Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {/* Locations */}
            <Card className="shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-3 text-lg sm:text-xl">
                  <MapPin className="w-5 h-5 text-green-600" />
                  <span className="text-gray-900">Work Locations</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  {jobDetails["Location"].map((location, index) => (
                    <Badge
                      key={index}
                      className="bg-green-100 text-green-800 border-green-200 hover:bg-green-200 px-4 py-2 text-sm font-medium"
                    >
                      <MapPin className="w-3 h-3 mr-2" />
                      {location}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Experience */}
            <Card className="shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-3 text-lg sm:text-xl">
                  <Calendar className="w-5 h-5 text-purple-600" />
                  <span className="text-gray-900">Experience Required</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-purple-50 p-6 sm:p-8 rounded-lg text-center border">
                  <p className="text-3xl sm:text-4xl font-bold text-purple-800 mb-2">
                    {jobDetails["Experience"][0]} -{" "}
                    {jobDetails["Experience"][1]}
                  </p>
                  <p className="text-purple-600 font-medium text-sm sm:text-base">
                    Years of Experience
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Skills Requirements */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {/* Required Skills */}
            <Card className="shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-3 text-lg sm:text-xl">
                  <Target className="w-5 h-5 text-red-600" />
                  <span className="text-gray-900">Required Skills</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  {jobDetails["Skills Required"].map((skill, index) => (
                    <Badge
                      key={index}
                      className="bg-red-100 text-red-800 border-red-200 hover:bg-red-200 px-4 py-2 text-sm font-medium"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Preferred Skills */}
            <Card className="shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-3 text-lg sm:text-xl">
                  <Target className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-900">Preferred Skills</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  {jobDetails["Skills Optional"].map((skill, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 px-4 py-2 text-sm font-medium"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Hiring Information */}
          <Card className="shadow-lg">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center space-x-3 text-xl sm:text-2xl">
                <Users className="w-6 h-6 text-blue-600" />
                <span className="text-gray-900">Hiring Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <div className="text-center p-6 bg-blue-50 rounded-lg border border-blue-200">
                  <Users className="w-10 h-10 text-blue-600 mx-auto mb-3" />
                  <p className="text-2xl sm:text-3xl font-bold text-blue-800 mb-1">
                    {jobDetails["Resume Count"]}
                  </p>
                  <p className="text-xs sm:text-sm text-blue-600 font-medium">
                    Target Hires
                  </p>
                </div>
                <div className="text-center p-6 bg-green-50 rounded-lg border border-green-200">
                  <Target className="w-10 h-10 text-green-600 mx-auto mb-3" />
                  <p className="text-2xl sm:text-3xl font-bold text-green-800 mb-1">
                    {jobDetails["Match Threshold"]}%
                  </p>
                  <p className="text-xs sm:text-sm text-green-600 font-medium">
                    Match Threshold
                  </p>
                </div>
                <div className="text-center p-6 bg-purple-50 rounded-lg border border-purple-200">
                  <Briefcase className="w-10 h-10 text-purple-600 mx-auto mb-3" />
                  <p className="text-2xl sm:text-3xl font-bold text-purple-800 mb-1">
                    Full-time
                  </p>
                  <p className="text-xs sm:text-sm text-purple-600 font-medium">
                    Employment Type
                  </p>
                </div>
                <div className="text-center p-6 bg-orange-50 rounded-lg border border-orange-200">
                  <Clock className="w-10 h-10 text-orange-600 mx-auto mb-3" />
                  <p className="text-2xl sm:text-3xl font-bold text-orange-800 mb-1">
                    30
                  </p>
                  <p className="text-xs sm:text-sm text-orange-600 font-medium">
                    Days to Apply
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="shadow-lg">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center space-x-3 text-xl sm:text-2xl">
                <User className="w-6 h-6 text-blue-600" />
                <span className="text-gray-900">Contact Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                <div className="flex items-center space-x-4 p-6 bg-gray-50 rounded-lg border">
                  <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center">
                    <Mail className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-lg">John Doe</p>
                    <p className="text-sm text-gray-600 mb-1 font-medium">
                      Hiring Manager
                    </p>
                    <p className="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer font-medium">
                      john.doe@techcorp.com
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 p-6 bg-gray-50 rounded-lg border">
                  <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
                    <Phone className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-lg">
                      HR Department
                    </p>
                    <p className="text-sm text-gray-600 mb-1 font-medium">
                      Human Resources
                    </p>
                    <p className="text-green-600 font-medium">
                      +1 (555) 123-4567
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Call to Action */}
          <Card className="bg-black text-black shadow-lg">
            <CardContent className="text-center py-12 sm:py-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Ready to Join Our Team?
              </h2>
              <p className="text-lg sm:text-xl mb-8 sm:mb-10 opacity-90 max-w-2xl mx-auto">
                Take the next step in your career and make a meaningful impact
                in the tech industry
              </p>
              <Button
                onClick={handleApply}
                size="lg"
                className="bg-black text-blue-600 hover:bg-gray-100 px-8 sm:px-10 py-3 sm:py-4 text-lg font-semibold"
              >
                <User className="w-5 h-5 mr-2" />
                Apply for this Position
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default JobRequisitionPage;
