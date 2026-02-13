import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Edit } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

export const KYCReview = () => {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [personalInfo, setPersonalInfo] = useState<any>(null);
  const [document, setDocument] = useState<any>(null);
  const [selfie, setSelfie] = useState<any>(null);

  useEffect(() => {
    // Load all stored data
    const personalInfoString = sessionStorage.getItem('kyc_personal_info');
    const documentString = sessionStorage.getItem('kyc_document');
    const selfieString = sessionStorage.getItem('kyc_selfie');

    if (personalInfoString) setPersonalInfo(JSON.parse(personalInfoString));
    if (documentString) setDocument(JSON.parse(documentString));
    if (selfieString) setSelfie(JSON.parse(selfieString));
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Submit all KYC data to backend
      await supabase
        .from('user_profiles')
        .update({
          full_name: `${personalInfo.firstName} ${personalInfo.lastName}`,
          kyc_id_number: personalInfo.idNumber,
          kyc_address: `${personalInfo.address}, ${personalInfo.city}, ${personalInfo.postalCode}`,
          kyc_date_of_birth: personalInfo.dateOfBirth,
          kyc_status: 'submitted',
          kyc_document_url: `documents/${user?.id}/${document?.fileName}`,
          kyc_selfie_url: `selfies/${user?.id}/${selfie?.fileName}`,
        })
        .eq('id', user?.id);

      await refreshUser();
      
      // Clear session storage
      sessionStorage.removeItem('kyc_personal_info');
      sessionStorage.removeItem('kyc_document');
      sessionStorage.removeItem('kyc_selfie');
      
      navigate('/kyc/pending');
    } catch (error) {
      console.error('Error submitting KYC:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!personalInfo) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 bg-white z-50 px-4 py-4 border-b border-neutral-200">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="text-[#0F2A44]">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-base sm:text-lg font-medium text-[#0F2A44]">Step 4 of 4</h1>
          <div className="w-6" />
        </div>
      </div>

      {/* Progress Dots */}
      <div className="fixed top-16 left-0 right-0 bg-white z-40 px-4 py-4">
        <div className="max-w-4xl mx-auto flex justify-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#0F2A44]" />
          <div className="w-2 h-2 rounded-full bg-[#0F2A44]" />
          <div className="w-2 h-2 rounded-full bg-[#0F2A44]" />
          <div className="w-2 h-2 rounded-full bg-[#0F2A44]" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 pt-28 pb-24 px-4 sm:px-6 md:px-8 overflow-y-auto">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-semibold text-[#0F2A44] mb-2">Review Your Information</h2>
          <p className="text-sm sm:text-base text-[#6B7280] mb-6">Please review all details before submitting</p>

          {/* Personal Information */}
          <div className="bg-white border border-neutral-200 rounded-xl p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-semibold text-[#0F2A44]">Personal Information</h3>
              <button
                onClick={() => navigate('/kyc/personal-info')}
                className="text-[#0F2A44] text-sm flex items-center gap-1"
              >
                <Edit size={16} />
                Edit
              </button>
            </div>
            <div className="space-y-2">
              <div>
                <p className="text-xs text-[#6B7280]">Full Name</p>
                <p className="text-sm text-[#0F2A44]">{personalInfo.firstName} {personalInfo.lastName}</p>
              </div>
              <div>
                <p className="text-xs text-[#6B7280]">Date of Birth</p>
                <p className="text-sm text-[#0F2A44]">{personalInfo.dateOfBirth}</p>
              </div>
              <div>
                <p className="text-xs text-[#6B7280]">National ID Number</p>
                <p className="text-sm text-[#0F2A44]">{personalInfo.idNumber}</p>
              </div>
              <div>
                <p className="text-xs text-[#6B7280]">Address</p>
                <p className="text-sm text-[#0F2A44]">{personalInfo.address}, {personalInfo.city}, {personalInfo.postalCode}</p>
              </div>
            </div>
          </div>

          {/* Document Upload */}
          <div className="bg-white border border-neutral-200 rounded-xl p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-semibold text-[#0F2A44]">ID Document</h3>
              <button
                onClick={() => navigate('/kyc/document-upload')}
                className="text-[#0F2A44] text-sm flex items-center gap-1"
              >
                <Edit size={16} />
                Edit
              </button>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#1FA774]/10 rounded-full flex items-center justify-center">
                <CheckCircle size={20} className="text-[#1FA774]" />
              </div>
              <div>
                <p className="text-sm text-[#0F2A44]">Document uploaded</p>
                <p className="text-xs text-[#6B7280]">{document?.fileName}</p>
              </div>
            </div>
          </div>

          {/* Selfie Upload */}
          <div className="bg-white border border-neutral-200 rounded-xl p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-semibold text-[#0F2A44]">Selfie Photo</h3>
              <button
                onClick={() => navigate('/kyc/selfie-upload')}
                className="text-[#0F2A44] text-sm flex items-center gap-1"
              >
                <Edit size={16} />
                Edit
              </button>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#1FA774]/10 rounded-full flex items-center justify-center">
                <CheckCircle size={20} className="text-[#1FA774]" />
              </div>
              <div>
                <p className="text-sm text-[#0F2A44]">Selfie uploaded</p>
                <p className="text-xs text-[#6B7280]">{selfie?.fileName}</p>
              </div>
            </div>
          </div>

          <div className="bg-[#F4F6F8] rounded-lg p-3 sm:p-4 mt-6">
            <p className="text-xs sm:text-sm text-[#6B7280] text-center">
              By submitting, you confirm that all information provided is accurate and matches your official documents. False information may result in account suspension.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white px-4 sm:px-6 py-4 border-t border-neutral-200">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-[#F4B400] hover:bg-[#E5A800] text-white py-3 sm:py-4 rounded-lg text-base sm:text-lg font-medium transition-colors disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit for Review'}
          </button>
        </div>
      </div>
    </div>
  );
};
