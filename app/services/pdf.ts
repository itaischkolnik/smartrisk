import { renderToBuffer, Font, StyleSheet, Document, Page, Text, View } from '@react-pdf/renderer';
import { Analysis } from '@/types/analysis';
import type { FC } from 'react';

// Register Arial font
Font.register({
  family: 'Arial',
  src: 'https://db.onlinewebfonts.com/t/0750a0fb32f886c9e87bab8df9fae5fd.ttf'
});

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column' as const,
    backgroundColor: '#ffffff',
    padding: 30,
    fontFamily: 'Arial'
  },
  section: {
    margin: 10,
    padding: 10,
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'right' as const
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'right' as const
  },
  text: {
    fontSize: 12,
    marginBottom: 5,
    textAlign: 'right' as const
  },
  list: {
    marginLeft: 10
  }
});

interface AnalysisDocumentProps {
  analysis: Analysis;
}

const AnalysisDocument: FC<AnalysisDocumentProps> = ({ analysis }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.header}>ניתוח סיכונים עסקי</Text>
        <Text style={styles.text}>תאריך: {new Date().toLocaleDateString('he-IL')}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.title}>תקציר מנהלים</Text>
        <Text style={styles.text}>המלצה מהירה: {analysis.content.executiveSummary.quickRecommendation}</Text>
        {analysis.content.executiveSummary.keyHighlights.map((highlight, index) => (
          <Text key={index} style={styles.text}>• {highlight}</Text>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.title}>ציוני סיכון</Text>
        <Text style={styles.text}>ציון סיכון כולל: {analysis.riskScores.overall}/10</Text>
        <Text style={styles.text}>סיכון עסקי: {analysis.riskScores.business}/10</Text>
        <Text style={styles.text}>סיכון פיננסי: {analysis.riskScores.financial}/10</Text>
        <Text style={styles.text}>סיכון שוק: {analysis.riskScores.market}/10</Text>
        <Text style={styles.text}>סיכון SWOT: {analysis.riskScores.swot}/10</Text>
      </View>
    </Page>

    {/* Business Fundamentals */}
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.title}>{analysis.content.businessFundamentals.title}</Text>
        <Text style={styles.text}>{analysis.content.businessFundamentals.content}</Text>
        <Text style={styles.text}>ציון סיכון: {analysis.content.businessFundamentals.riskScore}/10</Text>
      </View>
    </Page>

    {/* Financial Analysis */}
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.title}>{analysis.content.financialAnalysis.title}</Text>
        <Text style={styles.text}>{analysis.content.financialAnalysis.content}</Text>
        <Text style={styles.text}>ציון סיכון: {analysis.content.financialAnalysis.riskScore}/10</Text>
      </View>
    </Page>

    {/* Market Analysis */}
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.title}>{analysis.content.marketAnalysis.title}</Text>
        <Text style={styles.text}>{analysis.content.marketAnalysis.content}</Text>
        <Text style={styles.text}>ציון סיכון: {analysis.content.marketAnalysis.riskScore}/10</Text>
      </View>
    </Page>

    {/* SWOT Analysis */}
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.title}>{analysis.content.swotAnalysis.title}</Text>
        <Text style={styles.text}>{analysis.content.swotAnalysis.content}</Text>
        <Text style={styles.text}>ציון סיכון: {analysis.content.swotAnalysis.riskScore}/10</Text>
      </View>
    </Page>

    {/* Recommendations */}
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.title}>המלצות</Text>
        
        <Text style={styles.title}>פעולות מומלצות:</Text>
        {analysis.content.recommendations.actionItems.map((item, index) => (
          <Text key={index} style={styles.text}>• {item}</Text>
        ))}

        <Text style={styles.title}>אסטרטגיות להפחתת סיכון:</Text>
        {analysis.content.recommendations.riskMitigation.map((item, index) => (
          <Text key={index} style={styles.text}>• {item}</Text>
        ))}

        <Text style={styles.title}>שיקולי השקעה:</Text>
        {analysis.content.recommendations.investmentConsiderations.map((item, index) => (
          <Text key={index} style={styles.text}>• {item}</Text>
        ))}
      </View>
    </Page>
  </Document>
);

export async function generateAnalysisPDF(analysis: Analysis): Promise<Buffer> {
  return await renderToBuffer(<AnalysisDocument analysis={analysis} />);
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