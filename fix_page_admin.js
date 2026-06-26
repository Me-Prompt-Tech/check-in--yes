const fs = require('fs');

let content = fs.readFileSync('app/admin/page.tsx', 'utf8').replace(/\r\n/g, '\n');

// 1. Add Import
content = content.replace(
  "import { checkCurrentSession, logoutAction } from '../actions/auth';", 
  "import { checkCurrentSession, logoutAction } from '../actions/auth';\nimport { AdminSidebar } from '../components/AdminSidebar';"
);

// 2. Add adminUserId state
content = content.replace(
  /const \[loading, setLoading\] = useState\(true\);\n/,
  "const [loading, setLoading] = useState(true);\n  const [adminUserId, setAdminUserId] = useState('');\n"
);

// 3. Fix verifyAdmin
const verify_from = `      const session = await checkCurrentSession();
      if (!session || session.role !== 'admin') {
        router.push('/');
      } else {
        try {`;
const verify_to = `      const session = await checkCurrentSession();
      if (!session || session.role !== 'admin') {
        router.push('/');
        return;
      }
      setAdminUserId(session.userId);
      try {`;
content = content.replace(verify_from, verify_to);

// And remove the closing bracket of the else
const else_close_from = `        } finally {
          setLoading(false);
        }
      }
    }
    verifyAdmin();`;
const else_close_to = `        } finally {
          setLoading(false);
        }
    }
    verifyAdmin();`;
content = content.replace(else_close_from, else_close_to);

// 4. Replace aside
const asideRegex = /<aside[\s\S]*?<\/aside>/;
const replacement = `<AdminSidebar activePath="/admin" userId={adminUserId} />`;
content = content.replace(asideRegex, replacement);

fs.writeFileSync('app/admin/page.tsx', content);
console.log('Fixed app/admin/page.tsx completely');
