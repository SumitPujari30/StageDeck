import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, ArrowLeft, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { OTPInput } from '@/components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { ADMIN_CONFIRM_EMAIL } from '@/utils/constants';
import authService from '@/services/auth.service';

/**
 * Admin OTP verification page
 */

export const AdminVerifyOTP: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  
  const email = location.state?.email || '';
  
  useEffect(() => {
    if (!email) {
      navigate('/auth/admin/register');
      return;
    }
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [email, navigate]);
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  const handleVerify = async () => {
    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }
    
    try {
      setError('');
      setIsVerifying(true);
      
      // Verify OTP
      const response = await authService.verifyAdminOTP(email, otp);
      
      if (response.verified) {
        // Get the pending admin data
        const pendingData = sessionStorage.getItem('pendingAdminData');
        if (pendingData) {
          const adminData = JSON.parse(pendingData);
          // Complete registration (in a real app, this would be another API call)
          // For now, redirect to login
          sessionStorage.removeItem('pendingAdminData');
          navigate('/auth/admin/login', {
            state: { message: 'Admin account created successfully! Please login.' }
          });
        }
      }
    } catch (err: any) {
      setError(err.message || 'Invalid OTP');
    } finally {
      setIsVerifying(false);
    }
  };
  
  const handleResend = async () => {
    try {
      setError('');
      const pendingData = sessionStorage.getItem('pendingAdminData');
      if (pendingData) {
        const adminData = JSON.parse(pendingData);
        await authService.requestAdminOTP(adminData);
        setTimeLeft(300);
        setOtp('');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to resend OTP');
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-pink-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-soft-lg">
          <CardHeader className="space-y-1 text-center">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white mb-4">
              <Shield className="w-8 h-8" />
            </div>
            <CardTitle className="text-2xl font-bold">Verify OTP</CardTitle>
            <CardDescription>
              Enter the 6-digit code sent to the admin email
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Email display */}
            <div className="p-4 rounded-xl bg-purple-50 border border-purple-200 text-center">
              <p className="text-sm text-purple-700 mb-1">OTP sent to:</p>
              <p className="text-sm font-mono font-bold text-purple-900">
                {ADMIN_CONFIRM_EMAIL}
              </p>
            </div>
            
            {error && (
              <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm text-center">
                {error}
              </div>
            )}
            
            {/* OTP Input */}
            <div className="flex justify-center">
              <OTPInput
                value={otp}
                onChange={setOtp}
                length={6}
                error={error ? ' ' : undefined}
              />
            </div>
            
            {/* Timer */}
            <div className="text-center">
              {timeLeft > 0 ? (
                <p className="text-sm text-gray-600">
                  Code expires in{' '}
                  <span className="font-semibold text-purple-600">
                    {formatTime(timeLeft)}
                  </span>
                </p>
              ) : (
                <p className="text-sm text-red-600">
                  OTP expired. Please request a new one.
                </p>
              )}
            </div>
            
            {/* Actions */}
            <div className="space-y-3">
              <Button
                onClick={handleVerify}
                className="w-full"
                size="lg"
                variant="gradient"
                loading={isVerifying}
                disabled={otp.length !== 6 || timeLeft === 0}
              >
                Verify & Create Account
              </Button>
              
              <Button
                onClick={handleResend}
                variant="outline"
                className="w-full"
                disabled={timeLeft > 0}
                leftIcon={<RefreshCw className="w-4 h-4" />}
              >
                Resend OTP
              </Button>
              
              <Button
                onClick={() => navigate('/auth/admin/register')}
                variant="ghost"
                className="w-full"
                leftIcon={<ArrowLeft className="w-4 h-4" />}
              >
                Back to Registration
              </Button>
            </div>
            
            {/* Info */}
            <div className="text-center">
              <p className="text-xs text-gray-500">
                Didn't receive the code? Check your spam folder or contact support.
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
