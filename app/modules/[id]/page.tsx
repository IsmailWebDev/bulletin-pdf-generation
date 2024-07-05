import React from 'react';
import {
  getModules,
  getStudents,
  getClasses,
} from '../../actions/dataActions';
import Link from 'next/link';

export default async function ModulePage({
  params,
}: {
  params: { id: string };
}) {
  const modules = await getModules();
  const students = await getStudents();
  const classes = await getClasses();

  const moduleData = modules.find((m) => m.id === params.id);

  if (!moduleData) {
    return <div>Module not found</div>;
  }

  const studentsInModule = students.filter((student) =>
    student.modules.some((m) => m.id === moduleData.id)
  );

  const classesWithThisModule = classes.filter((c) =>
    c.modules.some((m) => m.id === moduleData.id)
  );

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">
        {moduleData.name} ({moduleData.code})
      </h1>
      <p className="mb-4">Coefficient: {moduleData.coefficient}</p>

      <h2 className="text-xl font-semibold mb-2">
        Classes with this module:
      </h2>
      <ul className="list-disc pl-5 mb-4">
        {classesWithThisModule.map((c) => (
          <li key={c.id}>
            <Link
              href={`/classes/${c.id}`}
              className="text-blue-500 hover:underline"
            >
              {c.name}
            </Link>
          </li>
        ))}
      </ul>

      <h2 className="text-xl font-semibold mb-2">
        Students enrolled:
      </h2>
      <table className="w-full border-collapse border border-gray-300 mb-4">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2">Name</th>
            <th className="border border-gray-300 px-4 py-2">
              Continuous Assessment
            </th>
          </tr>
        </thead>
        <tbody>
          {studentsInModule.map((student) => {
            const studentModule = student.modules.find(
              (m) => m.id === moduleData.id
            );
            return (
              <tr key={student.id}>
                <td className="border border-gray-300 px-4 py-2">
                  <Link
                    href={`/reports/${student.id}`}
                    className="text-blue-500 hover:underline"
                  >
                    {student.name}
                  </Link>
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {studentModule?.continuousAssessment.toFixed(2)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <Link href="/classes" className="text-blue-500 hover:underline">
        Back to Classes
      </Link>
    </div>
  );
}
