'use server';

import { createSession, deleteSession, getSession } from '../lib/session';
import { getCredentials, updatePassword } from '../lib/credentials';

export interface AuthResponse {
  success: boolean;
  error?: string;
  role?: 'admin' | 'employee';
}

export interface ChangePasswordResponse {
  success: boolean;
  error?: string;
}

export async function loginAction(formData: FormData): Promise<AuthResponse> {
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;

  if (!username || !password) {
    return { success: false, error: 'กรุณากรอกชื่อผู้ใช้และรหัสผ่าน' };
  }

  const creds = getCredentials();

  // Admin login check
  if (username.toLowerCase() === creds.admin.username && password === creds.admin.password) {
    await createSession(creds.admin.displayName, 'admin');
    return { success: true, role: 'admin' };
  }

  // Employee login check
  if (username.toLowerCase() === creds.employee.username && password === creds.employee.password) {
    await createSession(creds.employee.displayName, 'employee');
    return { success: true, role: 'employee' };
  }

  return { success: false, error: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' };
}

export async function logoutAction() {
  await deleteSession();
}

export async function checkCurrentSession() {
  return await getSession();
}

export async function changePasswordAction(formData: FormData): Promise<ChangePasswordResponse> {
  const session = await getSession();
  if (!session) {
    return { success: false, error: 'กรุณาเข้าสู่ระบบก่อน' };
  }

  const role = session.role; // 'admin' | 'employee'
  const currentPassword = formData.get('currentPassword') as string;
  const newPassword = formData.get('newPassword') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

  if (!currentPassword || !newPassword || !confirmPassword) {
    return { success: false, error: 'กรุณากรอกข้อมูลให้ครบทุกช่อง' };
  }

  const creds = getCredentials();
  const stored = creds[role];

  if (currentPassword !== stored.password) {
    return { success: false, error: 'รหัสผ่านปัจจุบันไม่ถูกต้อง' };
  }

  if (newPassword.length < 6) {
    return { success: false, error: 'รหัสผ่านใหม่ต้องมีอย่างน้อย 6 ตัวอักษร' };
  }

  if (newPassword !== confirmPassword) {
    return { success: false, error: 'รหัสผ่านใหม่และยืนยันรหัสผ่านไม่ตรงกัน' };
  }

  if (newPassword === currentPassword) {
    return { success: false, error: 'รหัสผ่านใหม่ต้องแตกต่างจากรหัสผ่านปัจจุบัน' };
  }

  updatePassword(role, newPassword);
  return { success: true };
}
