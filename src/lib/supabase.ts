/**
 * Supabase client - re-exports from dataProvider for backward compatibility
 */

import { supabase as dataProviderClient } from './dataProvider';

export const supabase = dataProviderClient;
