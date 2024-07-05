// types/index.ts

export interface Module {
  id: string;
  code: string;
  name: string;
  coefficient: number;
}

export interface StudentModule extends Module {
  continuousAssessment: number;
}

export interface Class {
  id: string;
  name: string;
  modules: Module[];
}

export interface Student {
  id: string;
  name: string;
  classId: string;
  modules: StudentModule[];
}
