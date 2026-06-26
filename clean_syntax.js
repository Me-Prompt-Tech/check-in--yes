const fs = require('fs');

const pages = [
  'app/admin/page.tsx',
  'app/admin/employees/page.tsx',
  'app/admin/departments/page.tsx',
  'app/admin/leaves/page.tsx',
  'app/admin/reports/page.tsx',
];

for (const path of pages) {
  let content = fs.readFileSync(path, 'utf8');

  // Fix 1: The duplicated setAdminUserId
  content = content.replace(/setAdminUserId\(session\.userId\);\s*else\s*\{\s*setAdminUserId\(session\.userId\);/g, "} else {\n      setAdminUserId(session.userId);");

  // Fix 2: Another possible variation
  content = content.replace(/if \(!session \|\| session\.role !== 'admin'\) \{ router\.push\('\/'\); return; \} else \{ setAdminUserId\(session\.userId\);/g, 
  "if (!session || session.role !== 'admin') {\n        router.push('/');\n        return;\n      } else {\n        setAdminUserId(session.userId);\n      }");

  // Fix 3: In case the 'else' was entirely mangled
  content = content.replace(/router\.push\('\/'\);\s*\}\s*setAdminUserId\(session\.userId\);/g, 
  "router.push('/');\n        return;\n      }\n      setAdminUserId(session.userId);");

  fs.writeFileSync(path, content);
  console.log(`Cleaned ${path}`);
}
