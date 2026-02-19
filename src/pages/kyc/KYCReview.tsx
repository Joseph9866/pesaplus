import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Edit, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { draftManager, KYCDraft } from '../../lib/kyc/draftManager';
import { kycService } from '../../lib/api/services/kyc';
import { KYCData, APIError } from '../../types';

export const KYCReview = () => {
  const navigate = useNavigate();
  const { updateKYCStatus, refreshKYCStatus, kycStatus, kycData } = useAuth();
  const [loading, setLoading] = useState(false);
  const [draft, setDraft] = useState<KYCDraft | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    // Load draft data
    const loadedDraft = draftManager.loadDraft();
    if (!loadedDraft) {
      // No draft data, redirect to start
      navigate('/kyc/intro');
      return;
    }
    setDraft(loadedDraft);
    
    // Check if we're in edit mode (rejected status with existing KYC data)
    if (kycStatus === 'rejected' && kycData) {
      setIsEditMode(true);
    }
  }, [navigate, kycStatus, kycData]);

  const handleSubmit = async () => {
    if (!draft?.personalInfo) {
      setError('Missing personal information. Please complete all steps.');
      return;
    }

    setLoading(true);
    setError(null);
    setFieldErrors({});

    try {
      if (isEditMode && kycData?.membership_number) {
        // Edit mode: Perform partial update (PATCH) with only changed fields
        const changedFields: Partial<KYCData> = {};
        
        // Compare draft data with existing KYC data to identify changed fields
        if (draft.personalInfo.gender !== kycData.gender) {
          changedFields.gender = draft.personalInfo.gender as 'male' | 'female' | 'other';
        }
        if (draft.personalInfo.marital_status !== kycData.marital_status) {
          changedFields.marital_status = draft.personalInfo.marital_status as 'married' | 'single' | 'other';
        }
        if (draft.personalInfo.id_number !== kycData.id_number) {
          changedFields.id_number = draft.personalInfo.id_number;
        }
        if (draft.personalInfo.kra_pin !== kycData.kra_pin) {
          changedFields.kra_pin = draft.personalInfo.kra_pin;
        }
        if (draft.personalInfo.country !== kycData.country) {
          changedFields.country = draft.personalInfo.country;
        }
        if (draft.personalInfo.county !== kycData.county) {
          changedFields.county = draft.personalInfo.county;
        }

        // Only send update if there are changed fields
        if (Object.keys(changedFields).length === 0) {
          setError('No changes detected. Please modify at least one field.');
          setLoading(false);
          return;
        }

        console.log('Updating KYC data with changed fields:', changedFields);

        // Perform partial update
        const response = await kycService.patchKYC(kycData.membership_number, changedFields);
        
        console.log('KYC update successful:', response);

        // Clear draft data after successful update
        draftManager.clearDraft();

        // Refresh KYC status from backend
        await refreshKYCStatus();

        // Navigate to pending page
        navigate('/kyc/pending');
      } else {
        // Create mode: Submit new KYC data
        const kycDataToSubmit: KYCData = {
          id_number: draft.personalInfo.id_number,
          kra_pin: draft.personalInfo.kra_pin,
          gender: draft.personalInfo.gender as 'male' | 'female' | 'other',
          marital_status: draft.personalInfo.marital_status as 'married' | 'single' | 'other',
          country: draft.personalInfo.country,
          county: draft.personalInfo.county,
          kyc_submitted: true,
          kyc_confirmed: false,
        };

        // Note: Document uploads should be handled separately before submission
        // For now, we're submitting the KYC data without documents
        // In a complete implementation, documents would be uploaded first and URLs added here

        console.log('Submitting KYC data:', kycDataToSubmit);

        // Submit KYC data to backend
        const response = await kycService.createKYC(kycDataToSubmit);
        
        console.log('KYC submission successful:', response);

        // Clear draft data after successful submission
        draftManager.clearDraft();

        // Update auth context with new status
        updateKYCStatus('submitted');
        
        // Refresh KYC status from backend
        await refreshKYCStatus();

        // Navigate to pending page
        navigate('/kyc/pending');
      }
    } catch (err: any) {
      console.error('Error submitting/updating KYC:', err);
      
      // Handle API errors
      const apiError = err as APIError;
      
      // Special handling for 403 permission errors
      if (apiError.status === 403 || apiError.code === 'AUTHORIZATION_ERROR') {
        setError('Permission denied: Your account does not have permission to submit KYC. Please contact support or check your account status.');
        console.error('403 Permission Error Details:', {
          status: apiError.status,
          code: apiError.code,
          message: apiError.message,
          response: err.response?.data
        });
      } else if (apiError.fieldErrors) {
        // Display field-specific validation errors
        setFieldErrors(apiError.fieldErrors);
        setError('Please correct the errors below and try again.');
      } else {
        // Display general error message
        setError(apiError.message || `Failed to ${isEditMode ? 'update' : 'submit'} KYC. Please try again.`);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!draft?.personalInfo) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#6B7280] mb-4">No KYC data found</p>
          <button
            onClick={() => navigate('/kyc/intro')}
            className="text-[#0F2A44] underline"
          >
            Start KYC Process
          </button>
        </div>
      </div>
    );
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
          <p className="text-sm sm:text-base text-[#6B7280] mb-6">
            {isEditMode 
              ? 'Review your updated information before resubmitting' 
              : 'Please review all details before submitting'}
          </p>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 flex items-start gap-3">
              <AlertCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-red-800">{error}</p>
                {Object.keys(fieldErrors).length > 0 && (
                  <ul className="mt-2 space-y-1">
                    {Object.entries(fieldErrors).map(([field, errors]) => (
                      <li key={field} className="text-xs text-red-700">
                        <strong>{field}:</strong> {errors.join(', ')}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}

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
                <p className="text-xs text-[#6B7280]">Gender</p>
                <p className="text-sm text-[#0F2A44] capitalize">{draft.personalInfo.gender}</p>
              </div>
              <div>
                <p className="text-xs text-[#6B7280]">Marital Status</p>
                <p className="text-sm text-[#0F2A44] capitalize">{draft.personalInfo.marital_status}</p>
              </div>
              <div>
                <p className="text-xs text-[#6B7280]">National ID Number</p>
                <p className="text-sm text-[#0F2A44]">{draft.personalInfo.id_number}</p>
              </div>
              <div>
                <p className="text-xs text-[#6B7280]">KRA PIN</p>
                <p className="text-sm text-[#0F2A44]">{draft.personalInfo.kra_pin}</p>
              </div>
              <div>
                <p className="text-xs text-[#6B7280]">Country</p>
                <p className="text-sm text-[#0F2A44]">{draft.personalInfo.country}</p>
              </div>
              <div>
                <p className="text-xs text-[#6B7280]">County</p>
                <p className="text-sm text-[#0F2A44]">{draft.personalInfo.county}</p>
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
            {draft.documents?.id_front_preview || draft.documents?.id_back_preview ? (
              <div className="space-y-3">
                {draft.documents.id_front_preview && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#1FA774]/10 rounded-full flex items-center justify-center">
                      <CheckCircle size={20} className="text-[#1FA774]" />
                    </div>
                    <div>
                      <p className="text-sm text-[#0F2A44]">Front of ID uploaded</p>
                      <p className="text-xs text-[#6B7280]">Document ready for submission</p>
                    </div>
                  </div>
                )}
                {draft.documents.id_back_preview && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#1FA774]/10 rounded-full flex items-center justify-center">
                      <CheckCircle size={20} className="text-[#1FA774]" />
                    </div>
                    <div>
                      <p className="text-sm text-[#0F2A44]">Back of ID uploaded</p>
                      <p className="text-xs text-[#6B7280]">Document ready for submission</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-sm text-[#6B7280]">No documents uploaded yet</div>
            )}
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
            {draft.documents?.selfie_preview ? (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#1FA774]/10 rounded-full flex items-center justify-center">
                  <CheckCircle size={20} className="text-[#1FA774]" />
                </div>
                <div>
                  <p className="text-sm text-[#0F2A44]">Selfie uploaded</p>
                  <p className="text-xs text-[#6B7280]">Photo ready for submission</p>
                </div>
              </div>
            ) : (
              <div className="text-sm text-[#6B7280]">No selfie uploaded yet</div>
            )}
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
            {loading ? (isEditMode ? 'Updating...' : 'Submitting...') : (isEditMode ? 'Update & Resubmit' : 'Submit for Review')}
          </button>
        </div>
      </div>
    </div>
  );
};
