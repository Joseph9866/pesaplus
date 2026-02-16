/**
 * Goals Service
 * Handles all goals-related API calls
 */

import apiClient from '../client';
import { API_ENDPOINTS } from '../config';
import { Goal } from '../../../types';

export const goalsService = {
  /**
   * Get all goals for the current user
   */
  getGoals: async (filters?: { status?: string }): Promise<Goal[]> => {
    try {
      const params = new URLSearchParams();
      if (filters?.status) {
        params.append('status', filters.status);
      }

      const url = `${API_ENDPOINTS.goals.list}${params.toString() ? '?' + params.toString() : ''}`;
      console.log('Fetching goals from:', url);

      const response = await apiClient.get<Goal[]>(url);
      console.log('Goals fetched successfully:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching goals:', error.response?.data || error.message);
      console.error('Attempted URL:', API_ENDPOINTS.goals.list);
      throw error;
    }
  },

  /**
   * Get a single goal by ID
   */
  getGoal: async (id: string): Promise<Goal> => {
    try {
      const url = API_ENDPOINTS.goals.detail(id);
      console.log('Fetching goal from:', url);

      const response = await apiClient.get<Goal>(url);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching goal:', error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Create a new goal
   */
  createGoal: async (goalData: Partial<Goal>): Promise<Goal> => {
    try {
      const url = API_ENDPOINTS.goals.create;
      console.log('Creating goal at:', url);
      console.log('Goal data:', goalData);

      const response = await apiClient.post<Goal>(url, goalData);
      console.log('Goal created successfully:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error creating goal:', error.response?.data || error.message);
      console.error('Attempted URL:', API_ENDPOINTS.goals.create);
      console.error('Request data:', goalData);
      throw error;
    }
  },

  /**
   * Update an existing goal
   */
  updateGoal: async (id: string, goalData: Partial<Goal>): Promise<Goal> => {
    try {
      const url = API_ENDPOINTS.goals.update(id);
      console.log('Updating goal at:', url);

      const response = await apiClient.put<Goal>(url, goalData);
      return response.data;
    } catch (error: any) {
      console.error('Error updating goal:', error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Delete a goal
   */
  deleteGoal: async (id: string): Promise<void> => {
    try {
      const url = API_ENDPOINTS.goals.delete(id);
      console.log('Deleting goal at:', url);

      await apiClient.delete(url);
    } catch (error: any) {
      console.error('Error deleting goal:', error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Add funds to a goal
   */
  addFunds: async (id: string, amount: number): Promise<Goal> => {
    try {
      const url = API_ENDPOINTS.goals.addFunds(id);
      const response = await apiClient.post<Goal>(url, { amount });
      return response.data;
    } catch (error: any) {
      console.error('Error adding funds:', error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Withdraw funds from a goal
   */
  withdrawFunds: async (id: string, amount: number): Promise<Goal> => {
    try {
      const url = API_ENDPOINTS.goals.withdrawFunds(id);
      const response = await apiClient.post<Goal>(url, { amount });
      return response.data;
    } catch (error: any) {
      console.error('Error withdrawing funds:', error.response?.data || error.message);
      throw error;
    }
  },
};
