import React from 'react';
import Link from 'next/link';
import { getStudentWithAssessments } from '../../actions/dataActions';
import StudentDetails from '../../components/StudentDetails';

export default async function StudentPage({
  params,
}: {
  params: { id: string };
}) {
  const student = await getStudentWithAssessments(params.id);
  console.log(student?.class.modules);
  if (!student) {
    return <div>Student not found</div>;
  }

  return (
    <div className="p-4">
      <Link
        href="/students"
        className="text-blue-500 hover:underline mb-4 inline-block"
      >
        ← Back to Students
      </Link>
      <h1 className="text-2xl font-bold mb-4">Student Details</h1>
      <StudentDetails student={student} />
    </div>
  );
}
