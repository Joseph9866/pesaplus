import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Info, AlertCircle } from 'lucide-react';
import { draftManager } from '../../lib/kyc/draftManager';
import { useAuth } from '../../contexts/AuthContext';
import { useErrorHandler } from '../../hooks/useErrorHandler';

// Simple debounce utility
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// ID number validation: Kenyan ID is typically 7-8 digits
const idNumberRegex = /^\d{7,8}$/;

// KRA PIN validation: Alphanumeric, typically 11 characters (A followed by 9 digits and a letter)
const kraPinRegex = /^[A-Z0-9]{11}$/;

const personalInfoSchema = z.object({
  gender: z.enum(['male', 'female', 'other'], {
    required_error: 'Please select a gender',
  }),
  marital_status: z.enum(['married', 'single', 'other'], {
    required_error: 'Please select marital status',
  }),
  id_number: z
    .string()
    .min(1, 'ID number is required')
    .regex(idNumberRegex, 'ID number must be 7-8 digits'),
  kra_pin: z
    .string()
    .min(1, 'KRA PIN is required')
    .regex(kraPinRegex, 'KRA PIN must be alphanumeric (11 characters)'),
  country: z.string().min(1, 'Country is required'),
  county: z.string().min(1, 'County is required'),
});

type PersonalInfoFormData = z.infer<typeof personalInfoSchema>;

