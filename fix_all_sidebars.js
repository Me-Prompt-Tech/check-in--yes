const fs = require('fs');

// 1. Update EmployeeSidebar.tsx
let sidebar = fs.readFileSync('app/components/EmployeeSidebar.tsx', 'utf8').replace(/\r\n/g, '\n');

// Add profilePicture prop
sidebar = sidebar.replace(
  '  isAdmin?: boolean;\n}',
  '  isAdmin?: boolean;\n  profilePicture?: string | null;\n}'
);

sidebar = sidebar.replace(
  'export function EmployeeSidebar({ empName, isAdmin }: EmployeeSidebarProps) {',
  'export function EmployeeSidebar({ empName, isAdmin, profilePicture }: EmployeeSidebarProps) {'
);

const oldAvatar = `<div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white shadow-md text-sm uppercase">
              {empName ? empName.charAt(0) : 'E'}
            </div>`;

const newAvatar = `<div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white shadow-md text-sm uppercase overflow-hidden">
              {profilePicture ? (
                <img src={profilePicture} alt={empName} className="w-full h-full object-cover" />
              ) : (
                empName ? empName.charAt(0) : 'E'
              )}
            </div>`;

sidebar = sidebar.replace(oldAvatar, newAvatar);
fs.writeFileSync('app/components/EmployeeSidebar.tsx', sidebar);


// 2. Update employee/leaves/page.tsx
let leaves = fs.readFileSync('app/employee/leaves/page.tsx', 'utf8').replace(/\r\n/g, '\n');

// We need to fetch profilePicture from DBEmployee
if (!leaves.includes('profilePicture')) {
  leaves = leaves.replace('const [userName, setUserName] = useState(\'\');', 'const [userName, setUserName] = useState(\'\');\n  const [profilePicture, setProfilePicture] = useState<string | null>(null);');
  
  leaves = leaves.replace(
    'setUserName(session.displayName || session.username);',
    'setUserName(session.displayName || session.username);\n        const employees = await fetchEmployeesAction();\n        const me = employees.find(e => e.id === session.userId);\n        if (me?.profilePicture) setProfilePicture(me.profilePicture);'
  );

  const oldLeavesAvatar = `<div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white shadow-md text-sm">
                {userName.charAt(0).toUpperCase()}
              </div>`;
              
  const newLeavesAvatar = `<div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white shadow-md text-sm overflow-hidden">
                {profilePicture ? (
                  <img src={profilePicture} alt={userName} className="w-full h-full object-cover" />
                ) : (
                  userName.charAt(0).toUpperCase()
                )}
              </div>`;
              
  leaves = leaves.replace(oldLeavesAvatar, newLeavesAvatar);
  fs.writeFileSync('app/employee/leaves/page.tsx', leaves);
}

// 3. Update employee/page.tsx
let empPage = fs.readFileSync('app/employee/page.tsx', 'utf8').replace(/\r\n/g, '\n');

if (!empPage.includes('profilePicture')) {
  empPage = empPage.replace('const [empRole, setEmpRole] = useState(\'\');', 'const [empRole, setEmpRole] = useState(\'\');\n  const [profilePicture, setProfilePicture] = useState<string | null>(null);');
  
  empPage = empPage.replace(
    '          const me = employees.find(e => e.id === session.userId);',
    '          const me = employees.find(e => e.id === session.userId);\n          if (me?.profilePicture) setProfilePicture(me.profilePicture);'
  );

  empPage = empPage.replace(
    '<EmployeeSidebar empName={empName} isAdmin={isAdmin} />',
    '<EmployeeSidebar empName={empName} isAdmin={isAdmin} profilePicture={profilePicture} />'
  );
  fs.writeFileSync('app/employee/page.tsx', empPage);
}

// 4. Update employee/profile/page.tsx
let profilePage = fs.readFileSync('app/employee/profile/page.tsx', 'utf8').replace(/\r\n/g, '\n');
profilePage = profilePage.replace(
    '<EmployeeSidebar empName={empName} isAdmin={isAdmin} />',
    '<EmployeeSidebar empName={empName} isAdmin={isAdmin} profilePicture={employee?.profilePicture} />'
);
fs.writeFileSync('app/employee/profile/page.tsx', profilePage);

console.log('Fixed sidebars');
