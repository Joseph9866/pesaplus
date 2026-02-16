# Bug Fix: Goals Not Appearing After Creation

## Issue Description

When creating a goal in the Dashboard while using mock data mode, the newly created goal was not appearing in the goals list, even though the creation was successful.

## Root Cause

The bug was in the `MockDataStore.applySelect()` method in `src/lib/mockDataStore.ts`. When a query used `.select('*')` to fetch all columns, the method had a logic error:

```typescript
// BEFORE (Buggy code)
private applySelect(records: any[], columns: string[]): any[] {
  return records.map((record) => {
    const selected: any = { id: record.id };
    columns.forEach((col) => {
      if (col !== '*' && col !== 'id') {
        selected[col] = record[col];
      } else if (col === '*') {
        return record;  // ❌ This return is inside forEach, doesn't work!
      }
    });
    return selected;  // ❌ Always returns only { id: ... }
  });
}
```

The problem was that `return record` inside the `forEach` loop doesn't actually return from the `map` function - it only returns from the `forEach` callback. This meant that when selecting all columns with `*`, the method would still only return records with just the `id` field.

## The Fix

```typescript
// AFTER (Fixed code)
private applySelect(records: any[], columns: string[]): any[] {
  // If selecting all columns or no specific columns, return full records
  if (columns.length === 0 || columns.includes('*')) {
    return records;
  }

  // Otherwise, select only specified columns
  return records.map((record) => {
    const selected: any = { id: record.id };
    columns.forEach((col) => {
      if (col !== 'id') {
        selected[col] = record[col];
      }
    });
    return selected;
  });
}
```

The fix checks if `'*'` is in the columns array at the beginning and returns the full records immediately, avoiding the forEach loop issue entirely.

## Additional Improvements

### 1. Added Promise-like Interface to MockQueryBuilder

The mock query builder now implements a `then()` method to make SELECT queries properly awaitable:

```typescript
// In src/lib/mockTypes.ts
export interface MockQueryBuilder<T = any> {
  // ... other methods ...
  
  // Promise-like interface for SELECT queries
  then<TResult1 = MockResponse<T[]>, TResult2 = never>(
    onfulfilled?: ((value: MockResponse<T[]>) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null
  ): Promise<TResult1 | TResult2>;
}
```

This allows queries like:
```typescript
const { data, error } = await supabase.from('goals').select('*').eq('user_id', userId);
```

### 2. Enhanced Goal Creation in Dashboard

Updated the goal creation to include all required fields:

```typescript
await supabase.from('goals').insert({
  user_id: user?.id,
  title: data.title,
  target_amount: parseFloat(data.target_amount),
  current_amount: 0,
  deadline: data.deadline,
  icon: 'Target',
  color: '#1FA774',
  status: 'active',
  auto_save_enabled: false,
  auto_save_amount: null,
  auto_save_frequency: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
});
```

## Files Modified

1. `src/lib/mockDataStore.ts` - Fixed `applySelect()` method
2. `src/lib/mockTypes.ts` - Added `then()` method to MockQueryBuilder interface
3. `src/lib/mockDataProvider.ts` - Implemented `then()` method in MockQueryBuilderImpl
4. `src/pages/Dashboard.tsx` - Enhanced goal creation with all required fields

## Testing

Created comprehensive tests to verify the fix:
- ✅ Goal creation and retrieval
- ✅ Multiple goal creation
- ✅ Goal filtering by status
- ✅ All existing tests still pass (32 tests)

## Impact

This fix resolves the issue where:
- Goals created in the Dashboard now immediately appear in the goals list
- All SELECT queries with `*` now return complete records
- The mock data provider now properly mimics Supabase behavior

## How to Verify

1. Run the app in mock mode (`VITE_USE_MOCK_DATA=true`)
2. Login with test credentials (e.g., `active-user@test.com` / `password123`)
3. Create a new goal from the Dashboard
4. The goal should immediately appear in the "Active Goals" section

## Prevention

To prevent similar issues in the future:
1. Always test SELECT queries with `*` in mock mode
2. Verify that query builders properly implement Promise-like interfaces
3. Add integration tests for CRUD operations
4. Test data flow from creation to display

## Related Issues

This fix also improves:
- Transaction history display
- Challenge participation tracking
- Any other feature using `.select('*')` with mock data
