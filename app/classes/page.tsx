import React from 'react';
import Link from 'next/link';
import { getClasses, getStudents } from '../actions/dataActions';

export default async function ClassPage() {
  const classes = await getClasses();
  const students = await getStudents();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Classes</h1>
      <Link
        href="/classes/add"
        className="text-blue-500 hover:underline mb-4 inline-block"
      >
        Add New Class
      </Link>
      {classes.length === 0 ? (
        <p>No classes found.</p>
      ) : (
        classes.map((classItem) => (
          <div
            key={classItem.id}
            className="mb-8 border p-4 rounded-lg shadow"
          >
            <h2 className="text-xl font-semibold mb-2">
              {classItem.name}
            </h2>
            <h3 className="text-lg font-medium mb-2">Modules:</h3>
            <ul className="list-disc pl-5 mb-4">
              {classItem.modules.map((module) => (
                <li key={module.id}>
                  <Link
                    href={`/modules/${module.id}`}
                    className="text-blue-500 hover:underline"
                  >
                    {module.name} ({module.code})
                  </Link>
                </li>
              ))}
            </ul>
            <h3 className="text-lg font-medium mb-2">Students:</h3>
            <ul className="list-disc pl-5">
              {students
                .filter((student) => student.classId === classItem.id)
                .map((student) => (
                  <li key={student.id}>
                    {student.name} -
                    <Link
                      href={`/reports/${student.id}`}
                      className="text-blue-500 hover:underline ml-2"
                    >
                      Download Report
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
}
