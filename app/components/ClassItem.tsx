'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AddModulesToClass from './AddModulesToClass';
import RemoveModuleFromClass from './RemoveModuleFromClass';
import { Class, Module, Student } from '@prisma/client';
import { deleteClass, updateClass } from '../actions/dataActions';
import { useRouter } from 'next/navigation';

interface ClassItemProps {
  classItem: Class & { modules: Module[]; students: Student[] };
}

export default function ClassItem({ classItem }: ClassItemProps) {
  const [modules, setModules] = useState(classItem.modules);
  const [isEditing, setIsEditing] = useState(false);
  const [className, setClassName] = useState(classItem.name);
  const router = useRouter();

  const handleAddModules = (newModules: Module[]) => {
    setModules([...modules, ...newModules]);
  };

  const handleRemoveModule = (moduleId: string) => {
    setModules(modules.filter((module) => module.id !== moduleId));
  };

  const handleDeleteClass = async () => {
    if (confirm('Are you sure you want to delete this class?')) {
      await deleteClass(classItem.id);
      router.push('/classes');
      router.refresh();
    }
  };

  const handleUpdateClass = async () => {
    await updateClass(classItem.id, { name: className });
    setIsEditing(false);
    router.refresh();
  };

  return (
    <div className="mb-8 border p-4 rounded-lg shadow">
      <Link
        href="/classes"
        className="text-blue-500 hover:underline mb-4 inline-block"
      >
        ← Back to Classes
      </Link>

      {isEditing ? (
        <div className="mb-4">
          <input
            type="text"
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            className="border p-2 mr-2 text-black"
          />
          <button
            onClick={handleUpdateClass}
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
          <h2 className="text-2xl font-semibold">{classItem.name}</h2>
          <div>
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
            >
              Edit
            </button>
            <button
              onClick={handleDeleteClass}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Delete
            </button>
          </div>
        </div>
      )}

      <h3 className="text-xl font-medium mb-2">Modules:</h3>
      <ul className="list-disc pl-5 mb-4">
        {modules.map((module) => (
          <li key={module.id} className="flex items-center mb-2">
            <Link
              href={`/modules/${module.id}`}
              className="text-blue-500 hover:underline"
            >
              {module.name} ({module.code})
            </Link>
            <RemoveModuleFromClass
              classId={classItem.id}
              moduleId={module.id}
              moduleName={module.name}
              onRemove={() => handleRemoveModule(module.id)}
            />
          </li>
        ))}
      </ul>

      <AddModulesToClass
        classId={classItem.id}
        onAdd={handleAddModules}
      />

      <h3 className="text-xl font-medium mb-2 mt-6">Students:</h3>
      <ul className="list-disc pl-5">
        {classItem.students.map((student) => (
          <li key={student.id} className="mb-2">
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
  );
}
