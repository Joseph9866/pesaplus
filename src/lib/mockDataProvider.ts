/**
 * Mock data provider implementing Supabase client interface
 */

import { MockDataStore } from './mockDataStore';
import {
  MockResponse,
  MockQueryBuilder,
  MockAuthProvider,
  MockDataProvider,
  MockProviderConfig,
  Filter,
  SignUpCredentials,
  SignInCredentials,
  AuthResponse,
  SessionResponse,
  UserResponse,
  AuthCallback,
  AuthSubscription,
  MockSession,
  MockAuthUser,
} from './mockTypes';
import { TEST_CREDENTIALS } from './mockSeedData';

// Query builder implementation
class MockQueryBuilderImpl<T = any> implements MockQueryBuilder<T> {
  private table: string;
  private store: MockDataStore;
  private config: MockProviderConfig;
  private filters: Filter[] = [];
  private selectedColumns: string[] = [];
  private sortColumn: string | null = null;
  private sortAscending: boolean = true;
  private limitCount: number | null = null;
  private updateData: Partial<T> | null = null;
  private isDelete: boolean = false;

  constructor(table: string, store: MockDataStore, config: MockProviderConfig) {
    this.table = table;
    this.store = store;
    this.config = config;
  }

  select(columns?: string): MockQueryBuilder<T> {
    if (columns) {
      this.selectedColumns = columns.split(',').map((c) => c.trim());
    } else {
      this.selectedColumns = ['*'];
    }
    return this;
  }

  eq(column: string, value: any): MockQueryBuilder<T> {
    this.filters.push({ column, operator: 'eq', value });
    return this;
  }

  neq(column: string, value: any): MockQueryBuilder<T> {
    this.filters.push({ column, operator: 'neq', value });
    return this;
  }

  gt(column: string, value: any): MockQueryBuilder<T> {
    this.filters.push({ column, operator: 'gt', value });
    return this;
  }

  gte(column: string, value: any): MockQueryBuilder<T> {
    this.filters.push({ column, operator: 'gte', value });
    return this;
  }

  lt(column: string, value: any): MockQueryBuilder<T> {
    this.filters.push({ column, operator: 'lt', value });
    return this;
  }

  lte(column: string, value: any): MockQueryBuilder<T> {
    this.filters.push({ column, operator: 'lte', value });
    return this;
  }

  order(column: string, options?: { ascending?: boolean }): MockQueryBuilder<T> {
    this.sortColumn = column;
    this.sortAscending = options?.ascending !== false;
    return this;
  }

  limit(count: number): MockQueryBuilder<T> {
    this.limitCount = count;
    return this;
  }

  async insert(data: Partial<T> | Partial<T>[]): Promise<MockResponse<T | T[]>> {
    await this.simulateDelay();

    try {
      if (Array.isArray(data)) {
        const results = data.map((item) => this.store.insert(this.table, item));
        this.log('INSERT', { table: this.table, count: results.length });
        return { data: results as T[], error: null };
      } else {
        const result = this.store.insert(this.table, data);
        this.log('INSERT', { table: this.table, data: result });
        return { data: result as T, error: null };
      }
    } catch (error: any) {
      return { data: null, error: { message: error.message, code: 'INSERT_ERROR' } };
    }
  }

  update(data: Partial<T>): MockQueryBuilder<T> {
    this.updateData = data;
    return this;
  }

  delete(): MockQueryBuilder<T> {
    this.isDelete = true;
    return this;
  }

  async single(): Promise<MockResponse<T>> {
    await this.simulateDelay();

    try {
      const results = await this.executeQuery();

      if (results.length === 0) {
        return { data: null, error: { message: 'Record not found', code: 'PGRST116' } };
      }

      if (results.length > 1) {
        return {
          data: null,
          error: { message: 'Multiple records found', code: 'PGRST116' },
        };
      }

      return { data: results[0] as T, error: null };
    } catch (error: any) {
      return { data: null, error: { message: error.message, code: 'QUERY_ERROR' } };
    }
  }

  async maybeSingle(): Promise<MockResponse<T>> {
    await this.simulateDelay();

    try {
      const results = await this.executeQuery();

      if (results.length === 0) {
        return { data: null, error: null };
      }

      if (results.length > 1) {
        return {
          data: null,
          error: { message: 'Multiple records found', code: 'PGRST116' },
        };
      }

      return { data: results[0] as T, error: null };
    } catch (error: any) {
      return { data: null, error: { message: error.message, code: 'QUERY_ERROR' } };
    }
  }

  private async executeQuery(): Promise<any[]> {
    if (this.isDelete) {
      const deleted = this.store.delete(this.table, this.filters);
      this.log('DELETE', { table: this.table, count: deleted.length });
      return deleted;
    }

    if (this.updateData) {
      const updated = this.store.update(this.table, this.filters, this.updateData);
      this.log('UPDATE', { table: this.table, count: updated.length });
      return updated;
    }

    const results = this.store.query(
      this.table,
      this.filters,
      this.sortColumn || undefined,
      this.sortAscending,
      this.limitCount || undefined,
      this.selectedColumns.length > 0 ? this.selectedColumns : undefined
    );

    this.log('SELECT', { table: this.table, count: results.length });
    return results;
  }

  private async simulateDelay(): Promise<void> {
    const min = this.config.delayMin || 0;
    const max = this.config.delayMax || 0;

    if (min === 0 && max === 0) return;

    const delay = Math.random() * (max - min) + min;
    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  private log(operation: string, details: any): void {
    if (this.config.enableLogging && import.meta.env.DEV) {
      console.log(`[MockDataProvider] ${operation}:`, details);
    }
  }
}

// Auth provider implementation
class MockAuthProviderImpl implements MockAuthProvider {
  private store: MockDataStore;
  private config: MockProviderConfig;
  private session: MockSession | null = null;
  private authCallbacks: AuthCallback[] = [];

