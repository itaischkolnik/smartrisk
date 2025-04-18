import PDFDocument from 'pdfkit';
import { Analysis } from '@/types/analysis';
import { configurePDFKit } from '@/utils/fonts';

export async function generateAnalysisPDF(analysis: Analysis): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      // Configure PDFKit to use built-in fonts
      configurePDFKit();

      // Create a document
      const doc = new PDFDocument({
        size: 'A4',
        margin: 50,
        autoFirstPage: false
      });

      // Collect the PDF data chunks
      const chunks: any[] = [];
      doc.on('data', chunk => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));

      // Add the first page
      doc.addPage({ layout: 'portrait' });
      
      // Set default font size and basic styling
      doc.fontSize(12);
      
      // Add header
      doc.fontSize(24)
         .text('ניתוח סיכונים עסקי', { align: 'right' })
         .fontSize(12)
         .text(`תאריך: ${new Date().toLocaleDateString('he-IL')}`, { align: 'right' })
         .moveDown();

      // Add executive summary
      doc.fontSize(18)
         .text('תקציר מנהלים', { align: 'right' })
         .fontSize(12)
         .text(`המלצה מהירה: ${analysis.content.executiveSummary.quickRecommendation}`, { align: 'right' })
         .moveDown();

      // Add key highlights
      analysis.content.executiveSummary.keyHighlights.forEach(highlight => {
        doc.text(`• ${highlight}`, { align: 'right' });
      });
      doc.moveDown();

      // Add risk scores
      doc.fontSize(18)
         .text('ציוני סיכון', { align: 'right' })
         .fontSize(12)
         .text(`ציון סיכון כולל: ${analysis.riskScores.overall}/10`, { align: 'right' })
         .text(`סיכון עסקי: ${analysis.riskScores.business}/10`, { align: 'right' })
         .text(`סיכון פיננסי: ${analysis.riskScores.financial}/10`, { align: 'right' })
         .text(`סיכון שוק: ${analysis.riskScores.market}/10`, { align: 'right' })
         .text(`סיכון SWOT: ${analysis.riskScores.swot}/10`, { align: 'right' })
         .moveDown();

      // Add sections
      const sections = [
        analysis.content.businessFundamentals,
        analysis.content.financialAnalysis,
        analysis.content.marketAnalysis,
        analysis.content.swotAnalysis,
      ];

      sections.forEach(section => {
        doc.addPage();
        doc.fontSize(18)
           .text(section.title, { align: 'right' })
           .moveDown()
           .fontSize(12)
           .text(section.content, { align: 'right' })
           .moveDown()
           .text(`ציון סיכון: ${section.riskScore}/10`, { align: 'right' });
      });

      // Add recommendations
      doc.addPage();
      doc.fontSize(18)
         .text('המלצות', { align: 'right' })
         .moveDown();

      doc.fontSize(14)
         .text('פעולות מומלצות:', { align: 'right' })
         .fontSize(12);
      analysis.content.recommendations.actionItems.forEach(item => {
        doc.text(`• ${item}`, { align: 'right' });
      });
      doc.moveDown();

      doc.fontSize(14)
         .text('אסטרטגיות להפחתת סיכון:', { align: 'right' })
         .fontSize(12);
      analysis.content.recommendations.riskMitigation.forEach(item => {
        doc.text(`• ${item}`, { align: 'right' });
      });
      doc.moveDown();

      doc.fontSize(14)
         .text('שיקולי השקעה:', { align: 'right' })
         .fontSize(12);
      analysis.content.recommendations.investmentConsiderations.forEach(item => {
        doc.text(`• ${item}`, { align: 'right' });
      });

      // Finalize the PDF
      doc.end();
    } catch (error) {
      reject(error);
    }
  });
} 