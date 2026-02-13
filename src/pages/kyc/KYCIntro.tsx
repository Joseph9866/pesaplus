import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Clock } from 'lucide-react';

export const KYCIntro = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full bg-white flex items-center justify-center min-h-screen">
      <div className="w-full max-w-7xl mx-auto bg-white min-h-screen flex flex-col relative px-4">
        {/* Header */}
        <div className="fixed top-0 left-0 right-0 w-full bg-white z-50 px-4 py-4">
          <div className="max-w-7xl mx-auto">
            <button onClick={() => navigate(-1)} className="text-[#0F2A44]">
              <ArrowLeft size={24} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 md:px-8 pb-32 pt-16 max-w-2xl mx-auto w-full">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-[#0F2A44] rounded-full flex items-center justify-center">
              <Shield className="text-white" size={40} />
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl text-[#0F2A44] text-center mt-4 font-bold">
              Verify Your Identity
            </h1>
            <p className="text-sm sm:text-base text-[#6B7280] text-center mt-4 leading-relaxed max-w-md">
              To comply with financial regulations and keep your account secure, we need to verify your identity.
            </p>
          </div>

          <div className="bg-[#F4F6F8] rounded-xl p-4 sm:p-5 md:p-6 mt-6">
            <h2 className="text-base sm:text-lg text-[#0F2A44] font-semibold">What you'll need:</h2>
            <div className="mt-3 space-y-2">
              <div className="flex items-start">
                <span className="text-[#1FA774] text-sm mr-2 mt-0.5">✓</span>
                <span className="text-sm sm:text-base text-[#2E2E2E]">Full name and date of birth</span>
              </div>
              <div className="flex items-start">
                <span className="text-[#1FA774] text-sm mr-2 mt-0.5">✓</span>
                <span className="text-sm sm:text-base text-[#2E2E2E]">National ID, Passport, or Driver's License</span>
              </div>
              <div className="flex items-start">
                <span className="text-[#1FA774] text-sm mr-2 mt-0.5">✓</span>
                <span className="text-sm sm:text-base text-[#2E2E2E]">Selfie photo</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center mt-4">
            <Clock className="text-[#6B7280] mr-1" size={14} />
            <span className="text-xs sm:text-sm text-[#6B7280]">Takes about 3 minutes</span>
          </div>
        </div>

        {/* Footer */}
        <div className="fixed bottom-0 left-0 right-0 w-full bg-white px-4 sm:px-6 pb-6">
          <div className="max-w-2xl mx-auto">
            <button
              onClick={() => navigate('/kyc/personal-info')}
              className="w-full bg-[#F4B400] text-white py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold hover:bg-[#E5A800] transition-colors"
            >
              Start Verification
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full text-[#0F2A44] text-sm sm:text-base mt-4 hover:underline"
            >
              I'll do this later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
