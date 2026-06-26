const fs = require('fs');

const pages = [
  { path: 'app/admin/page.tsx', activePath: '/admin', depth: '../components/AdminSidebar' },
  { path: 'app/admin/employees/page.tsx', activePath: '/admin/employees', depth: '../../components/AdminSidebar' },
  { path: 'app/admin/departments/page.tsx', activePath: '/admin/departments', depth: '../../components/AdminSidebar' },
  { path: 'app/admin/leaves/page.tsx', activePath: '/admin/leaves', depth: '../../components/AdminSidebar' },
  { path: 'app/admin/reports/page.tsx', activePath: '/admin/reports', depth: '../../components/AdminSidebar' },
];

for (const page of pages) {
  let content = fs.readFileSync(page.path, 'utf8');

  // 1. Add Import
  if (!content.includes('AdminSidebar')) {
    content = content.replace(
      "import { checkCurrentSession", 
      `import { AdminSidebar } from '${page.depth}';\nimport { checkCurrentSession`
    );
  }

  // 2. Add adminUserId state
  if (!content.includes('const [adminUserId, setAdminUserId]')) {
    // find first useState and put it after
    content = content.replace(
      /const \[loading, setLoading\] = useState.*?;\n/g,
      match => match + "  const [adminUserId, setAdminUserId] = useState('');\n"
    );
    // fallback if no loading state (e.g. employees)
    if (!content.includes('adminUserId')) {
      content = content.replace(
        /const \[search, setSearch\] = useState.*?;\n/g,
        match => "  const [adminUserId, setAdminUserId] = useState('');\n" + match
      );
    }
  }

  // 3. Set adminUserId inside checkCurrentSession
  if (content.includes('if (!session || session.role !== \'admin\') {')) {
    if (!content.includes('setAdminUserId(session.userId)')) {
      content = content.replace(
        /if \(!session \|\| session\.role !== 'admin'\) \{\s*router\.push\('\/'\);\s*(?:return;)?\s*\} else \{/g,
        "if (!session || session.role !== 'admin') { router.push('/'); return; } else { setAdminUserId(session.userId);"
      );
      // For cases where there is no 'else', just find the router.push block
      content = content.replace(
        /if \(!session \|\| session\.role !== 'admin'\) \{\s*router\.push\('\/'\);\s*return;\s*\}/g,
        "if (!session || session.role !== 'admin') {\n        router.push('/');\n        return;\n      }\n      setAdminUserId(session.userId);"
      );
    }
  }

  // 4. In Reports page, add guard for ADM
  if (page.path.includes('reports/page.tsx')) {
    if (!content.includes("!session.userId.startsWith('ADM')")) {
      content = content.replace(
        /setAdminUserId\(session\.userId\);/g,
        "setAdminUserId(session.userId);\n      if (!session.userId.startsWith('ADM')) {\n        router.push('/admin');\n        return;\n      }"
      );
    }
  }

  // 5. Replace <aside>...</aside> with <AdminSidebar activePath="..." userId={adminUserId} isPending={isPending} />
  // We need to match <aside className="..."> down to </aside>
  const asideRegex = /<aside[\s\S]*?<\/aside>/;
  const isPendingExists = content.includes('isPending');
  const replacement = `<AdminSidebar activePath="${page.activePath}" userId={adminUserId} ${isPendingExists ? 'isPending={isPending}' : ''} />`;
  
  if (asideRegex.test(content)) {
    content = content.replace(asideRegex, replacement);
  }

  fs.writeFileSync(page.path, content);
  console.log(`Updated ${page.path}`);
}
