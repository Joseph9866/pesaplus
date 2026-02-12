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
    <main className="flex items-center justify-center bg-[#0F2A44] w-full min-h-screen p-4">
      <div className="w-full max-w-[428px] bg-white rounded-3xl shadow-2xl px-6 py-8 overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl text-neutral-900 mb-2 font-bold">Welcome Back</h1>
          <p className="text-sm text-neutral-500">Log in to continue saving</p>
        </div>

        {/* Social Login */}
         
        {/* Login Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Development Mode Test Credentials */}
          {import.meta.env.VITE_USE_MOCK_DATA === 'true' && (
            <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg text-xs">
              <p className="font-semibold text-blue-900 mb-1">🎭 Mock Mode - Test Credentials:</p>
              <p className="text-blue-800">• active-user@test.com / password123</p>
              <p className="text-blue-800">• power-user@test.com / password123</p>
              <p className="text-blue-800">• new-user@test.com / password123</p>
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-sm text-neutral-600 mb-2">Email</label>
            <input
              type="email"
              placeholder="your@email.com"
              className={`w-full h-12 px-4 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 ${
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
            <label className="block text-sm text-neutral-600 mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className={`w-full h-12 px-4 pr-12 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 ${
                  errors.password ? 'border-red-500' : 'border-neutral-300'
                }`}
                {...register('password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-neutral-500"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Forgot Password */}
          <div className="text-right pt-2">
            <a href="#" className="text-sm text-neutral-900 hover:underline">
              Forgot Password?
            </a>
          </div>

          {/* Remember Me */}
          <div className="flex items-center pt-4">
            <input
              type="checkbox"
              id="remember"
              className="w-4 h-4 border border-neutral-300 rounded focus:ring-2 focus:ring-neutral-900"
              {...register('remember')}
            />
            <label htmlFor="remember" className="ml-2 text-xs text-neutral-600">
              Remember me
            </label>
          </div>

          {/* Login Button */}
          <div className="pt-6">
            <button
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-[#F4B400] text-white rounded-lg hover:bg-[#E5A800] transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
            >
              {loading ? 'Logging in...' : 'Log In'}
            </button>
          </div>
        </form>

      
        {/* Footer Link */}
        <div className="text-center mt-6">
          <p className="text-sm text-neutral-900">
            Don't have an account?{' '}
            <Link to="/signup" className="hover:underline font-semibold">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
};
