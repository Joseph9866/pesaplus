import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, CheckCircle, Info, AlertCircle, X } from 'lucide-react';
import { validateFile, generatePreview } from '../../lib/kyc/fileUpload';
import { saveDraft, loadDraft } from '../../lib/kyc/draftManager';
import { useErrorHandler } from '../../hooks/useErrorHandler';

export const KYCSelfieUpload = () => {
  const navigate = useNavigate();
  const { error: globalError, handleError, clearError } = useErrorHandler();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selfiePreview, setSelfiePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Load draft data on mount
  useEffect(() => {
    try {
      clearError(); // Clear any previous errors
      const draft = loadDraft();
      if (draft?.documents?.selfie_preview) {
        setSelfiePreview(draft.documents.selfie_preview);
      }
    } catch (err) {
      console.error('Error loading draft data:', err);
      handleError(err);
    }
  }, [clearError, handleError]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Clear previous errors
    setValidationError(null);
    setError(null);

    // Validate file
    const validation = validateFile(file);
    if (!validation.valid) {
      setValidationError(validation.error || 'Invalid file');
      return;
    }

    try {
      // Generate preview for image
      const preview = await generatePreview(file);
      
      setSelectedFile(file);
      setSelfiePreview(preview);
      
      // Save to draft
      const draft = loadDraft();
      saveDraft({
        documents: {
          ...draft?.documents,
          selfie_preview: preview,
        },
        currentStep: 3,
      });
    } catch (err) {
      console.error('Error generating preview:', err);
      setValidationError('Failed to generate preview. Please try another file.');
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setSelfiePreview(null);
    
    // Update draft
    const draft = loadDraft();
    saveDraft({
      documents: {
        ...draft?.documents,
        selfie_preview: undefined,
      },
      currentStep: 3,
    });
    
    // Clear validation error
    setValidationError(null);
  };

  const handleSubmit = async () => {
    // Validate that selfie is uploaded
    if (!selectedFile && !selfiePreview) {
      setError('Please upload a selfie photo');
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    setError(null);

    try {
      // Simulate upload progress
      // In a real implementation, this would be handled by the API service
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      clearInterval(progressInterval);
      setUploadProgress(100);

      // Navigate to review page (Step 4)
      navigate('/kyc/review');
    } catch (err) {
      console.error('Error uploading selfie:', err);
      setError('Upload failed. Please try again.');
      setUploadProgress(0);
    } finally {
      setUploading(false);
    }
  };

  const retryUpload = () => {
    setError(null);
    setUploadProgress(0);
    handleSubmit();
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 bg-white z-50 px-4 py-4 border-b border-neutral-200">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="text-[#0F2A44]">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-base sm:text-lg font-medium text-[#0F2A44]">Step 3 of 4</h1>
          <div className="w-6" />
        </div>
      </div>

      {/* Progress Dots */}
      <div className="fixed top-16 left-0 right-0 bg-white z-40 px-4 py-4">
        <div className="max-w-4xl mx-auto flex justify-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#0F2A44]" />
          <div className="w-2 h-2 rounded-full bg-[#0F2A44]" />
          <div className="w-2 h-2 rounded-full bg-[#0F2A44]" />
          <div className="w-2 h-2 rounded-full bg-neutral-300" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 pt-28 pb-24 px-4 sm:px-6 md:px-8 overflow-y-auto">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-semibold text-[#0F2A44] mb-2">Take a Selfie</h2>
          <p className="text-sm sm:text-base text-[#6B7280] mb-6">Please take a clear photo of yourself for identity verification</p>

          {/* Error Message */}
          {(error || globalError) && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3">
              <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-red-800">{error || globalError?.message}</p>
                {uploading && (
                  <button
                    onClick={retryUpload}
                    className="text-sm text-red-600 underline mt-2"
                  >
                    Retry Upload
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Upload Progress */}
          {uploading && uploadProgress > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-blue-900">Uploading selfie...</p>
                <p className="text-sm font-medium text-blue-900">{uploadProgress}%</p>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          <div className={`border-2 border-dashed rounded-2xl p-8 text-center transition-colors ${
            validationError ? 'border-red-300 bg-red-50' : 'border-neutral-300'
          }`}>
            {selfiePreview ? (
              <div className="space-y-4">
                <div className="relative inline-block">
                  <img
                    src={selfiePreview}
                    alt="Selfie Preview"
                    className="max-h-64 rounded-lg border border-neutral-200"
                  />
                  <button
                    type="button"
                    onClick={removeFile}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    disabled={uploading}
                  >
                    <X size={16} />
                  </button>
                </div>
                <div className="w-16 h-16 bg-[#1FA774]/10 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle size={32} className="text-[#1FA774]" />
                </div>
                <div>
                  <p className="font-medium text-[#0F2A44] mb-1">Selfie Captured</p>
                  {selectedFile && (
                    <>
                      <p className="text-sm text-[#6B7280]">{selectedFile.name}</p>
                      <p className="text-xs text-[#6B7280] mt-1">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </>
                  )}
                </div>
                <button
                  type="button"
                  onClick={removeFile}
                  className="text-[#0F2A44] text-sm underline"
                  disabled={uploading}
                >
                  Retake Photo
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto">
                  <Camera size={32} className="text-[#6B7280]" />
                </div>
                <div>
                  <p className="font-medium text-[#0F2A44] mb-1">
                    Upload a selfie photo
                  </p>
                  <p className="text-sm text-[#6B7280] mb-4">
                    Make sure your face is clearly visible
                  </p>
                  <label htmlFor="selfie-upload">
                    <span className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-medium bg-[#0F2A44] text-white hover:bg-[#0A1F33] cursor-pointer transition-colors">
                      <Camera size={18} className="mr-2" />
                      Take Photo
                    </span>
                  </label>
                  <input
                    id="selfie-upload"
                    type="file"
                    accept="image/*"
                    capture="user"
                    onChange={handleFileSelect}
                    className="hidden"
                    disabled={uploading}
                  />
                </div>
                <p className="text-xs text-[#6B7280]">
                  Supported formats: JPG, PNG (Max 5MB)
                </p>
              </div>
            )}
          </div>
          
          {/* Validation Error */}
          {validationError && (
            <div className="flex items-start gap-2 mt-3">
              <AlertCircle size={16} className="text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-600">{validationError}</p>
            </div>
          )}

          <div className="bg-[#F4F6F8] rounded-xl p-4 sm:p-5 md:p-6 mt-6">
            <p className="text-sm sm:text-base font-medium text-[#0F2A44] mb-2">Tips for a good selfie:</p>
            <ul className="text-sm sm:text-base text-[#6B7280] space-y-1">
              <li className="flex items-start">
                <span className="text-[#1FA774] mr-2">✓</span>
                <span>Face the camera directly</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#1FA774] mr-2">✓</span>
                <span>Remove glasses and hats</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#1FA774] mr-2">✓</span>
                <span>Use good lighting</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#1FA774] mr-2">✓</span>
                <span>Keep a neutral expression</span>
              </li>
            </ul>
          </div>

          <div className="bg-[#F4F6F8] rounded-lg p-3 flex items-start gap-2 mt-4">
            <Info size={16} className="text-[#0F2A44] mt-0.5 flex-shrink-0" />
            <p className="text-xs sm:text-sm text-[#6B7280]">Your selfie will be compared with your ID document to verify your identity</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white px-4 sm:px-6 py-4 border-t border-neutral-200">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={handleSubmit}
            disabled={(!selectedFile && !selfiePreview) || uploading}
            className="w-full bg-[#F4B400] hover:bg-[#E5A800] text-white py-3 sm:py-4 rounded-lg text-base sm:text-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? `Uploading... ${uploadProgress}%` : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  );
};
