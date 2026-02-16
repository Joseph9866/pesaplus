import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  remember: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const Login = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setError('');
      setLoading(true);
      await signIn(data.email, data.password);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex items-center justify-center bg-gradient-to-br from-[#0F2A44] to-[#1a3a5c] w-full min-h-screen p-8">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl text-[#0F2A44] mb-2 font-bold">Welcome Back</h1>
          <p className="text-base text-gray-600">Log in to continue saving</p>
        </div>

        {/* Social Login */}
         
        {/* Login Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm border border-red-200">
              {error}
            </div>
          )}

          {/* Development Mode Test Credentials */}
          {import.meta.env.VITE_USE_MOCK_DATA === 'true' && (
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg text-sm">
              <p className="font-semibold text-blue-900 mb-2">🎭 Mock Mode - Test Credentials:</p>
              <p className="text-blue-800">• active-user@test.com / password123</p>
              <p className="text-blue-800">• power-user@test.com / password123</p>
              <p className="text-blue-800">• new-user@test.com / password123</p>
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <input
              type="email"
              placeholder="your@email.com"
              className={`w-full h-11 px-4 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F2A44] focus:border-transparent transition-all ${
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
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <a href="#" className="text-sm text-[#0F2A44] hover:underline font-medium">
                Forgot Password?
              </a>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className={`w-full h-11 px-4 pr-12 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F2A44] focus:border-transparent transition-all ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
                {...register('password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1.5">{errors.password.message}</p>
            )}
          </div>

          {/* Remember Me */}
          <div className="flex items-center pt-1">
            <input
              type="checkbox"
              id="remember"
              className="w-4 h-4 border border-gray-300 rounded focus:ring-2 focus:ring-[#0F2A44] text-[#0F2A44]"
              {...register('remember')}
            />
            <label htmlFor="remember" className="ml-3 text-sm text-gray-600">
              Remember me for 30 days
            </label>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-[#F4B400] text-white rounded-lg hover:bg-[#E5A800] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-base shadow-sm mt-6"
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

      
        {/* Footer Link */}
        <div className="text-center mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/signup" className="text-[#0F2A44] font-semibold hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
};
