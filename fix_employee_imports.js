const fs = require('fs');
let content = fs.readFileSync('app/employee/page.tsx', 'utf8');

content = content.replace(
  "import { fetchEmployeesAction, fetchEmployeeLogsAction, punchAttendanceAction } from '../actions/employees';",
  "import { fetchEmployeesAction, fetchEmployeeLogsAction, punchAttendanceAction, fetchEmployeeLogTodayAction } from '../actions/employees';"
);

fs.writeFileSync('app/employee/page.tsx', content);
console.log('Fixed imports in app/employee/page.tsx');
