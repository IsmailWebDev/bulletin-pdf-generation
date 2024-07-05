import React from 'react';
import PDFGenerator from '@/app/components/PDFGenerator';
import { getStudents, getClasses } from '../../actions/dataActions';

export default async function StudentReportPage({
  params,
}: {
  params: { id: string };
}) {
  const students = await getStudents();
  const classes = await getClasses();

  const student = students.find((s) => s.id === params.id);
  const classInfo = classes.find((c) => c.id === student?.classId);

  if (!student || !classInfo) {
    return <div>Student or Class not found</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Student Report</h1>
      <p className="mb-2">Student: {student.name}</p>
      <p className="mb-4">Class: {classInfo.name}</p>
      <PDFGenerator student={student} classInfo={classInfo} />
    </div>
  );
}
