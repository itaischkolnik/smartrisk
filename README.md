# SmartRisk Assessment Platform

A comprehensive assessment platform built with Next.js, featuring multi-step forms, file management, and secure data handling.

## 🌟 Features

### Multi-Step Assessment Form
- **6-Step Assessment Process**:
  1. Personal Details
  2. Personal Questionnaire
  3. Business Details
  4. Financial Data
  5. SWOT Analysis
  6. File Upload
- Auto-save functionality for drafts
- Progress tracking
- Form validation using Zod
- Responsive design with Tailwind CSS

### File Management System
- Drag and drop file uploads
- Support for multiple file uploads
- Hebrew filename handling
- File preview and listing
- Secure file storage with Supabase
- Download and delete capabilities
- Progress tracking for uploads

### Security Features
- User authentication with NextAuth
- Secure session management
- Protected API routes
- Secure file handling

## 🏗️ Project Structure

```
SmartRisk/
├── app/
│   ├── api/
│   │   ├── assessment/
│   │   │   ├── [id]/
│   │   │   │   ├── file/
│   │   │   │   │   └── route.ts    # File upload endpoint
│   │   │   │   └── files/
│   │   │   │       └── route.ts    # File management endpoint
│   │   └── auth/
│   │       └── [...nextauth]/
│   │           └── route.ts        # Authentication routes
│   ├── components/
│   │   └── assessment/
│   │       ├── MultiStepForm.tsx   # Main form component
│   │       └── steps/
│   │           ├── FileUploadForm.tsx
│   │           ├── PersonalDetails.tsx
│   │           ├── BusinessDetails.tsx
│   │           ├── FinancialData.tsx
│   │           └── SwotAnalysis.tsx
│   └── layout.tsx
```

## 🛠️ Technical Stack

### Frontend
- Next.js 13+
- React Hook Form
- Zod Validation
- Tailwind CSS
- React Icons

### Backend
- Next.js API Routes
- Supabase (Storage & Database)
- NextAuth.js

### Storage
- Supabase Storage for file management
- Supabase Database for metadata

## 🚀 Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn
- Supabase account
- Environment variables setup

