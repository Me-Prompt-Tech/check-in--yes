'use server';

import prisma from '../lib/db';
import { checkCurrentSession } from './auth';

export interface DBDepartment {
  id: string;
  name: string;
}

// 1. Fetch all departments
export async function fetchDepartmentsAction(): Promise<DBDepartment[]> {
  const list = await prisma.department.findMany({
    orderBy: { name: 'asc' }
  });
  
  return list.map(item => ({
    id: item.id,
    name: item.name
  }));
}

// 2. Create department
export async function createDepartmentAction(name: string) {
  const session = await checkCurrentSession();
  if (!session || session.role !== 'admin') {
    return { success: false, error: 'Unauthorized' };
  }

  if (!name || name.trim() === '') {
    return { success: false, error: 'ชื่อแผนกไม่สามารถเว้นว่างได้' };
  }

  const existing = await prisma.department.findFirst({
    where: { name: name.trim() }
  });

  if (existing) {
    return { success: false, error: 'มีชื่อแผนกนี้ในระบบแล้ว' };
  }

  await prisma.department.create({
    data: {
      name: name.trim()
    }
  });

  return { success: true };
}

// 3. Update department
export async function updateDepartmentAction(id: string, newName: string) {
  const session = await checkCurrentSession();
  if (!session || session.role !== 'admin') {
    return { success: false, error: 'Unauthorized' };
  }

  if (!newName || newName.trim() === '') {
    return { success: false, error: 'ชื่อแผนกไม่สามารถเว้นว่างได้' };
  }

  const existing = await prisma.department.findFirst({
    where: { 
      name: newName.trim(),
      id: { not: id } 
    }
  });

  if (existing) {
    return { success: false, error: 'มีชื่อแผนกนี้ในระบบแล้ว' };
  }

  await prisma.department.update({
    where: { id },
    data: { name: newName.trim() }
  });

  return { success: true };
}

// 4. Delete department
export async function deleteDepartmentAction(id: string) {
  const session = await checkCurrentSession();
  if (!session || session.role !== 'admin') {
    return { success: false, error: 'Unauthorized' };
  }

  await prisma.department.delete({
    where: { id }
  });

  return { success: true };
}
