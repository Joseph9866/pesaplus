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
      if (err instanceof Error) {
        setError(err.message || 'Failed to create account');
      } else {
        setError('Failed to create account');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#0F2A44] flex items-center justify-center p-4">
      <div className="w-full max-w-[428px] bg-white rounded-3xl shadow-2xl px-6 py-8 overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <header className="text-center mb-6">
          <h1 className="text-2xl text-[#0F2A44] mb-2 font-bold">Welcome to PesaPlus</h1>
          <p className="text-sm text-[#8A8F98]">Create your account to start saving</p>
        </header>

      {/* Social Login Section To be updated later*/}
           
      {/* Signup Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Full Name */}
        <div>
          <label htmlFor="fullName" className="block text-sm text-[#8A8F98] mb-1">
            Full Name
          </label>
          <input
            type="text"
            id="fullName"
            placeholder="John Doe"
            className={`w-full h-12 px-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F2A44] focus:border-transparent ${
              errors.fullName ? 'border-red-500' : 'border-neutral-300'
            }`}
            {...register('fullName')}
          />
          {errors.fullName && (
            <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm text-[#8A8F98] mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            placeholder="your@email.com"
            className={`w-full h-12 px-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F2A44] focus:border-transparent ${
              errors.email ? 'border-red-500' : 'border-neutral-300'
            }`}
            {...register('email')}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-sm text-[#8A8F98] mb-1">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              placeholder="••••••••"
              className={`w-full h-12 px-4 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F2A44] focus:border-transparent ${
                errors.password ? 'border-red-500' : 'border-neutral-300'
              }`}
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8A8F98] cursor-pointer"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label htmlFor="confirm-password" className="block text-sm text-[#8A8F98] mb-1">
            Confirm Password
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirm-password"
              placeholder="••••••••"
              className={`w-full h-12 px-4 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F2A44] focus:border-transparent ${
                errors.confirmPassword ? 'border-red-500' : 'border-neutral-300'
              }`}
              {...register('confirmPassword')}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8A8F98] cursor-pointer"
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>
          )}
        </div>

        {/* Terms Checkbox */}
        <div className="flex items-start mt-4">
          <input
            type="checkbox"
            id="terms"
            className="w-4 h-4 mt-0.5 border-neutral-300 rounded focus:ring-[#0F2A44]"
            {...register('terms')}
          />
          <label htmlFor="terms" className="ml-2 text-xs text-[#2E2E2E]">
            I agree to Terms & Privacy Policy
          </label>
        </div>
        {errors.terms && (
          <p className="text-red-500 text-xs mt-1">{errors.terms.message}</p>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full h-14 bg-[#F4B400] text-white rounded-lg mt-6 hover:bg-[#E5A800] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
        >
          {loading ? 'Creating Account...' : 'Sign Up'}
        </button>
      </form>

      {/* Footer */}
      <footer className="text-center mt-4">
        <p className="text-sm text-[#0F2A44]">
          Already have an account?{' '}
          <Link to="/login" className="underline hover:opacity-80 font-semibold">
            Log in
          </Link>
        </p>
      </footer>
      </div>
    </div>
  );
};
