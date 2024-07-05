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

interface Module {
  code: string;
  name: string;
  coefficient: number;
}

interface Assessment {
  module: Module;
  continuousAssessment: number;
}

interface Student {
  id: string;
  name: string;
  assessments: Assessment[];
}

interface Class {
  name: string;
  students: Student[];
}

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
  classInfo: {
    fontSize: 18,
    marginTop: 20,
    marginBottom: 10,
    color: '#444444',
  },
  studentInfo: {
    fontSize: 14,
    marginBottom: 10,
    color: '#444444',
  },
  table: {
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

const formatFloatWithComma = (num: number): string => {
  return num.toFixed(2).replace('.', ',');
};

const AllStudentsReportPDF: React.FC<{ classItem: Class }> = ({
  classItem,
}) => {
  const calculateFinalNote = (student: Student): number => {
    if (!student.assessments || student.assessments.length === 0)
      return 0;
    const totalWeightedSum = student.assessments.reduce(
      (sum: number, assessment: Assessment) =>
        sum +
        assessment.continuousAssessment *
          assessment.module.coefficient,
      0
    );
    const totalCoefficients = student.assessments.reduce(
      (sum: number, assessment: Assessment) =>
        sum + assessment.module.coefficient,
      0
    );
    return totalWeightedSum / totalCoefficients;
  };

  const PDFDocument: React.FC = () => (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>
          Class Report: {classItem.name}
        </Text>
        {classItem.students.map((student) => (
          <View key={student.id}>
            <Text style={styles.studentInfo}>
              Student: {student.name}
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
              {student.assessments &&
                student.assessments.map((assessment, index) => (
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
                  <Text
                    style={[styles.tableCell, styles.finalNoteText]}
                  >
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
                    {formatFloatWithComma(
                      calculateFinalNote(student)
                    )}
                  </Text>
                </View>
              </View>
              <View style={[styles.tableRow, styles.decisionRow]}>
                <View style={[styles.tableCol, { width: '100%' }]}>
                  <Text style={styles.decisionLabel}>Décision:</Text>
                </View>
              </View>
            </View>
          </View>
        ))}
      </Page>
    </Document>
  );

  return (
    <PDFDownloadLink
      document={<PDFDocument />}
      fileName={`${classItem.name.replace(
        ' ',
        '_'
      )}_students_report.pdf`}
    >
      {({ blob, url, loading, error }) =>
        loading
          ? 'Generating PDF...'
          : 'Download Class Students Report PDF'
      }
    </PDFDownloadLink>
  );
};

export default AllStudentsReportPDF;
