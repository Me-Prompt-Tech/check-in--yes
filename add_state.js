const fs = require('fs');

const pages = [
  'app/admin/departments/page.tsx',
  'app/admin/leaves/page.tsx',
  'app/admin/reports/page.tsx'
];

for (const p of pages) {
  let content = fs.readFileSync(p, 'utf8');
  if (!content.includes('const [adminUserId, setAdminUserId]')) {
    content = content.replace(
      /const router = useRouter\(\);/g,
      "const router = useRouter();\n  const [adminUserId, setAdminUserId] = useState('');"
    );
    fs.writeFileSync(p, content);
    console.log(`Added state to ${p}`);
  }
}
