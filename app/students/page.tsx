import React from 'react';
import Link from 'next/link';
import { getStudents } from '../actions/dataActions';

export default async function StudentsPage() {
  const students = await getStudents();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Students</h1>
      <div className="flex gap-4">
        <Link
          href="/students/add"
          className="text-blue-500 hover:underline mb-4 inline-block"
        >
          Add New Student
        </Link>
        <Link
          href="/modules"
          className="text-blue-500 hover:underline mb-4 inline-block"
        >
          View All Modules
        </Link>
        <Link
          href="/classes"
          className="text-blue-500 hover:underline mb-4 inline-block"
        >
          View All Classes
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {students.map((student) => (
          <Link href={`/students/${student.id}`} key={student.id}>
            <div className="border p-4 rounded-lg shadow hover:shadow-md transition-shadow">
              <h2 className="text-xl font-semibold mb-2">
                {student.name}
              </h2>
              <p>Class: {student.class.name}</p>
              <p>{student.assessments.length} assessments</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
