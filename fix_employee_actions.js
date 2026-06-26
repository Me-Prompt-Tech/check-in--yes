const fs = require('fs');
let content = fs.readFileSync('app/actions/employees.ts', 'utf8').replace(/\r\n/g, '\n');

// 1. Update DBEmployee interface
const dbEmployeeInterfaceOld = `export interface DBEmployee {
  id: string;
  firstName: string;
  lastName: string;
  department: string;
  role: string;
  username: string;
  password?: string;
  roleType?: string;
  status: string;
  createdDate: string;
  forcePasswordChange: boolean;
}`;

const dbEmployeeInterfaceNew = `export interface DBEmployee {
  id: string;
  firstName: string;
  lastName: string;
  department: string;
  role: string;
  username: string;
  password?: string;
  roleType?: string;
  status: string;
  createdDate: string;
  forcePasswordChange: boolean;
  profilePicture?: string | null;
}`;

content = content.replace(dbEmployeeInterfaceOld, dbEmployeeInterfaceNew);

// 2. Update fetchEmployeesAction
const fetchEmployeesMapOld = `    forcePasswordChange: item.forcePasswordChange,
    roleType: item.roleType
  })) as DBEmployee[];`;

const fetchEmployeesMapNew = `    forcePasswordChange: item.forcePasswordChange,
    roleType: item.roleType,
    profilePicture: item.profilePicture
  })) as DBEmployee[];`;

content = content.replace(fetchEmployeesMapOld, fetchEmployeesMapNew);

// 3. Add updateProfilePictureAction
const updateProfileAction = `
// 12. Update Employee Profile Picture
export async function updateProfilePictureAction(empId: string, base64Data: string) {
  await ensureDbSeeded();
  const session = await checkCurrentSession();
  
  if (!session) return { success: false, error: 'Unauthorized' };
  
  // Only the employee themselves or an admin can update the picture
  if (session.role !== 'admin' && session.userId !== empId) {
    return { success: false, error: 'Unauthorized' };
  }
  
  try {
    await prisma.employee.update({
      where: { id: empId },
      data: { profilePicture: base64Data }
    });
    return { success: true };
  } catch (err) {
    return { success: false, error: 'ไม่สามารถอัปเดตรูปโปรไฟล์ได้' };
  }
}
`;

content += updateProfileAction;

fs.writeFileSync('app/actions/employees.ts', content);
console.log('Fixed app/actions/employees.ts');
