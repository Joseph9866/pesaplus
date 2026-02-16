/**
 * Data provider factory - switches between mock and Django backend
 */

import { MockDataStore } from './mockDataStore';
import { MockDataProviderImpl } from './mockDataProvider';
import { generateSeedData, TEST_CREDENTIALS } from './mockSeedData';
import { DjangoProvider } from './djangoProvider';

// Read environment configuration
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true';
const MOCK_API_DELAY_MIN = parseInt(import.meta.env.VITE_MOCK_API_DELAY_MIN || '300');
const MOCK_API_DELAY_MAX = parseInt(import.meta.env.VITE_MOCK_API_DELAY_MAX || '800');
const MOCK_ERROR_RATE = parseFloat(import.meta.env.VITE_MOCK_ERROR_RATE || '0');

// Create the appropriate provider
let dataProvider: any;

if (USE_MOCK_DATA) {
  // Create mock provider
  const seedData = generateSeedData();
  const mockStore = new MockDataStore(seedData);
  dataProvider = new MockDataProviderImpl(mockStore, {
    delayMin: MOCK_API_DELAY_MIN,
    delayMax: MOCK_API_DELAY_MAX,
    errorRate: MOCK_ERROR_RATE,
    enableLogging: true,
  });

  // Log mock mode activation
  console.log('🎭 Mock Data Mode Active');
  console.log('📝 Test Credentials:');
  TEST_CREDENTIALS.forEach((cred) => {
    console.log(`  - ${cred.scenario}: ${cred.email} / ${cred.password}`);
  });
} else {
  // Create Django backend provider
  dataProvider = new DjangoProvider();
  console.log('🔌 Django Backend Mode Active');
  console.log('📡 API URL:', import.meta.env.VITE_API_BASE_URL);
}

// Export as both dataProvider and supabase for compatibility
export { dataProvider, dataProvider as supabase };
