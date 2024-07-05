'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { addStudent, getClasses } from '../../actions/dataActions';

export default function AddStudentPage() {
  const [name, setName] = useState('');
  const [classId, setClassId] = useState('');
  const [classes, setClasses] = useState<
    Array<{ id: string; name: string }>
  >([]);
  const router = useRouter();

  useEffect(() => {
    const fetchClasses = async () => {
      const fetchedClasses = await getClasses();
      setClasses(fetchedClasses);
      if (fetchedClasses.length > 0) {
        setClassId(fetchedClasses[0].id);
      }
    };
    fetchClasses();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addStudent({ name, classId });
    router.push('/students');
    router.refresh();
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Add New Student</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block mb-2">
            Student Name:
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded text-black"
          />
        </div>
        <div>
          <label htmlFor="class" className="block mb-2">
            Class:
          </label>
          <select
            id="class"
            value={classId}
            onChange={(e) => setClassId(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded text-black"
          >
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add Student
        </button>
      </form>
    </div>
  );
}
