# Assessment Usage System

This document describes the tiered assessment system implemented in SmartRisk, which controls user access to assessments based on their subscription plan.

## Overview

The system implements a usage-based access control where users can only create assessments according to their membership plan limits. This ensures fair usage and encourages users to upgrade their plans.

## Subscription Plans & Limits

| Plan | Hebrew Name | Assessments per Year | File Upload | Notes |
|------|-------------|---------------------|-------------|-------|
| Free | חינם | Unlimited | ❌ | Can create assessments but cannot upload files |
| Entrepreneur | יזם | 1 | ✅ | One-time business check |
| Business Person | איש עסקים | 18 | ✅ | Monthly subscription |
| Professional | מקצועי | 36 | ✅ | Monthly subscription |

## Database Schema

### New Fields Added to `profiles` Table

- `assessments_used_this_year` (INTEGER): Count of assessments used in current year
- `last_assessment_reset_date` (DATE): Date when assessment count was last reset

### Database Functions

- `can_create_assessment(user_subscription, assessments_used)`: Checks if user can create assessment
- `increment_assessment_count(user_id)`: Increments assessment count for user
- `reset_yearly_assessment_counts()`: Resets all expired assessment counts

## Implementation Details

### Frontend Components

1. **useAssessmentPermissions Hook** (`app/hooks/useAssessmentPermissions.ts`)
   - Provides real-time assessment permissions
   - Calculates remaining assessments
   - Determines file upload access

2. **MultiStepForm** (`app/components/assessment/MultiStepForm.tsx`)
   - Checks permissions before allowing assessment creation
   - Hides file upload step for free users
   - Shows upgrade prompts when limits are reached

3. **Dashboard** (`app/dashboard/page.tsx`)
   - Displays current usage status
   - Shows remaining assessments
   - Provides upgrade links when needed

### Backend API

1. **Assessment Creation** (`app/api/assessment/route.ts`)
   - Validates user permissions before creating assessments
   - Only counts completed assessments (not drafts)
   - Increments usage count automatically

2. **Admin APIs**
   - `app/api/admin/stats/route.ts`: Subscription statistics
   - `app/api/admin/profiles/route.ts`: User profiles with usage data

### Admin Panel Features

1. **Dashboard Statistics**
   - Subscription plan distribution
   - Total assessments used across all users
   - Real-time usage metrics

2. **User Management**
   - View and edit assessment usage counts
   - Reset assessment counts manually
   - Monitor user subscription status

## Usage Flow

### For Users

1. **Free Users**
   - Can create unlimited assessments
   - Cannot upload files (file upload step is hidden)
   - See upgrade prompts for file upload capability

2. **Paid Users**
   - Can create assessments up to their limit
   - See remaining assessment count
   - File upload available for all paid plans

### For Admins

1. **Monitoring**
   - Track subscription distribution
   - Monitor assessment usage patterns
   - Identify users approaching limits

2. **Management**
   - Adjust user subscription plans
   - Reset assessment counts if needed
   - View detailed usage analytics

## Maintenance

### Yearly Reset

Assessment counts are automatically reset yearly based on the `last_assessment_reset_date`. You can also manually trigger a reset:

```bash
npm run reset-assessments
```

### Migration

If you need to apply the database changes manually:

```bash
npm run apply-migration
```

## Security Considerations

1. **Server-side Validation**: All permission checks happen on the server
2. **API Protection**: Assessment creation APIs validate permissions
3. **Database Functions**: Usage tracking uses database-level functions
4. **Admin Access**: Only admins can modify usage counts

## Troubleshooting

### Common Issues

1. **Permission Denied Errors**
   - Check user subscription status
   - Verify assessment count hasn't exceeded limit
   - Ensure user profile exists

2. **Count Not Incrementing**
   - Verify assessment status is 'completed' (not 'draft')
   - Check database function exists
   - Review server logs for errors

3. **Admin Panel Not Showing Usage**
   - Ensure migration was applied
   - Check admin permissions
   - Verify API endpoints are working

### Debug Commands

```bash
# Check current assessment usage
npm run reset-assessments

# View database functions
# Connect to Supabase and run:
# \df can_create_assessment
# \df increment_assessment_count
# \df reset_yearly_assessment_counts
```

## Future Enhancements

1. **Usage Analytics**: Detailed usage reports and trends
2. **Auto-upgrade Prompts**: Suggest plan upgrades when approaching limits
3. **Usage History**: Track assessment usage over time
4. **Flexible Limits**: Allow admins to set custom limits per user
5. **Usage Notifications**: Email alerts when approaching limits
