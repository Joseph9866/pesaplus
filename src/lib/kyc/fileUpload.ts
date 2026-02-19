/**
 * File Upload Handler
 * Handles file validation, preview generation, and FormData creation for KYC document uploads
 */

// Accepted file types
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];
const ACCEPTED_DOCUMENT_TYPES = [...ACCEPTED_IMAGE_TYPES, 'application/pdf'];

// Maximum file size: 5MB
const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Validation result interface
export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validates a file based on type and size constraints
 * @param file - The file to validate
 * @returns Validation result with error message if invalid
 */
export function validateFile(file: File): FileValidationResult {
  // Check file type
  if (!ACCEPTED_DOCUMENT_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: 'Invalid file type. Please upload a JPEG, PNG, or PDF file.',
    };
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
    return {
      valid: false,
      error: `File size (${sizeMB}MB) exceeds the maximum allowed size of 5MB.`,
    };
  }

  return { valid: true };
}

/**
 * Generates a preview URL for an image file
 * @param file - The image file to generate a preview for
 * @returns Promise that resolves to a data URL for the image preview
 */
export function generatePreview(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    // Only generate previews for image files
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      reject(new Error('Preview generation is only supported for image files (JPEG, PNG).'));
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result === 'string') {
        resolve(result);
      } else {
        reject(new Error('Failed to generate preview: Invalid result type.'));
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file for preview generation.'));
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Creates FormData for multipart file upload
 * @param files - Object containing files to upload with their field names
 * @returns FormData object ready for multipart upload
 */
export function createFormData(files: Record<string, File>): FormData {
  const formData = new FormData();

  Object.entries(files).forEach(([fieldName, file]) => {
    formData.append(fieldName, file);
  });

  return formData;
}

/**
 * File upload handler with all utilities
 */
export const fileUploadHandler = {
  validateFile,
  generatePreview,
  createFormData,
  
  // Constants for external use
  ACCEPTED_IMAGE_TYPES,
  ACCEPTED_DOCUMENT_TYPES,
  MAX_FILE_SIZE,
};

export default fileUploadHandler;
