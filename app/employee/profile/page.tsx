'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { checkCurrentSession } from '../../actions/auth';
import { fetchEmployeesAction, updateProfilePictureAction, DBEmployee } from '../../actions/employees';
import { useRef } from 'react';
import { EmployeeSidebar } from '../../components/EmployeeSidebar';

export default function EmployeeProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [employee, setEmployee] = useState<DBEmployee | null>(null);
  const [empName, setEmpName] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);


  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !employee) return;

    // Check size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setUploadError('ขนาดไฟล์ต้องไม่เกิน 2MB');
      setTimeout(() => setUploadError(''), 3000);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setUploadingImage(true);
    setUploadError('');
    setUploadSuccess(false);

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64String = event.target?.result as string;
      
      const res = await updateProfilePictureAction(employee.id, base64String);
      if (res.success) {
        setEmployee({ ...employee, profilePicture: base64String });
        setUploadSuccess(true);
        setTimeout(() => setUploadSuccess(false), 3000);
      } else {
        setUploadError(res.error || 'เกิดข้อผิดพลาด');
        setTimeout(() => setUploadError(''), 3000);
      }
      setUploadingImage(false);
    };
    reader.onerror = () => {
      setUploadError('เกิดข้อผิดพลาดในการอ่านไฟล์');
      setUploadingImage(false);
    };
    reader.readAsDataURL(file);
    
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  useEffect(() => {
    async function loadData() {
      try {
        const session = await checkCurrentSession();
        if (!session) {
          router.push('/');
          return;
        }

        setEmpName(session.displayName || session.username);
        setIsAdmin(session.role === 'admin');

        const employees = await fetchEmployeesAction();
        const me = employees.find(e => e.id === session.userId);
        if (me) {
          setEmployee(me);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="text-slate-400 mt-4 font-medium animate-pulse">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col lg:flex-row">
      <EmployeeSidebar empName={empName} isAdmin={isAdmin} profilePicture={employee?.profilePicture} />
      
      <main className="flex-1 p-6 lg:p-10 max-w-5xl mx-auto w-full flex flex-col gap-8">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-2">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">ข้อมูลส่วนตัว</h1>
            <p className="text-slate-400 text-sm mt-1">ตรวจสอบข้อมูลส่วนตัวของคุณในระบบ</p>
          </div>
        </div>

        {employee ? (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 lg:p-10 shadow-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-radial from-indigo-600/5 to-transparent pointer-events-none"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row gap-10 items-start">
              {/* Avatar Section */}
              <div className="flex flex-col items-center gap-4 relative">
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageChange} 
                  accept="image/jpeg, image/png" 
                  className="hidden" 
                />
                <div className="relative group cursor-pointer" onClick={() => !uploadingImage && fileInputRef.current?.click()}>
                  <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-5xl font-bold text-white shadow-lg border-4 border-slate-800 transition-transform duration-300 group-hover:scale-105">
                    {employee.profilePicture ? (
                      <img src={employee.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      employee.firstName?.charAt(0) || employee.username.charAt(0).toUpperCase()
                    )}
                  </div>
                  
                  {/* Camera overlay */}
                  <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    {uploadingImage ? (
                      <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>
                    )}
                  </div>
                </div>
                
                {/* Status Messages */}
                {uploadError && <p className="text-rose-400 text-xs font-medium absolute -bottom-6 whitespace-nowrap">{uploadError}</p>}
                {uploadSuccess && <p className="text-emerald-400 text-xs font-medium absolute -bottom-6 whitespace-nowrap">อัปเดตรูปสำเร็จ!</p>}
                
                <div className="px-3 py-1 bg-indigo-500/10 text-indigo-400 rounded-full text-xs font-semibold border border-indigo-500/20 mt-1">
                  {employee.roleType === 'admin' ? 'แอดมิน' : 'พนักงาน'}
                </div>
              </div>

              {/* Info Section */}
              <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">รหัสพนักงาน</label>
                  <div className="text-slate-200 font-mono bg-slate-950/50 px-4 py-2.5 rounded-xl border border-slate-800/50">{employee.id}</div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">ชื่อผู้ใช้งาน (Username)</label>
                  <div className="text-slate-200 font-mono bg-slate-950/50 px-4 py-2.5 rounded-xl border border-slate-800/50">{employee.username}</div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">ชื่อจริง</label>
                  <div className="text-slate-200 bg-slate-950/50 px-4 py-2.5 rounded-xl border border-slate-800/50">{employee.firstName || '-'}</div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">นามสกุล</label>
                  <div className="text-slate-200 bg-slate-950/50 px-4 py-2.5 rounded-xl border border-slate-800/50">{employee.lastName || '-'}</div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">แผนก</label>
                  <div className="text-slate-200 bg-slate-950/50 px-4 py-2.5 rounded-xl border border-slate-800/50">{employee.department}</div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">ตำแหน่ง</label>
                  <div className="text-slate-200 bg-slate-950/50 px-4 py-2.5 rounded-xl border border-slate-800/50">{employee.role}</div>
                </div>
              </div>
            </div>
            
            <div className="mt-10 pt-6 border-t border-slate-800 flex justify-end">
              <p className="text-xs text-slate-500">
                หากต้องการแก้ไขข้อมูล กรุณาติดต่อแอดมินหรือฝ่ายบุคคล
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-10 text-center text-slate-400">
            ไม่พบข้อมูลส่วนตัว
          </div>
        )}
      </main>
    </div>
  );
}
