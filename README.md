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

## 📄 License
[Your License Here]
