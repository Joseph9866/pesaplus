/**
 * KYC Service Tests
 * Tests for KYC service methods
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { kycService } from '../kyc';
import apiClient from '../../client';

// Mock environment to disable mock mode
vi.stubEnv('VITE_USE_MOCK_DATA', 'false');

// Mock the API client
vi.mock('../../client', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

// Mock the file upload utility
vi.mock('../../../kyc/fileUpload', () => ({
  createFormData: vi.fn((files: Record<string, File>) => {
    const formData = new FormData();
    Object.entries(files).forEach(([key, file]) => {
      formData.append(key, file);
    });
    return formData;
  }),
}));

describe('KYC Service - uploadDocuments', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should upload documents with progress tracking', async () => {
    // Mock file objects
    const mockFrontFile = new File(['front'], 'id-front.jpg', { type: 'image/jpeg' });
    const mockBackFile = new File(['back'], 'id-back.jpg', { type: 'image/jpeg' });
    const mockSelfieFile = new File(['selfie'], 'selfie.jpg', { type: 'image/jpeg' });

    // Mock API response
    const mockResponse = {
      data: {
        id_document_front: 'https://example.com/uploads/id-front.jpg',
        id_document_back: 'https://example.com/uploads/id-back.jpg',
        selfie_photo: 'https://example.com/uploads/selfie.jpg',
      },
    };

    vi.mocked(apiClient.post).mockResolvedValue(mockResponse);

    // Mock progress callback
    const onProgress = vi.fn();

    // Call uploadDocuments
    const result = await kycService.uploadDocuments(
      {
        front: mockFrontFile,
        back: mockBackFile,
        selfie: mockSelfieFile,
      },
      onProgress
    );

    // Verify API was called with correct URL
    expect(apiClient.post).toHaveBeenCalledWith(
      expect.stringContaining('/api/v1/accounts/api/kyc/upload/'),
      expect.any(FormData),
      expect.objectContaining({
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: expect.any(Function),
      })
    );

    // Verify result matches expected format
    expect(result).toEqual({
      front: 'https://example.com/uploads/id-front.jpg',
      back: 'https://example.com/uploads/id-back.jpg',
      selfie: 'https://example.com/uploads/selfie.jpg',
    });
  });

  it('should handle upload with only some files', async () => {
    const mockFrontFile = new File(['front'], 'id-front.jpg', { type: 'image/jpeg' });

    const mockResponse = {
      data: {
        id_document_front: 'https://example.com/uploads/id-front.jpg',
      },
    };

    vi.mocked(apiClient.post).mockResolvedValue(mockResponse);

    const result = await kycService.uploadDocuments({
      front: mockFrontFile,
    });

    expect(result).toEqual({
      front: 'https://example.com/uploads/id-front.jpg',
      back: undefined,
      selfie: undefined,
    });
  });

  it('should track upload progress', async () => {
    const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const mockResponse = {
      data: {
        id_document_front: 'https://example.com/uploads/test.jpg',
      },
    };

    // Capture the onUploadProgress callback
    let progressCallback: ((event: any) => void) | undefined;
    vi.mocked(apiClient.post).mockImplementation((url, data, config) => {
      progressCallback = config?.onUploadProgress;
      return Promise.resolve(mockResponse);
    });

    const onProgress = vi.fn();

    await kycService.uploadDocuments({ front: mockFile }, onProgress);

    // Simulate progress events
    if (progressCallback) {
      progressCallback({ loaded: 50, total: 100 });
      expect(onProgress).toHaveBeenCalledWith(50);

      progressCallback({ loaded: 100, total: 100 });
      expect(onProgress).toHaveBeenCalledWith(100);
    }
  });

  it('should handle upload errors', async () => {
    const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

    const mockError = {
      response: {
        status: 400,
        data: {
          message: 'Invalid file format',
          code: 'INVALID_FILE',
        },
      },
    };

    vi.mocked(apiClient.post).mockRejectedValue(mockError);

    await expect(
      kycService.uploadDocuments({ front: mockFile })
    ).rejects.toMatchObject({
      message: 'Invalid file format',
      status: 400,
      code: 'VALIDATION_ERROR', // Error handler transforms 400 errors to VALIDATION_ERROR
    });
  });

  it('should handle network errors during upload', async () => {
    const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

    const mockError = {
      request: {},
      message: 'Network Error',
    };

    vi.mocked(apiClient.post).mockRejectedValue(mockError);

    await expect(
      kycService.uploadDocuments({ front: mockFile })
    ).rejects.toMatchObject({
      message: 'Unable to connect. Please check your internet connection and try again.',
      status: 0,
      code: 'NETWORK_ERROR',
    });
  });
});

describe('KYC Service - Requirements Validation', () => {
  it('validates Requirement 3.3: Uses multipart/form-data encoding', async () => {
    const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const mockResponse = {
      data: {
        id_document_front: 'https://example.com/uploads/test.jpg',
      },
    };

    vi.mocked(apiClient.post).mockResolvedValue(mockResponse);

    await kycService.uploadDocuments({ front: mockFile });

    // Verify Content-Type header is set to multipart/form-data
    expect(apiClient.post).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(FormData),
      expect.objectContaining({
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
    );
  });

  it('validates Requirement 3.4: Tracks upload progress', async () => {
    const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const mockResponse = {
      data: {
        id_document_front: 'https://example.com/uploads/test.jpg',
      },
    };

    vi.mocked(apiClient.post).mockResolvedValue(mockResponse);

    const onProgress = vi.fn();
    await kycService.uploadDocuments({ front: mockFile }, onProgress);

    // Verify onUploadProgress callback is provided
    expect(apiClient.post).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(FormData),
      expect.objectContaining({
        onUploadProgress: expect.any(Function),
      })
    );
  });

  it('validates Requirement 3.5: Returns uploaded file URLs', async () => {
    const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const mockResponse = {
      data: {
        id_document_front: 'https://example.com/uploads/test.jpg',
      },
    };

    vi.mocked(apiClient.post).mockResolvedValue(mockResponse);

    const result = await kycService.uploadDocuments({ front: mockFile });

    // Verify the result contains the uploaded file URL
    expect(result.front).toBe('https://example.com/uploads/test.jpg');
    expect(typeof result.front).toBe('string');
  });
});
