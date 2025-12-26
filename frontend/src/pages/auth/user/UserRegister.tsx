import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, Check, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { userRegisterSchema, type UserRegisterInput, calculatePasswordStrength } from '@/utils/validators';
import { cn } from '@/utils/cn';

/**
 * User registration page
 */

export const UserRegister: React.FC = () => {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<UserRegisterInput>({
    resolver: zodResolver(userRegisterSchema),
  });

  const password = watch('password', '');
  const passwordStrength = calculatePasswordStrength(password);

  const onSubmit = async (data: UserRegisterInput) => {
    try {
      setError('');
      const result = await registerUser(data);

      // Check if OTP verification is needed
      if (result.needsVerification) {
        // Navigate to OTP verification page with email
        navigate('/auth/user/verify-otp', {
          state: { email: result.email || data.email }
        });
      } else {
        // If for some reason no verification is needed, go to dashboard
        navigate('/user/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    }
  };

  const passwordRequirements = [
    { met: password.length >= 12, text: 'At least 12 characters' },
    { met: /[A-Z]/.test(password), text: 'One uppercase letter' },
    { met: /[a-z]/.test(password), text: 'One lowercase letter' },
    { met: /[0-9]/.test(password), text: 'One number' },
    { met: /[!@#$%^&*(),.?":{}|<>]/.test(password), text: 'One special character' },
  ];

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
            <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold text-2xl mb-4">
              S
            </div>
            <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
            <CardDescription>
              Join StageDeck to discover and book amazing events
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              {error && (
                <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm">
                  {error}
                </div>
              )}

              <Input
                {...register('name')}
                label="Full Name"
                placeholder="John Doe"
                leftIcon={<User className="w-4 h-4" />}
                error={errors.name?.message}
              />

              <Input
                {...register('email')}
                type="email"
                label="Email"
                placeholder="john@example.com"
                leftIcon={<Mail className="w-4 h-4" />}
                error={errors.email?.message}
              />

              <div>
                <Input
                  {...register('password')}
                  type="password"
                  label="Password"
                  placeholder="Create a strong password"
                  leftIcon={<Lock className="w-4 h-4" />}
                  error={errors.password?.message}
                  autoComplete="new-password"
                />

                {password && (
                  <div className="mt-2 space-y-2">
                    {/* Password strength meter */}
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
                      'text-xs font-medium',
                      passwordStrength.color === 'red' ? 'text-red-600'
                        : passwordStrength.color === 'orange' ? 'text-orange-600'
                          : passwordStrength.color === 'yellow' ? 'text-yellow-600'
                            : 'text-green-600'
                    )}>
                      Password strength: {passwordStrength.label}
                    </p>

                    {/* Requirements checklist */}
                    <div className="space-y-1">
                      {passwordRequirements.map((req, index) => (
                        <div key={index} className="flex items-center gap-2 text-xs">
                          {req.met ? (
                            <Check className="w-3 h-3 text-green-500" />
                          ) : (
                            <X className="w-3 h-3 text-gray-400" />
                          )}
                          <span className={req.met ? 'text-green-600' : 'text-gray-500'}>
                            {req.text}
                          </span>
                        </div>
                      ))}
                    </div>
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
                autoComplete="new-password"
              />

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  required
                  className="rounded border-gray-300"
                />
                <span>
                  I agree to the{' '}
                  <Link to="/terms" className="text-primary-600 hover:text-primary-700">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="text-primary-600 hover:text-primary-700">
                    Privacy Policy
                  </Link>
                </span>
              </label>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                className="w-full"
                size="lg"
                loading={isSubmitting}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Create Account
              </Button>

              <div className="text-center text-sm text-gray-600">
                Already have an account?{' '}
                <Link
                  to="/auth/user/login"
                  className="font-medium text-primary-600 hover:text-primary-700"
                >
                  Sign in
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  );
};
