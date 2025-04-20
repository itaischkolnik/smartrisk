import PDFDocument from 'pdfkit';
import { Analysis } from '@/types/analysis';

export async function generateAnalysisPDF(analysis: Analysis): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      // Create a document with embedded standard fonts
      const doc = new PDFDocument({
        autoFirstPage: true,
        size: 'A4',
        margin: 50,
        layout: 'portrait',
        compress: true,
        pdfVersion: '1.7',
        tagged: true,
        displayTitle: true,
        lang: 'he',
        info: {
          Title: 'ניתוח סיכונים עסקי',
          Author: 'SmartRisk',
          Subject: 'Business Risk Analysis',
          Keywords: 'risk analysis, business, assessment',
          Creator: 'SmartRisk Platform',
          Producer: 'PDFKit'
        }
      });

      // Configure document to use RTL for Hebrew
      doc.text('', { align: 'right' }); // Set default alignment to right

      // Collect the PDF data chunks
      const chunks: any[] = [];
      doc.on('data', chunk => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));

      // Add content with RTL support
      doc.fontSize(20)
         .text('ניתוח סיכונים עסקי', { align: 'right', continued: false })
         .fontSize(12)
         .text(`תאריך: ${new Date().toLocaleDateString('he-IL')}`, { align: 'right', continued: false })
         .moveDown();

      // Executive Summary
      doc.fontSize(16)
         .text('תקציר מנהלים', { align: 'right', continued: false })
         .fontSize(12)
         .text(`המלצה מהירה: ${analysis.content.executiveSummary.quickRecommendation}`, { align: 'right', continued: false })
         .moveDown();

      doc.text('נקודות מפתח:', { align: 'right', continued: false });
      analysis.content.executiveSummary.keyHighlights.forEach(highlight => {
        doc.text(`• ${highlight}`, { align: 'right', continued: false });
      });
      doc.moveDown();

      // Risk Scores
      doc.fontSize(16)
         .text('ציוני סיכון', { align: 'right', continued: false })
         .fontSize(12)
         .text(`ציון סיכון כולל: ${analysis.riskScores.overall}/10`, { align: 'right', continued: false })
         .text(`סיכון עסקי: ${analysis.riskScores.business}/10`, { align: 'right', continued: false })
         .text(`סיכון פיננסי: ${analysis.riskScores.financial}/10`, { align: 'right', continued: false })
         .text(`סיכון שוק: ${analysis.riskScores.market}/10`, { align: 'right', continued: false })
         .text(`סיכון SWOT: ${analysis.riskScores.swot}/10`, { align: 'right', continued: false })
         .moveDown();

      // Add sections
      const sections = [
        analysis.content.businessFundamentals,
        analysis.content.financialAnalysis,
        analysis.content.marketAnalysis,
        analysis.content.swotAnalysis,
      ];

      sections.forEach(section => {
        doc.addPage()
           .fontSize(16)
           .text(section.title, { align: 'right', continued: false })
           .moveDown()
           .fontSize(12)
           .text(section.content, { align: 'right', continued: false })
           .moveDown()
           .text(`ציון סיכון: ${section.riskScore}/10`, { align: 'right', continued: false });
      });

      // Add recommendations
      doc.addPage()
         .fontSize(16)
         .text('המלצות', { align: 'right', continued: false })
         .moveDown()
         .fontSize(12)
         .text('פעולות מומלצות:', { align: 'right', continued: false });

      analysis.content.recommendations.actionItems.forEach(item => {
        doc.text(`• ${item}`, { align: 'right', continued: false });
      });
      doc.moveDown();

      doc.text('אסטרטגיות להפחתת סיכון:', { align: 'right', continued: false });
      analysis.content.recommendations.riskMitigation.forEach(item => {
        doc.text(`• ${item}`, { align: 'right', continued: false });
      });
      doc.moveDown();

      doc.text('שיקולי השקעה:', { align: 'right', continued: false });
      analysis.content.recommendations.investmentConsiderations.forEach(item => {
        doc.text(`• ${item}`, { align: 'right', continued: false });
      });

      // Add footer
      doc.fontSize(10)
         .text('© SmartRisk. כל הזכויות שמורות.', { align: 'center', continued: false });

      // Finalize the PDF
      doc.end();
    } catch (error) {
      console.error('PDF Generation Error:', error);
      reject(error);
    }
  });
} 