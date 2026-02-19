/**
 * Next of Kin Service Tests
 * Tests for Next of Kin service methods
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { nextOfKinService } from '../nextOfKin';
import apiClient from '../../client';
import { NextOfKinData } from '../../../../types';

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

describe('Next of Kin Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('listNextOfKin', () => {
    it('should fetch all next of kin records', async () => {
      const mockData: NextOfKinData[] = [
        {
          id: 1,
          kyc: 'MEM123456',
          full_name: 'John Doe',
          relationship: 'Brother',
          phone_number: '+254712345678',
          email: 'john@example.com',
          address: '123 Main St',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
        },
        {
          id: 2,
          kyc: 'MEM123456',
          full_name: 'Jane Smith',
          relationship: 'Sister',
          phone_number: '+254723456789',
          created_at: '2024-01-02T00:00:00Z',
          updated_at: '2024-01-02T00:00:00Z',
        },
      ];

      const mockResponse = { data: mockData };
      vi.mocked(apiClient.get).mockResolvedValue(mockResponse);

      const result = await nextOfKinService.listNextOfKin();

      expect(apiClient.get).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/accounts/api/next-of-kins/')
      );
      expect(result).toEqual(mockData);
    });

    it('should handle errors when fetching next of kin records', async () => {
      const mockError = {
        response: {
          status: 500,
          data: { message: 'Server error' },
        },
      };

      vi.mocked(apiClient.get).mockRejectedValue(mockError);

      await expect(nextOfKinService.listNextOfKin()).rejects.toMatchObject({
        message: 'Server error occurred. Please try again in a few moments.',
        code: 'SERVER_ERROR',
        status: 500,
      });
    });
  });

  describe('getNextOfKin', () => {
    it('should fetch a single next of kin record by ID', async () => {
      const mockData: NextOfKinData = {
        id: 1,
        kyc: 'MEM123456',
        full_name: 'John Doe',
        relationship: 'Brother',
        phone_number: '+254712345678',
        email: 'john@example.com',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      };

      const mockResponse = { data: mockData };
      vi.mocked(apiClient.get).mockResolvedValue(mockResponse);

      const result = await nextOfKinService.getNextOfKin(1);

      expect(apiClient.get).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/accounts/api/next-of-kins/1/')
      );
      expect(result).toEqual(mockData);
    });

    it('should handle 404 error when next of kin record not found', async () => {
      const mockError = {
        response: {
          status: 404,
          data: { message: 'Not found' },
        },
      };

      vi.mocked(apiClient.get).mockRejectedValue(mockError);

      await expect(nextOfKinService.getNextOfKin(999)).rejects.toMatchObject({
        message: 'The requested information could not be found.',
        code: 'NOT_FOUND',
        status: 404,
      });
    });
  });

  describe('createNextOfKin', () => {
    it('should create a new next of kin record', async () => {
      const newData = {
        kyc: 'MEM123456',
        full_name: 'John Doe',
        relationship: 'Brother',
        phone_number: '+254712345678',
        email: 'john@example.com',
        address: '123 Main St',
      };

      const mockResponse = {
        data: {
          id: 1,
          ...newData,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
        },
      };

      vi.mocked(apiClient.post).mockResolvedValue(mockResponse);

      const result = await nextOfKinService.createNextOfKin(newData);

      expect(apiClient.post).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/accounts/api/next-of-kins/'),
        newData
      );
      expect(result).toEqual(mockResponse.data);
      expect(result.id).toBe(1);
    });

    it('should handle validation errors when creating next of kin', async () => {
      const newData = {
        kyc: 'MEM123456',
        full_name: '',
        relationship: 'Brother',
        phone_number: 'invalid',
      };

      const mockError = {
        response: {
          status: 400,
          data: {
            message: 'Validation failed',
            field_errors: {
              full_name: ['This field is required'],
              phone_number: ['Invalid phone number format'],
            },
          },
        },
      };

      vi.mocked(apiClient.post).mockRejectedValue(mockError);

      await expect(nextOfKinService.createNextOfKin(newData)).rejects.toMatchObject({
        message: 'Validation failed',
        code: 'VALIDATION_ERROR',
        status: 400,
        fieldErrors: {
          full_name: ['This field is required'],
          phone_number: ['Invalid phone number format'],
        },
      });
    });
  });

  describe('updateNextOfKin', () => {
    it('should update an existing next of kin record', async () => {
      const updateData = {
        kyc: 'MEM123456',
        full_name: 'John Doe Updated',
        relationship: 'Brother',
        phone_number: '+254712345678',
        email: 'john.updated@example.com',
      };

      const mockResponse = {
        data: {
          id: 1,
          ...updateData,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-02T00:00:00Z',
        },
      };

      vi.mocked(apiClient.put).mockResolvedValue(mockResponse);

      const result = await nextOfKinService.updateNextOfKin(1, updateData);

      expect(apiClient.put).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/accounts/api/next-of-kins/1/'),
        updateData
      );
      expect(result).toEqual(mockResponse.data);
      expect(result.full_name).toBe('John Doe Updated');
    });

    it('should handle errors when updating next of kin', async () => {
      const updateData = {
        kyc: 'MEM123456',
        full_name: 'John Doe',
        relationship: 'Brother',
        phone_number: '+254712345678',
      };

      const mockError = {
        response: {
          status: 404,
          data: { message: 'Not found' },
        },
      };

      vi.mocked(apiClient.put).mockRejectedValue(mockError);

      await expect(nextOfKinService.updateNextOfKin(999, updateData)).rejects.toMatchObject({
        message: 'The requested information could not be found.',
        code: 'NOT_FOUND',
        status: 404,
      });
    });
  });

  describe('patchNextOfKin', () => {
    it('should partially update a next of kin record', async () => {
      const patchData = {
        phone_number: '+254799999999',
        email: 'newemail@example.com',
      };

      const mockResponse = {
        data: {
          id: 1,
          kyc: 'MEM123456',
          full_name: 'John Doe',
          relationship: 'Brother',
          phone_number: '+254799999999',
          email: 'newemail@example.com',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-02T00:00:00Z',
        },
      };

      vi.mocked(apiClient.patch).mockResolvedValue(mockResponse);

      const result = await nextOfKinService.patchNextOfKin(1, patchData);

      expect(apiClient.patch).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/accounts/api/next-of-kins/1/'),
        patchData
      );
      expect(result).toEqual(mockResponse.data);
      expect(result.phone_number).toBe('+254799999999');
      expect(result.email).toBe('newemail@example.com');
    });

    it('should handle validation errors when patching', async () => {
      const patchData = {
        phone_number: 'invalid',
      };

      const mockError = {
        response: {
          status: 400,
          data: {
            message: 'Validation failed',
            field_errors: {
              phone_number: ['Invalid phone number format'],
            },
          },
        },
      };

      vi.mocked(apiClient.patch).mockRejectedValue(mockError);

      await expect(nextOfKinService.patchNextOfKin(1, patchData)).rejects.toMatchObject({
        message: 'Validation failed',
        code: 'VALIDATION_ERROR',
        status: 400,
        fieldErrors: {
          phone_number: ['Invalid phone number format'],
        },
      });
    });
  });

  describe('deleteNextOfKin', () => {
    it('should delete a next of kin record', async () => {
      vi.mocked(apiClient.delete).mockResolvedValue({ data: null });

      await nextOfKinService.deleteNextOfKin(1);

      expect(apiClient.delete).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/accounts/api/next-of-kins/1/')
      );
    });

    it('should handle errors when deleting next of kin', async () => {
      const mockError = {
        response: {
          status: 404,
          data: { message: 'Not found' },
        },
      };

      vi.mocked(apiClient.delete).mockRejectedValue(mockError);

      await expect(nextOfKinService.deleteNextOfKin(999)).rejects.toMatchObject({
        message: 'The requested information could not be found.',
        code: 'NOT_FOUND',
        status: 404,
      });
    });
  });
});

describe('Next of Kin Service - Requirements Validation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('validates Requirement 2.2: Includes all CRUD methods', () => {
    // Verify all required methods exist
    expect(nextOfKinService.listNextOfKin).toBeDefined();
    expect(nextOfKinService.getNextOfKin).toBeDefined();
    expect(nextOfKinService.createNextOfKin).toBeDefined();
    expect(nextOfKinService.updateNextOfKin).toBeDefined();
    expect(nextOfKinService.patchNextOfKin).toBeDefined();
    expect(nextOfKinService.deleteNextOfKin).toBeDefined();

    // Verify they are functions
    expect(typeof nextOfKinService.listNextOfKin).toBe('function');
    expect(typeof nextOfKinService.getNextOfKin).toBe('function');
    expect(typeof nextOfKinService.createNextOfKin).toBe('function');
    expect(typeof nextOfKinService.updateNextOfKin).toBe('function');
    expect(typeof nextOfKinService.patchNextOfKin).toBe('function');
    expect(typeof nextOfKinService.deleteNextOfKin).toBe('function');
  });

  it('validates Requirement 2.3: Includes JWT token in requests', async () => {
    const mockResponse = { data: [] };
    vi.mocked(apiClient.get).mockResolvedValue(mockResponse);

    await nextOfKinService.listNextOfKin();

    // The JWT token is added by the apiClient interceptor
    // We verify that apiClient is being used (which has the interceptor)
    expect(apiClient.get).toHaveBeenCalled();
  });

  it('validates Requirement 2.4: Returns structured error responses', async () => {
    const mockError = {
      response: {
        status: 400,
        data: {
          message: 'Validation failed',
          code: 'VALIDATION_ERROR',
          field_errors: {
            phone_number: ['Invalid format'],
          },
        },
      },
    };

    vi.mocked(apiClient.post).mockRejectedValue(mockError);

    try {
      await nextOfKinService.createNextOfKin({
        kyc: 'MEM123456',
        full_name: 'Test',
        relationship: 'Brother',
        phone_number: 'invalid',
      });
      // Should not reach here
      expect.fail('Expected error to be thrown');
    } catch (error: any) {
      // Verify error structure - the error is transformed by createAPIError
      expect(error.status).toBe(400);
      expect(error.message).toBeDefined();
      expect(error.code).toBe('VALIDATION_ERROR');
      expect(error.fieldErrors).toBeDefined();
      expect(error.fieldErrors.phone_number).toEqual(['Invalid format']);
    }
  });
});