  constructor(store: MockDataStore, config: MockProviderConfig) {
    this.store = store;
    this.config = config;
  }

  async signUp(credentials: SignUpCredentials): Promise<AuthResponse> {
    await this.simulateDelay();

    try {
      const { email, password, options } = credentials;

      // Check if user already exists
      const existingUsers = this.store.query('user_profiles', [
        { column: 'email', operator: 'eq', value: email },
      ]);

      if (existingUsers.length > 0) {
        return {
          data: { user: null, session: null },
          error: { message: 'User already exists', code: 'AUTH_ERROR' },
        };
      }

      // Create new user
      const newUser = this.store.insert('user_profiles', {
        email,
        full_name: options?.data?.full_name || 'New User',
        phone_number: null,
        total_balance: 0,
        total_saved: 0,
        lottery_entries: 0,
        referral_code: `REF${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        referred_by: null,
        kyc_status: 'pending',
        kyc_document_url: null,
        kyc_id_number: null,
        kyc_address: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      const authUser: MockAuthUser = {
        id: newUser.id,
        email: newUser.email,
        user_metadata: options?.data,
      };

      const session = this.createSession(authUser);
      this.session = session;
      this.notifyAuthChange('SIGNED_IN', session);

      this.log('SIGN_UP', { email });
      return { data: { user: authUser, session }, error: null };
    } catch (error: any) {
      return {
        data: { user: null, session: null },
        error: { message: error.message, code: 'AUTH_ERROR' },
      };
    }
  }

  async signInWithPassword(credentials: SignInCredentials): Promise<AuthResponse> {
    await this.simulateDelay();

    try {
      const { email, password } = credentials;

      // Check test credentials
      const testCred = TEST_CREDENTIALS.find((c) => c.email === email && c.password === password);

      if (!testCred) {
        return {
          data: { user: null, session: null },
          error: { message: 'Invalid login credentials', code: 'AUTH_ERROR' },
        };
      }

      // Get user profile
      const users = this.store.query('user_profiles', [
        { column: 'id', operator: 'eq', value: testCred.userId },
      ]);

      if (users.length === 0) {
        return {
          data: { user: null, session: null },
          error: { message: 'User not found', code: 'AUTH_ERROR' },
        };
      }

      const user = users[0];
      const authUser: MockAuthUser = {
        id: user.id,
        email: user.email,
        user_metadata: { full_name: user.full_name },
      };

      const session = this.createSession(authUser);
      this.session = session;
      this.notifyAuthChange('SIGNED_IN', session);

      this.log('SIGN_IN', { email });
      return { data: { user: authUser, session }, error: null };
    } catch (error: any) {
      return {
        data: { user: null, session: null },
        error: { message: error.message, code: 'AUTH_ERROR' },
      };
    }
  }

  async signOut(): Promise<{ error: null }> {
    await this.simulateDelay();

    this.session = null;
    this.notifyAuthChange('SIGNED_OUT', null);

    this.log('SIGN_OUT', {});
    return { error: null };
  }

  async getSession(): Promise<SessionResponse> {
    return { data: { session: this.session }, error: null };
  }

  async getUser(): Promise<UserResponse> {
    return { data: { user: this.session?.user || null }, error: null };
  }

  onAuthStateChange(callback: AuthCallback): AuthSubscription {
    this.authCallbacks.push(callback);

    return {
      data: {
        subscription: {
          unsubscribe: () => {
            const index = this.authCallbacks.indexOf(callback);
            if (index > -1) {
              this.authCallbacks.splice(index, 1);
            }
          },
        },
      },
    };
  }

  private createSession(user: MockAuthUser): MockSession {
    return {
      access_token: `mock-token-${Math.random().toString(36).substr(2)}`,
      refresh_token: `mock-refresh-${Math.random().toString(36).substr(2)}`,
      expires_at: Date.now() + 3600000, // 1 hour
      user,
    };
  }

  private notifyAuthChange(event: string, session: MockSession | null): void {
    this.authCallbacks.forEach((callback) => {
      try {
        callback(event, session);
      } catch (error) {
        console.error('Error in auth callback:', error);
      }
    });
  }

  private async simulateDelay(): Promise<void> {
    const min = this.config.delayMin || 0;
    const max = this.config.delayMax || 0;

    if (min === 0 && max === 0) return;

    const delay = Math.random() * (max - min) + min;
    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  private log(operation: string, details: any): void {
    if (this.config.enableLogging && import.meta.env.DEV) {
      console.log(`[MockAuthProvider] ${operation}:`, details);
    }
  }
}

// Main mock data provider
export class MockDataProviderImpl implements MockDataProvider {
  private store: MockDataStore;
  private config: MockProviderConfig;
  public auth: MockAuthProvider;

  constructor(store: MockDataStore, config: MockProviderConfig = {}) {
    this.store = store;
    this.config = {
      delayMin: config.delayMin || 300,
      delayMax: config.delayMax || 800,
      errorRate: config.errorRate || 0,
      enableLogging: config.enableLogging !== false,
    };
    this.auth = new MockAuthProviderImpl(store, this.config);
  }

  from<T = any>(table: string): MockQueryBuilder<T> {
    return new MockQueryBuilderImpl<T>(table, this.store, this.config);
  }
}
