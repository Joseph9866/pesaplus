import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Clock } from 'lucide-react';

export const KYCIntro = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full bg-white flex items-center justify-center min-h-screen">
      <div className="w-full max-w-[428px] min-w-[320px] bg-white min-h-screen flex flex-col relative">
        {/* Header */}
        <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[428px] min-w-[320px] bg-white z-50 px-4 py-4">
          <button onClick={() => navigate(-1)} className="text-[#0F2A44]">
            <ArrowLeft size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-center px-6 pb-32 pt-16">
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-[#0F2A44] rounded-full flex items-center justify-center">
              <Shield className="text-white" size={40} />
            </div>
            <h1 className="text-2xl text-[#0F2A44] text-center mt-4 font-bold">
              Verify Your Identity
            </h1>
            <p className="text-sm text-[#6B7280] text-center mt-4 leading-relaxed">
              To comply with financial regulations and keep your account secure, we need to verify your identity.
            </p>
          </div>

          <div className="bg-[#F4F6F8] rounded-xl p-4 mt-6">
            <h2 className="text-base text-[#0F2A44] font-semibold">What you'll need:</h2>
            <div className="mt-3 space-y-2">
              <div className="flex items-start">
                <span className="text-[#1FA774] text-sm mr-2 mt-0.5">✓</span>
                <span className="text-sm text-[#2E2E2E]">Full name and date of birth</span>
              </div>
              <div className="flex items-start">
                <span className="text-[#1FA774] text-sm mr-2 mt-0.5">✓</span>
                <span className="text-sm text-[#2E2E2E]">National ID, Passport, or Driver's License</span>
              </div>
              <div className="flex items-start">
                <span className="text-[#1FA774] text-sm mr-2 mt-0.5">✓</span>
                <span className="text-sm text-[#2E2E2E]">Selfie photo</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center mt-4">
            <Clock className="text-[#6B7280] mr-1" size={14} />
            <span className="text-xs text-[#6B7280]">Takes about 3 minutes</span>
          </div>
        </div>

        {/* Footer */}
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[428px] min-w-[320px] bg-white px-6 pb-6">
          <button
            onClick={() => navigate('/kyc/personal-info')}
            className="w-full bg-[#F4B400] text-white py-4 rounded-lg text-base font-semibold hover:bg-[#E5A800] transition-colors"
          >
            Start Verification
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full text-[#0F2A44] text-sm mt-4 hover:underline"
          >
            I'll do this later
          </button>
        </div>
      </div>
    </div>
  );
};
