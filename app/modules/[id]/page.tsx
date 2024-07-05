'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Module, Student, Assessment } from '@prisma/client';
import {
  getModule,
  updateModuleStudentAssessments,
} from '../../actions/dataActions';

interface ExtendedStudent extends Student {
  assessments: Assessment[];
}

interface ExtendedModule extends Module {
  classes: {
    id: string;
    name: string;
    students: ExtendedStudent[];
  }[];
}

export default function ModulePage({
  params,
}: {
  params: { id: string };
}) {
  const [moduleData, setModuleData] = useState<ExtendedModule | null>(
    null
  );
  const [assessments, setAssessments] = useState<{
    [key: string]: number;
  }>({});
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const data = await getModule(params.id);
      if (data) {
        setModuleData(data);

        // Initialize assessments state with current values
        const initialAssessments: { [key: string]: number } = {};
        data.classes.forEach((c) => {
          c.students.forEach((s) => {
            const assessment = s.assessments.find(
              (a) => a.moduleId === data.id
            );
            if (assessment) {
              initialAssessments[s.id] =
                assessment.continuousAssessment;
            }
          });
        });
        setAssessments(initialAssessments);
      }
      setLoading(false);
    };
    fetchData();
  }, [params.id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!moduleData) {
    return <div>Module not found</div>;
  }

  const handleAssessmentChange = (
    studentId: string,
    value: string
  ) => {
    setAssessments((prev) => ({
      ...prev,
      [studentId]: parseFloat(value) || 0,
    }));
  };

  const handleUpdateAssessments = async () => {
    await updateModuleStudentAssessments(moduleData.id, assessments);
    router.refresh();
  };

  const allStudents = moduleData.classes.flatMap((c) => c.students);

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
        {moduleData.classes.map((c) => (
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
        Student Assessments:
      </h2>
      <table className="w-full border-collapse border border-gray-300 mb-4">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2">Name</th>
            <th className="border border-gray-300 px-4 py-2">
              Class
            </th>
            <th className="border border-gray-300 px-4 py-2">
              Assessment
            </th>
          </tr>
        </thead>
        <tbody>
          {allStudents.map((student) => {
            const studentClass = moduleData.classes.find((c) =>
              c.students.some((s) => s.id === student.id)
            );
            return (
              <tr key={student.id}>
                <td className="border border-gray-300 px-4 py-2">
                  <Link
                    href={`/students/${student.id}`}
                    className="text-blue-500 hover:underline"
                  >
                    {student.name}
                  </Link>
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {studentClass?.name}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <input
                    type="number"
                    value={assessments[student.id] || ''}
                    onChange={(e) =>
                      handleAssessmentChange(
                        student.id,
                        e.target.value
                      )
                    }
                    className="border p-1 w-20 text-black"
                    step="0.01"
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <button
        onClick={handleUpdateAssessments}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4"
      >
        Update Assessments
      </button>

      <div>
        <Link
          href="/modules"
          className="text-blue-500 hover:underline"
        >
          Back to Modules
        </Link>
      </div>
    </div>
  );
}
