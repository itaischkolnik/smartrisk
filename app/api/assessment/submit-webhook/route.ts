import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '../../../lib/supabase/server';
import { analyzeFilesForFinancialData, FileAnalysisResult } from '../../../services/openai';

const WEBHOOK_URL = 'https://hook.eu2.make.com/uewiytsog8lkdy5soyp11ci2rp9z9ytm';

export async function POST(request: Request) {
  try {
    const { assessmentId } = await request.json();

    if (!assessmentId) {
      return NextResponse.json(
        { error: 'Assessment ID is required' },
        { status: 400 }
      );
    }

    console.log('Starting webhook submission for assessment:', assessmentId);

    const supabase = createServerSupabaseClient();

    // Check if user is authenticated
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    console.log('User ID:', userId);
    console.log('Session user email:', session.user.email);

    // Fetch all assessment data sections
    const { data: sections, error: sectionsError } = await supabase
      .from('assessment_data')
      .select('section, data')
      .eq('assessment_id', assessmentId);

    if (sectionsError) {
      console.error('Error fetching assessment sections:', sectionsError);
      return NextResponse.json(
        { error: 'Failed to fetch assessment data' },
        { status: 500 }
      );
    }

    console.log('Found sections:', sections?.map(s => s.section) || []);

    // Convert sections array to organized object
    const sectionData = sections?.reduce((acc, section) => {
      acc[section.section] = section.data;
      return acc;
    }, {} as Record<string, any>) || {};

    // Helper function to replace empty fields with "מידע חסר"
    const replaceEmptyFields = (obj: Record<string, any>): Record<string, any> => {
      const result: Record<string, any> = {};
      for (const [key, value] of Object.entries(obj)) {
        if (value === null || value === undefined || value === '' || 
            (Array.isArray(value) && value.length === 0) ||
            (typeof value === 'string' && value.trim() === '')) {
          result[key] = 'מידע חסר';
        } else {
          result[key] = value;
        }
      }
      return result;
    };

    // Ensure business_type is sent in Hebrew
    const businessTypeTranslations: Record<string, string> = {
      retail: 'קמעונאות',
      restaurant: 'מסעדנות',
      service: 'שירותים',
      manufacturing: 'ייצור',
      tech: 'טכנולוגיה',
      other: 'אחר'
    };

    if (sectionData.business_details && sectionData.business_details.business_type) {
      const typeVal = sectionData.business_details.business_type;
      if (businessTypeTranslations[typeVal]) {
        sectionData.business_details.business_type = businessTypeTranslations[typeVal];
      }
    }

    // Translate business_structure (legal status) to Hebrew
    const businessStructureTranslations: Record<string, string> = {
      sole_proprietorship: 'עוסק מורשה',
      partnership: 'שותפות',
      limited_company: 'חברה בע״מ',
      public_company: 'חברה ציבורית',
      other: 'אחר'
    };

    if (sectionData.business_details && sectionData.business_details.business_structure) {
      const structureVal = sectionData.business_details.business_structure;
      if (businessStructureTranslations[structureVal]) {
        sectionData.business_details.business_structure = businessStructureTranslations[structureVal];
      }
    }

    // Translate has_rental_property yes/no to Hebrew
    if (sectionData.business_details && sectionData.business_details.has_rental_property) {
      const rentalVal = sectionData.business_details.has_rental_property;
      sectionData.business_details.has_rental_property = rentalVal === 'yes' ? 'כן' : rentalVal === 'no' ? 'לא' : rentalVal;
    }

    // Translate has_renewal_option yes/no to Hebrew
    if (sectionData.business_details && sectionData.business_details.has_renewal_option) {
      const renewalVal = sectionData.business_details.has_renewal_option;
      sectionData.business_details.has_renewal_option = renewalVal === 'yes' ? 'כן' : renewalVal === 'no' ? 'לא' : renewalVal;
    }

    // Ensure licenses_permits is an array of all selections; convert to readable Hebrew string list if needed
    if (sectionData.business_details && sectionData.business_details.licenses_permits) {
      const licenses = sectionData.business_details.licenses_permits;
      if (Array.isArray(licenses)) {
        // Remove duplicates and empty strings
        const uniqueLicenses = Array.from(new Set(licenses.filter(Boolean)));
        sectionData.business_details.licenses_permits = uniqueLicenses;
        // Optionally also provide a comma-separated string version for convenience
        sectionData.business_details.licenses_permits_str = uniqueLicenses.join(', ');
      }
    }

    // Translate seller_offers_support yes/no to Hebrew
    if (sectionData.business_details && sectionData.business_details.seller_offers_support) {
      const supportVal = sectionData.business_details.seller_offers_support;
      sectionData.business_details.seller_offers_support = supportVal === 'yes' ? 'כן' : supportVal === 'no' ? 'לא' : supportVal;
    }

    // Translate is_franchise yes/no to Hebrew
    if (sectionData.business_details && sectionData.business_details.is_franchise) {
      const franVal = sectionData.business_details.is_franchise;
      sectionData.business_details.is_franchise = franVal === 'yes' ? 'כן' : franVal === 'no' ? 'לא' : franVal;
    }

    // Translate is_inventory_included_in_price yes/no to Hebrew (financial_data)
    if (sectionData.financial_data && sectionData.financial_data.is_inventory_included_in_price) {
      const invIncluded = sectionData.financial_data.is_inventory_included_in_price;
      sectionData.financial_data.is_inventory_included_in_price = invIncluded === 'yes' ? 'כן' : invIncluded === 'no' ? 'לא' : invIncluded;
    }

    // Add field label mapping for financial data
    if (sectionData.financial_data) {
      // Map operating_profit field to new Hebrew label
      if (sectionData.financial_data.operating_profit !== undefined) {
        sectionData.financial_data['ממוצע מחזור שנתי'] = sectionData.financial_data.operating_profit;
        // Keep the original field for backward compatibility
        // sectionData.financial_data.operating_profit = sectionData.financial_data.operating_profit;
      }

      // Map new fields to Hebrew labels
      if (sectionData.financial_data.average_business_profit !== undefined) {
        sectionData.financial_data['ממוצע שנתי של רווח העסק'] = sectionData.financial_data.average_business_profit;
      }

      if (sectionData.financial_data.average_owner_salary !== undefined) {
        sectionData.financial_data['ממוצע שנתי משכורת בעלים'] = sectionData.financial_data.average_owner_salary;
      }
    }

    // Ensure inventory_value_in_price is numeric; default to 0 if empty
    if (sectionData.financial_data) {
      const invValue = sectionData.financial_data.inventory_value_in_price;
      if (invValue === '' || invValue === null || typeof invValue === 'undefined') {
        sectionData.financial_data.inventory_value_in_price = 0;
      }

      // Translate has_legal_claims yes/no to Hebrew
      if (sectionData.financial_data.has_legal_claims) {
        const legalVal = sectionData.financial_data.has_legal_claims;
        sectionData.financial_data.has_legal_claims = legalVal === 'yes' ? 'כן' : legalVal === 'no' ? 'לא' : legalVal;
      }
    }

    // Fetch uploaded files
    console.log('Fetching files for assessment_id:', assessmentId);
    const { data: files, error: filesError } = await supabase
      .from('files')
      .select('*')
      .eq('assessment_id', assessmentId);

    if (filesError) {
      console.error('Error fetching files:', filesError);
      return NextResponse.json(
        { error: 'Failed to fetch files' },
        { status: 500 }
      );
    }

    console.log('Files query result - Found files:', files?.length || 0);
    console.log('Raw files data:', JSON.stringify(files, null, 2));
    
    if (files && files.length > 0) {
      console.log('Files details:', files.map(f => ({
        id: f.id,
        name: f.file_name,
        url: f.file_url,
        type: f.file_type,
        size: f.file_size,
        assessment_id: f.assessment_id
      })));
    } else {
      console.log('No files found - checking if assessment exists in files table');
      // Debug query to see if any files exist for this assessment
      const { data: debugFiles, error: debugError } = await supabase
        .from('files')
        .select('assessment_id, file_name')
        .eq('assessment_id', assessmentId);
      console.log('Debug files check:', debugFiles, 'Error:', debugError);
    }

    // Process files for webhook and categorize them
    const processedFiles = (files || []).map((file) => ({
      id: file.id,
      name: file.file_name,
      type: file.file_type,
      size: file.file_size,
      category: file.file_category || 'general',
      url: file.file_url,
      created_at: file.created_at
    }));

    console.log('Processed files for webhook:', processedFiles);

    // Categorize files by their specific types
    const categorizedFiles = {
      profit_loss_year_a: processedFiles.find(f => f.category === 'profit_loss_year_a'),
      profit_loss_year_b: processedFiles.find(f => f.category === 'profit_loss_year_b'),
      profit_loss_year_c: processedFiles.find(f => f.category === 'profit_loss_year_c'),
      form_11: processedFiles.find(f => f.category === 'form_11'),
      form_126: processedFiles.find(f => f.category === 'form_126'),
    };

    // Check if any PDF files were uploaded
    const hasPdfFiles = processedFiles.length > 0;
    console.log(`PDF detection: ${hasPdfFiles ? 'YES' : 'NO'} - Found ${processedFiles.length} files`);

    // Analyze files with OpenAI for financial data - only if PDFs were uploaded
    let fileAnalysisResults: FileAnalysisResult[] = [];
    if (hasPdfFiles) {
      try {
        console.log('Starting OpenAI file analysis...');
        
        // Analyze profit & loss files (3 years) and form 11 for equipment value
        const filesToAnalyze = [
          categorizedFiles.profit_loss_year_a,
          categorizedFiles.profit_loss_year_b,
          categorizedFiles.profit_loss_year_c,
          categorizedFiles.form_11
        ].filter(Boolean);
   
        console.log(`Analyzing ${filesToAnalyze.length} financial files`);
   
        if (filesToAnalyze.length > 0) {
          // Set a shorter timeout for file analysis to prevent overall timeout
          const analysisPromise = analyzeFilesForFinancialData(filesToAnalyze);
          const timeoutPromise = new Promise<FileAnalysisResult[]>((_, reject) => {
            setTimeout(() => reject(new Error('File analysis timeout')), 15000); // 15 second timeout
          });
          
          fileAnalysisResults = await Promise.race([analysisPromise, timeoutPromise]);
          console.log('OpenAI file analysis completed:', fileAnalysisResults.length, 'files analyzed');
        } else {
          console.log('No profit & loss files found for analysis');
        }
      } catch (error) {
        console.error('Error in OpenAI file analysis:', error);
        // Continue with webhook submission even if analysis fails
        fileAnalysisResults = [];
        console.log('Continuing webhook submission without file analysis due to error/timeout');
      }
    } else {
      console.log('No PDF files uploaded - skipping AI analysis');
    }

    // Ensure profit & loss years are sequential if AI mis-read duplicates
    const fixSequentialYears = () => {
      const order = [
        categorizedFiles.profit_loss_year_a,
        categorizedFiles.profit_loss_year_b,
        categorizedFiles.profit_loss_year_c,
      ];
      const resultsMap: Record<string, FileAnalysisResult | null> = {};
      order.forEach((f) => {
        if (!f) return;
        const res = fileAnalysisResults.find(r => r.fileId === f.id) || null;
        if (res && res.analysisSuccess && res.financialData) {
          resultsMap[f.id] = res;
        }
      });

      const years: number[] = order.map(f => {
        if (!f) return NaN;
        const yearFromNameMatch = f.name.match(/20\d{2}/);
        if (yearFromNameMatch) {
          return Number(yearFromNameMatch[0]);
        }
        const r = resultsMap[f.id];
        const y = r && r.financialData ? Number(r.financialData['שנה']) : NaN;
        return isFinite(y) ? y : NaN;
      });

      // if we have duplicates or non-sequential numbers, fix
      const uniqueYears = Array.from(new Set(years.filter(y => !isNaN(y))));
      const isConsecutive = uniqueYears.length === 3 && uniqueYears[1] === uniqueYears[0] + 1 && uniqueYears[2] === uniqueYears[1] + 1;
      if (!isConsecutive) {
        // determine maxYear from any valid year; default to current year
        const maxYear = Math.max(...uniqueYears, new Date().getFullYear());
        const corrected = [maxYear - 2, maxYear - 1, maxYear];
        corrected.forEach((yr, idx) => {
          const f = order[idx];
          if (!f) return;
          let res = resultsMap[f.id];
          if (!res) {
            // create placeholder result if missing
            res = fileAnalysisResults.find(r => r.fileId === f.id) || null;
            if (!res) return;
          }
          if (res.financialData) {
            res.financialData['שנה'] = yr;
          }
        });
      }
    };

    fixSequentialYears();

    // Structure the file analysis by category for easy mapping
    const structuredFileAnalysis = {
      year_a: {
        uploaded: !!categorizedFiles.profit_loss_year_a,
        file: categorizedFiles.profit_loss_year_a || null,
        analysis: fileAnalysisResults.find(r => r.fileId === categorizedFiles.profit_loss_year_a?.id) || null
      },
      year_b: {
        uploaded: !!categorizedFiles.profit_loss_year_b,
        file: categorizedFiles.profit_loss_year_b || null,
        analysis: fileAnalysisResults.find(r => r.fileId === categorizedFiles.profit_loss_year_b?.id) || null
      },
      year_c: {
        uploaded: !!categorizedFiles.profit_loss_year_c,
        file: categorizedFiles.profit_loss_year_c || null,
        analysis: fileAnalysisResults.find(r => r.fileId === categorizedFiles.profit_loss_year_c?.id) || null
      },
      form_11: {
        uploaded: !!categorizedFiles.form_11,
        file: categorizedFiles.form_11 || null,
        analysis: fileAnalysisResults.find(r => r.fileId === categorizedFiles.form_11?.id) || null
      },
      form_126: {
        uploaded: !!categorizedFiles.form_126,
        file: categorizedFiles.form_126 || null,
        analysis: null // Form 126 is not analyzed for financial data
      }
    };

         // Apply empty field replacement to all sections AFTER all translations and mappings
     for (const sectionKey in sectionData) {
       if (sectionData[sectionKey] && typeof sectionData[sectionKey] === 'object') {
         sectionData[sectionKey] = replaceEmptyFields(sectionData[sectionKey]);
       }
     }

     // Create clean, non-duplicated webhook payload
     const webhookPayload = {
       // Basic submission info
       assessmentId,
       userId,
       userEmail: session.user.email,
       submissionDate: new Date().toISOString(),
       
       // PDF Detection Status
       PDF: hasPdfFiles ? 'yes' : 'no',
       
       // Assessment data organized by section
       assessment: {
         personal_details: sectionData.personal_details || {},
         personal_questionnaire: sectionData.personal_questionnaire || {},
         business_details: sectionData.business_details || {},
         financial_data: sectionData.financial_data || {},
         swot_analysis: sectionData.swot_analysis || {},
         additional_files: sectionData.additional_files || {},
         documents: sectionData.documents || {}
       },
      
      // Files information (legacy format for compatibility)
      files: processedFiles,
      totalFiles: processedFiles.length,
      
      // NEW: Structured file analysis by category (easy to map in Make.com)
      fileAnalysis: structuredFileAnalysis,
      
      // Metadata
      metadata: {
        source: 'SmartRisk Assessment Form',
        version: '1.0',
        timestamp: new Date().toISOString(),
        sectionsCount: Object.keys(sectionData).length,
        hasFileAnalysis: fileAnalysisResults.length > 0,
        analyzedFiles: fileAnalysisResults.length,
        totalUploadedFiles: processedFiles.length,
        hasPdfFiles: hasPdfFiles
      }
    };

    console.log('Webhook payload prepared:', {
      assessmentId,
      sectionsCount: Object.keys(sectionData).length,
      filesCount: processedFiles.length,
      fileAnalysisCount: fileAnalysisResults.length,
      userEmail: session.user.email
    });

    console.log('Processed files summary:', processedFiles.map(f => ({
      name: f.name,
      type: f.type,
      size: f.size,
      url: f.url
    })));

    console.log('File analysis summary:', fileAnalysisResults.map(r => ({
      fileName: r.fileName,
      success: r.analysisSuccess,
      hasFinancialData: !!r.financialData
    })));

    // Send data to webhook
    console.log('Sending to webhook URL:', WEBHOOK_URL);
    const webhookResponse = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(webhookPayload),
    });

    if (!webhookResponse.ok) {
      const errorText = await webhookResponse.text();
      console.error('Webhook error response:', {
        status: webhookResponse.status,
        statusText: webhookResponse.statusText,
        body: errorText
      });
      return NextResponse.json(
        { error: 'Failed to send data to webhook', details: errorText },
        { status: 500 }
      );
    }

    console.log('Webhook response status:', webhookResponse.status);

    // Update assessment status
    const { error: updateError } = await supabase
      .from('assessments')
      .update({
        status: 'submitted_to_webhook',
        updated_at: new Date().toISOString(),
      })
      .eq('id', assessmentId);

    if (updateError) {
      console.error('Error updating assessment status:', updateError);
      // Don't fail the request if status update fails
    }

    const webhookResult = await webhookResponse.json().catch(() => ({}));
    console.log('Webhook submission completed successfully');

    return NextResponse.json({
      success: true,
      message: 'Data successfully sent to webhook',
      assessmentId,
      webhookResponse: webhookResult,
      filesProcessed: processedFiles.length,
      sectionsProcessed: Object.keys(sectionData).length,
      fileAnalysisResults: fileAnalysisResults.length
    });

  } catch (error) {
    console.error('Error in webhook submission:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}