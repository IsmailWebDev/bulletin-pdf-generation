'use client';

import React, { useState } from 'react';
import { Module } from '@prisma/client';
import { deleteModule, updateModule } from '../actions/dataActions';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface ModuleItemProps {
  module: Module;
}

export default function ModuleItem({ module }: ModuleItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [moduleName, setModuleName] = useState(module.name);
  const [moduleCode, setModuleCode] = useState(module.code);
  const [moduleCoefficient, setModuleCoefficient] = useState(
    module.coefficient
  );
  const router = useRouter();

  const handleDeleteModule = async () => {
    if (confirm('Are you sure you want to delete this module?')) {
      await deleteModule(module.id);
      router.refresh();
    }
  };

  const handleUpdateModule = async () => {
    await updateModule(module.id, {
      name: moduleName,
      code: moduleCode,
      coefficient: moduleCoefficient,
    });
    setIsEditing(false);
    router.refresh();
  };

  return (
    <div className="mb-4 border p-4 rounded-lg shadow">
      {isEditing ? (
        <div>
          <input
            type="text"
            value={moduleName}
            onChange={(e) => setModuleName(e.target.value)}
            className="border p-1 mr-2 mb-2"
            placeholder="Module Name"
          />
          <input
            type="text"
            value={moduleCode}
            onChange={(e) => setModuleCode(e.target.value)}
            className="border p-1 mr-2 mb-2"
            placeholder="Module Code"
          />
          <input
            type="number"
            value={moduleCoefficient}
            onChange={(e) =>
              setModuleCoefficient(parseFloat(e.target.value))
            }
            className="border p-1 mr-2 mb-2"
            placeholder="Coefficient"
          />
          <button
            onClick={handleUpdateModule}
            className="bg-green-500 text-white px-2 py-1 rounded mr-2"
          >
            Save
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className="bg-gray-500 text-white px-2 py-1 rounded"
          >
            Cancel
          </button>
        </div>
      ) : (
        <div>
          <Link key={module.id} href={`/modules/${module.id}`}>
            <h3 className="text-lg font-semibold">
              {module.name} ({module.code})
            </h3>
          </Link>
          <p>Coefficient: {module.coefficient}</p>
          <div className="mt-2">
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
            >
              Edit
            </button>
            <button
              onClick={handleDeleteModule}
              className="bg-red-500 text-white px-2 py-1 rounded"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
