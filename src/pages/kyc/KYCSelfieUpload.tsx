import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, CheckCircle, Info } from 'lucide-react';

export const KYCSelfieUpload = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) return;

    setUploading(true);
    try {
      // Store selfie info in session
      sessionStorage.setItem('kyc_selfie', JSON.stringify({
        fileName: selectedFile.name,
        fileSize: selectedFile.size,
      }));

      // Navigate to review page (Step 4)
      navigate('/kyc/review');
    } catch (error) {
      console.error('Error processing selfie:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 bg-white z-50 px-4 py-4 border-b border-neutral-200">
        <div className="max-w-[428px] mx-auto flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="text-[#0F2A44]">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-lg font-medium text-[#0F2A44]">Step 3 of 4</h1>
          <div className="w-6" />
        </div>
      </div>

      {/* Progress Dots */}
      <div className="fixed top-16 left-0 right-0 bg-white z-40 px-4 py-4">
        <div className="max-w-[428px] mx-auto flex justify-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#0F2A44]" />
          <div className="w-2 h-2 rounded-full bg-[#0F2A44]" />
          <div className="w-2 h-2 rounded-full bg-[#0F2A44]" />
          <div className="w-2 h-2 rounded-full bg-neutral-300" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 pt-28 pb-24 px-6 overflow-y-auto">
        <div className="max-w-[428px] mx-auto">
          <h2 className="text-2xl font-semibold text-[#0F2A44] mb-2">Take a Selfie</h2>
          <p className="text-sm text-[#6B7280] mb-6">Please take a clear photo of yourself for identity verification</p>

          <div className="border-2 border-dashed border-neutral-300 rounded-2xl p-8 text-center">
            {selectedFile ? (
              <div className="space-y-4">
                <div className="w-16 h-16 bg-[#1FA774]/10 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle size={32} className="text-[#1FA774]" />
                </div>
                <div>
                  <p className="font-medium text-[#0F2A44] mb-1">Selfie Captured</p>
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
                  />
                </div>
                <p className="text-xs text-[#6B7280]">
                  Supported formats: JPG, PNG (Max 10MB)
                </p>
              </div>
            )}
          </div>

          <div className="bg-[#F4F6F8] rounded-xl p-4 mt-6">
            <p className="text-sm font-medium text-[#0F2A44] mb-2">Tips for a good selfie:</p>
            <ul className="text-sm text-[#6B7280] space-y-1">
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
            <p className="text-xs text-[#6B7280]">Your selfie will be compared with your ID document to verify your identity</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white px-6 py-4 border-t border-neutral-200">
        <div className="max-w-[428px] mx-auto">
          <button
            onClick={handleSubmit}
            disabled={!selectedFile || uploading}
            className="w-full bg-[#F4B400] hover:bg-[#E5A800] text-white py-4 rounded-lg text-base font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? 'Processing...' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  );
};
