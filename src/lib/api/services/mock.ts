/**
 * Mock Service
 * Provides simulated API responses for development and testing
 * Simulates network delays and stores data in memory for persistence
 */

import { KYCData, NextOfKinData } from '../../../types';

// In-memory storage for mock data
let mockKYCRecords: KYCData[] = [];
let mockNextOfKinRecords: NextOfKinData[] = [];
let kycIdCounter = 1;
let nokIdCounter = 1;

/**
 * Simulate network delay between 500-1500ms
 */
const simulateDelay = (): Promise<void> => {
  const delay = Math.floor(Math.random() * 1000) + 500; // 500-1500ms
  return new Promise(resolve => setTimeout(resolve, delay));
};

/**
 * Generate a mock membership number
 */
const generateMembershipNumber = (): string => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `MEM${timestamp}${random}`;
};

/**
 * Mock KYC Service
 */
export const mockKYCService = {
  /**
   * List all KYC records
   */
  listKYC: async (): Promise<KYCData[]> => {
    await simulateDelay();
    console.log('[MOCK] Fetching KYC records:', mockKYCRecords);
    return [...mockKYCRecords];
  },

  /**
   * Get a single KYC record by membership number
   */
  getKYC: async (membershipNumber: string): Promise<KYCData> => {
    await simulateDelay();
    const record = mockKYCRecords.find(r => r.membership_number === membershipNumber);
    
    if (!record) {
      throw {
        response: {
          status: 404,
          data: {
            message: 'KYC record not found',
            code: 'NOT_FOUND',
          },
        },
      };
    }
    
    console.log('[MOCK] Fetching KYC record:', record);
    return { ...record };
  },

  /**
   * Create a new KYC record
   */
  createKYC: async (data: KYCData): Promise<KYCData> => {
    await simulateDelay();
    
    const now = new Date().toISOString();
    const newRecord: KYCData = {
      ...data,
      membership_number: generateMembershipNumber(),
      user: data.user || 1,
      kyc_submitted: true,
      kyc_confirmed: false,
      status: 'submitted',
      created_at: now,
      updated_at: now,
      submitted_at: now,
    };
    
    mockKYCRecords.push(newRecord);
    console.log('[MOCK] Created KYC record:', newRecord);
    return { ...newRecord };
  },

  /**
   * Update a KYC record (full update)
   */
  updateKYC: async (membershipNumber: string, data: KYCData): Promise<KYCData> => {
    await simulateDelay();
    
    const index = mockKYCRecords.findIndex(r => r.membership_number === membershipNumber);
    
    if (index === -1) {
      throw {
        response: {
          status: 404,
          data: {
            message: 'KYC record not found',
            code: 'NOT_FOUND',
          },
        },
      };
    }
    
    const updatedRecord: KYCData = {
      ...data,
      membership_number,
      updated_at: new Date().toISOString(),
    };
    
    mockKYCRecords[index] = updatedRecord;
    console.log('[MOCK] Updated KYC record:', updatedRecord);
    return { ...updatedRecord };
  },

  /**
   * Partial update of a KYC record
   */
  patchKYC: async (membershipNumber: string, data: Partial<KYCData>): Promise<KYCData> => {
    await simulateDelay();
    
    const index = mockKYCRecords.findIndex(r => r.membership_number === membershipNumber);
    
    if (index === -1) {
      throw {
        response: {
          status: 404,
          data: {
            message: 'KYC record not found',
            code: 'NOT_FOUND',
          },
        },
      };
    }
    
    const patchedRecord: KYCData = {
      ...mockKYCRecords[index],
      ...data,
      membership_number, // Ensure membership_number doesn't change
      updated_at: new Date().toISOString(),
    };
    
    mockKYCRecords[index] = patchedRecord;
    console.log('[MOCK] Patched KYC record:', patchedRecord);
    return { ...patchedRecord };
  },

  /**
   * Delete a KYC record
   */
  deleteKYC: async (membershipNumber: string): Promise<void> => {
    await simulateDelay();
    
    const index = mockKYCRecords.findIndex(r => r.membership_number === membershipNumber);
    
    if (index === -1) {
      throw {
        response: {
          status: 404,
          data: {
            message: 'KYC record not found',
            code: 'NOT_FOUND',
          },
        },
      };
    }
    
    mockKYCRecords.splice(index, 1);
    console.log('[MOCK] Deleted KYC record:', membershipNumber);
  },

  /**
   * Upload documents with progress tracking
   */
  uploadDocuments: async (
    files: { front?: File; back?: File; selfie?: File },
    onProgress?: (progress: number) => void
  ): Promise<{ front?: string; back?: string; selfie?: string }> => {
    // Simulate upload progress
    if (onProgress) {
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 100));
        onProgress(i);
      }
    } else {
      await simulateDelay();
    }
    
    const result: { front?: string; back?: string; selfie?: string } = {};
    
    if (files.front) {
      result.front = `https://mock-storage.example.com/kyc/front_${Date.now()}.jpg`;
    }
    if (files.back) {
      result.back = `https://mock-storage.example.com/kyc/back_${Date.now()}.jpg`;
    }
    if (files.selfie) {
      result.selfie = `https://mock-storage.example.com/kyc/selfie_${Date.now()}.jpg`;
    }
    
    console.log('[MOCK] Uploaded documents:', result);
    return result;
  },
};

/**
 * Mock Next of Kin Service
 */
