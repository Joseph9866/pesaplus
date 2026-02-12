/**
 * Type definitions for the mock data layer
 * These interfaces match the Supabase client patterns used in the codebase
 */

// Mock response format matching Supabase client responses
export interface MockResponse<T = any> {
  data: T | null;
  error: MockError | null;
}

// Mock error format matching Supabase error structure
export interface MockError {
  message: string;
  code?: string;
  details?: string;
  hint?: string;
}

// Filter operators for query building
export type FilterOperator = 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte';

// Filter definition
export interface Filter {
  column: string;
  operator: FilterOperator;
  value: any;
}

// Query builder interface matching Supabase query patterns
export interface MockQueryBuilder<T = any> {
  // Selection
  select(columns?: string): MockQueryBuilder<T>;
  
  // Filtering
  eq(column: string, value: any): MockQueryBuilder<T>;
  neq(column: string, value: any): MockQueryBuilder<T>;
  gt(column: string, value: any): MockQueryBuilder<T>;
  gte(column: string, value: any): MockQueryBuilder<T>;
  lt(column: string, value: any): MockQueryBuilder<T>;
  lte(column: string, value: any): MockQueryBuilder<T>;
  
  // Sorting and limiting
  order(column: string, options?: { ascending?: boolean }): MockQueryBuilder<T>;
  limit(count: number): MockQueryBuilder<T>;
  
  // Mutations
  insert(data: Partial<T> | Partial<T>[]): Promise<MockResponse<T | T[]>>;
  update(data: Partial<T>): MockQueryBuilder<T>;
  delete(): MockQueryBuilder<T>;
  
  // Terminal methods
  single(): Promise<MockResponse<T>>;
  maybeSingle(): Promise<MockResponse<T>>;
}

// Authentication types matching Supabase auth
export interface SignUpCredentials {
  email: string;
  password: string;
  options?: {
    data?: {
      full_name?: string;
      [key: string]: any;
    };
  };
}

export interface SignInCredentials {
  email: string;
  password: string;
}

export interface MockSession {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  user: MockAuthUser;
}

export interface MockAuthUser {
  id: string;
  email: string;
  user_metadata?: {
    full_name?: string;
    [key: string]: any;
  };
}

export interface AuthResponse {
  data: {
    user: MockAuthUser | null;
    session: MockSession | null;
  };
  error: MockError | null;
}

export interface SessionResponse {
  data: {
    session: MockSession | null;
  };
  error: MockError | null;
}

export interface UserResponse {
  data: {
    user: MockAuthUser | null;
  };
  error: MockError | null;
}

export type AuthCallback = (event: string, session: MockSession | null) => void;

export interface AuthSubscription {
  data: {
    subscription: {
      unsubscribe: () => void;
    };
  };
}

// Mock auth provider interface matching Supabase auth
export interface MockAuthProvider {
  signUp(credentials: SignUpCredentials): Promise<AuthResponse>;
  signInWithPassword(credentials: SignInCredentials): Promise<AuthResponse>;
  signOut(): Promise<{ error: MockError | null }>;
  getSession(): Promise<SessionResponse>;
  getUser(): Promise<UserResponse>;
  onAuthStateChange(callback: AuthCallback): AuthSubscription;
}

// Mock data provider interface matching Supabase client
export interface MockDataProvider {
  from<T = any>(table: string): MockQueryBuilder<T>;
  auth: MockAuthProvider;
}

// Configuration for mock provider
export interface MockProviderConfig {
  delayMin?: number;
  delayMax?: number;
  errorRate?: number;
  enableLogging?: boolean;
}

// Test scenario credentials
export interface TestCredentials {
  email: string;
  password: string;
  userId: string;
  scenario: 'new-user' | 'active-user' | 'power-user';
}
