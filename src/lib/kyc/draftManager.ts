/**
 * KYC Draft Manager
 * Manages KYC draft data persistence in localStorage with timestamp tracking and expiration
 */

// LocalStorage key for KYC draft data
const DRAFT_STORAGE_KEY = 'kyc_draft_data';

// Draft expiration time: 7 days in milliseconds
const DRAFT_EXPIRATION_MS = 7 * 24 * 60 * 60 * 1000; // 604800000 ms

/**
 * Next of Kin data structure
 */
export interface NextOfKinData {
  full_name: string;
  relationship: string;
  phone_number: string;
  email?: string;
  address?: string;
}

/**
 * KYC Draft data structure
 */
export interface KYCDraft {
  personalInfo?: {
    gender: string;
    marital_status: string;
    id_number: string;
    kra_pin: string;
    country: string;
    county: string;
  };
  documents?: {
    id_front_preview?: string;
    id_back_preview?: string;
    selfie_preview?: string;
  };
  nextOfKin?: NextOfKinData;
  timestamp: number;
  currentStep: number;
}

/**
 * Saves KYC draft data to localStorage with timestamp
 * @param draft - Partial draft data to save (will be merged with existing data)
 */
export function saveDraft(draft: Partial<KYCDraft>): void {
  try {
    // Load existing draft to merge with new data
    const existingDraft = loadDraft();
    
    // Merge existing draft with new data
    const updatedDraft: KYCDraft = {
      ...existingDraft,
      ...draft,
      timestamp: Date.now(), // Always update timestamp on save
    };

    // Save to localStorage
    localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(updatedDraft));
  } catch (error) {
    console.error('Failed to save KYC draft:', error);
    // Silently fail - don't block user flow if localStorage is unavailable
  }
}

/**
 * Loads KYC draft data from localStorage
 * Automatically clears expired drafts (older than 7 days)
 * @returns Draft data or null if no valid draft exists
 */
export function loadDraft(): KYCDraft | null {
  try {
    const storedData = localStorage.getItem(DRAFT_STORAGE_KEY);
    
    if (!storedData) {
      return null;
    }

    const draft: KYCDraft = JSON.parse(storedData);

    // Check if draft has expired
    if (isDraftExpired(draft)) {
      clearDraft();
      return null;
    }

    return draft;
  } catch (error) {
    console.error('Failed to load KYC draft:', error);
    // Clear corrupted data
    clearDraft();
    return null;
  }
}

/**
 * Clears KYC draft data from localStorage
 */
export function clearDraft(): void {
  try {
    localStorage.removeItem(DRAFT_STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear KYC draft:', error);
  }
}

/**
 * Checks if a draft has expired (older than 7 days)
 * @param draft - Optional draft to check. If not provided, loads from localStorage
 * @returns True if draft is expired or doesn't exist, false otherwise
 */
export function isDraftExpired(draft?: KYCDraft | null): boolean {
  try {
    const draftToCheck = draft ?? loadDraftWithoutExpiration();
    
    if (!draftToCheck || !draftToCheck.timestamp) {
      return true;
    }

    const now = Date.now();
    const age = now - draftToCheck.timestamp;
    
    return age > DRAFT_EXPIRATION_MS;
  } catch (error) {
    console.error('Failed to check draft expiration:', error);
    return true; // Treat errors as expired
  }
}

/**
 * Internal helper to load draft without expiration check
 * Used by isDraftExpired to avoid infinite recursion
 * @returns Draft data or null if no draft exists
 */
function loadDraftWithoutExpiration(): KYCDraft | null {
  try {
    const storedData = localStorage.getItem(DRAFT_STORAGE_KEY);
    
    if (!storedData) {
      return null;
    }

    return JSON.parse(storedData);
  } catch (error) {
    return null;
  }
}

/**
 * Draft manager with all utilities
 */
export const draftManager = {
  saveDraft,
  loadDraft,
  clearDraft,
  isDraftExpired,
  
  // Constants for external use
  DRAFT_STORAGE_KEY,
  DRAFT_EXPIRATION_MS,
};

export default draftManager;