export const mockNextOfKinService = {
  /**
   * List all next of kin records
   */
  listNextOfKin: async (): Promise<NextOfKinData[]> => {
    await simulateDelay();
    console.log('[MOCK] Fetching next of kin records:', mockNextOfKinRecords);
    return [...mockNextOfKinRecords];
  },

  /**
   * Get a single next of kin record by ID
   */
  getNextOfKin: async (id: number): Promise<NextOfKinData> => {
    await simulateDelay();
    const record = mockNextOfKinRecords.find(r => r.id === id);
    
    if (!record) {
      throw {
        response: {
          status: 404,
          data: {
            message: 'Next of kin record not found',
            code: 'NOT_FOUND',
          },
        },
      };
    }
    
    console.log('[MOCK] Fetching next of kin record:', record);
    return { ...record };
  },

  /**
   * Create a new next of kin record
   */
  createNextOfKin: async (data: Omit<NextOfKinData, 'id' | 'created_at' | 'updated_at'>): Promise<NextOfKinData> => {
    await simulateDelay();
    
    const now = new Date().toISOString();
    const newRecord: NextOfKinData = {
      ...data,
      id: nokIdCounter++,
      created_at: now,
      updated_at: now,
    };
    
    mockNextOfKinRecords.push(newRecord);
    console.log('[MOCK] Created next of kin record:', newRecord);
    return { ...newRecord };
  },

  /**
   * Update a next of kin record (full update)
   */
  updateNextOfKin: async (id: number, data: Omit<NextOfKinData, 'id' | 'created_at' | 'updated_at'>): Promise<NextOfKinData> => {
    await simulateDelay();
    
    const index = mockNextOfKinRecords.findIndex(r => r.id === id);
    
    if (index === -1) {
      throw {
        response: {
          status: 404,
          data: {
            message: 'Next of kin record not found',
            code: 'NOT_FOUND',
          },
        },
      };
    }
    
    const updatedRecord: NextOfKinData = {
      ...data,
      id,
      created_at: mockNextOfKinRecords[index].created_at,
      updated_at: new Date().toISOString(),
    };
    
    mockNextOfKinRecords[index] = updatedRecord;
    console.log('[MOCK] Updated next of kin record:', updatedRecord);
    return { ...updatedRecord };
  },

  /**
   * Partial update of a next of kin record
   */
  patchNextOfKin: async (id: number, data: Partial<NextOfKinData>): Promise<NextOfKinData> => {
    await simulateDelay();
    
    const index = mockNextOfKinRecords.findIndex(r => r.id === id);
    
    if (index === -1) {
      throw {
        response: {
          status: 404,
          data: {
            message: 'Next of kin record not found',
            code: 'NOT_FOUND',
          },
        },
      };
    }
    
    const patchedRecord: NextOfKinData = {
      ...mockNextOfKinRecords[index],
      ...data,
      id, // Ensure ID doesn't change
      updated_at: new Date().toISOString(),
    };
    
    mockNextOfKinRecords[index] = patchedRecord;
    console.log('[MOCK] Patched next of kin record:', patchedRecord);
    return { ...patchedRecord };
  },

  /**
   * Delete a next of kin record
   */
  deleteNextOfKin: async (id: number): Promise<void> => {
    await simulateDelay();
    
    const index = mockNextOfKinRecords.findIndex(r => r.id === id);
    
    if (index === -1) {
      throw {
        response: {
          status: 404,
          data: {
            message: 'Next of kin record not found',
            code: 'NOT_FOUND',
          },
        },
      };
    }
    
    mockNextOfKinRecords.splice(index, 1);
    console.log('[MOCK] Deleted next of kin record:', id);
  },
};

/**
 * Utility functions for testing
 */
export const mockUtils = {
  /**
   * Reset all mock data
   */
  resetMockData: () => {
    mockKYCRecords = [];
    mockNextOfKinRecords = [];
    kycIdCounter = 1;
    nokIdCounter = 1;
    console.log('[MOCK] Reset all mock data');
  },

  /**
   * Seed mock data with sample records
   */
  seedMockData: () => {
    const now = new Date().toISOString();
    
    // Seed a sample KYC record
    const sampleKYC: KYCData = {
      membership_number: 'MEM1234567890',
      user: 1,
      id_number: '12345678',
      kra_pin: 'A123456789B',
      gender: 'male',
      marital_status: 'single',
      country: 'Kenya',
      county: 'Nairobi',
      kyc_submitted: true,
      kyc_confirmed: true,
      status: 'approved',
      id_document_front: 'https://mock-storage.example.com/kyc/front_sample.jpg',
      id_document_back: 'https://mock-storage.example.com/kyc/back_sample.jpg',
      selfie_photo: 'https://mock-storage.example.com/kyc/selfie_sample.jpg',
      created_at: now,
      updated_at: now,
      submitted_at: now,
      reviewed_at: now,
    };
    
    mockKYCRecords.push(sampleKYC);
    
    // Seed a sample Next of Kin record
    const sampleNOK: NextOfKinData = {
      id: nokIdCounter++,
      kyc: 'MEM1234567890',
      full_name: 'Jane Doe',
      relationship: 'Spouse',
      phone_number: '+254712345678',
      email: 'jane.doe@example.com',
      address: '123 Sample Street, Nairobi',
      created_at: now,
      updated_at: now,
    };
    
    mockNextOfKinRecords.push(sampleNOK);
    
    console.log('[MOCK] Seeded sample data');
  },

  /**
   * Get current mock data (for debugging)
   */
  getMockData: () => ({
    kyc: [...mockKYCRecords],
    nextOfKin: [...mockNextOfKinRecords],
  }),
};
