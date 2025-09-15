# Page Deletion Issue Fix

## Problem Description
In the admin panel, when trying to delete existing pages from the דפים (Pages) tab, the pages are not actually deleted from the database and reappear in the table after refreshing the page.

## Root Cause
The issue is caused by a combination of factors:

1. **RLS Policy Issue**: The `pages` table RLS policy uses `auth.uid()` which doesn't work correctly in API route contexts
2. **Client Mismatch**: The DELETE operation was using the regular `supabase` client instead of the `supabaseAdmin` client with service role privileges
3. **Authentication Context**: The JWT context is not properly accessible in the API route for the RLS policy

## Solution Applied

### 1. Fixed Client Usage in DELETE API
Updated `app/api/admin/pages/[id]/route.ts` to use `supabaseAdmin` client for the actual deletion operation:

```typescript
// Before (incorrect):
const { error: deleteError } = await supabase
  .from('pages')
  .delete()
  .eq('id', params.id);

// After (correct):
const { error: deleteError } = await supabaseAdmin
  .from('pages')
  .delete()
  .eq('id', params.id);
```

### 2. Fixed RLS Policy
The RLS policy for the `pages` table needs to be updated to use JWT email instead of `auth.uid()` for better compatibility with API routes.

## How to Apply the Fix

### Option 1: Run SQL Script (Recommended)
1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `scripts/fix-pages-admin-policy.sql`
4. Click **Run** to execute the SQL

### Option 2: Apply Migration
The migration file `supabase/migrations/20240615_fix_pages_admin_policy.sql` contains the same fix and can be applied through your migration system.

## What the Fix Does

1. **Drops the problematic RLS policy** that uses `auth.uid()`
2. **Creates a new RLS policy** that uses `auth.jwt() ->> 'email'` for better API route compatibility
3. **Maintains the same security level** - only admin users can perform operations on pages

## Verification

After applying the fix:
1. Go to your admin dashboard
2. Navigate to the דפים (Pages) tab
3. Try to delete a page
4. The page should be permanently deleted and not reappear after refresh

## Technical Details

### Why `auth.uid()` Doesn't Work in API Routes
- `auth.uid()` relies on the user context being properly set in the database session
- API routes run in a different context where this might not be available
- `auth.jwt() ->> 'email'` extracts the email directly from the JWT token, which is more reliable

### Why Service Role Client is Needed
- The service role client bypasses RLS policies entirely
- This ensures that admin operations work regardless of RLS policy issues
- It's safe to use after admin authentication has been verified

## Related Issues

This same pattern might affect other admin operations. If you encounter similar issues with:
- User deletion
- Assessment deletion
- Profile updates

Check if they're using the correct client (service role vs regular) and if their RLS policies use `auth.uid()` instead of JWT-based authentication.

## Prevention

For future admin API routes:
1. Always use the service role client (`supabaseAdmin`) for database operations after admin verification
2. Use JWT-based RLS policies (`auth.jwt() ->> 'email'`) instead of `auth.uid()` for admin access
3. Test deletion operations thoroughly to ensure they work permanently
