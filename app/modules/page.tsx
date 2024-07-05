import React from 'react';
import Link from 'next/link';
import { getModules } from '../actions/dataActions';
import ModuleItem from '../components/ModuleItem';

export default async function ModulesPage() {
  const modules = await getModules();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Modules</h1>
      <div className="mb-4 flex gap-4">
        <Link
          href="/modules/add"
          className="text-blue-500 hover:underline"
        >
          Add New Module
        </Link>
        <Link
          href="/classes"
          className="text-blue-500 hover:underline"
        >
          View All Classes
        </Link>
        <Link
          href="/students"
          className="text-blue-500 hover:underline"
        >
          View All Students
        </Link>
      </div>
      {modules.length === 0 ? (
        <p>No modules found.</p>
      ) : (
        modules.map((module) => (
          <ModuleItem key={module.id} module={module} />
        ))
      )}
    </div>
  );
}
