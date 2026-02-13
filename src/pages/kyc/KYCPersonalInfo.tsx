import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Calendar, Info } from 'lucide-react';

const personalInfoSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  idNumber: z.string().min(5, 'Valid ID number is required'),
  address: z.string().min(10, 'Complete address is required'),
  city: z.string().min(2, 'City is required'),
  postalCode: z.string().min(4, 'Postal code is required'),
});

type PersonalInfoFormData = z.infer<typeof personalInfoSchema>;

export const KYCPersonalInfo = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PersonalInfoFormData>({
    resolver: zodResolver(personalInfoSchema),
  });

  const onSubmit = async (data: PersonalInfoFormData) => {
    setLoading(true);
    sessionStorage.setItem('kyc_personal_info', JSON.stringify(data));
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

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm sm:text-base font-medium text-[#0F2A44] mb-1">First Name</label>
              <input
                type="text"
                placeholder="Enter your first name"
                className="w-full px-4 py-3 sm:py-3.5 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-[#0F2A44] focus:border-transparent text-sm sm:text-base"
                {...register('firstName')}
              />
              {errors.firstName && (
                <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.firstName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm sm:text-base font-medium text-[#0F2A44] mb-1">Last Name</label>
              <input
                type="text"
                placeholder="Enter your last name"
                className="w-full px-4 py-3 sm:py-3.5 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-[#0F2A44] focus:border-transparent text-sm sm:text-base"
                {...register('lastName')}
              />
              {errors.lastName && (
                <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.lastName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm sm:text-base font-medium text-[#0F2A44] mb-1">Date of Birth</label>
              <div className="relative">
                <input
                  type="date"
                  className="w-full px-4 py-3 sm:py-3.5 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-[#0F2A44] focus:border-transparent text-sm sm:text-base"
                  {...register('dateOfBirth')}
                />
                <Calendar size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280] pointer-events-none" />
              </div>
              {errors.dateOfBirth && (
                <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.dateOfBirth.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm sm:text-base font-medium text-[#0F2A44] mb-1">National ID Number</label>
              <input
                type="text"
                placeholder="Enter your ID number"
                className="w-full px-4 py-3 sm:py-3.5 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-[#0F2A44] focus:border-transparent text-sm sm:text-base"
                {...register('idNumber')}
              />
              {errors.idNumber && (
                <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.idNumber.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm sm:text-base font-medium text-[#0F2A44] mb-1">Residential Address</label>
              <input
                type="text"
                placeholder="Enter your address"
                className="w-full px-4 py-3 sm:py-3.5 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-[#0F2A44] focus:border-transparent text-sm sm:text-base"
                {...register('address')}
              />
              {errors.address && (
                <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.address.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm sm:text-base font-medium text-[#0F2A44] mb-1">City</label>
              <input
                type="text"
                placeholder="Enter your city"
                className="w-full px-4 py-3 sm:py-3.5 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-[#0F2A44] focus:border-transparent text-sm sm:text-base"
                {...register('city')}
              />
              {errors.city && (
                <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.city.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm sm:text-base font-medium text-[#0F2A44] mb-1">Postal Code</label>
              <input
                type="text"
                placeholder="Enter postal code"
                className="w-full px-4 py-3 sm:py-3.5 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-[#0F2A44] focus:border-transparent text-sm sm:text-base"
                {...register('postalCode')}
              />
              {errors.postalCode && (
                <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.postalCode.message}</p>
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
