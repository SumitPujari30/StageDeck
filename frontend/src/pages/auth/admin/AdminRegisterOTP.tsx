import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, Shield, Info } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { adminRegisterSchema, type AdminRegisterInput, calculatePasswordStrength } from '@/utils/validators';
import { ADMIN_CONFIRM_EMAIL } from '@/utils/constants';
import { cn } from '@/utils/cn';
import authService from '@/services/auth.service';

/**
 * Admin registration page with OTP flow
 */

export const AdminRegisterOTP: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isOTPSent, setIsOTPSent] = useState(false);
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<AdminRegisterInput>({
    resolver: zodResolver(adminRegisterSchema),
  });
  
  const password = watch('password', '');
  const passwordStrength = calculatePasswordStrength(password);
  
  const onSubmit = async (data: AdminRegisterInput) => {
    try {
      setError('');
      // Request OTP for admin registration
      await authService.requestAdminOTP(data);
      // Store admin data for verification step
      sessionStorage.setItem('pendingAdminData', JSON.stringify(data));
      setIsOTPSent(true);
      // Navigate to OTP verification
      setTimeout(() => {
        navigate('/auth/admin/verify-otp', { 
          state: { email: data.email } 
        });
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP');
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
            <CardTitle className="text-2xl font-bold">Admin Registration</CardTitle>
            <CardDescription>
              Create an admin account for StageDeck
            </CardDescription>
          </CardHeader>
          
          {!isOTPSent ? (
            <form onSubmit={handleSubmit(onSubmit)}>
              <CardContent className="space-y-4">
                {/* Important Notice */}
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
                  <div className="flex gap-3">
                    <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-amber-900">
                        Important: OTP Verification Required
                      </p>
                      <p className="text-xs text-amber-700">
                        An OTP will be sent to the admin confirmation email:
                      </p>
                      
                    </div>
                  </div>
                </div>
                
                {error && (
                  <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm">
                    {error}
                  </div>
                )}
                
                <Input
                  {...register('name')}
                  label="Full Name"
                  placeholder="Admin Name"
                  leftIcon={<User className="w-4 h-4" />}
                  error={errors.name?.message}
                />
                
                <Input
                  {...register('email')}
                  type="email"
                  label="Admin Email"
                  placeholder="admin@example.com"
                  leftIcon={<Mail className="w-4 h-4" />}
                  error={errors.email?.message}
                  helperText="This will be your admin login email"
                />
                
                <div>
                  <Input
                    {...register('password')}
                    type="password"
                    label="Password"
                    placeholder="Create a strong password"
                    leftIcon={<Lock className="w-4 h-4" />}
                    error={errors.password?.message}
                  />
                  
                  {password && (
                    <div className="mt-2">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4].map((level) => (
                          <div
                            key={level}
                            className={cn(
                              'h-1 flex-1 rounded-full transition-colors',
                              level <= passwordStrength.score
                                ? passwordStrength.color === 'red' ? 'bg-red-500'
                                : passwordStrength.color === 'orange' ? 'bg-orange-500'
                                : passwordStrength.color === 'yellow' ? 'bg-yellow-500'
                                : 'bg-green-500'
                                : 'bg-gray-200'
                            )}
                          />
                        ))}
                      </div>
                      <p className={cn(
                        'text-xs font-medium mt-1',
                        passwordStrength.color === 'red' ? 'text-red-600'
                        : passwordStrength.color === 'orange' ? 'text-orange-600'
                        : passwordStrength.color === 'yellow' ? 'text-yellow-600'
                        : 'text-green-600'
                      )}>
                        Strength: {passwordStrength.label}
                      </p>
                    </div>
                  )}
                </div>
                
                <Input
                  {...register('confirmPassword')}
                  type="password"
                  label="Confirm Password"
                  placeholder="Re-enter your password"
                  leftIcon={<Lock className="w-4 h-4" />}
                  error={errors.confirmPassword?.message}
                />
              </CardContent>
              
              <CardFooter className="flex flex-col space-y-4">
                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  variant="gradient"
                  loading={isSubmitting}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Send OTP
                </Button>
                
                <div className="text-center text-sm text-gray-600">
                  Already have an admin account?{' '}
                  <Link
                    to="/auth/admin/login"
                    className="font-medium text-purple-600 hover:text-purple-700"
                  >
                    Sign in
                  </Link>
                </div>
              </CardFooter>
            </form>
          ) : (
            <CardContent className="py-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-center space-y-4"
              >
                <div className="w-16 h-16 mx-auto rounded-full bg-green-100 flex items-center justify-center">
                  <Mail className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold">OTP Sent Successfully!</h3>
                <p className="text-sm text-gray-600">
                  We've sent a verification code to:
                </p>
                <p className="text-sm font-mono font-bold bg-gray-100 px-3 py-2 rounded-lg inline-block">
                  {ADMIN_CONFIRM_EMAIL}
                </p>
                <p className="text-xs text-gray-500">
                  Redirecting to verification page...
                </p>
              </motion.div>
            </CardContent>
          )}
        </Card>
      </motion.div>
    </div>
  );
};
