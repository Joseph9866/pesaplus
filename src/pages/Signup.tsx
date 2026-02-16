import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const signupSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  terms: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the terms',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type SignupFormData = z.infer<typeof signupSchema>;

export const Signup = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    try {
      setError('');
      setLoading(true);
      await signUp(data.email, data.password, data.fullName);
      navigate('/dashboard');
    } catch (err: unknown) {
      console.error('Signup error:', err);
      
      // Extract error message from axios error
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as any;
        if (axiosError.response?.data) {
          // Try to get detailed error message
          const errorData = axiosError.response.data;
          console.log('Error response:', errorData);
          
          if (typeof errorData === 'string') {
            setError(errorData);
          } else if (errorData.message) {
            setError(errorData.message);
          } else if (errorData.detail) {
            setError(errorData.detail);
          } else if (errorData.error) {
            setError(errorData.error);
          } else {
            // Show all field errors
            const fieldErrors = Object.entries(errorData)
              .map(([field, messages]) => {
                if (Array.isArray(messages)) {
                  return `${field}: ${messages.join(', ')}`;
                }
                return `${field}: ${messages}`;
              })
              .join('; ');
            setError(fieldErrors || 'Failed to create account');
          }
        } else {
          setError(`Error ${axiosError.response?.status}: ${axiosError.response?.statusText || 'Failed to create account'}`);
        }
      } else if (err instanceof Error) {
        setError(err.message || 'Failed to create account');
      } else {
        setError('Failed to create account');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-[#0F2A44] to-[#1a3a5c] flex items-center justify-center p-8">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-3xl text-[#0F2A44] mb-2 font-bold">Welcome to PesaPlus</h1>
          <p className="text-base text-[#8A8F98]">Create your account to start saving</p>
        </header>

      {/* Social Login Section To be updated later*/}
           
      {/* Signup Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm border border-red-200">
            {error}
          </div>
        )}

        {/* Full Name */}
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
            Full Name
          </label>
          <input
            type="text"
            id="fullName"
            placeholder="John Doe"
            className={`w-full h-11 px-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F2A44] focus:border-transparent transition-all ${
              errors.fullName ? 'border-red-500' : 'border-gray-300'
            }`}
            {...register('fullName')}
          />
          {errors.fullName && (
            <p className="text-red-500 text-sm mt-1.5">{errors.fullName.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            placeholder="your@email.com"
            className={`w-full h-11 px-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F2A44] focus:border-transparent transition-all ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            {...register('email')}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1.5">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              placeholder="••••••••"
              className={`w-full h-11 px-4 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F2A44] focus:border-transparent transition-all ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              }`}
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-sm mt-1.5">{errors.password.message}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-2">
            Confirm Password
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirm-password"
              placeholder="••••••••"
              className={`w-full h-11 px-4 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F2A44] focus:border-transparent transition-all ${
                errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
              }`}
              {...register('confirmPassword')}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1.5">{errors.confirmPassword.message}</p>
          )}
        </div>

        {/* Terms Checkbox */}
        <div className="flex items-start pt-2">
          <input
            type="checkbox"
            id="terms"
            className="w-4 h-4 mt-1 border-gray-300 rounded focus:ring-[#0F2A44] text-[#0F2A44]"
            {...register('terms')}
          />
          <label htmlFor="terms" className="ml-3 text-sm text-gray-600">
            I agree to the Terms & Conditions and Privacy Policy
          </label>
        </div>
        {errors.terms && (
          <p className="text-red-500 text-sm mt-1">{errors.terms.message}</p>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full h-12 bg-[#F4B400] text-white rounded-lg mt-6 hover:bg-[#E5A800] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-base shadow-sm"
        >
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>

      {/* Footer */}
      <footer className="text-center mt-6 pt-6 border-t border-gray-200">
        <p className="text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-[#0F2A44] font-semibold hover:underline">
            Log in
          </Link>
        </p>
      </footer>
      </div>
    </div>
  );
};
