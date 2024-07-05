import React from 'react';
import Link from 'next/link';
import { getClasses } from '../actions/dataActions';

export default async function ClassPage() {
  const classes = await getClasses();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Classes</h1>
      <div className="flex space-x-4 mb-4">
        <Link
          href="/classes/add"
          className="text-blue-500 hover:underline"
        >
          Add New Class
        </Link>
        <Link
          href="/modules"
          className="text-blue-500 hover:underline"
        >
          View All Modules
        </Link>
        <Link
          href="/students"
          className="text-blue-500 hover:underline"
        >
          View All Students
        </Link>
      </div>
      {classes.length === 0 ? (
        <p>No classes found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {classes.map((classItem) => (
            <Link
              href={`/classes/${classItem.id}`}
              key={classItem.id}
            >
              <div className="border p-4 rounded-lg shadow hover:shadow-md transition-shadow">
                <h2 className="text-xl font-semibold mb-2">
                  {classItem.name}
                </h2>
                <p>{classItem.students.length} students</p>
                <p>{classItem.modules.length} modules</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
