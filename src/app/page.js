"use client";
import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useInitializeUser, useResendOTP, useSendOTP, useValidateOTP } from '@/hooks/useApi';
import { storage } from '@/shared/utils';
import { resendOTP } from './utils/api';

const LoginPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reqno = searchParams.get('reqno'); // Get reqno from URL parameter

  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [countdown, setCountdown] = useState(0);
  // React Query: initialize user
  const {
    data: userInitData,
    isLoading: isLoadingUser,
    error: userInitError,
    isSuccess: isUserInitSuccess
  } = useInitializeUser(reqno);

  // React Query: send OTP
  const sendOTPMutation = useSendOTP();
  // React Query: send OTP

  // React Query: validate OTP
  const validateOTPMutation = useValidateOTP();

  // Set email/mobile from userInitData
  useEffect(() => {
    if (userInitData?.success && userInitData.data) {
      setEmail(userInitData.data.CustEmail);
      setMobile(userInitData.data.CustMobile);
      setSuccess('Ready to login!');
      // Store in localStorage for session
      storage.setDecryptedID(userInitData.decryptedID);
      storage.setUserData(userInitData.data);
    } else if (userInitError) {
      setError(userInitError.message || 'Failed to load user data');
    }
  }, [userInitData, userInitError]);

  useEffect(() => {
    if (!reqno) {
      setError('Invalid login link. Please use the correct access link.');
    }
  }, [reqno]);


  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSendOtp = async () => {
    setError('');
    setSuccess('');
    setIsLoading(true);
    try {
      await sendOTPMutation.mutateAsync(reqno);
      setIsOtpSent(true);
      setCountdown(30);
      setSuccess('OTP sent successfully!');
    } catch (err) {
      setError(err.message || 'Error sending OTP');
    } finally {
      setIsLoading(false);
    }
  };


  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };
  const handleVerifyOtp = async () => {
    const otpValue = otp.join('');
    if (otpValue.length !== 6) {
      setError('Please enter complete OTP');
      return;
    }
    setIsVerifying(true);
    setError('');
    setSuccess('');
    try {
      const userData = storage.getUserData();
      if (!userData) {
        throw new Error('Session expired. Please refresh and try again.');
      }
      const result = await validateOTPMutation.mutateAsync({ reqNo: userData?.ReqNo, otp: otpValue });
      if (result.data?.value?.message !== 'Valid') {
        throw new Error(result.error || 'OTP verification failed');
      }
      setSuccess('Login successful! Redirecting...');
      setTimeout(() => router.push('/dashboard'), 1500);
    } catch (err) {
      setError(err.message || 'OTP verification failed');
    } finally {
      setIsVerifying(false);
    }
  };
  const handleBack = () => {
    setIsOtpSent(false);
    setOtp(['', '', '', '', '', '']);
    setError('');
    setSuccess('');
  };

  // Show loading while fetching user data
  if (isLoadingUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-xl">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-4" />
            <p className="text-gray-600">Loading your details...</p>
          </CardContent>
        </Card>
      </div>
    );
  }
  if (userInitError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-xl">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Alert className="border-red-200 bg-red-50 mb-4">
              <AlertDescription className="text-red-800">{userInitError.message || 'Failed to load user data'}</AlertDescription>
            </Alert>
            <p className="text-gray-600">Please check your login link or try again later.</p>
          </CardContent>
        </Card>
      </div>
    );
  }


  // const testAPI = async () => {
  //   console.log('Testing API...');
  //   const result = await fetch('/api/initialize-user', {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({ reqno: 'U2FsdGVkX18Ax1VBSDXemIe6HgAXlswQcp7OEVSyayyD66FD-5kmCgPzmKHKU-YS' }),
  //   });
  //   const data = await result.json();
  //   console.log('Test result:', data);
  // };
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      {/* <button onClick={testAPI}>Test API</button> */}
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">
            {isOtpSent ? 'Verify OTP' : 'Sign In'}
          </CardTitle>
          <CardDescription className="text-gray-600">
            {isOtpSent
              ? 'Enter the 6-digit code sent to your contact'
              : 'Your details are pre-filled. Click Send OTP to continue.'
            }
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertDescription className="text-red-800">{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-200 bg-green-50">
              <AlertDescription className="text-green-800">{success}</AlertDescription>
            </Alert>
          )}

          {!isOtpSent ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Email Address</Label>
                <Input
                  type="email"
                  value={email}
                  readOnly
                  className="h-12"
                  placeholder={isLoadingUser ? "Loading..." : "Enter email address"}
                // Disabled during loading or when email has value
                />
              </div>

              <div className="space-y-2">
                <Label>Mobile Number</Label>
                <Input
                  type="tel"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="h-12"
                  readOnly
                  placeholder={isLoadingUser ? "Loading..." : "Enter mobile number"}

                />
              </div>

              <Button
                onClick={handleSendOtp}
                className="w-full h-12"
                disabled={isLoading || isLoadingUser || (!email && !mobile)}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending OTP...
                  </>
                ) : isLoadingUser ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Loading...
                  </>
                ) : (
                  'Send OTP'
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <Button
                variant="ghost"
                onClick={handleBack}
                className="flex items-center gap-2 p-0 h-auto text-gray-600"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>

              <div className="space-y-4">
                <Label className="text-center block">Enter 6-digit OTP</Label>
                <div className="flex gap-2 justify-center">
                  {otp.map((digit, index) => (
                    <Input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className="w-12 h-12 text-center text-lg font-bold"
                    />
                  ))}
                </div>
              </div>

              <Button
                onClick={handleVerifyOtp}
                className="w-full h-12"
                disabled={isVerifying}
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  'Verify & Login'
                )}
              </Button>

              <div className="text-center">
                <Button
                  variant="link"
                  onClick={() => countdown === 0 && handleSendOtp()}
                  disabled={countdown > 0}

                  className="text-sm"
                >
                  {countdown > 0 ? `Resend in ${countdown}s` : 'Resend OTP'}
                </Button>
              </div>
            </div>
          )}

          <div className="text-center text-sm text-gray-500 pt-4 border-t">
            <p>Demo: Use OTP <span className="font-mono font-bold">123456</span></p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default function Page() {
  return (
    <Suspense fallback={<div className="p-4 text-gray-500">Loading login...</div>}>
      <LoginPage />
    </Suspense>
  );
}