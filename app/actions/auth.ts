'use server';

import { createSession, deleteSession, getSession } from '../lib/session';
import prisma from '../lib/db';
import { seedDatabase } from './seed';

export interface AuthResponse {
  success: boolean;
  error?: string;
  role?: 'admin' | 'employee';
}

export async function loginAction(formData: FormData): Promise<AuthResponse> {
  const usernameInput = formData.get('username') as string;
  const passwordInput = formData.get('password') as string;

  if (!usernameInput || !passwordInput) {
    return { success: false, error: 'กรุณากรอกชื่อผู้ใช้และรหัสผ่าน' };
  }

  // Ensure DB has initial database records
  await seedDatabase();

  try {
    const user = await prisma.employee.findUnique({
      where: {
        username: usernameInput.toLowerCase()
      }
    });

    if (!user) {
      return { success: false, error: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' };
    }

    if (user.status !== 'active') {
      return { success: false, error: 'บัญชีผู้ใช้ของคุณถูกระงับการใช้งาน' };
    }

    // Direct password match (in real prod, use bcrypt)
    if (user.password !== passwordInput) {
      return { success: false, error: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' };
    }

    const displayName = `${user.firstName} ${user.lastName}`;
    const roleType = user.roleType as 'admin' | 'employee' || 'employee';

    await createSession(displayName, roleType);

    return { success: true, role: roleType };
  } catch (err) {
    console.error('Login database query error:', err);
    return { success: false, error: 'เกิดข้อผิดพลาดในการเชื่อมต่อฐานข้อมูล' };
  }
}

export async function logoutAction() {
  await deleteSession();
}

export async function checkCurrentSession() {
  return await getSession();
}
