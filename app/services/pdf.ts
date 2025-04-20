import PDFDocument from 'pdfkit';
import { Analysis } from '@/types/analysis';

export async function generateAnalysisPDF(analysis: Analysis): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      // Create a document with default Helvetica font
      const doc = new PDFDocument({
        autoFirstPage: true,
        size: 'A4',
        margin: 50,
        layout: 'portrait'
      });

      // Configure document to use RTL for Hebrew
      doc.text('', 0, 0, { align: 'right' }); // Set default alignment to right

      // Collect the PDF data chunks
      const chunks: any[] = [];
      doc.on('data', chunk => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));

      // Add content with RTL support
      doc.fontSize(20)
         .text('ניתוח סיכונים עסקי', { align: 'right' })
         .fontSize(12)
         .text(`תאריך: ${new Date().toLocaleDateString('he-IL')}`, { align: 'right' })
         .moveDown();

      // Executive Summary
      doc.fontSize(16)
         .text('תקציר מנהלים', { align: 'right' })
         .fontSize(12)
         .text(`המלצה מהירה: ${analysis.content.executiveSummary.quickRecommendation}`, { align: 'right' })
         .moveDown();

      doc.text('נקודות מפתח:', { align: 'right' });
      analysis.content.executiveSummary.keyHighlights.forEach(highlight => {
        doc.text(`• ${highlight}`, { align: 'right' });
      });
      doc.moveDown();

      // Risk Scores
      doc.fontSize(16)
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
        doc.addPage()
           .fontSize(16)
           .text(section.title, { align: 'right' })
           .moveDown()
           .fontSize(12)
           .text(section.content, { align: 'right' })
           .moveDown()
           .text(`ציון סיכון: ${section.riskScore}/10`, { align: 'right' });
      });

      // Add recommendations
      doc.addPage()
         .fontSize(16)
         .text('המלצות', { align: 'right' })
         .moveDown()
         .fontSize(12)
         .text('פעולות מומלצות:', { align: 'right' });

      analysis.content.recommendations.actionItems.forEach(item => {
        doc.text(`• ${item}`, { align: 'right' });
      });
      doc.moveDown();

      doc.text('אסטרטגיות להפחתת סיכון:', { align: 'right' });
      analysis.content.recommendations.riskMitigation.forEach(item => {
        doc.text(`• ${item}`, { align: 'right' });
      });
      doc.moveDown();

      doc.text('שיקולי השקעה:', { align: 'right' });
      analysis.content.recommendations.investmentConsiderations.forEach(item => {
        doc.text(`• ${item}`, { align: 'right' });
      });

      // Add footer
      doc.fontSize(10)
         .text('© SmartRisk. כל הזכויות שמורות.', { align: 'center' });

      // Finalize the PDF
      doc.end();
    } catch (error) {
      reject(error);
    }
  });
} 