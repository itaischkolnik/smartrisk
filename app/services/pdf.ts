import { Analysis } from '@/types/analysis';
import jsPDF from 'jspdf';

export async function generateAnalysisPDF(analysis: Analysis): Promise<Buffer> {
  try {
    // Create new PDF document
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Set RTL mode
    doc.setR2L(true);

    // Set font size and line height
    const titleSize = 20;
    const subtitleSize = 16;
    const textSize = 12;
    const lineHeight = 7;
    let y = 20;

    // Add title
    doc.setFontSize(titleSize);
    doc.text('ניתוח סיכונים עסקי', 190, y, { align: 'right' });
    y += lineHeight * 2;

    // Add date
    doc.setFontSize(textSize);
    doc.text(`תאריך: ${new Date().toLocaleDateString('he-IL')}`, 190, y, { align: 'right' });
    y += lineHeight * 2;

    // Executive Summary
    doc.setFontSize(subtitleSize);
    doc.text('תקציר מנהלים', 190, y, { align: 'right' });
    y += lineHeight;

    doc.setFontSize(textSize);
    const quickRec = `המלצה מהירה: ${analysis.content.executiveSummary.quickRecommendation}`;
    const quickRecLines = doc.splitTextToSize(quickRec, 170);
    doc.text(quickRecLines, 190, y, { align: 'right' });
    y += lineHeight * quickRecLines.length + lineHeight;

    // Key Highlights
    doc.text('נקודות מפתח:', 190, y, { align: 'right' });
    y += lineHeight;
    analysis.content.executiveSummary.keyHighlights.forEach(highlight => {
      const lines = doc.splitTextToSize(`• ${highlight}`, 170);
      doc.text(lines, 190, y, { align: 'right' });
      y += lineHeight * lines.length;
    });
    y += lineHeight;

    // Risk Scores
    doc.setFontSize(subtitleSize);
    doc.text('ציוני סיכון', 190, y, { align: 'right' });
    y += lineHeight;

    doc.setFontSize(textSize);
    doc.text(`ציון סיכון כולל: ${analysis.riskScores.overall}/10`, 190, y, { align: 'right' });
    y += lineHeight;
    doc.text(`סיכון עסקי: ${analysis.riskScores.business}/10`, 190, y, { align: 'right' });
    y += lineHeight;
    doc.text(`סיכון פיננסי: ${analysis.riskScores.financial}/10`, 190, y, { align: 'right' });
    y += lineHeight;
    doc.text(`סיכון שוק: ${analysis.riskScores.market}/10`, 190, y, { align: 'right' });
    y += lineHeight;
    doc.text(`סיכון SWOT: ${analysis.riskScores.swot}/10`, 190, y, { align: 'right' });
    y += lineHeight * 2;

    // Add new page if near bottom
    if (y > 250) {
      doc.addPage();
      y = 20;
    }

    // Business Fundamentals
    doc.setFontSize(subtitleSize);
    doc.text(analysis.content.businessFundamentals.title, 190, y, { align: 'right' });
    y += lineHeight;

    doc.setFontSize(textSize);
    const bfLines = doc.splitTextToSize(analysis.content.businessFundamentals.content, 170);
    doc.text(bfLines, 190, y, { align: 'right' });
    y += lineHeight * bfLines.length;
    doc.text(`ציון סיכון: ${analysis.content.businessFundamentals.riskScore}/10`, 190, y, { align: 'right' });
    y += lineHeight * 2;

    // Add new page
    doc.addPage();
    y = 20;

    // Financial Analysis
    doc.setFontSize(subtitleSize);
    doc.text(analysis.content.financialAnalysis.title, 190, y, { align: 'right' });
    y += lineHeight;

    doc.setFontSize(textSize);
    const faLines = doc.splitTextToSize(analysis.content.financialAnalysis.content, 170);
    doc.text(faLines, 190, y, { align: 'right' });
    y += lineHeight * faLines.length;
    doc.text(`ציון סיכון: ${analysis.content.financialAnalysis.riskScore}/10`, 190, y, { align: 'right' });
    y += lineHeight * 2;

    // Add new page
    doc.addPage();
    y = 20;

    // Market Analysis
    doc.setFontSize(subtitleSize);
    doc.text(analysis.content.marketAnalysis.title, 190, y, { align: 'right' });
    y += lineHeight;

    doc.setFontSize(textSize);
    const maLines = doc.splitTextToSize(analysis.content.marketAnalysis.content, 170);
    doc.text(maLines, 190, y, { align: 'right' });
    y += lineHeight * maLines.length;
    doc.text(`ציון סיכון: ${analysis.content.marketAnalysis.riskScore}/10`, 190, y, { align: 'right' });
    y += lineHeight * 2;

    // Add new page
    doc.addPage();
    y = 20;

    // SWOT Analysis
    doc.setFontSize(subtitleSize);
    doc.text(analysis.content.swotAnalysis.title, 190, y, { align: 'right' });
    y += lineHeight;

    doc.setFontSize(textSize);
    const swotLines = doc.splitTextToSize(analysis.content.swotAnalysis.content, 170);
    doc.text(swotLines, 190, y, { align: 'right' });
    y += lineHeight * swotLines.length;
    doc.text(`ציון סיכון: ${analysis.content.swotAnalysis.riskScore}/10`, 190, y, { align: 'right' });
    y += lineHeight * 2;

    // Add new page
    doc.addPage();
    y = 20;

    // Recommendations
    doc.setFontSize(subtitleSize);
    doc.text('המלצות', 190, y, { align: 'right' });
    y += lineHeight * 1.5;

    doc.setFontSize(textSize);
    doc.text('פעולות מומלצות:', 190, y, { align: 'right' });
    y += lineHeight;
    analysis.content.recommendations.actionItems.forEach(item => {
      const lines = doc.splitTextToSize(`• ${item}`, 170);
      doc.text(lines, 190, y, { align: 'right' });
      y += lineHeight * lines.length;
    });
    y += lineHeight;

    doc.text('אסטרטגיות להפחתת סיכון:', 190, y, { align: 'right' });
    y += lineHeight;
    analysis.content.recommendations.riskMitigation.forEach(item => {
      const lines = doc.splitTextToSize(`• ${item}`, 170);
      doc.text(lines, 190, y, { align: 'right' });
      y += lineHeight * lines.length;
    });
    y += lineHeight;

    doc.text('שיקולי השקעה:', 190, y, { align: 'right' });
    y += lineHeight;
    analysis.content.recommendations.investmentConsiderations.forEach(item => {
      const lines = doc.splitTextToSize(`• ${item}`, 170);
      doc.text(lines, 190, y, { align: 'right' });
      y += lineHeight * lines.length;
    });

    // Add footer
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.text('© SmartRisk. כל הזכויות שמורות.', 105, 285, { align: 'center' });
    }

    // Convert to Buffer
    const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
    return pdfBuffer;

  } catch (error) {
    console.error('PDF Generation Error:', error);
    throw error;
  }
} 