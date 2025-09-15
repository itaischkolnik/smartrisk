# Pages Table Setup Guide

## Problem
The דפים (Pages) tab in the admin dashboard is showing a 403 Forbidden error because:
1. The `pages` table doesn't exist in the database
2. The API route was using incorrect admin authentication (fixed)

## Solution
You need to create the `pages` table in your Supabase database.

## Option 1: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `scripts/create-pages-table.sql`
4. Click **Run** to execute the SQL

## Option 2: Using the Setup Script

1. Make sure you have the required environment variables:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

2. Run the setup script:
   ```bash
   npm run ts-node scripts/setup-pages-table.ts
   ```

## What the Script Creates

The setup creates:
- `pages` table with all necessary fields
- Proper indexes for performance
- Row Level Security (RLS) policies
- Admin access policies
- Public read access for published pages
- Automatic timestamp updates

## Table Structure

```sql
pages (
  id UUID PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  meta_description TEXT,
  is_published BOOLEAN DEFAULT false,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
)
```

## Verification

After running the setup:
1. Go to your admin dashboard
2. Navigate to the דפים (Pages) tab
3. You should see an empty table (or a sample page if created)
4. No more 403 errors should appear

## Troubleshooting

### Policy Already Exists Error?
If you get `ERROR: 42710: policy "Allow admins full access to pages" for table "pages" already exists`:

**Option A: Use the Updated Script**
The updated `scripts/create-pages-table.sql` now handles existing policies gracefully.

**Option B: Clean Start (Recommended for conflicts)**
1. Run the cleanup script first: `scripts/cleanup-pages-table.sql`
2. Then run the main setup script: `scripts/create-pages-table.sql`

### Still Getting 403 Errors?
1. Check that you're logged in as an admin user
2. Verify the `admin_roles` table exists and has your email
3. Check browser console for any other errors

### Table Creation Failed?
1. Ensure you have the correct permissions in Supabase
2. Check the SQL editor for any syntax errors
3. Try running the statements one by one

### Need to Reset?
If you need to start over:
1. Run the cleanup script: `scripts/cleanup-pages-table.sql`
2. Then run the setup script again: `scripts/create-pages-table.sql`

## Next Steps

Once the pages table is working:
1. Test creating a new page
2. Test editing existing pages
3. Test the publish/unpublish functionality
4. Consider adding rich text editor integration
