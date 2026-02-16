import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const Splash = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/signup');
    }
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <div className="relative w-full h-screen bg-gradient-to-br from-[#0F2A44] to-[#1a3a5c] flex flex-col items-center justify-center px-8">
      {/* Logo/Title */}
      <div className="text-center mb-16">
        <h1 className="text-white text-6xl mb-4 font-bold tracking-tight">PesaPlus</h1>
        <div className="w-24 h-1 bg-[#F4B400] mx-auto rounded-full"></div>
      </div>

      {/* Tagline */}
      <div className="text-center mb-16">
        <h2 className="text-white text-4xl mb-4 font-semibold">Save, Grow, Earn</h2>
        <p className="text-white text-lg opacity-80 max-w-md mx-auto">
          Start your savings journey today and watch your money grow
        </p>
      </div>

      {/* CTA buttons */}
      <div className="w-full max-w-sm space-y-4">
        <button
          onClick={handleGetStarted}
          className="w-full h-12 bg-[#F4B400] text-white text-base font-semibold rounded-lg hover:bg-[#E5A800] transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          Get Started
        </button>
        <p className="text-white text-sm text-center">
          Already have an account?{' '}
          <button onClick={handleLogin} className="font-semibold underline hover:text-[#F4B400] transition-colors">
            Log in
          </button>
        </p>
      </div>
    </div>
  );
};
