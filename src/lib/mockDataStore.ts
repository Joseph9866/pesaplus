/**
 * In-memory mock data store with CRUD operations
 */

import { Filter } from './mockTypes';

export class MockDataStore {
  private data: Record<string, any[]>;
  private seedData: Record<string, any[]>;

  constructor(seedData: Record<string, any[]>) {
    this.seedData = JSON.parse(JSON.stringify(seedData));
    this.data = JSON.parse(JSON.stringify(seedData));
  }

  getTable(tableName: string): any[] {
    return this.data[tableName] || [];
  }

  insert(tableName: string, record: any): any {
    if (!this.data[tableName]) {
      this.data[tableName] = [];
    }

    const id = this.generateId(tableName);
    const newRecord = { ...record, id };
    this.data[tableName].push(newRecord);
    return newRecord;
  }

  update(tableName: string, filters: Filter[], updates: any): any[] {
    const table = this.getTable(tableName);
    const matchingRecords = this.applyFilters(table, filters);

    matchingRecords.forEach((record) => {
      Object.assign(record, updates);
    });

    return matchingRecords;
  }

  delete(tableName: string, filters: Filter[]): any[] {
    const table = this.getTable(tableName);
    const matchingRecords = this.applyFilters(table, filters);
    const matchingIds = new Set(matchingRecords.map((r) => r.id));

    this.data[tableName] = table.filter((record) => !matchingIds.has(record.id));

    return matchingRecords;
  }

  query(
    tableName: string,
    filters: Filter[],
    sortColumn?: string,
    sortAscending: boolean = true,
    limitCount?: number,
    selectedColumns?: string[]
  ): any[] {
    let results = this.getTable(tableName);

    // Apply filters
    results = this.applyFilters(results, filters);

    // Apply sorting
    if (sortColumn) {
      results = this.applySort(results, sortColumn, sortAscending);
    }

    // Apply limit
    if (limitCount !== undefined) {
      results = results.slice(0, limitCount);
    }

    // Apply column selection
    if (selectedColumns && selectedColumns.length > 0) {
      results = this.applySelect(results, selectedColumns);
    }

    return results;
  }

  reset(): void {
    this.data = JSON.parse(JSON.stringify(this.seedData));
  }

  getState(): Record<string, any[]> {
    return JSON.parse(JSON.stringify(this.data));
  }

  private generateId(prefix: string): string {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private applyFilters(records: any[], filters: Filter[]): any[] {
    return records.filter((record) => {
      return filters.every((filter) => {
        const value = record[filter.column];
        switch (filter.operator) {
          case 'eq':
            return value === filter.value;
          case 'neq':
            return value !== filter.value;
          case 'gt':
            return value > filter.value;
          case 'gte':
            return value >= filter.value;
          case 'lt':
            return value < filter.value;
          case 'lte':
            return value <= filter.value;
          default:
            return true;
        }
      });
    });
  }

  private applySort(records: any[], column: string, ascending: boolean): any[] {
    return [...records].sort((a, b) => {
      const aVal = a[column];
      const bVal = b[column];

      if (aVal < bVal) return ascending ? -1 : 1;
      if (aVal > bVal) return ascending ? 1 : -1;
      return 0;
    });
  }

  private applySelect(records: any[], columns: string[]): any[] {
    return records.map((record) => {
      const selected: any = { id: record.id };
      columns.forEach((col) => {
        if (col !== '*' && col !== 'id') {
          selected[col] = record[col];
        } else if (col === '*') {
          return record;
        }
      });
      return selected;
    });
  }
}
