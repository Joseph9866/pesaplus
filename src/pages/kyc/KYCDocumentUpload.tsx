import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, CheckCircle, Info, AlertCircle, X } from 'lucide-react';
import { validateFile, generatePreview } from '../../lib/kyc/fileUpload';
import { saveDraft, loadDraft } from '../../lib/kyc/draftManager';
import { useErrorHandler } from '../../hooks/useErrorHandler';

export const KYCDocumentUpload = () => {
  const navigate = useNavigate();
  const { error: globalError, handleError, clearError } = useErrorHandler();
  const [frontFile, setFrontFile] = useState<File | null>(null);
  const [backFile, setBackFile] = useState<File | null>(null);
  const [frontPreview, setFrontPreview] = useState<string | null>(null);
  const [backPreview, setBackPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState<'front' | 'back' | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<{ front?: string; back?: string }>({});

  // Load draft data on mount
  useEffect(() => {
    try {
      clearError(); // Clear any previous errors
      const draft = loadDraft();
      if (draft?.documents) {
        setFrontPreview(draft.documents.id_front_preview || null);
        setBackPreview(draft.documents.id_back_preview || null);
      }
    } catch (err) {
      console.error('Error loading draft data:', err);
      handleError(err);
    }
  }, [clearError, handleError]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>, side: 'front' | 'back') => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Clear previous errors
    setValidationErrors(prev => ({ ...prev, [side]: undefined }));
    setError(null);

    // Validate file
    const validation = validateFile(file);
    if (!validation.valid) {
      setValidationErrors(prev => ({ ...prev, [side]: validation.error }));
      return;
    }

    try {
      // Generate preview for images
      const preview = await generatePreview(file);
      
      if (side === 'front') {
        setFrontFile(file);
        setFrontPreview(preview);
        
        // Save to draft
        saveDraft({
          documents: {
            id_front_preview: preview,
            id_back_preview: backPreview || undefined,
          },
          currentStep: 2,
        });
      } else {
        setBackFile(file);
        setBackPreview(preview);
        
        // Save to draft
        saveDraft({
          documents: {
            id_front_preview: frontPreview || undefined,
            id_back_preview: preview,
          },
          currentStep: 2,
        });
      }
    } catch (err) {
      console.error('Error generating preview:', err);
      setValidationErrors(prev => ({ 
        ...prev, 
        [side]: 'Failed to generate preview. Please try another file.' 
      }));
    }
  };

  const handleDrag = (e: React.DragEvent, side: 'front' | 'back') => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(side);
    } else if (e.type === 'dragleave') {
      setDragActive(null);
    }
  };

  const handleDrop = async (e: React.DragEvent, side: 'front' | 'back') => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(null);
    
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    // Clear previous errors
    setValidationErrors(prev => ({ ...prev, [side]: undefined }));
    setError(null);

    // Validate file
    const validation = validateFile(file);
    if (!validation.valid) {
      setValidationErrors(prev => ({ ...prev, [side]: validation.error }));
      return;
    }

    try {
      // Generate preview for images
      const preview = await generatePreview(file);
      
      if (side === 'front') {
        setFrontFile(file);
        setFrontPreview(preview);
        
        // Save to draft
        saveDraft({
          documents: {
            id_front_preview: preview,
            id_back_preview: backPreview || undefined,
          },
          currentStep: 2,
        });
      } else {
        setBackFile(file);
        setBackPreview(preview);
        
        // Save to draft
        saveDraft({
          documents: {
            id_front_preview: frontPreview || undefined,
            id_back_preview: preview,
          },
          currentStep: 2,
        });
      }
    } catch (err) {
      console.error('Error generating preview:', err);
      setValidationErrors(prev => ({ 
        ...prev, 
        [side]: 'Failed to generate preview. Please try another file.' 
      }));
    }
  };

  const removeFile = (side: 'front' | 'back') => {
    if (side === 'front') {
      setFrontFile(null);
      setFrontPreview(null);
      
      // Update draft
      saveDraft({
        documents: {
          id_front_preview: undefined,
          id_back_preview: backPreview || undefined,
        },
        currentStep: 2,
      });
    } else {
      setBackFile(null);
      setBackPreview(null);
      
      // Update draft
      saveDraft({
        documents: {
          id_front_preview: frontPreview || undefined,
          id_back_preview: undefined,
        },
        currentStep: 2,
      });
    }
    
    // Clear validation error for this side
    setValidationErrors(prev => ({ ...prev, [side]: undefined }));
  };

  const handleSubmit = async () => {
    // Validate that at least front document is uploaded
    if (!frontFile && !frontPreview) {
      setError('Please upload at least the front of your ID document');
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

      // Navigate to selfie upload (Step 3)
      navigate('/kyc/selfie-upload');
    } catch (err) {
      console.error('Error uploading documents:', err);
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
          <h1 className="text-base sm:text-lg font-medium text-[#0F2A44]">Step 2 of 4</h1>
          <div className="w-6" />
        </div>
      </div>

      {/* Progress Dots */}
      <div className="fixed top-16 left-0 right-0 bg-white z-40 px-4 py-4">
        <div className="max-w-4xl mx-auto flex justify-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#0F2A44]" />
          <div className="w-2 h-2 rounded-full bg-[#0F2A44]" />
          <div className="w-2 h-2 rounded-full bg-neutral-300" />
          <div className="w-2 h-2 rounded-full bg-neutral-300" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 pt-28 pb-24 px-4 sm:px-6 md:px-8 overflow-y-auto">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-semibold text-[#0F2A44] mb-2">Upload ID Document</h2>
          <p className="text-sm sm:text-base text-[#6B7280] mb-6">Please upload clear photos of both sides of your National ID, Passport, or Driver's License</p>

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
                <p className="text-sm font-medium text-blue-900">Uploading documents...</p>
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

          {/* Front Document Upload */}
          <div className="mb-6">
            <h3 className="text-base font-medium text-[#0F2A44] mb-3">Front of ID Document *</h3>
            <div
              onDragEnter={(e) => handleDrag(e, 'front')}
              onDragLeave={(e) => handleDrag(e, 'front')}
              onDragOver={(e) => handleDrag(e, 'front')}
              onDrop={(e) => handleDrop(e, 'front')}
              className={`border-2 border-dashed rounded-2xl p-6 text-center transition-colors ${
                dragActive === 'front'
                  ? 'border-[#0F2A44] bg-[#0F2A44]/5'
                  : validationErrors.front
                  ? 'border-red-300 bg-red-50'
                  : 'border-neutral-300'
              }`}
            >
              {frontPreview ? (
                <div className="space-y-4">
                  <div className="relative inline-block">
                    <img
                      src={frontPreview}
                      alt="ID Front Preview"
                      className="max-h-48 rounded-lg border border-neutral-200"
                    />
                    <button
                      type="button"
                      onClick={() => removeFile('front')}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      disabled={uploading}
                    >
                      <X size={16} />
                    </button>
                  </div>
                  <div className="w-12 h-12 bg-[#1FA774]/10 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle size={24} className="text-[#1FA774]" />
                  </div>
                  <p className="text-sm font-medium text-[#0F2A44]">Front uploaded successfully</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center mx-auto">
                    <Upload size={24} className="text-[#6B7280]" />
                  </div>
                  <div>
                    <p className="font-medium text-[#0F2A44] mb-1">
                      Drag and drop your file here
                    </p>
                    <p className="text-sm text-[#6B7280] mb-4">
                      or click to browse
                    </p>
                    <label htmlFor="front-upload">
                      <span className="inline-flex items-center justify-center px-6 py-2 rounded-lg font-medium bg-[#0F2A44] text-white hover:bg-[#0A1F33] cursor-pointer transition-colors">
                        Choose File
                      </span>
                    </label>
                    <input
                      id="front-upload"
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,application/pdf"
                      onChange={(e) => handleFileSelect(e, 'front')}
                      className="hidden"
                      disabled={uploading}
                    />
                  </div>
                  <p className="text-xs text-[#6B7280]">
                    Supported formats: JPG, PNG, PDF (Max 5MB)
                  </p>
                </div>
              )}
            </div>
            {validationErrors.front && (
              <div className="flex items-start gap-2 mt-2">
                <AlertCircle size={16} className="text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-600">{validationErrors.front}</p>
              </div>
            )}
          </div>

          {/* Back Document Upload */}
          <div className="mb-6">
            <h3 className="text-base font-medium text-[#0F2A44] mb-3">Back of ID Document (Optional)</h3>
            <div
              onDragEnter={(e) => handleDrag(e, 'back')}
              onDragLeave={(e) => handleDrag(e, 'back')}
              onDragOver={(e) => handleDrag(e, 'back')}
              onDrop={(e) => handleDrop(e, 'back')}
              className={`border-2 border-dashed rounded-2xl p-6 text-center transition-colors ${
                dragActive === 'back'
                  ? 'border-[#0F2A44] bg-[#0F2A44]/5'
                  : validationErrors.back
                  ? 'border-red-300 bg-red-50'
                  : 'border-neutral-300'
              }`}
            >
              {backPreview ? (
                <div className="space-y-4">
                  <div className="relative inline-block">
                    <img
                      src={backPreview}
                      alt="ID Back Preview"
                      className="max-h-48 rounded-lg border border-neutral-200"
                    />
                    <button
                      type="button"
                      onClick={() => removeFile('back')}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      disabled={uploading}
                    >
                      <X size={16} />
                    </button>
                  </div>
                  <div className="w-12 h-12 bg-[#1FA774]/10 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle size={24} className="text-[#1FA774]" />
                  </div>
                  <p className="text-sm font-medium text-[#0F2A44]">Back uploaded successfully</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center mx-auto">
                    <Upload size={24} className="text-[#6B7280]" />
                  </div>
                  <div>
                    <p className="font-medium text-[#0F2A44] mb-1">
                      Drag and drop your file here
                    </p>
                    <p className="text-sm text-[#6B7280] mb-4">
                      or click to browse
                    </p>
                    <label htmlFor="back-upload">
                      <span className="inline-flex items-center justify-center px-6 py-2 rounded-lg font-medium bg-[#0F2A44] text-white hover:bg-[#0A1F33] cursor-pointer transition-colors">
                        Choose File
                      </span>
                    </label>
                    <input
                      id="back-upload"
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,application/pdf"
                      onChange={(e) => handleFileSelect(e, 'back')}
                      className="hidden"
                      disabled={uploading}
                    />
                  </div>
                  <p className="text-xs text-[#6B7280]">
                    Supported formats: JPG, PNG, PDF (Max 5MB)
                  </p>
                </div>
              )}
            </div>
            {validationErrors.back && (
              <div className="flex items-start gap-2 mt-2">
                <AlertCircle size={16} className="text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-600">{validationErrors.back}</p>
              </div>
            )}
          </div>

          <div className="bg-[#F4F6F8] rounded-xl p-4 sm:p-5 md:p-6 mt-6">
            <p className="text-sm sm:text-base font-medium text-[#0F2A44] mb-2">Tips for a clear photo:</p>
            <ul className="text-sm sm:text-base text-[#6B7280] space-y-1">
              <li className="flex items-start">
                <span className="text-[#1FA774] mr-2">✓</span>
                <span>Ensure all text is clearly visible</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#1FA774] mr-2">✓</span>
                <span>Avoid glare and shadows</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#1FA774] mr-2">✓</span>
                <span>Capture the entire document</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#1FA774] mr-2">✓</span>
                <span>Use good lighting</span>
              </li>
            </ul>
          </div>

          <div className="bg-[#F4F6F8] rounded-lg p-3 flex items-start gap-2 mt-4">
            <Info size={16} className="text-[#0F2A44] mt-0.5 flex-shrink-0" />
            <p className="text-xs sm:text-sm text-[#6B7280]">Your document will be securely stored and only used for verification purposes</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white px-4 sm:px-6 py-4 border-t border-neutral-200">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={handleSubmit}
            disabled={(!frontFile && !frontPreview) || uploading}
            className="w-full bg-[#F4B400] hover:bg-[#E5A800] text-white py-3 sm:py-4 rounded-lg text-base sm:text-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? `Uploading... ${uploadProgress}%` : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  );
};
