import React from 'react';
import { getModules, getStudents } from '../actions/dataActions';
import Link from 'next/link';

export default async function ModulePage() {
  const modules = await getModules();
  const students = await getStudents();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Modules</h1>
      {modules && modules.length > 0 ? (
        modules.map((module) => (
          <div key={module.id} className="mb-8">
            <h2 className="text-xl font-semibold mb-2">
              {module.name} ({module.code})
            </h2>
            <p className="mb-2">Coefficient: {module.coefficient}</p>
            <h3 className="text-lg font-medium mb-2">
              Enrolled Students:
            </h3>
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2">
                    Student Name
                  </th>
                  <th className="border border-gray-300 px-4 py-2">
                    Continuous Assessment
                  </th>
                </tr>
              </thead>
              <tbody>
                {students
                  .filter((student) =>
                    student.modules.some((m) => m.id === module.id)
                  )
                  .map((student) => {
                    const studentModule = student.modules.find(
                      (m) => m.id === module.id
                    );
                    return (
                      <tr key={student.id}>
                        <td className="border border-gray-300 px-4 py-2">
                          {student.name}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {studentModule?.continuousAssessment.toFixed(
                            2
                          )}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        ))
      ) : (
        <p>No modules found.</p>
      )}
      <Link
        href="/modules/add"
        className="text-blue-500 hover:underline"
      >
        Add New Module
      </Link>
    </div>
  );
}
