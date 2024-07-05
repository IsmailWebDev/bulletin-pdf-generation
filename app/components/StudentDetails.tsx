'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Student, Class, Module, Assessment } from '@prisma/client';
import {
  updateStudent,
  deleteStudent,
  addStudentToModule,
  updateStudentAssessments,
} from '../actions/dataActions';
import PDFGenerator from './PDFGenerator';

interface StudentDetailsProps {
  student: Student & {
    class: Class & { modules: Module[] };
    assessments: (Assessment & { module: Module })[];
  };
}

export default function StudentDetails({
  student,
}: StudentDetailsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(student.name);
  const [assessmentValues, setAssessmentValues] = useState<{
    [moduleId: string]: number;
  }>(
    student.assessments.reduce((acc, assessment) => {
      acc[assessment.moduleId] = assessment.continuousAssessment;
      return acc;
    }, {} as { [moduleId: string]: number })
  );
  const router = useRouter();

  const handleUpdateStudent = async () => {
    await updateStudent(student.id, { name });
    setIsEditing(false);
    router.refresh();
  };

  const handleDeleteStudent = async () => {
    if (confirm('Are you sure you want to delete this student?')) {
      await deleteStudent(student.id);
      router.push('/students');
      router.refresh();
    }
  };

  const handleAddModule = async (moduleId: string) => {
    await addStudentToModule(student.id, moduleId);
    router.refresh();
  };

  const handleAssessmentChange = (
    moduleId: string,
    value: number
  ) => {
    setAssessmentValues((prevValues) => ({
      ...prevValues,
      [moduleId]: value,
    }));
  };

  const handleUpdateAllAssessments = async () => {
    await updateStudentAssessments(student.id, assessmentValues);
    router.refresh();
  };

  return (
    <div className="border p-4 rounded-lg shadow">
      {isEditing ? (
        <div className="mb-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-2 mr-2 text-black"
          />
          <button
            onClick={handleUpdateStudent}
            className="bg-green-500 text-white px-4 py-2 rounded mr-2"
          >
            Save
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      ) : (
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">{student.name}</h2>
          <div>
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
            >
              Edit
            </button>
            <button
              onClick={handleDeleteStudent}
              className="bg-red-500 text-white px-4 py-2 rounded mr-2"
            >
              Delete
            </button>
            <PDFGenerator
              student={student}
              classInfo={student.class}
            />
          </div>
        </div>
      )}

      <p className="mb-4">Class: {student.class.name}</p>

      <h3 className="text-xl font-medium mb-2">
        Modules and Assessments:
      </h3>
      <table className="w-full mb-4">
        <thead>
          <tr>
            <th className="text-left">Module</th>
            <th className="text-left">Code</th>
            <th className="text-left">Assessment</th>
            <th className="text-left">Coefficient</th>
          </tr>
        </thead>
        <tbody>
          {student.class.modules.map((module) => {
            const assessment = student.assessments.find(
              (a) => a.moduleId === module.id
            );
            return (
              <tr key={module.id}>
                <td>{module.name}</td>
                <td>{module.code}</td>
                <td>
                  {assessment ? (
                    <input
                      type="number"
                      value={assessmentValues[module.id] || ''}
                      onChange={(e) =>
                        handleAssessmentChange(
                          module.id,
                          parseFloat(e.target.value)
                        )
                      }
                      className="border p-1 w-20 text-black"
                    />
                  ) : (
                    <button
                      onClick={() => handleAddModule(module.id)}
                      className="bg-green-500 text-white px-2 py-1 rounded"
                    >
                      Add
                    </button>
                  )}
                </td>
                <td>{module.coefficient}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <button
        onClick={handleUpdateAllAssessments}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        Update All Assessments
      </button>
      <PDFGenerator student={student} classInfo={student.class} />
    </div>
  );
}
