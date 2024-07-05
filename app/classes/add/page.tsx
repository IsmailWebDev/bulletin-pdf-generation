'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { addClass } from '../../actions/dataActions';

export default function AddClassPage() {
  const [className, setClassName] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addClass({ name: className, modules: [] });
    router.push('/classes');
    router.refresh();
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Add New Class</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="className" className="block mb-2">
            Class Name:
          </label>
          <input
            type="text"
            id="className"
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded text-black"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add Class
        </button>
      </form>
    </div>
  );
}
