# Admin Styling Guide

## Overview
This guide ensures proper contrast and prevents white-on-white issues in admin pages.

## The Problem
White-on-white issues occur when:
- Text color is white on a white background
- CSS specificity conflicts override intended colors
- Global styles interfere with component styles
- Font loading issues cause fallback to white text

## Solution: Admin CSS Classes

### 1. Always Use Admin Classes
```tsx
// ✅ Correct - Use admin classes
<div className="admin-card">
  <h2 className="admin-text-primary">Title</h2>
  <p className="admin-text-secondary">Content</p>
</div>

// ❌ Wrong - Don't use generic classes
<div className="bg-white">
  <h2 className="text-gray-800">Title</h2>
  <p className="text-gray-600">Content</p>
</div>
```

### 2. Admin Layout Structure
```tsx
'use client';

import AdminLayout from '../components/layout/AdminLayout';

export default function AdminPage() {
  return (
    <AdminLayout>
      {/* Your admin content here */}
      <div className="admin-card">
        <h1 className="admin-text-primary">Page Title</h1>
        <p className="admin-text-secondary">Page content...</p>
      </div>
    </AdminLayout>
  );
}
```

### 3. Available Admin Classes

#### Text Colors
- `admin-text-primary` - Dark gray (#111827) for headings
- `admin-text-secondary` - Medium gray (#374151) for body text
- `admin-text-muted` - Light gray (#6b7280) for muted text

#### Background Colors
- `admin-bg-white` - White background (#ffffff)
- `admin-bg-gray-50` - Light gray background (#f9fafb)
- `admin-bg-gray-100` - Slightly darker gray (#f3f4f6)

#### Components
- `admin-card` - Card with proper contrast
- `admin-form` - Form with proper input styling
- `admin-table` - Table with proper contrast
- `admin-button` - Button with proper contrast

#### Alerts
- `admin-alert-error` - Red error alert
- `admin-alert-success` - Green success alert
- `admin-alert-warning` - Yellow warning alert
- `admin-alert-info` - Blue info alert

### 4. Input Styling
```tsx
// ✅ Correct - Use admin form class
<form className="admin-form">
  <input 
    className="admin-input w-full px-4 py-3 rounded-xl"
    placeholder="Enter text..."
  />
</form>

// ✅ Also correct - Use futuristic-input with admin page
<div className="admin-page">
  <input 
    className="futuristic-input w-full px-4 py-3 rounded-xl"
    placeholder="Enter text..."
  />
</div>
```

### 5. Button Styling
```tsx
// ✅ Correct - Use admin button class
<button className="admin-button px-4 py-2 rounded-lg">
  Submit
</button>

// ✅ Also correct - Use glow-button with admin page
<div className="admin-page">
  <button className="glow-button admin-button px-4 py-2 rounded-lg">
    Submit
  </button>
</div>
```

## Best Practices

### 1. Always Use AdminLayout
```tsx
// ✅ Correct
export default function AdminPage() {
  return (
    <AdminLayout>
      <div className="admin-card">
        {/* Content */}
      </div>
    </AdminLayout>
  );
}
```

### 2. Use Admin Classes for Text
```tsx
// ✅ Correct
<h1 className="admin-text-primary">Title</h1>
<p className="admin-text-secondary">Content</p>
<span className="admin-text-muted">Muted text</span>

// ❌ Wrong
<h1 className="text-gray-800">Title</h1>
<p className="text-gray-600">Content</p>
```

### 3. Use Admin Classes for Cards
```tsx
// ✅ Correct
<div className="admin-card p-6 rounded-xl">
  <h2 className="admin-text-primary">Card Title</h2>
  <p className="admin-text-secondary">Card content</p>
</div>

// ❌ Wrong
<div className="bg-white p-6 rounded-xl">
  <h2 className="text-gray-800">Card Title</h2>
  <p className="text-gray-600">Card content</p>
</div>
```

### 4. Use Admin Classes for Forms
```tsx
// ✅ Correct
<form className="admin-form space-y-4">
  <div>
    <label className="admin-text-secondary">Email</label>
    <input className="admin-input w-full" />
  </div>
</form>
```

### 5. Use Admin Classes for Tables
```tsx
// ✅ Correct
<table className="admin-table w-full">
  <thead>
    <tr>
      <th className="admin-text-secondary">Header</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td className="admin-text-primary">Data</td>
    </tr>
  </tbody>
</table>
```

## CSS Specificity

The admin CSS uses `!important` declarations to ensure proper contrast:

```css
.admin-text-primary {
  color: #111827 !important; /* gray-900 */
}

.admin-card {
  background-color: #ffffff !important;
  color: #1f2937 !important; /* gray-800 */
}
```

## Testing Checklist

Before deploying admin pages, verify:

- [ ] All text is visible on white backgrounds
- [ ] All text is visible on colored backgrounds
- [ ] Input fields have proper contrast
- [ ] Buttons have proper contrast
- [ ] Tables have proper contrast
- [ ] Alerts have proper contrast
- [ ] Forms are readable
- [ ] Cards are readable

## Common Issues and Solutions

### Issue: White text on white background
**Solution**: Use `admin-text-primary` or `admin-text-secondary`

### Issue: Input text not visible
**Solution**: Use `admin-input` class or ensure `admin-page` wrapper

### Issue: Button text not visible
**Solution**: Use `admin-button` class

### Issue: Card content not visible
**Solution**: Use `admin-card` class

## Migration Guide

To fix existing admin pages:

1. Add `admin-page` class to the main container
2. Replace text classes with admin equivalents:
   - `text-gray-800` → `admin-text-primary`
   - `text-gray-600` → `admin-text-secondary`
   - `text-gray-500` → `admin-text-muted`
3. Replace background classes:
   - `bg-white` → `admin-bg-white`
4. Replace component classes:
   - Add `admin-card` to cards
   - Add `admin-form` to forms
   - Add `admin-table` to tables
   - Add `admin-button` to buttons

## File Structure

```
app/
├── styles/
│   └── admin.css          # Admin-specific styles
├── components/
│   └── layout/
│       └── AdminLayout.tsx # Admin layout component
└── admin/
    ├── login/
    │   └── page.tsx       # Admin login page
    ├── dashboard/
    │   └── page.tsx       # Admin dashboard
    └── users/
        └── page.tsx       # Admin users page
```

This guide ensures all admin pages have proper contrast and prevents white-on-white issues. 