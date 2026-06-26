import os
import re

# 1. Fix ThemeToggle import in AdminSidebar
sidebar_path = "app/components/AdminSidebar.tsx"
with open(sidebar_path, "r", encoding="utf-8") as f:
    sidebar = f.read()
sidebar = sidebar.replace("import ThemeToggle from './ThemeToggle';", "import { ThemeToggle } from './ThemeToggle';")
with open(sidebar_path, "w", encoding="utf-8") as f:
    f.write(sidebar)
print("Fixed AdminSidebar.tsx")

# 2. Fix the syntax errors in verifyAdmin across all admin pages
pages = [
    "app/admin/page.tsx",
    "app/admin/employees/page.tsx",
    "app/admin/departments/page.tsx",
    "app/admin/leaves/page.tsx",
    "app/admin/reports/page.tsx"
]

for p in pages:
    with open(p, "r", encoding="utf-8") as f:
        content = f.read()

    # The problem:
    # if (!session || session.role !== 'admin') {
    #   router.push('/');
    #   return;
    # }
    # } else {
    # setAdminUserId(session.userId);
    
    # We just want:
    # if (!session || session.role !== 'admin') {
    #   router.push('/');
    #   return;
    # }
    # setAdminUserId(session.userId);

    content = re.sub(
        r"if \(!session \|\| session\.role !== 'admin'\) \{\s*router\.push\('\/'\);\s*(?:return;)?\s*\}\s*\} else \{\s*setAdminUserId\(session\.userId\);",
        "if (!session || session.role !== 'admin') {\n        router.push('/');\n        return;\n      }\n      setAdminUserId(session.userId);",
        content
    )

    # Another possible bad state:
    content = re.sub(
        r"if \(!session \|\| session\.role !== 'admin'\) \{\s*router\.push\('\/'\);\s*(?:return;)?\s*\}\s*setAdminUserId\(session\.userId\);\s*else \{\s*setAdminUserId\(session\.userId\);",
        "if (!session || session.role !== 'admin') {\n        router.push('/');\n        return;\n      }\n      setAdminUserId(session.userId);",
        content
    )
    
    with open(p, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"Fixed {p}")
