import PDFDocument from 'pdfkit';

// Configure PDFKit to use standard fonts without requiring external files
const configurePDFKit = () => {
  // @ts-ignore - Accessing internal PDFKit configuration
  if (PDFDocument.prototype._fontFamilies) {
    // @ts-ignore
    PDFDocument.prototype._fontFamilies = {
      helvetica: {
        normal: 'Helvetica',
        bold: 'Helvetica-Bold',
        italic: 'Helvetica-Oblique',
        boldItalic: 'Helvetica-BoldOblique'
      }
    };
  }
};

export { configurePDFKit }; 