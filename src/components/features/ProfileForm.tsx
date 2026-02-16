import { useState, FormEvent, ChangeEvent } from 'react';
import { User } from '../../types';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { FeedbackMessage } from '../ui/FeedbackMessage';
import { validateFullName, validateEmail, validatePhoneNumber } from '../../utils/validation';
import { authService } from '../../lib/api/services/auth';

interface ProfileFormProps {
  user: User;
  onUpdateSuccess: () => void;
}

interface FormState {
  full_name: string;
  email: string;
  phone_number: string;
}

interface FormErrors {
  full_name?: string;
  email?: string;
  phone_number?: string;
}

export const ProfileForm = ({ user, onUpdateSuccess }: ProfileFormProps) => {
  // Initialize form state with user data
  const [formData, setFormData] = useState<FormState>({
    full_name: user.full_name,
    email: user.email,
    phone_number: user.phone_number || '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Handle input changes
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  // Validate all fields
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    const fullNameResult = validateFullName(formData.full_name);
    if (!fullNameResult.isValid) {
      newErrors.full_name = fullNameResult.error;
    }

    const emailResult = validateEmail(formData.email);
    if (!emailResult.isValid) {
      newErrors.email = emailResult.error;
    }

    const phoneResult = validatePhoneNumber(formData.phone_number);
    if (!phoneResult.isValid) {
      newErrors.phone_number = phoneResult.error;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Clear any existing feedback
    setFeedback(null);

    // Validate all fields before submission
    if (!validateForm()) {
      return;
    }

    // Set loading state
    setIsSubmitting(true);

    try {
      // Call API to update user - don't include username since it's not editable
      console.log('Updating user with data:', {
        full_name: formData.full_name,
        email: formData.email,
        phone_number: formData.phone_number || undefined,
      });
      
      await authService.updateUser({
        full_name: formData.full_name,
        email: formData.email,
        phone_number: formData.phone_number || undefined,
      });
      
      // Show success message
      setFeedback({
        type: 'success',
        message: 'Your profile has been updated successfully!',
      });
      
      // Call onUpdateSuccess to refresh user context
      onUpdateSuccess();
    } catch (error: any) {
      console.error('Error updating profile:', error);
      
      // Handle error response and show error message
      let errorMessage = 'Failed to update profile. Please try again.';
      
      if (error.response?.data) {
        // Extract specific error messages from API response
        const apiErrors = error.response.data;
        if (typeof apiErrors === 'string') {
          errorMessage = apiErrors;
        } else if (apiErrors.detail) {
          errorMessage = apiErrors.detail;
        } else if (apiErrors.error) {
          errorMessage = apiErrors.error;
        } else {
          // Handle field-specific errors
          const fieldErrors = Object.entries(apiErrors)
            .map(([field, msgs]) => `${field}: ${Array.isArray(msgs) ? msgs.join(', ') : msgs}`)
            .join('; ');
          if (fieldErrors) {
            errorMessage = fieldErrors;
          }
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setFeedback({
        type: 'error',
        message: errorMessage,
      });
      
      // Form data is retained automatically (no need to clear)
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full p-8 border-2 border-gray-200">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-8 bg-[#F4B400] rounded-full"></div>
          <h2 className="text-2xl font-semibold text-[#0F2A44]">Personal Information</h2>
        </div>
        
        {/* Feedback message */}
        {feedback && (
          <FeedbackMessage
            type={feedback.type}
            message={feedback.message}
            onDismiss={() => setFeedback(null)}
            autoDismiss={feedback.type === 'success'}
            dismissAfter={3000}
          />
        )}
        
        <Input
          label="Full Name"
          name="full_name"
          type="text"
          value={formData.full_name}
          onChange={handleChange}
          error={errors.full_name}
          placeholder="Enter your full name"
        />

        <Input
          label="Email Address"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          placeholder="Enter your email"
        />

        <Input
          label="Phone Number (Optional)"
          name="phone_number"
          type="tel"
          value={formData.phone_number}
          onChange={handleChange}
          error={errors.phone_number}
          placeholder="Enter your phone number"
        />

        <div className="pt-4">
          <Button
            type="submit"
            variant="primary"
            fullWidth
            loading={isSubmitting}
            disabled={isSubmitting}
            className="h-12 text-base font-semibold bg-[#F4B400] hover:bg-[#E5A800] text-white"
          >
            {isSubmitting ? 'Saving Changes...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Card>
  );
};
