import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { userLoginSchema, type UserLoginInput } from '@/utils/validators';

/**
 * User login page
 */

export const UserLogin: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [error, setError] = useState('');
  
  const from = location.state?.from?.pathname || '/user/dashboard';
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UserLoginInput>({
    resolver: zodResolver(userLoginSchema),
  });
  
  const onSubmit = async (data: UserLoginInput) => {
    try {
      setError('');
      await login(data);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message || 'Invalid email or password');
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
            <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold text-2xl mb-4">
              S
            </div>
            <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
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
                {...register('email')}
                type="email"
                label="Email"
                placeholder="john@example.com"
                leftIcon={<Mail className="w-4 h-4" />}
                error={errors.email?.message}
              />
              
              <Input
                {...register('password')}
                type="password"
                label="Password"
                placeholder="Enter your password"
                leftIcon={<Lock className="w-4 h-4" />}
                error={errors.password?.message}
              />
              
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" className="rounded border-gray-300" />
                  <span>Remember me</span>
                </label>
                
                <Link
                  to="/auth/forgot-password"
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  Forgot password?
                </Link>
              </div>
            </CardContent>
            
            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                className="w-full"
                size="lg"
                loading={isSubmitting}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Sign In
              </Button>
              
              <div className="text-center text-sm text-gray-600">
                Don't have an account?{' '}
                <Link
                  to="/auth/user/register"
                  className="font-medium text-primary-600 hover:text-primary-700"
                >
                  Sign up
                </Link>
              </div>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or</span>
                </div>
              </div>
              
              <Link to="/auth/admin/login" className="w-full">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                >
                  Login as Admin
                </Button>
              </Link>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  );
};
