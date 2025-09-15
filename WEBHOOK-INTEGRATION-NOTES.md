# Webhook Integration Documentation

## Overview
The assessment form has been modified to send data directly to a webhook instead of using OpenAI for analysis. This change routes all form submissions to a Make.com webhook endpoint for external processing.

## Changes Made

### 1. New API Endpoint
- **File**: `app/api/assessment/submit-webhook/route.ts`
- **Purpose**: Collects all assessment data and files, then sends them to the webhook
- **Webhook URL**: `https://hook.eu2.make.com/uewiytsog8lkdy5soyp11ci2rp9z9ytm`

### 2. Updated Form Submission
- **File**: `app/components/assessment/MultiStepForm.tsx`
- **Changes**: 
  - Replaced `submitAssessmentForAnalysis` with `submitAssessmentToWebhook`
  - Removed `AnalysisButton` component
  - Updated submit button styling and messaging

### 3. New Utility Function
- **File**: `app/utils/api.ts`
- **Function**: `submitAssessmentToWebhook(assessment: Assessment)`
- **Purpose**: Client-side function to call the webhook submission endpoint

### 4. Updated Success Page
- **File**: `app/assessment/success/page.tsx`
- **Changes**: 
  - Removed AI analysis references
  - Updated messaging to reflect webhook submission
  - Removed `AnalysisStatus` component

### 5. Dashboard Updates
- **File**: `app/dashboard/page.tsx`
- **Changes**: Added support for new `submitted_to_webhook` status

### 6. Type Updates
- **File**: `app/types/assessment.ts`
- **Changes**: Added `submitted_to_webhook` to assessment status type

## Webhook Payload Structure

The webhook receives a JSON payload with the following clean, non-duplicated structure:

```json
{
  "assessmentId": "string",
  "userId": "string", 
  "userEmail": "string",
  "submissionDate": "ISO datetime string",
  "assessment": {
    "personal_details": { /* personal details form data */ },
    "personal_questionnaire": { /* personal questionnaire data */ },
    "business_details": { /* business details form data */ },
    "financial_data": { /* financial form data */ },
    "swot_analysis": { /* SWOT analysis data */ },
    "additional_files": { /* additional files metadata */ },
    "documents": { /* documents metadata */ }
  },
  "files": [
    {
      "id": "string",
      "name": "filename.pdf",
      "type": "application/pdf",
      "size": 1048576,
      "category": "general",
      "url": "https://supabase-storage-url/path/to/file.pdf",
      "created_at": "ISO datetime string"
    }
  ],
  "totalFiles": 3,
  "metadata": {
    "source": "SmartRisk Assessment Form",
    "version": "1.0",
    "timestamp": "ISO datetime string",
    "sectionsCount": 7
  }
}
```

## File Handling

Files are processed with direct URLs to Supabase storage:
1. **File URL**: Direct URL to the file in Supabase storage (`url` field)
2. **File Metadata**: Complete file information including ID, name, type, size, category, and creation date

This provides a clean structure for the webhook consumer to access files and their metadata.

## Error Handling

The webhook endpoint includes comprehensive error handling:
- Authentication validation
- Data validation
- File processing error handling
- Webhook response validation
- Database status updates

## Status Flow

1. User fills out form → `draft`
2. User submits form → `submitted_to_webhook` 
3. External processing can update status as needed

## Testing

A sample payload structure is provided in `webhook-payload-example.json` for testing purposes.

## OpenAI File Analysis (NEW)

The webhook now includes OpenAI-powered analysis of uploaded files, specifically targeting Hebrew profit and loss statements. 

### Analysis Process:
1. **File Filtering**: Only analyzes files likely to contain financial data (PDFs, images, files with "רווח" or "הפסד" in the name)
2. **OpenAI Analysis**: Uses GPT-4 to extract structured financial data from Hebrew documents
3. **Data Extraction**: Extracts key financial metrics including revenue, expenses, profits, and owner salaries
4. **Error Handling**: Gracefully handles analysis failures and continues with webhook submission

### Extracted Financial Data:
- **שנה** (Year)
- **הכנסות** (Revenue excluding VAT)
- **הכנסות נוספות** (Additional income)
- **רווח העסק** (Business profit)
- **משכורות בעלים** (Owner salaries)
- **רווח כולל** (Total profit = business profit + owner salaries)
- **עלות המכר** (Cost of goods sold)
- **הוצאות מנהליות** (Administrative expenses)
- **משכורות עובדים** (Employee salaries)

### Webhook Payload Addition:
The webhook now includes a `fileAnalysis` section with:
- `totalAnalyzed`: Number of files analyzed
- `successfulAnalyses`: Number of successful analyses
- `results`: Array of analysis results for each file

## Notes

- OpenAI integration is now actively used for file analysis
- File uploads continue to work through Supabase storage
- Assessment data is still saved to the database before webhook submission
- The system gracefully handles webhook failures and provides detailed error messages
- File analysis failures do not prevent webhook submission 