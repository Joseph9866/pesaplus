/**
 * Django Backend Provider
 * Provides a Supabase-like interface for Django REST API
 */

import { goalsService } from './api/services/goals';
import { Goal } from '../types';

interface QueryBuilder<T> {
  select(columns?: string): QueryBuilder<T>;
  eq(column: string, value: any): QueryBuilder<T>;
  neq(column: string, value: any): QueryBuilder<T>;
  order(column: string, options?: { ascending?: boolean }): QueryBuilder<T>;
  limit(count: number): QueryBuilder<T>;
  insert(data: Partial<T> | Partial<T>[]): Promise<{ data: T | T[] | null; error: any }>;
  update(data: Partial<T>): QueryBuilder<T>;
  delete(): QueryBuilder<T>;
  then<TResult1 = { data: T[] | null; error: any }, TResult2 = never>(
    onfulfilled?: ((value: { data: T[] | null; error: any }) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null
  ): Promise<TResult1 | TResult2>;
}

class DjangoQueryBuilder<T = any> implements QueryBuilder<T> {
  private table: string;
  private filters: Record<string, any> = {};
  private selectedColumns: string[] = [];
  private sortColumn: string | null = null;
  private sortAscending: boolean = true;
  private limitCount: number | null = null;
  private updateData: Partial<T> | null = null;
  private isDelete: boolean = false;

  constructor(table: string) {
    this.table = table;
  }

  select(columns?: string): QueryBuilder<T> {
    if (columns) {
      this.selectedColumns = columns.split(',').map((c) => c.trim());
    }
    return this;
  }

  eq(column: string, value: any): QueryBuilder<T> {
    this.filters[column] = value;
    return this;
  }

  neq(column: string, value: any): QueryBuilder<T> {
    this.filters[`${column}__ne`] = value;
    return this;
  }

  order(column: string, options?: { ascending?: boolean }): QueryBuilder<T> {
    this.sortColumn = column;
    this.sortAscending = options?.ascending !== false;
    return this;
  }

  limit(count: number): QueryBuilder<T> {
    this.limitCount = count;
    return this;
  }

  async insert(data: Partial<T> | Partial<T>[]): Promise<{ data: T | T[] | null; error: any }> {
    try {
      if (this.table === 'goals') {
        if (Array.isArray(data)) {
          const results = await Promise.all(
            data.map((item) => goalsService.createGoal(item as any))
          );
          return { data: results as T[], error: null };
        } else {
          const result = await goalsService.createGoal(data as any);
          return { data: result as T, error: null };
        }
      }
      
      throw new Error(`Insert not implemented for table: ${this.table}`);
    } catch (error: any) {
      console.error('Django insert error:', error);
      return { data: null, error: error.response?.data || error.message };
    }
  }

  update(data: Partial<T>): QueryBuilder<T> {
    this.updateData = data;
    return this;
  }

  delete(): QueryBuilder<T> {
    this.isDelete = true;
    return this;
  }

  async then<TResult1 = { data: T[] | null; error: any }, TResult2 = never>(
    onfulfilled?: ((value: { data: T[] | null; error: any }) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null
  ): Promise<TResult1 | TResult2> {
    try {
      let results: any[] = [];

      if (this.table === 'goals') {
        // Fetch goals from Django API
        const status = this.filters['status'];
        results = await goalsService.getGoals(status ? { status } : undefined);

        // Apply additional filters
        Object.keys(this.filters).forEach((key) => {
          if (key !== 'status' && key !== 'user_id') {
            const value = this.filters[key];
            results = results.filter((item: any) => item[key] === value);
          }
        });

        // Apply sorting
        if (this.sortColumn) {
          results.sort((a: any, b: any) => {
            const aVal = a[this.sortColumn!];
            const bVal = b[this.sortColumn!];
            if (aVal < bVal) return this.sortAscending ? -1 : 1;
            if (aVal > bVal) return this.sortAscending ? 1 : -1;
            return 0;
          });
        }

        // Apply limit
        if (this.limitCount) {
          results = results.slice(0, this.limitCount);
        }
      } else if (this.table === 'user_profiles') {
        // User profiles are handled by AuthContext
        results = [];
      } else if (this.table === 'transactions') {
        // Transactions not yet implemented
        results = [];
      }

      const response = { data: results as T[], error: null };

      if (onfulfilled) {
        return onfulfilled(response);
      }
      return response as any;
    } catch (error: any) {
      console.error('Django query error:', error);
      const errorResponse = {
        data: null,
        error: error.response?.data || error.message,
      };

      if (onrejected) {
        return onrejected(error);
      }
      if (onfulfilled) {
        return onfulfilled(errorResponse);
      }
      return errorResponse as any;
    }
  }
}

// Django provider with Supabase-like interface
export class DjangoProvider {
  from<T = any>(table: string): QueryBuilder<T> {
    return new DjangoQueryBuilder<T>(table);
  }

  // Auth is handled separately by AuthContext
  auth = {
    getUser: async () => ({ data: { user: null }, error: null }),
    getSession: async () => ({ data: { session: null }, error: null }),
    signOut: async () => ({ error: null }),
    onAuthStateChange: () => ({
      data: { subscription: { unsubscribe: () => {} } },
    }),
  };
}
