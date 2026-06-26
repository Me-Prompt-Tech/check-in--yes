const fs = require('fs');
let content = fs.readFileSync('prisma/schema.prisma', 'utf8').replace(/\r\n/g, '\n');

if (!content.includes('profilePicture')) {
  content = content.replace(
    '  forcePasswordChange Boolean  @default(false)\n\n  @@map("employees")',
    '  forcePasswordChange Boolean  @default(false)\n  profilePicture      String?\n\n  @@map("employees")'
  );
  fs.writeFileSync('prisma/schema.prisma', content);
  console.log('Added profilePicture to schema');
} else {
  console.log('profilePicture already exists');
}
