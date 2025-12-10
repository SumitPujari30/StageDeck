import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, Shield } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { adminLoginSchema, type AdminLoginInput } from '@/utils/validators';

/**
 * Admin login page
 */

export const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginAdmin } = useAuth();
  const [error, setError] = useState('');
  
  const from = location.state?.from?.pathname || '/admin/dashboard';
  const message = location.state?.message;
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AdminLoginInput>({
    resolver: zodResolver(adminLoginSchema),
  });
  
  const onSubmit = async (data: AdminLoginInput) => {
    try {
      setError('');
      await loginAdmin(data);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message || 'Invalid admin credentials');
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
            <CardTitle className="text-2xl font-bold">Admin Login</CardTitle>
            <CardDescription>
              Access the admin dashboard
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              {message && (
                <div className="p-3 rounded-lg bg-green-50 text-green-600 text-sm">
                  {message}
                </div>
              )}
              
              {error && (
                <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm">
                  {error}
                </div>
              )}
              
              <Input
                {...register('email')}
                type="email"
                label="Admin Email"
                placeholder="admin@example.com"
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
                  className="text-sm text-purple-600 hover:text-purple-700"
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
                variant="gradient"
                loading={isSubmitting}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Sign In as Admin
              </Button>
              
              <div className="text-center text-sm text-gray-600">
                Need an admin account?{' '}
                <Link
                  to="/auth/admin/register"
                  className="font-medium text-purple-600 hover:text-purple-700"
                >
                  Register here
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
              
              <Link to="/auth/user/login" className="w-full">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                >
                  Login as User
                </Button>
              </Link>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  );
};
