/**
 * KYC Service
 * Handles all KYC-related API calls
 */

import apiClient from '../client';
import { API_ENDPOINTS } from '../config';
import { KYCData } from '../../../types';
import { createAPIError } from '../errorHandler';
import { mockKYCService } from './mock';

/**
 * Check if mock mode is enabled
 */
const isMockMode = (): boolean => {
  const useMockData = import.meta.env.VITE_USE_MOCK_DATA;
  return useMockData === 'true' || useMockData === true;
};

export const kycService = {
  /**
   * Get all KYC records for the authenticated user
   */
  listKYC: async (): Promise<KYCData[]> => {
    // Use mock service if mock mode is enabled
    if (isMockMode()) {
      console.log('[MODE] Using mock service for listKYC');
      return mockKYCService.listKYC();
    }

    try {
      const url = API_ENDPOINTS.kyc.list;
      console.log('Fetching KYC records from:', url);

      const response = await apiClient.get<KYCData[]>(url);
      console.log('KYC records fetched successfully:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching KYC records:', error.response?.data || error.message);
      throw createAPIError(error);
    }
  },

  /**
   * Get a single KYC record by membership number
   */
  getKYC: async (membershipNumber: string): Promise<KYCData> => {
    // Use mock service if mock mode is enabled
    if (isMockMode()) {
      console.log('[MODE] Using mock service for getKYC');
      return mockKYCService.getKYC(membershipNumber);
    }

    try {
      const url = API_ENDPOINTS.kyc.detail(membershipNumber);
      console.log('Fetching KYC record from:', url);

      const response = await apiClient.get<KYCData>(url);
      console.log('KYC record fetched successfully:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching KYC record:', error.response?.data || error.message);
      throw createAPIError(error);
    }
  },

  /**
   * Create a new KYC submission
   */
  createKYC: async (data: KYCData): Promise<KYCData> => {
    // Use mock service if mock mode is enabled
    if (isMockMode()) {
      console.log('[MODE] Using mock service for createKYC');
      return mockKYCService.createKYC(data);
    }

    try {
      const url = API_ENDPOINTS.kyc.list;
      console.log('Creating KYC record at:', url);
      console.log('KYC data:', data);

      const response = await apiClient.post<KYCData>(url, data);
      console.log('KYC record created successfully:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error creating KYC record:', error.response?.data || error.message);
      console.error('Request data:', data);
      throw createAPIError(error);
    }
  },

  /**
   * Update an existing KYC record (full update)
   */
  updateKYC: async (membershipNumber: string, data: KYCData): Promise<KYCData> => {
    // Use mock service if mock mode is enabled
    if (isMockMode()) {
      console.log('[MODE] Using mock service for updateKYC');
      return mockKYCService.updateKYC(membershipNumber, data);
    }

    try {
      const url = API_ENDPOINTS.kyc.detail(membershipNumber);
      console.log('Updating KYC record at:', url);

      const response = await apiClient.put<KYCData>(url, data);
      console.log('KYC record updated successfully:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error updating KYC record:', error.response?.data || error.message);
      throw createAPIError(error);
    }
  },

  /**
   * Partial update of a KYC record
   */
  patchKYC: async (membershipNumber: string, data: Partial<KYCData>): Promise<KYCData> => {
    // Use mock service if mock mode is enabled
    if (isMockMode()) {
      console.log('[MODE] Using mock service for patchKYC');
      return mockKYCService.patchKYC(membershipNumber, data);
    }

    try {
      const url = API_ENDPOINTS.kyc.detail(membershipNumber);
      console.log('Patching KYC record at:', url);
      console.log('Patch data:', data);

      const response = await apiClient.patch<KYCData>(url, data);
      console.log('KYC record patched successfully:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error patching KYC record:', error.response?.data || error.message);
      throw createAPIError(error);
    }
  },

  /**
   * Delete a KYC record
   */
  deleteKYC: async (membershipNumber: string): Promise<void> => {
    // Use mock service if mock mode is enabled
    if (isMockMode()) {
      console.log('[MODE] Using mock service for deleteKYC');
      return mockKYCService.deleteKYC(membershipNumber);
    }

    try {
      const url = API_ENDPOINTS.kyc.detail(membershipNumber);
      console.log('Deleting KYC record at:', url);

      await apiClient.delete(url);
      console.log('KYC record deleted successfully');
    } catch (error: any) {
      console.error('Error deleting KYC record:', error.response?.data || error.message);
      throw createAPIError(error);
    }
  },

  /**
   * Upload KYC documents with progress tracking
   * @param files - Object containing files to upload (front, back, selfie)
   * @param onProgress - Optional callback for upload progress (0-100)
   * @returns Object containing URLs of uploaded files
   */
  uploadDocuments: async (
    files: { front?: File; back?: File; selfie?: File },
    onProgress?: (progress: number) => void
  ): Promise<{ front?: string; back?: string; selfie?: string }> => {
    // Use mock service if mock mode is enabled
    if (isMockMode()) {
      console.log('[MODE] Using mock service for uploadDocuments');
      return mockKYCService.uploadDocuments(files, onProgress);
    }

    try {
      // Create FormData with proper field names matching backend expectations
      const formData = new FormData();
      
      if (files.front) {
        formData.append('id_document_front', files.front);
      }
      if (files.back) {
        formData.append('id_document_back', files.back);
      }
      if (files.selfie) {
        formData.append('selfie_photo', files.selfie);
      }

      const url = `${API_ENDPOINTS.kyc.list}upload/`;
      console.log('Uploading documents to:', url);

      const response = await apiClient.post<{ 
        id_document_front?: string; 
        id_document_back?: string; 
        selfie_photo?: string;
      }>(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            onProgress(percentCompleted);
          }
        },
      });

      console.log('Documents uploaded successfully:', response.data);

      // Map backend response to expected format
      return {
        front: response.data.id_document_front,
        back: response.data.id_document_back,
        selfie: response.data.selfie_photo,
      };
    } catch (error: any) {
      console.error('Error uploading documents:', error.response?.data || error.message);
      throw createAPIError(error);
    }
  },
};
