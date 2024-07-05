'use client';

import React from 'react';
import { removeModuleFromClass } from '../actions/dataActions';

interface RemoveModuleFromClassProps {
  classId: string;
  moduleId: string;
  moduleName: string;
  onRemove: () => void;
}

export default function RemoveModuleFromClass({
  classId,
  moduleId,
  moduleName,
  onRemove,
}: RemoveModuleFromClassProps) {
  const handleRemove = async () => {
    if (
      confirm(
        `Are you sure you want to remove ${moduleName} from this class?`
      )
    ) {
      await removeModuleFromClass(classId, moduleId);
      onRemove();
    }
  };

  return (
    <button
      onClick={handleRemove}
      className="text-red-500 hover:text-red-700 ml-2"
    >
      Remove
    </button>
  );
}
