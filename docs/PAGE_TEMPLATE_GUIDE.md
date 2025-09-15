# PageTemplate Guide

## Overview
The `PageTemplate` component is designed to prevent the white color problem that occurs when pages are corrupted or improperly structured. It provides a consistent layout wrapper for all pages.

## Why Use PageTemplate?

The white color problem occurs when:
1. Files get corrupted during editing
2. Missing proper HTML structure
3. Inconsistent styling between pages
4. Font loading issues

The PageTemplate component ensures:
- ✅ Consistent layout structure
- ✅ Proper font loading
- ✅ Navbar and Footer inclusion
- ✅ Responsive design
- ✅ Error prevention

## How to Use

### Basic Usage
```tsx
'use client';

import PageTemplate from '../components/PageTemplate';

export default function YourPage() {
  return (
    <PageTemplate>
      {/* Your page content goes here */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h1>Your Page Title</h1>
          <p>Your page content...</p>
        </div>
      </section>
    </PageTemplate>
  );
}
```

### With Optional Props
```tsx
'use client';

import PageTemplate from '../components/PageTemplate';

export default function YourPage() {
  return (
    <PageTemplate 
      title="Page Title"
      description="Page description"
    >
      {/* Your page content */}
    </PageTemplate>
  );
}
```

## Template Structure

The PageTemplate includes:
- `min-h-screen flex flex-col font-heebo` - Full height layout with Heebo font
- Google Fonts import for Heebo font family
- Navbar component
- Main content area with `flex-1`
- Footer component

## Best Practices

1. **Always use PageTemplate** for new pages
2. **Don't duplicate** the layout structure in individual pages
3. **Keep content focused** on the page-specific content
4. **Use consistent styling** classes throughout

## Migration Guide

To migrate existing pages to use PageTemplate:

1. Remove the outer div wrapper
2. Remove the style jsx global import
3. Remove Navbar and Footer imports
4. Remove the main tag wrapper
5. Wrap content with PageTemplate

### Before:
```tsx
'use client';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function YourPage() {
  return (
    <div className="min-h-screen flex flex-col font-heebo">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;600;700;800;900&display=swap');
      `}</style>
      
      <Navbar />
      
      <main className="flex-1">
        {/* Your content */}
      </main>
      
      <Footer />
    </div>
  );
}
```

### After:
```tsx
'use client';

import PageTemplate from '../components/PageTemplate';

export default function YourPage() {
  return (
    <PageTemplate>
      {/* Your content */}
    </PageTemplate>
  );
}
```

## Troubleshooting

### White Screen Issues
If you still see a white screen:
1. Check that PageTemplate is properly imported
2. Verify the component structure is correct
3. Ensure no syntax errors in the page content
4. Check browser console for errors

### Font Issues
If fonts aren't loading:
1. PageTemplate handles font loading automatically
2. No need to import fonts in individual pages
3. Font loading is optimized in the template

## File Location
- Template: `app/components/PageTemplate.tsx`
- This guide: `docs/PAGE_TEMPLATE_GUIDE.md`

## Future Pages
When creating new pages, always use this pattern:
```tsx
'use client';

import PageTemplate from '../components/PageTemplate';

export default function NewPage() {
  return (
    <PageTemplate>
      {/* Your beautiful page content */}
    </PageTemplate>
  );
}
```

This ensures consistency and prevents the white color problem from occurring in future pages. 