'use client';

import React, { useState } from 'react';
import { addModule } from '../../actions/dataActions';
import { useRouter } from 'next/navigation';

export default function AddModulePage() {
  const [moduleName, setModuleName] = useState('');
  const [moduleCode, setModuleCode] = useState('');
  const [coefficient, setCoefficient] = useState(1);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addModule({
      name: moduleName,
      code: moduleCode,
      coefficient,
    });
    router.push('/modules');
    router.refresh();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Add New Module</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="moduleName" className="block mb-2">
            Module Name:
          </label>
          <input
            type="text"
            id="moduleName"
            value={moduleName}
            onChange={(e) => setModuleName(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded text-black"
          />
        </div>
        <div>
          <label htmlFor="moduleCode" className="block mb-2">
            Module Code:
          </label>
          <input
            type="text"
            id="moduleCode"
            value={moduleCode}
            onChange={(e) => setModuleCode(e.target.value)}
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
            value={coefficient}
            onChange={(e) => setCoefficient(Number(e.target.value))}
            required
            min="1"
            className="w-full px-3 py-2 border rounded text-black"
          />
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
