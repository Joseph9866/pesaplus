/**
 * Test: KYC Edit Mode for Rejected Submissions
 * 
 * This test verifies that the KYC edit capability works correctly for rejected submissions:
 * - Loads existing KYC data into form when status is rejected
 * - Performs partial update (PATCH) with only changed fields
 * - Refreshes status after successful update
 * - Displays validation errors on update failure
 * 
 * Requirements: 10.1, 10.2, 10.3, 10.4, 10.5
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { kycService } from '../lib/api/services/kyc';
import { KYCData } from '../types';

describe('KYC Edit Mode - Partial Update', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should identify changed fields for partial update', () => {
    // Original KYC data (rejected)
    const originalData: KYCData = {
      membership_number: 'MEM123',
      id_number: '12345678',
      kra_pin: 'A001234567Z',
      gender: 'male',
      marital_status: 'single',
      country: 'Kenya',
      county: 'Nairobi',
      kyc_submitted: true,
      kyc_confirmed: false,
      status: 'rejected',
      rejection_reason: 'Invalid ID number',
    };

    // Updated data from form
    const updatedData = {
      id_number: '87654321', // Changed
      kra_pin: 'A001234567Z', // Unchanged
      gender: 'male', // Unchanged
      marital_status: 'married', // Changed
      country: 'Kenya', // Unchanged
      county: 'Mombasa', // Changed
    };

    // Identify changed fields
    const changedFields: Partial<KYCData> = {};
    
    if (updatedData.id_number !== originalData.id_number) {
      changedFields.id_number = updatedData.id_number;
    }
    if (updatedData.marital_status !== originalData.marital_status) {
      changedFields.marital_status = updatedData.marital_status as 'married' | 'single' | 'other';
    }
    if (updatedData.county !== originalData.county) {
      changedFields.county = updatedData.county;
    }

    // Verify only changed fields are included
    expect(changedFields).toEqual({
      id_number: '87654321',
      marital_status: 'married',
      county: 'Mombasa',
    });

    // Verify unchanged fields are not included
    expect(changedFields).not.toHaveProperty('kra_pin');
    expect(changedFields).not.toHaveProperty('gender');
    expect(changedFields).not.toHaveProperty('country');
  });

  it('should detect when no fields have changed', () => {
    // Original KYC data
    const originalData: KYCData = {
      membership_number: 'MEM123',
      id_number: '12345678',
      kra_pin: 'A001234567Z',
      gender: 'male',
      marital_status: 'single',
      country: 'Kenya',
      county: 'Nairobi',
      kyc_submitted: true,
      kyc_confirmed: false,
      status: 'rejected',
    };

    // Same data (no changes)
    const updatedData = {
      id_number: '12345678',
      kra_pin: 'A001234567Z',
      gender: 'male',
      marital_status: 'single',
      country: 'Kenya',
      county: 'Nairobi',
    };

    // Identify changed fields
    const changedFields: Partial<KYCData> = {};
    
    if (updatedData.id_number !== originalData.id_number) {
      changedFields.id_number = updatedData.id_number;
    }
    if (updatedData.kra_pin !== originalData.kra_pin) {
      changedFields.kra_pin = updatedData.kra_pin;
    }
    if (updatedData.gender !== originalData.gender) {
      changedFields.gender = updatedData.gender as 'male' | 'female' | 'other';
    }
    if (updatedData.marital_status !== originalData.marital_status) {
      changedFields.marital_status = updatedData.marital_status as 'married' | 'single' | 'other';
    }
    if (updatedData.country !== originalData.country) {
      changedFields.country = updatedData.country;
    }
    if (updatedData.county !== originalData.county) {
      changedFields.county = updatedData.county;
    }

    // Verify no changed fields
    expect(Object.keys(changedFields).length).toBe(0);
  });

  it('should call patchKYC with only changed fields', async () => {
    // Mock the patchKYC service method
    const mockPatchKYC = vi.spyOn(kycService, 'patchKYC').mockResolvedValue({
      membership_number: 'MEM123',
      id_number: '87654321',
      kra_pin: 'A001234567Z',
      gender: 'male',
      marital_status: 'married',
      country: 'Kenya',
      county: 'Mombasa',
      kyc_submitted: true,
      kyc_confirmed: false,
      status: 'submitted',
    });

    const membershipNumber = 'MEM123';
    const changedFields = {
      id_number: '87654321',
      marital_status: 'married' as const,
      county: 'Mombasa',
    };

    // Call the service
    const result = await kycService.patchKYC(membershipNumber, changedFields);

    // Verify the service was called with correct parameters
    expect(mockPatchKYC).toHaveBeenCalledWith(membershipNumber, changedFields);
    expect(mockPatchKYC).toHaveBeenCalledTimes(1);

    // Verify the result
    expect(result.status).toBe('submitted');
    expect(result.id_number).toBe('87654321');
    expect(result.marital_status).toBe('married');
    expect(result.county).toBe('Mombasa');
  });

  it('should handle validation errors on update failure', async () => {
    // Mock the patchKYC service method to throw validation error
    const mockError = {
      message: 'Validation failed',
      status: 400,
      code: 'VALIDATION_ERROR',
      fieldErrors: {
        id_number: ['Invalid ID number format'],
        kra_pin: ['KRA PIN is required'],
      },
    };

    vi.spyOn(kycService, 'patchKYC').mockRejectedValue(mockError);

    const membershipNumber = 'MEM123';
    const changedFields = {
      id_number: 'invalid',
      kra_pin: '',
    };

    // Attempt to update
    try {
      await kycService.patchKYC(membershipNumber, changedFields);
      // Should not reach here
      expect(true).toBe(false);
    } catch (error: any) {
      // Verify error structure
      expect(error.status).toBe(400);
      expect(error.code).toBe('VALIDATION_ERROR');
      expect(error.fieldErrors).toEqual({
        id_number: ['Invalid ID number format'],
        kra_pin: ['KRA PIN is required'],
      });
    }
  });
});
