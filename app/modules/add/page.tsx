'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { addModule, getClasses } from '../../actions/dataActions';

export default function AddModulePage() {
  const [moduleData, setModuleData] = useState({
    name: '',
    code: '',
    coefficient: 1,
    classIds: [] as string[],
  });
  const [classes, setClasses] = useState<
    Array<{ id: string; name: string }>
  >([]);
  const router = useRouter();

  useEffect(() => {
    const fetchClasses = async () => {
      const fetchedClasses = await getClasses();
      setClasses(fetchedClasses);
    };
    fetchClasses();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setModuleData((prev) => ({
      ...prev,
      [name]: name === 'coefficient' ? parseFloat(value) : value,
    }));
  };

  const handleClassChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedOptions = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setModuleData((prev) => ({
      ...prev,
      classIds: selectedOptions,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addModule(moduleData);
    router.push('/modules');
    router.refresh();
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Add New Module</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block mb-2">
            Module Name:
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={moduleData.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded text-black"
          />
        </div>
        <div>
          <label htmlFor="code" className="block mb-2">
            Module Code:
          </label>
          <input
            type="text"
            id="code"
            name="code"
            value={moduleData.code}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded text-black"
          />
        </div>
        <div>
          <label htmlFor="coefficient" className="block mb-2">
            Coefficient:
          </label>
          <input
            type="number"
            id="coefficient"
            name="coefficient"
            value={moduleData.coefficient}
            onChange={handleChange}
            required
            min="0"
            step="0.1"
            className="w-full px-3 py-2 border rounded text-black"
          />
        </div>
        <div>
          <label htmlFor="classes" className="block mb-2">
            Classes:
          </label>
          <select
            id="classes"
            name="classes"
            multiple
            onChange={handleClassChange}
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
          Add Module
        </button>
      </form>
    </div>
  );
}
