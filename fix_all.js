const fs = require('fs');

// 1. Fix ThemeToggle import in AdminSidebar
const sidebar_path = "app/components/AdminSidebar.tsx";
let sidebar = fs.readFileSync(sidebar_path, "utf8");
sidebar = sidebar.replace("import ThemeToggle from './ThemeToggle';", "import { ThemeToggle } from './ThemeToggle';");
fs.writeFileSync(sidebar_path, sidebar);
console.log("Fixed AdminSidebar.tsx");

// 2. Fix the syntax errors in verifyAdmin across all admin pages
const pages = [
    "app/admin/page.tsx",
    "app/admin/employees/page.tsx",
    "app/admin/departments/page.tsx",
    "app/admin/leaves/page.tsx",
    "app/admin/reports/page.tsx"
];

for (const p of pages) {
    let content = fs.readFileSync(p, "utf8");

    content = content.replace(
        /if \(!session \|\| session\.role !== 'admin'\) \{\s*router\.push\('\/'\);\s*(?:return;)?\s*\}\s*\} else \{\s*setAdminUserId\(session\.userId\);/g,
        "if (!session || session.role !== 'admin') {\n        router.push('/');\n        return;\n      }\n      setAdminUserId(session.userId);"
    );

    content = content.replace(
        /if \(!session \|\| session\.role !== 'admin'\) \{\s*router\.push\('\/'\);\s*(?:return;)?\s*\}\s*setAdminUserId\(session\.userId\);\s*else \{\s*setAdminUserId\(session\.userId\);/g,
        "if (!session || session.role !== 'admin') {\n        router.push('/');\n        return;\n      }\n      setAdminUserId(session.userId);"
    );
    
    fs.writeFileSync(p, content);
    console.log(`Fixed ${p}`);
}
