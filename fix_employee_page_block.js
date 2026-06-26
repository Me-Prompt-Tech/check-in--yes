const fs = require('fs');

let content = fs.readFileSync('app/employee/page.tsx', 'utf8').replace(/\r\n/g, '\n');

// 1. Add isOnLeave state
const stateInsert = `  const [nowDate, setNowDate] = useState<Date | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isOnLeave, setIsOnLeave] = useState(false);`;

content = content.replace(
  "  const [nowDate, setNowDate] = useState<Date | null>(null);\n  const [isAdmin, setIsAdmin] = useState(false);",
  stateInsert
);

// 2. Fetch the today log and set isOnLeave
const verifyEmployeeInsert = `
          const todayLogData = await fetchEmployeeLogTodayAction(session.userId);
          setIsOnLeave(todayLogData.isOnLeave || false);

          const userLogs = await fetchEmployeeLogsAction(session.userId);`;

content = content.replace("          const userLogs = await fetchEmployeeLogsAction(session.userId);", verifyEmployeeInsert);

// 3. Update the handleRecord submit logic to prevent submit if on leave
const handleRecordInsert = `  const handleRecord = (periodId: 'morning' | 'lunch' | 'afternoon' | 'leave') => {
    if (!isWithinArea || !empId) return;
    if (isOnLeave) {
      alert('คุณมีการยื่นลางานในวันนี้ ไม่สามารถลงเวลาทำงานได้');
      return;
    }`;

content = content.replace("  const handleRecord = (periodId: 'morning' | 'lunch' | 'afternoon' | 'leave') => {\n    if (!isWithinArea || !empId) return;", handleRecordInsert);

// 4. Update the UI to show a banner and disable buttons if isOnLeave
// Let's add the banner just before the Unified Clock & Check-In Section
const bannerInsert = `        {/* Unified Clock & Check-In Section */}
        {isOnLeave && (
          <div className="bg-rose-500/10 border border-rose-500/20 rounded-3xl p-6 text-center shadow-lg">
            <h2 className="text-xl font-bold text-rose-400 mb-2">คุณมีการยื่นลางานในวันนี้</h2>
            <p className="text-slate-300 text-sm">ไม่สามารถลงเวลาทำงานได้ หากต้องการลงเวลา กรุณายกเลิกใบลาในเมนู "ใบลางาน"</p>
          </div>
        )}
        
        <section className={\`bg-slate-900 border border-slate-800 rounded-3xl p-6 lg:p-8 shadow-xl relative overflow-hidden flex flex-col lg:flex-row gap-8 lg:gap-0 \${isOnLeave ? 'opacity-50 pointer-events-none grayscale' : ''}\`}>`;

content = content.replace(
  `        {/* Unified Clock & Check-In Section */}
        <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 lg:p-8 shadow-xl relative overflow-hidden flex flex-col lg:flex-row gap-8 lg:gap-0">`,
  bannerInsert
);

fs.writeFileSync('app/employee/page.tsx', content);
console.log('Fixed app/employee/page.tsx');