export const KYCPersonalInfo = () => {
  const navigate = useNavigate();
  const { kycStatus, kycData } = useAuth();
  const { error, handleError, clearError } = useErrorHandler();
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<PersonalInfoFormData>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      gender: 'male',
      marital_status: 'single',
      id_number: '',
      kra_pin: '',
      country: 'Kenya',
      county: '',
    },
  });

  // Load draft data or existing KYC data on mount
  useEffect(() => {
    try {
      clearError(); // Clear any previous errors
      
      // Check if we're in edit mode (rejected status with existing KYC data)
      if (kycStatus === 'rejected' && kycData) {
        setIsEditMode(true);
        // Load existing KYC data into form
        setValue('gender', kycData.gender);
        setValue('marital_status', kycData.marital_status);
        setValue('id_number', kycData.id_number);
        setValue('kra_pin', kycData.kra_pin);
        setValue('country', kycData.country);
        setValue('county', kycData.county);
        
        // Also save to draft for consistency
        draftManager.saveDraft({
          personalInfo: {
            gender: kycData.gender,
            marital_status: kycData.marital_status,
            id_number: kycData.id_number,
            kra_pin: kycData.kra_pin,
            country: kycData.country,
            county: kycData.county,
          },
          currentStep: 1,
        });
      } else {
        // Load draft data for new submissions or in-progress
        const draft = draftManager.loadDraft();
        if (draft?.personalInfo) {
          const { gender, marital_status, id_number, kra_pin, country, county } = draft.personalInfo;
          setValue('gender', gender as 'male' | 'female' | 'other');
          setValue('marital_status', marital_status as 'married' | 'single' | 'other');
          setValue('id_number', id_number);
          setValue('kra_pin', kra_pin);
          setValue('country', country);
          setValue('county', county);
        }
      }
    } catch (err) {
      console.error('Error loading draft data:', err);
      handleError(err);
    }
  }, [setValue, kycStatus, kycData, clearError, handleError]);

  // Debounced save to draft on field changes
  const saveToDraft = useCallback(
    debounce((data: PersonalInfoFormData) => {
      draftManager.saveDraft({
        personalInfo: {
          gender: data.gender,
          marital_status: data.marital_status,
          id_number: data.id_number,
          kra_pin: data.kra_pin,
          country: data.country,
          county: data.county,
        },
        currentStep: 1,
      });
    }, 500),
    []
  );

  // Watch form changes and save to draft
  useEffect(() => {
    const subscription = watch((data) => {
      if (data.gender && data.marital_status) {
        saveToDraft(data as PersonalInfoFormData);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, saveToDraft]);

  const onSubmit = async (data: PersonalInfoFormData) => {
    setLoading(true);
    
    // Save to draft before navigating
    draftManager.saveDraft({
      personalInfo: {
        gender: data.gender,
        marital_status: data.marital_status,
        id_number: data.id_number,
        kra_pin: data.kra_pin,
        country: data.country,
        county: data.county,
      },
      currentStep: 1,
    });

    setTimeout(() => {
      navigate('/kyc/document-upload');
    }, 500);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 bg-white z-50 px-4 py-4 border-b border-neutral-200">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="text-[#0F2A44]">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-base sm:text-lg font-medium text-[#0F2A44]">Step 1 of 4</h1>
          <div className="w-6" />
        </div>
      </div>

      {/* Progress Dots */}
      <div className="fixed top-16 left-0 right-0 bg-white z-40 px-4 py-4">
        <div className="max-w-4xl mx-auto flex justify-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#0F2A44]" />
          <div className="w-2 h-2 rounded-full bg-neutral-300" />
          <div className="w-2 h-2 rounded-full bg-neutral-300" />
          <div className="w-2 h-2 rounded-full bg-neutral-300" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 pt-28 pb-24 px-4 sm:px-6 md:px-8 overflow-y-auto">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-semibold text-[#0F2A44] mb-2">Personal Information</h2>
          <p className="text-sm sm:text-base text-[#6B7280] mb-6">Please provide your details as they appear on your ID</p>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 flex items-start gap-3">
              <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-red-800">{error.message}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm sm:text-base font-medium text-[#0F2A44] mb-1">Gender</label>
              <select
                className="w-full px-4 py-3 sm:py-3.5 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-[#0F2A44] focus:border-transparent text-sm sm:text-base"
                {...register('gender')}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              {errors.gender && (
                <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.gender.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm sm:text-base font-medium text-[#0F2A44] mb-1">Marital Status</label>
              <select
                className="w-full px-4 py-3 sm:py-3.5 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-[#0F2A44] focus:border-transparent text-sm sm:text-base"
                {...register('marital_status')}
              >
                <option value="single">Single</option>
                <option value="married">Married</option>
                <option value="other">Other</option>
              </select>
              {errors.marital_status && (
                <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.marital_status.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm sm:text-base font-medium text-[#0F2A44] mb-1">National ID Number</label>
              <input
                type="text"
                placeholder="Enter your ID number (7-8 digits)"
                className="w-full px-4 py-3 sm:py-3.5 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-[#0F2A44] focus:border-transparent text-sm sm:text-base"
                {...register('id_number')}
              />
              {errors.id_number && (
                <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.id_number.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm sm:text-base font-medium text-[#0F2A44] mb-1">KRA PIN</label>
              <input
                type="text"
                placeholder="Enter your KRA PIN (e.g., A001234567Z)"
                className="w-full px-4 py-3 sm:py-3.5 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-[#0F2A44] focus:border-transparent text-sm sm:text-base uppercase"
                maxLength={11}
                {...register('kra_pin')}
              />
              {errors.kra_pin && (
                <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.kra_pin.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm sm:text-base font-medium text-[#0F2A44] mb-1">Country</label>
              <select
                className="w-full px-4 py-3 sm:py-3.5 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-[#0F2A44] focus:border-transparent text-sm sm:text-base"
                {...register('country')}
              >
                <option value="Kenya">Kenya</option>
                <option value="Uganda">Uganda</option>
                <option value="Tanzania">Tanzania</option>
                <option value="Rwanda">Rwanda</option>
                <option value="Other">Other</option>
              </select>
              {errors.country && (
                <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.country.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm sm:text-base font-medium text-[#0F2A44] mb-1">County</label>
              <input
                type="text"
                placeholder="Enter your county"
                className="w-full px-4 py-3 sm:py-3.5 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-[#0F2A44] focus:border-transparent text-sm sm:text-base"
                {...register('county')}
              />
              {errors.county && (
                <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.county.message}</p>
              )}
            </div>

            <div className="bg-[#F4F6F8] rounded-lg p-3 flex items-start gap-2">
              <Info size={16} className="text-[#0F2A44] mt-0.5 flex-shrink-0" />
              <p className="text-xs sm:text-sm text-[#6B7280]">This information must match your ID document</p>
            </div>
          </form>
        </div>
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white px-4 sm:px-6 py-4 border-t border-neutral-200">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={handleSubmit(onSubmit)}
            disabled={loading}
            className="w-full bg-[#F4B400] hover:bg-[#E5A800] text-white py-3 sm:py-4 rounded-lg text-base sm:text-lg font-medium transition-colors disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  );
};
