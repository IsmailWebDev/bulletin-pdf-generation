'use server';

import { Class, Module, Student } from '@/app/types';

// This is a mock database. In a real application, you'd interact with a real database here.
let classes: Class[] = [
  {
    id: '1',
    name: 'Class A',
    modules: [
      { id: 'm1', code: 'M101', name: 'Mathematics', coefficient: 2 },
      { id: 'm2', code: 'P101', name: 'Physics', coefficient: 2 },
    ],
  },
  // Add more classes as needed
];

let students: Student[] = [
  {
    id: '1',
    name: 'Ismail',
    classId: '1',
    modules: [
      {
        id: 'm1',
        code: 'M101',
        name: 'Mathematics',
        coefficient: 2,
        continuousAssessment: 15,
      },
      {
        id: 'm2',
        code: 'P101',
        name: 'Physics',
        coefficient: 2,
        continuousAssessment: 14,
      },
    ],
  },
  // Add more students as needed
];
let modules: Module[] = [
  { id: 'm1', code: 'M101', name: 'Mathematics', coefficient: 2 },
  { id: 'm2', code: 'P101', name: 'Physics', coefficient: 2 },
  // Add more modules as needed
];

export async function getModules(): Promise<Module[]> {
  // In a real application, you'd fetch this data from a database
  return modules;
}

export async function getModule(
  id: string
): Promise<Module | undefined> {
  // In a real application, you'd fetch this data from a database
  return modules.find((m) => m.id === id);
}
// ... (other existing functions)

export async function addModule(
  newModule: Omit<Module, 'id'>
): Promise<Module> {
  const moduleWithId = { ...newModule, id: Date.now().toString() };
  modules.push(moduleWithId);
  return moduleWithId;
}

export async function getClasses(): Promise<Class[]> {
  // In a real application, you'd fetch this data from a database
  return classes;
}

export async function getStudents(): Promise<Student[]> {
  // In a real application, you'd fetch this data from a database
  return students;
}

export async function addClass(
  newClass: Omit<Class, 'id'>
): Promise<Class> {
  const classWithId = { ...newClass, id: Date.now().toString() };
  classes.push(classWithId);
  return classWithId;
}

export async function addStudent(
  newStudent: Omit<Student, 'id'>
): Promise<Student> {
  const studentWithId = { ...newStudent, id: Date.now().toString() };
  students.push(studentWithId);
  return studentWithId;
}
