const fs = require('fs');

// 1. Update EmployeeSidebar.tsx
let sidebar = fs.readFileSync('app/components/EmployeeSidebar.tsx', 'utf8').replace(/\r\n/g, '\n');

const newLinkSidebar = `          <a
            href="/employee/profile"
            className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 rounded-lg text-sm font-medium transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            ข้อมูลส่วนตัว
          </a>
          {isAdmin && (`;

sidebar = sidebar.replace("          {isAdmin && (", newLinkSidebar);
fs.writeFileSync('app/components/EmployeeSidebar.tsx', sidebar);


// 2. Update employee/leaves/page.tsx
let leavesPage = fs.readFileSync('app/employee/leaves/page.tsx', 'utf8').replace(/\r\n/g, '\n');

const newLinkLeaves = `            <a href="/employee/profile" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 rounded-lg text-sm font-medium transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              ข้อมูลส่วนตัว
            </a>
          </nav>`;

leavesPage = leavesPage.replace("          </nav>", newLinkLeaves);
fs.writeFileSync('app/employee/leaves/page.tsx', leavesPage);

console.log('Fixed sidebars');