### Environment Variables
Create a `.env.local` file with:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Installation
1. Clone the repository
```bash
git clone [repository-url]
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Set up Supabase storage
- Create a bucket named 'assessment-files'
- Configure CORS settings
- Set up storage policies

4. Run the development server
```bash
npm run dev
# or
yarn dev
```

## 📝 API Documentation

### File Upload Endpoint
`POST /api/assessment/[id]/file`
- Handles file uploads
- Sanitizes filenames
- Stores files in Supabase
- Updates database with metadata

### File Management Endpoint
`GET /api/assessment/[id]/files`
- Retrieves files for an assessment

`DELETE /api/assessment/[id]/files`
- Removes files from storage and database

## 🔒 Security Considerations
- All API routes are protected with authentication
- File uploads are validated and sanitized
- Secure storage handling with Supabase
- Session-based access control

## 🔄 Data Flow
1. User fills out multi-step form
2. Form data is auto-saved as draft
3. Files are uploaded to Supabase storage
4. File metadata is stored in database
5. Files can be retrieved or deleted through API

## 🎯 Future Enhancements
- [ ] File type validation
- [ ] File size limits
- [ ] Batch file operations
- [ ] File categorization
- [ ] Preview support for common file types
- [ ] Enhanced progress indicators

## 🚨 Common Issues & Solutions

### White-on-White Text Issue in Admin Pages

**Problem**: Text appears invisible (white on white background) in admin pages, particularly in headers and other colored sections.

**Root Cause**: The `app/styles/admin-only.css` file contains global CSS overrides that force all text to be dark colors and all backgrounds to be white, regardless of the Tailwind classes applied.

**Solution**: The CSS has been updated to be more specific and only apply default colors when no specific color classes are set.

#### How to Prevent This Issue in Future Pages:

1. **For Admin Pages with Colored Backgrounds**:
   ```jsx
   // ✅ CORRECT - Use specific classes and inline styles
   <div className="bg-gradient-to-r from-red-600 to-red-800 text-white py-8 admin-header" 
        style={{ background: 'linear-gradient(to right, #dc2626, #991b1b) !important' }}>
     <h1 className="text-2xl font-bold text-white">Title</h1>
     <p className="text-red-100">Subtitle</p>
   </div>
   ```

2. **Add Scoped CSS for Critical Sections**:
   ```jsx
   <style jsx>{`
     .admin-header {
       background: linear-gradient(to right, #dc2626, #991b1b) !important;
     }
     .admin-header * {
       color: white !important;
     }
     .admin-header .text-red-100 {
       color: #fecaca !important;
     }
   `}</style>
   ```

3. **CSS Rules to Avoid**:
   ```css
   /* ❌ DON'T - Global overrides that affect all elements */
   .admin-page {
     color: #1f2937 !important;
     background-color: #ffffff !important;
   }
   ```

4. **CSS Rules to Use**:
   ```css
   /* ✅ DO - Specific overrides that only apply when no color class is set */
   .admin-page h1:not([class*="text-"]) {
     color: #111827 !important;
   }
   .admin-page p:not([class*="text-"]) {
     color: #374151 !important;
   }
   ```

#### Testing Checklist:
- [ ] Check text visibility on colored backgrounds
- [ ] Verify icons are visible against backgrounds
- [ ] Test with different color schemes
- [ ] Ensure contrast ratios meet accessibility standards

#### Debugging Steps:
1. **Inspect Element**: Use browser dev tools to check if CSS is being overridden
2. **Check CSS Specificity**: Ensure your color classes have higher specificity
3. **Use Inline Styles**: For critical elements, use inline styles with `!important`
4. **Add Scoped CSS**: Use `styled-jsx` for page-specific overrides

#### Files to Check When Issues Occur:
- `app/styles/admin-only.css` - Check for global overrides
- `app/components/layout/AdminLayout.tsx` - Verify admin-page class usage
- `app/globals.css` - Check for conflicting global styles

## 📄 License
[Your License Here]

These are the schemas of the Supabase tables:

assessments table schema:

| column_name   | data_type                |
| ------------- | ------------------------ |
| id            | uuid                     |
| user_id       | uuid                     |
| business_name | text                     |
| status        | text                     |
| summary       | text                     |
| report_url    | text                     |
| created_at    | timestamp with time zone |
| updated_at    | timestamp with time zone |

assessment_data table schema:

| column_name   | data_type                |
| ------------- | ------------------------ |
| id            | uuid                     |
| assessment_id | uuid                     |
| section       | text                     |
| data          | jsonb                    |
| created_at    | timestamp with time zone |
| updated_at    | timestamp with time zone |

files table schema:

| column_name   | data_type                |
| ------------- | ------------------------ |
| id            | uuid                     |
| assessment_id | uuid                     |
| file_name     | text                     |
| file_url      | text                     |
| file_type     | text                     |
| file_size     | bigint                   |
| file_category | text                     |
| created_at    | timestamp with time zone |

profiles table schema:

| column_name | data_type                |
| ----------- | ------------------------ |
| id          | uuid                     |
| email       | text                     |
| full_name   | text                     |
| avatar_url  | text                     |
| created_at  | timestamp with time zone |
| updated_at  | timestamp with time zone |

analyses table schema:

| column_name          | data_type                |
| -------------------- | ------------------------ |
| id                   | uuid                     |
| assessment_id        | uuid                     |
| user_id              | uuid                     |
| status               | USER-DEFINED             |
| overall_risk_score   | numeric                  |
| business_risk_score  | numeric                  |
| financial_risk_score | numeric                  |
| market_risk_score    | numeric                  |
| swot_risk_score      | numeric                  |
| analysis_content     | jsonb                    |
| pdf_url              | text                     |
| created_at           | timestamp with time zone |
| updated_at           | timestamp with time zone |
| error_message        | text                     |