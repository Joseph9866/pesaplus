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
    <div className="relative w-full h-screen bg-[#0F2A44] flex flex-col items-center justify-center px-8">
      {/* Logo/Title at top third */}
      <div className="absolute top-1/3 transform -translate-y-1/2 text-center">
        <h1 className="text-white text-5xl mb-0 font-bold">PesaPlus</h1>
      </div>

      {/* Tagline in center */}
      <div className="text-center">
        <h2 className="text-white text-3xl mb-4 font-semibold">Save, Grow, Earn</h2>
        <p className="text-white text-base opacity-70">Start your savings journey today</p>
      </div>

      {/* CTA buttons at bottom */}
      <div className="absolute bottom-8 left-8 right-8 w-[calc(100%-4rem)]">
        <button
          onClick={handleGetStarted}
          className="w-full h-14 bg-[#F4B400] text-white text-base font-semibold rounded-[28px] mb-4 hover:bg-[#E5A800] transition-colors"
        >
          Get Started
        </button>
        <p className="text-white text-sm text-center mt-4">
          Already have an account?{' '}
          <button onClick={handleLogin} className="underline hover:opacity-80">
            Log in
          </button>
        </p>
      </div>
    </div>
  );
};
