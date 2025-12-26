import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { OTPInput } from '@/components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { useAuth } from '@/hooks/useAuth';

/**
 * User OTP verification page
 */

export const UserVerifyOTP: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyUserOTP } = useAuth();
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  
  const email = location.state?.email || sessionStorage.getItem('pendingUserEmail') || '';
  
  useEffect(() => {
    if (!email) {
      navigate('/auth/user/register');
      return;
    }
    
    // Store email in sessionStorage as backup
    sessionStorage.setItem('pendingUserEmail', email);
    
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
      
      // Verify OTP - this will automatically log in the user
      await verifyUserOTP(email, otp);
      
      // Clear the pending email
      sessionStorage.removeItem('pendingUserEmail');
      
      // Navigate to dashboard
      navigate('/user/dashboard');
    } catch (err: any) {
      setError(err.message || 'Invalid OTP. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };
  
  const handleResend = async () => {
    try {
      setError('');
      setIsResending(true);
      
      // Import authService dynamically to avoid circular dependency
      const { default: authService } = await import('@/services/auth.service');
      
      // Resend OTP by calling register again with the same email
      await authService.resendUserOTP(email);
      
      setTimeLeft(600);
      setOtp('');
      setError('');
      
      // Show success message briefly
      const successDiv = document.getElementById('success-message');
      if (successDiv) {
        successDiv.classList.remove('hidden');
        setTimeout(() => successDiv.classList.add('hidden'), 3000);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to resend OTP');
    } finally {
      setIsResending(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-soft-lg">
          <CardHeader className="space-y-1 text-center">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white mb-4">
              <Mail className="w-8 h-8" />
            </div>
            <CardTitle className="text-2xl font-bold">Verify Your Email</CardTitle>
            <CardDescription>
              Enter the 6-digit code sent to your email
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Email display */}
            <div className="p-4 rounded-xl bg-primary-50 border border-primary-200 text-center">
              <p className="text-sm text-primary-700 mb-1">OTP sent to:</p>
              <p className="text-sm font-mono font-bold text-primary-900 break-all">
                {email}
              </p>
            </div>
            
            {/* Success message */}
            <div id="success-message" className="hidden p-3 rounded-lg bg-green-50 text-green-600 text-sm text-center">
              OTP resent successfully! Check your email.
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
                  <span className="font-semibold text-primary-600">
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
                Verify & Continue
              </Button>
              
              <Button
                onClick={handleResend}
                variant="outline"
                className="w-full"
                disabled={timeLeft > 0}
                loading={isResending}
                leftIcon={<RefreshCw className="w-4 h-4" />}
              >
                {timeLeft > 0 ? `Resend in ${formatTime(timeLeft)}` : 'Resend OTP'}
              </Button>
              
              <Button
                onClick={() => {
                  sessionStorage.removeItem('pendingUserEmail');
                  navigate('/auth/user/register');
                }}
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
                Didn't receive the code? Check your spam folder.
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
