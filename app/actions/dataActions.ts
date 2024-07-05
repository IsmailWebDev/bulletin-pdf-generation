'use server';

import { prisma } from '@/app/lib/prisma';
import { revalidatePath } from 'next/cache';

// Class-related functions
export async function getClasses() {
  return prisma.class.findMany({
    include: {
      modules: true,
      students: true,
    },
  });
}

export async function getClassData(id: string) {
  return prisma.class.findUnique({
    where: { id },
    include: {
      students: {
        include: {
          assessments: {
            include: {
              module: true,
            },
          },
        },
      },
      modules: true,
    },
  });
}

export async function getClass(id: string) {
  return prisma.class.findUnique({
    where: { id },
    include: {
      modules: true,
      students: true,
    },
  });
}

export async function addClass(data: {
  name: string;
  modules: string[];
}) {
  await prisma.class.create({
    data: {
      name: data.name,
      modules: {
        connect: data.modules.map((id) => ({ id })),
      },
    },
  });
  revalidatePath('/classes');
}

export async function updateClass(
  id: string,
  data: { name?: string }
) {
  await prisma.class.update({
    where: { id },
    data,
  });
  revalidatePath('/classes');
}

export async function deleteClass(id: string) {
  await prisma.class.delete({
    where: { id },
  });
  revalidatePath('/classes');
}

// Module-related functions
export async function getModules() {
  return prisma.module.findMany({
    include: {
      classes: true,
      assessments: {
        include: {
          student: true,
        },
      },
    },
  });
}

export async function getModule(id: string) {
  return prisma.module.findUnique({
    where: { id },
    include: {
      classes: {
        include: {
          students: {
            include: {
              assessments: {
                where: {
                  moduleId: id,
                },
              },
            },
          },
        },
      },
    },
  });
}

export async function addModule(data: {
  name: string;
  code: string;
  coefficient: number;
  classIds: string[];
}) {
  await prisma.module.create({
    data: {
      name: data.name,
      code: data.code,
      coefficient: data.coefficient,
      classes: {
        connect: data.classIds.map((id) => ({ id })),
      },
    },
  });
  revalidatePath('/modules');
  revalidatePath('/classes');
}

export async function updateModule(
  id: string,
  data: { name?: string; code?: string; coefficient?: number }
) {
  await prisma.module.update({
    where: { id },
    data,
  });
  revalidatePath('/modules');
  revalidatePath('/classes');
}

export async function deleteModule(id: string) {
  await prisma.module.delete({
    where: { id },
  });
  revalidatePath('/modules');
  revalidatePath('/classes');
}

// Class-Module relationship functions
export async function addModulesToClass(
  classId: string,
  moduleIds: string[]
) {
  await prisma.class.update({
    where: { id: classId },
    data: {
      modules: {
        connect: moduleIds.map((id) => ({ id })),
      },
    },
  });
  revalidatePath('/classes');
}

export async function getModulesNotInClass(classId: string) {
  const allModules = await prisma.module.findMany();
  const classModules = await prisma.class
    .findUnique({
      where: { id: classId },
      include: { modules: true },
    })
    .then((cls) => cls?.modules || []);

  return allModules.filter(
    (module) => !classModules.some((cm) => cm.id === module.id)
  );
}

export async function removeModuleFromClass(
  classId: string,
  moduleId: string
) {
  await prisma.class.update({
    where: { id: classId },
    data: {
      modules: {
        disconnect: { id: moduleId },
      },
    },
  });
  revalidatePath(`/classes/${classId}`);
}

// Student-related functions
export async function getStudents() {
  return prisma.student.findMany({
    include: {
      class: true,
      assessments: {
        include: {
          module: true,
        },
      },
    },
  });
}

export async function getStudent(id: string) {
  return prisma.student.findUnique({
    where: { id },
    include: {
      class: {
        include: {
          modules: true,
        },
      },
    },
  });
}

export async function getStudentWithAssessments(id: string) {
  return prisma.student.findUnique({
    where: { id },
    include: {
      class: {
        include: {
          modules: true,
        },
      },
      assessments: {
        include: {
          module: true,
        },
      },
    },
  });
}

export async function addStudent(data: {
  name: string;
  classId: string;
}) {
  const student = await prisma.student.create({
    data: {
      name: data.name,
      classId: data.classId,
    },
  });
  revalidatePath('/students');
  revalidatePath(`/classes/${data.classId}`);
  return student;
}

export async function updateStudent(
  id: string,
  data: { name?: string; classId?: string }
) {
  const student = await prisma.student.update({
    where: { id },
    data,
  });
  revalidatePath('/students');
  revalidatePath(`/classes/${student.classId}`);
  return student;
}

export async function deleteStudent(id: string) {
  const student = await prisma.student.delete({
    where: { id },
  });
  revalidatePath('/students');
  revalidatePath(`/classes/${student.classId}`);
}

// Assessment-related functions
export async function addAssessment(data: {
  studentId: string;
  moduleId: string;
  score: number;
}) {
  const assessment = await prisma.assessment.create({
    data: {
      studentId: data.studentId,
      moduleId: data.moduleId,
      continuousAssessment: data.score,
    },
  });
  revalidatePath(`/students/${data.studentId}`);
  return assessment;
}

export async function addStudentToModule(
  studentId: string,
  moduleId: string
) {
  await prisma.assessment.create({
    data: {
      studentId,
      moduleId,
      continuousAssessment: 0,
    },
  });
}

export async function updateStudentAssessment(
  studentId: string,
  moduleId: string,
  assessment: number
) {
  await prisma.assessment.upsert({
    where: {
      studentId_moduleId: {
        studentId,
        moduleId,
      },
    },
    update: {
      continuousAssessment: assessment,
    },
    create: {
      studentId,
      moduleId,
      continuousAssessment: assessment,
    },
  });
  revalidatePath(`/modules/${moduleId}`);
}

export async function updateModuleStudentAssessments(
  moduleId: string,
  assessments: { [key: string]: number }
) {
  const updatePromises = Object.entries(assessments).map(
    ([studentId, assessment]) =>
      prisma.assessment.upsert({
        where: {
          studentId_moduleId: {
            studentId,
            moduleId,
          },
        },
        update: {
          continuousAssessment: assessment,
        },
        create: {
          studentId,
          moduleId,
          continuousAssessment: assessment,
        },
      })
  );

  await Promise.all(updatePromises);
  revalidatePath(`/modules/${moduleId}`);
}

export async function updateStudentAssessments(
  studentId: string,
  assessments: { [moduleId: string]: number }
) {
  const updatePromises = Object.entries(assessments).map(
    ([moduleId, value]) =>
      prisma.assessment.upsert({
        where: {
          studentId_moduleId: {
            studentId,
            moduleId,
          },
        },
        update: {
          continuousAssessment: value,
        },
        create: {
          studentId,
          moduleId,
          continuousAssessment: value,
        },
      })
  );

  await Promise.all(updatePromises);
  revalidatePath(`/students/${studentId}`);
}
