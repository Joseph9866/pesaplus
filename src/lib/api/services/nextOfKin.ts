/**
 * Next of Kin Service
 * Handles all next of kin-related API calls
 */

import apiClient from '../client';
import { API_ENDPOINTS } from '../config';
import { NextOfKinData } from '../../../types';
import { createAPIError } from '../errorHandler';
import { mockNextOfKinService } from './mock';

/**
 * Check if mock mode is enabled
 */
const isMockMode = (): boolean => {
  const useMockData = import.meta.env.VITE_USE_MOCK_DATA;
  return useMockData === 'true' || useMockData === true;
};

export const nextOfKinService = {
  /**
   * Get all next of kin records for the current user
   */
  listNextOfKin: async (): Promise<NextOfKinData[]> => {
    // Use mock service if mock mode is enabled
    if (isMockMode()) {
      console.log('[MODE] Using mock service for listNextOfKin');
      return mockNextOfKinService.listNextOfKin();
    }

    try {
      const url = API_ENDPOINTS.nextOfKin.list;
      console.log('Fetching next of kin records from:', url);

      const response = await apiClient.get<NextOfKinData[]>(url);
      console.log('Next of kin records fetched successfully:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching next of kin records:', error.response?.data || error.message);
      console.error('Attempted URL:', API_ENDPOINTS.nextOfKin.list);
      throw createAPIError(error);
    }
  },

  /**
   * Get a single next of kin record by ID
   */
  getNextOfKin: async (id: number): Promise<NextOfKinData> => {
    // Use mock service if mock mode is enabled
    if (isMockMode()) {
      console.log('[MODE] Using mock service for getNextOfKin');
      return mockNextOfKinService.getNextOfKin(id);
    }

    try {
      const url = API_ENDPOINTS.nextOfKin.detail(id);
      console.log('Fetching next of kin record from:', url);

      const response = await apiClient.get<NextOfKinData>(url);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching next of kin record:', error.response?.data || error.message);
      throw createAPIError(error);
    }
  },

  /**
   * Create a new next of kin record
   */
  createNextOfKin: async (data: Omit<NextOfKinData, 'id' | 'created_at' | 'updated_at'>): Promise<NextOfKinData> => {
    // Use mock service if mock mode is enabled
    if (isMockMode()) {
      console.log('[MODE] Using mock service for createNextOfKin');
      return mockNextOfKinService.createNextOfKin(data);
    }

    try {
      const url = API_ENDPOINTS.nextOfKin.list;
      console.log('Creating next of kin record at:', url);
      console.log('Next of kin data:', data);

      const response = await apiClient.post<NextOfKinData>(url, data);
      console.log('Next of kin record created successfully:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error creating next of kin record:', error.response?.data || error.message);
      console.error('Attempted URL:', API_ENDPOINTS.nextOfKin.list);
      console.error('Request data:', data);
      throw createAPIError(error);
    }
  },

  /**
   * Update an existing next of kin record (full update)
   */
  updateNextOfKin: async (id: number, data: Omit<NextOfKinData, 'id' | 'created_at' | 'updated_at'>): Promise<NextOfKinData> => {
    // Use mock service if mock mode is enabled
    if (isMockMode()) {
      console.log('[MODE] Using mock service for updateNextOfKin');
      return mockNextOfKinService.updateNextOfKin(id, data);
    }

    try {
      const url = API_ENDPOINTS.nextOfKin.detail(id);
      console.log('Updating next of kin record at:', url);

      const response = await apiClient.put<NextOfKinData>(url, data);
      return response.data;
    } catch (error: any) {
      console.error('Error updating next of kin record:', error.response?.data || error.message);
      throw createAPIError(error);
    }
  },

  /**
   * Partially update an existing next of kin record
   */
  patchNextOfKin: async (id: number, data: Partial<NextOfKinData>): Promise<NextOfKinData> => {
    // Use mock service if mock mode is enabled
    if (isMockMode()) {
      console.log('[MODE] Using mock service for patchNextOfKin');
      return mockNextOfKinService.patchNextOfKin(id, data);
    }

    try {
      const url = API_ENDPOINTS.nextOfKin.detail(id);
      console.log('Patching next of kin record at:', url);
      console.log('Patch data:', data);

      const response = await apiClient.patch<NextOfKinData>(url, data);
      return response.data;
    } catch (error: any) {
      console.error('Error patching next of kin record:', error.response?.data || error.message);
      throw createAPIError(error);
    }
  },

  /**
   * Delete a next of kin record
   */
  deleteNextOfKin: async (id: number): Promise<void> => {
    // Use mock service if mock mode is enabled
    if (isMockMode()) {
      console.log('[MODE] Using mock service for deleteNextOfKin');
      return mockNextOfKinService.deleteNextOfKin(id);
    }

    try {
      const url = API_ENDPOINTS.nextOfKin.detail(id);
      console.log('Deleting next of kin record at:', url);

      await apiClient.delete(url);
      console.log('Next of kin record deleted successfully');
    } catch (error: any) {
      console.error('Error deleting next of kin record:', error.response?.data || error.message);
      throw createAPIError(error);
    }
  },
};
