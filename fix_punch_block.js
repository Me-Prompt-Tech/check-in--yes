const fs = require('fs');

let content = fs.readFileSync('app/actions/employees.ts', 'utf8').replace(/\r\n/g, '\n');

// 1. Add checkIfOnLeaveToday helper
const helper = `
// Helper: Check if employee is on leave today
async function checkIfOnLeaveToday(empId: string, todayDateStr: string) {
  const leaves = await prisma.leaveRequest.findMany({
    where: {
      employeeId: empId,
      status: { in: ['pending', 'approved'] }
    }
  });

  for (const leave of leaves) {
    if (todayDateStr >= leave.startDate && todayDateStr <= leave.endDate) {
      return true;
    }
  }
  return false;
}
`;

content = content.replace("export async function fetchEmployeeLogTodayAction", helper + "\nexport async function fetchEmployeeLogTodayAction");

// 2. Update fetchEmployeeLogTodayAction return type
const oldFetchLog = `  if (!log) {
    return {
      isCheckedIn: false,
      isCheckedOut: false,
      checkInTime: '-',
      checkOutTime: '-'
    };
  }
  
  return {
    isCheckedIn: log.morningIn !== '-',
    isCheckedOut: log.leaveWork !== '-',
    checkInTime: log.morningIn,
    checkOutTime: log.leaveWork
  };
}`;

const newFetchLog = `  const isOnLeave = await checkIfOnLeaveToday(empId, today);

  if (!log) {
    return {
      isCheckedIn: false,
      isCheckedOut: false,
      checkInTime: '-',
      checkOutTime: '-',
      isOnLeave
    };
  }
  
  return {
    isCheckedIn: log.morningIn !== '-',
    isCheckedOut: log.leaveWork !== '-',
    checkInTime: log.morningIn,
    checkOutTime: log.leaveWork,
    isOnLeave
  };
}`;

content = content.replace(oldFetchLog, newFetchLog);

// 3. Update punchAttendanceAction to block
const oldPunch = `export async function punchAttendanceAction(empId: string, type: 'morning' | 'lunch' | 'afternoon' | 'leave', earlyLeaveReason?: string) {
  await ensureDbSeeded();
  const today = getTodayLocalDate();`;

const newPunch = `export async function punchAttendanceAction(empId: string, type: 'morning' | 'lunch' | 'afternoon' | 'leave', earlyLeaveReason?: string) {
  await ensureDbSeeded();
  const today = getTodayLocalDate();
  
  const isOnLeave = await checkIfOnLeaveToday(empId, today);
  if (isOnLeave) {
    return { success: false, error: 'คุณมีการยื่นลางานในวันนี้ ไม่สามารถลงเวลาทำงานได้' };
  }`;

content = content.replace(oldPunch, newPunch);

fs.writeFileSync('app/actions/employees.ts', content);
console.log('Fixed app/actions/employees.ts');
