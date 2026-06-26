const fs = require('fs');
let content = fs.readFileSync('app/employee/profile/page.tsx', 'utf8').replace(/\r\n/g, '\n');

// Add imports
content = content.replace(
  "import { fetchEmployeesAction, DBEmployee } from '../../actions/employees';",
  "import { fetchEmployeesAction, updateProfilePictureAction, DBEmployee } from '../../actions/employees';\nimport { useRef } from 'react';"
);

// Add states and ref
const statesInsert = `  const [isAdmin, setIsAdmin] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);`;

content = content.replace("  const [isAdmin, setIsAdmin] = useState(false);", statesInsert);

// Add upload handler function
const handleUpload = `
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
`;

content = content.replace("  useEffect(() => {", handleUpload + "\n  useEffect(() => {");

// Update Avatar rendering
const oldAvatar = `<div className="flex flex-col items-center gap-4">
                <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-5xl font-bold text-white shadow-lg border-4 border-slate-800">
                  {employee.firstName?.charAt(0) || employee.username.charAt(0).toUpperCase()}
                </div>
                <div className="px-3 py-1 bg-indigo-500/10 text-indigo-400 rounded-full text-xs font-semibold border border-indigo-500/20">
                  {employee.roleType === 'admin' ? 'แอดมิน' : 'พนักงาน'}
                </div>
              </div>`;

const newAvatar = `<div className="flex flex-col items-center gap-4 relative">
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
              </div>`;

content = content.replace(oldAvatar, newAvatar);

fs.writeFileSync('app/employee/profile/page.tsx', content);
console.log('Fixed app/employee/profile/page.tsx');
