import PDFDocument from 'pdfkit';
import { Analysis } from '@/types/analysis';

export async function generateAnalysisPDF(analysis: Analysis): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      // Create a document without any font configuration
      const doc = new PDFDocument({
        autoFirstPage: true,
        size: 'A4',
        margin: 50,
        layout: 'portrait'
      });

      // Collect the PDF data chunks
      const chunks: any[] = [];
      doc.on('data', chunk => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));

      // Add content without any font specifications
      doc.text('ניתוח סיכונים עסקי', { align: 'right' })
         .text(`תאריך: ${new Date().toLocaleDateString('he-IL')}`, { align: 'right' })
         .moveDown();

      doc.text('תקציר מנהלים', { align: 'right' })
         .text(`המלצה מהירה: ${analysis.content.executiveSummary.quickRecommendation}`, { align: 'right' })
         .moveDown();

      analysis.content.executiveSummary.keyHighlights.forEach(highlight => {
        doc.text(`• ${highlight}`, { align: 'right' });
      });
      doc.moveDown();

      doc.text('ציוני סיכון', { align: 'right' })
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
           .text(section.title, { align: 'right' })
           .moveDown()
           .text(section.content, { align: 'right' })
           .moveDown()
           .text(`ציון סיכון: ${section.riskScore}/10`, { align: 'right' });
      });

      // Add recommendations
      doc.addPage()
         .text('המלצות', { align: 'right' })
         .moveDown()
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

      // Finalize the PDF
      doc.end();
    } catch (error) {
      reject(error);
    }
  });
} 