import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { Analysis } from '@/types/analysis';

export async function generateAnalysisPDF(analysis: Analysis): Promise<Buffer> {
  const doc = await PDFDocument.create();
  
  // Use a standard font that supports Hebrew
  const font = await doc.embedFont(StandardFonts.Helvetica);
  
  // Create the first page
  const page = doc.addPage();
  const { width, height } = page.getSize();
  
  // Helper function for text
  const drawText = (text: string, x: number, y: number, size: number) => {
    page.drawText(text, {
      x: x,
      y: height - y,
      size,
      font,
      color: rgb(0, 0, 0),
    });
  };

  // Add header
  drawText('Business Risk Analysis', 50, 50, 24);
  drawText(`Date: ${new Date().toLocaleDateString()}`, 50, 80, 12);

  // Add executive summary
  drawText('Executive Summary', 50, 120, 18);
  drawText(`Quick Recommendation: ${analysis.content.executiveSummary.quickRecommendation}`, 50, 150, 12);
  
  let yOffset = 180;
  analysis.content.executiveSummary.keyHighlights.forEach((highlight, index) => {
    drawText(`• ${highlight}`, 50, yOffset, 12);
    yOffset += 20;
  });

  // Add risk scores
  yOffset += 20;
  drawText('Risk Scores', 50, yOffset, 18);
  yOffset += 30;
  drawText(`Overall Risk Score: ${analysis.riskScores.overall}/10`, 50, yOffset, 12);
  yOffset += 20;
  drawText(`Business Risk: ${analysis.riskScores.business}/10`, 50, yOffset, 12);
  yOffset += 20;
  drawText(`Financial Risk: ${analysis.riskScores.financial}/10`, 50, yOffset, 12);
  yOffset += 20;
  drawText(`Market Risk: ${analysis.riskScores.market}/10`, 50, yOffset, 12);
  yOffset += 20;
  drawText(`SWOT Risk: ${analysis.riskScores.swot}/10`, 50, yOffset, 12);

  // Add sections
  const sections = [
    analysis.content.businessFundamentals,
    analysis.content.financialAnalysis,
    analysis.content.marketAnalysis,
    analysis.content.swotAnalysis,
  ];

  sections.forEach(section => {
    // Add new page for each section
    const sectionPage = doc.addPage();
    drawText(section.title, 50, 50, 18);
    
    // Split content into lines and draw
    const lines = section.content.split('\n');
    let lineY = 80;
    lines.forEach(line => {
      drawText(line, 50, lineY, 12);
      lineY += 20;
    });
    
    drawText(`Risk Score: ${section.riskScore}/10`, 50, lineY + 20, 12);
  });

  // Add recommendations page
  const recsPage = doc.addPage();
  drawText('Recommendations', 50, 50, 18);
  
  yOffset = 80;
  drawText('Action Items:', 50, yOffset, 14);
  yOffset += 20;
  analysis.content.recommendations.actionItems.forEach(item => {
    drawText(`• ${item}`, 50, yOffset, 12);
    yOffset += 20;
  });

  yOffset += 20;
  drawText('Risk Mitigation Strategies:', 50, yOffset, 14);
  yOffset += 20;
  analysis.content.recommendations.riskMitigation.forEach(item => {
    drawText(`• ${item}`, 50, yOffset, 12);
    yOffset += 20;
  });

  yOffset += 20;
  drawText('Investment Considerations:', 50, yOffset, 14);
  yOffset += 20;
  analysis.content.recommendations.investmentConsiderations.forEach(item => {
    drawText(`• ${item}`, 50, yOffset, 12);
    yOffset += 20;
  });

  // Save the PDF
  const pdfBytes = await doc.save();
  return Buffer.from(pdfBytes);
}

// Helper function to split text into lines
function splitTextToLines(text: string, maxCharsPerLine: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  words.forEach(word => {
    if (currentLine.length + word.length + 1 <= maxCharsPerLine) {
      currentLine += (currentLine.length === 0 ? '' : ' ') + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  });

  if (currentLine.length > 0) {
    lines.push(currentLine);
  }

  return lines;
} 