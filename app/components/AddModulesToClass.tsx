'use client';

import React, { useState, useEffect } from 'react';
import {
  getModulesNotInClass,
  addModulesToClass,
} from '../actions/dataActions';
import { Module } from '@prisma/client'; // Adjust the import path as needed

interface AddModulesToClassProps {
  classId: string;
  onAdd: (newModules: Module[]) => void;
}

export default function AddModulesToClass({
  classId,
  onAdd,
}: AddModulesToClassProps) {
  const [availableModules, setAvailableModules] = useState<Module[]>(
    []
  );
  const [selectedModules, setSelectedModules] = useState<string[]>(
    []
  );

  useEffect(() => {
    const fetchModules = async () => {
      const modules = await getModulesNotInClass(classId);
      setAvailableModules(modules);
    };
    fetchModules();
  }, [classId]);

  const handleModuleChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedOptions = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setSelectedModules(selectedOptions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addModulesToClass(classId, selectedModules);
    const addedModules = availableModules.filter((module) =>
      selectedModules.includes(module.id)
    );
    onAdd(addedModules);
    setAvailableModules(
      availableModules.filter(
        (module) => !selectedModules.includes(module.id)
      )
    );
    setSelectedModules([]);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <select
        multiple
        onChange={handleModuleChange}
        value={selectedModules}
        className="w-full px-3 py-2 border rounded text-black mb-2"
      >
        {availableModules.map((module) => (
          <option key={module.id} value={module.id}>
            {module.name} ({module.code})
          </option>
        ))}
      </select>
      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Add Modules to Class
      </button>
    </form>
  );
}
