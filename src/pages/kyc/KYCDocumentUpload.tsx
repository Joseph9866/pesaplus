import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, CheckCircle, Info } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

export const KYCDocumentUpload = () => {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) return;

    setUploading(true);
    try {
      const personalInfoString = sessionStorage.getItem('kyc_personal_info');
      const personalInfo = personalInfoString ? JSON.parse(personalInfoString) : {};

      // Store document info in session for next step
      sessionStorage.setItem('kyc_document', JSON.stringify({
        fileName: selectedFile.name,
        fileSize: selectedFile.size,
      }));

      // Navigate to selfie upload (Step 3)
      navigate('/kyc/selfie-upload');
    } catch (error) {
      console.error('Error processing document:', error);
    } finally {
      setUploading(false);
    }
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
          <p className="text-sm sm:text-base text-[#6B7280] mb-6">Please upload a clear photo of your National ID, Passport, or Driver's License</p>

          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-2xl p-8 text-center transition-colors ${
              dragActive
                ? 'border-[#0F2A44] bg-[#0F2A44]/5'
                : 'border-neutral-300'
            }`}
          >
            {selectedFile ? (
              <div className="space-y-4">
                <div className="w-16 h-16 bg-[#1FA774]/10 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle size={32} className="text-[#1FA774]" />
                </div>
                <div>
                  <p className="font-medium text-[#0F2A44] mb-1">File Selected</p>
                  <p className="text-sm text-[#6B7280]">{selectedFile.name}</p>
                  <p className="text-xs text-[#6B7280] mt-1">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedFile(null)}
                  className="text-[#0F2A44] text-sm underline"
                >
                  Choose Different File
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto">
                  <Upload size={32} className="text-[#6B7280]" />
                </div>
                <div>
                  <p className="font-medium text-[#0F2A44] mb-1">
                    Drag and drop your file here
                  </p>
                  <p className="text-sm text-[#6B7280] mb-4">
                    or click to browse
                  </p>
                  <label htmlFor="file-upload">
                    <span className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-medium bg-[#0F2A44] text-white hover:bg-[#0A1F33] cursor-pointer transition-colors">
                      Choose File
                    </span>
                  </label>
                  <input
                    id="file-upload"
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>
                <p className="text-xs text-[#6B7280]">
                  Supported formats: JPG, PNG, PDF (Max 10MB)
                </p>
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
            disabled={!selectedFile || uploading}
            className="w-full bg-[#F4B400] hover:bg-[#E5A800] text-white py-3 sm:py-4 rounded-lg text-base sm:text-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? 'Uploading...' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  );
};
