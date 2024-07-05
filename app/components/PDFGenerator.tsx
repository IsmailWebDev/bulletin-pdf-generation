// app/components/PDFGenerator.tsx

'use client';

import dynamic from 'next/dynamic';

const PDFDownloadLink = dynamic(
  () =>
    import('@react-pdf/renderer').then((mod) => mod.PDFDownloadLink),
  {
    ssr: false,
    loading: () => <p>Loading...</p>,
  }
);

import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from '@react-pdf/renderer';
import { Student, Class, Module, Assessment } from '@prisma/client';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    color: '#333333',
  },
  studentInfo: {
    fontSize: 14,
    marginBottom: 10,
    color: '#444444',
  },
  table: {
    // display: 'table',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    margin: 'auto',
    flexDirection: 'row',
  },
  tableCol: {
    width: '25%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableHeader: {
    backgroundColor: '#f0f0f0',
    fontWeight: 'bold',
  },
  tableCell: {
    margin: 5,
    fontSize: 10,
  },
  tableCellCentered: {
    margin: 5,
    fontSize: 10,
    textAlign: 'center',
  },
  finalNoteRow: {
    backgroundColor: '#e6e6e6',
  },
  finalNoteText: {
    fontWeight: 'bold',
  },
  decisionRow: {
    height: 50,
  },
  decisionLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    margin: 5,
  },
});

const formatFloatWithComma = (num: number) => {
  return num.toFixed(2).replace('.', ',');
};

const PDFDocument = ({
  student,
  classInfo,
}: {
  student: Student & {
    assessments: (Assessment & { module: Module })[];
  };
  classInfo: Class;
}) => {
  const calculateFinalNote = () => {
    const totalWeightedSum = student.assessments.reduce(
      (sum, assessment) =>
        sum +
        assessment.module.coefficient *
          assessment.continuousAssessment,
      0
    );
    const totalCoefficients = student.assessments.reduce(
      (sum, assessment) => sum + assessment.module.coefficient,
      0
    );
    return totalWeightedSum / totalCoefficients;
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Student Report</Text>
        <Text style={styles.studentInfo}>
          Student: {student.name}
        </Text>
        <Text style={styles.studentInfo}>
          Class: {classInfo.name}
        </Text>
        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <View style={styles.tableCol}>
              <Text style={styles.tableCellCentered}>Code</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCellCentered}>Module</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCellCentered}>
                Coefficient
              </Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCellCentered}>
                Continuous Assessment
              </Text>
            </View>
          </View>
          {student.assessments.map((assessment, index) => (
            <View style={styles.tableRow} key={index}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCellCentered}>
                  {assessment.module.code}
                </Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>
                  {assessment.module.name}
                </Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCellCentered}>
                  {assessment.module.coefficient}
                </Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCellCentered}>
                  {formatFloatWithComma(
                    assessment.continuousAssessment
                  )}
                </Text>
              </View>
            </View>
          ))}
          <View style={[styles.tableRow, styles.finalNoteRow]}>
            <View style={[styles.tableCol, { width: '75%' }]}>
              <Text style={[styles.tableCell, styles.finalNoteText]}>
                Final Note:
              </Text>
            </View>
            <View style={styles.tableCol}>
              <Text
                style={[
                  styles.tableCellCentered,
                  styles.finalNoteText,
                ]}
              >
                {formatFloatWithComma(calculateFinalNote())}
              </Text>
            </View>
          </View>
          <View style={[styles.tableRow, styles.decisionRow]}>
            <View style={[styles.tableCol, { width: '100%' }]}>
              <Text style={styles.decisionLabel}>Décision:</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

interface PDFGeneratorProps {
  student: Student & {
    assessments: (Assessment & { module: Module })[];
  };
  classInfo: Class;
}

const PDFGenerator: React.FC<PDFGeneratorProps> = ({
  student,
  classInfo,
}) => {
  return (
    <PDFDownloadLink
      document={
        <PDFDocument student={student} classInfo={classInfo} />
      }
      fileName={`${student.name.replace(' ', '_')}_report.pdf`}
    >
      {({ blob, url, loading, error }) =>
        loading ? 'Generating PDF...' : 'Download PDF'
      }
    </PDFDownloadLink>
  );
};

export default PDFGenerator;
