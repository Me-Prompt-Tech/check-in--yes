const fs = require('fs');
let actionsFile = fs.readFileSync('app/actions/leaves.ts', 'utf8').replace(/\r\n/g, '\n');

actionsFile = actionsFile.replace(
  "status: 'approved' | 'rejected',",
  "status: 'approved' | 'rejected' | 'pending',"
);

fs.writeFileSync('app/actions/leaves.ts', actionsFile);

let pageFile = fs.readFileSync('app/admin/leaves/page.tsx', 'utf8').replace(/\r\n/g, '\n');

// Update state type
pageFile = pageFile.replace(
  "const [reviewAction, setReviewAction] = useState<'approved' | 'rejected'>('approved');",
  "const [reviewAction, setReviewAction] = useState<'approved' | 'rejected' | 'pending'>('approved');"
);

// Update openReview function
pageFile = pageFile.replace(
  "const openReview = (req: DBLeaveRequest, action: 'approved' | 'rejected') => {",
  "const openReview = (req: DBLeaveRequest, action: 'approved' | 'rejected' | 'pending') => {"
);

// Update rendering of buttons
const oldButtons = `                          {req.status === 'pending' ? (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => openReview(req, 'approved')}
                                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg transition cursor-pointer flex items-center gap-1"
                              >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                                อนุมัติ
                              </button>
                              <button
                                onClick={() => openReview(req, 'rejected')}
                                className="px-3 py-1.5 bg-rose-600/20 hover:bg-rose-600 border border-rose-500/30 hover:border-rose-500 text-rose-400 hover:text-white text-xs font-semibold rounded-lg transition cursor-pointer flex items-center gap-1"
                              >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                                ปฏิเสธ
                              </button>
                            </div>
                          ) : (
                            <span className="text-xs text-slate-600">ดำเนินการแล้ว</span>
                          )}`;

const newButtons = `                          {req.status === 'pending' ? (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => openReview(req, 'approved')}
                                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg transition cursor-pointer flex items-center gap-1"
                              >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                                อนุมัติ
                              </button>
                              <button
                                onClick={() => openReview(req, 'rejected')}
                                className="px-3 py-1.5 bg-rose-600/20 hover:bg-rose-600 border border-rose-500/30 hover:border-rose-500 text-rose-400 hover:text-white text-xs font-semibold rounded-lg transition cursor-pointer flex items-center gap-1"
                              >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                                ปฏิเสธ
                              </button>
                            </div>
                          ) : req.status === 'approved' ? (
                            <button
                              onClick={() => openReview(req, 'pending')}
                              className="px-3 py-1.5 bg-slate-600/20 hover:bg-slate-600 border border-slate-500/30 hover:border-slate-500 text-slate-300 hover:text-white text-xs font-semibold rounded-lg transition cursor-pointer flex items-center gap-1"
                            >
                              ยกเลิกอนุมัติ
                            </button>
                          ) : (
                            <span className="text-xs text-slate-600">ปฏิเสธแล้ว</span>
                          )}`;

pageFile = pageFile.replace(oldButtons, newButtons);

// Update review modal header
const oldModalHeader = `<h3 className="font-bold text-lg">
                {reviewAction === 'approved' ? '✅ ยืนยันการอนุมัติ' : '❌ ยืนยันการปฏิเสธ'}
              </h3>`;
const newModalHeader = `<h3 className="font-bold text-lg">
                {reviewAction === 'approved' ? '✅ ยืนยันการอนุมัติ' : reviewAction === 'pending' ? '🔄 ยกเลิกการอนุมัติ' : '❌ ยืนยันการปฏิเสธ'}
              </h3>`;

pageFile = pageFile.replace(oldModalHeader, newModalHeader);

// Update review modal title background
pageFile = pageFile.replace(
  "reviewAction === 'approved' ? 'bg-emerald-500/5' : 'bg-rose-500/5'",
  "reviewAction === 'approved' ? 'bg-emerald-500/5' : reviewAction === 'pending' ? 'bg-slate-500/5' : 'bg-rose-500/5'"
);

// Update review modal text info
const oldModalText = `<p className="text-slate-300 text-sm mb-4">
                คุณกำลังจะ<span className={\`font-bold \${reviewAction === 'approved' ? 'text-emerald-400' : 'text-rose-400'}\`}>{reviewAction === 'approved' ? 'อนุมัติ' : 'ปฏิเสธ'}</span>คำขอลางานของ <strong>{reviewTarget.employeeName}</strong>
              </p>`;
const newModalText = `<p className="text-slate-300 text-sm mb-4">
                คุณกำลังจะ<span className={\`font-bold \${reviewAction === 'approved' ? 'text-emerald-400' : reviewAction === 'pending' ? 'text-slate-300' : 'text-rose-400'}\`}>{reviewAction === 'approved' ? 'อนุมัติ' : reviewAction === 'pending' ? 'ยกเลิกการอนุมัติ' : 'ปฏิเสธ'}</span>คำขอลางานของ <strong>{reviewTarget.employeeName}</strong>
              </p>`;

pageFile = pageFile.replace(oldModalText, newModalText);

// Update review submit button
const oldSubmitBtn = `<button
                  onClick={handleReviewSubmit}
                  disabled={isPending}
                  className={\`px-4 py-2.5 text-sm font-semibold text-white rounded-xl transition \${
                    reviewAction === 'approved' 
                      ? 'bg-emerald-600 hover:bg-emerald-500' 
                      : 'bg-rose-600 hover:bg-rose-500'
                  }\`}
                >
                  {isPending ? 'กำลังบันทึก...' : 'ยืนยัน'}
                </button>`;
const newSubmitBtn = `<button
                  onClick={handleReviewSubmit}
                  disabled={isPending}
                  className={\`px-4 py-2.5 text-sm font-semibold text-white rounded-xl transition \${
                    reviewAction === 'approved' 
                      ? 'bg-emerald-600 hover:bg-emerald-500' 
                      : reviewAction === 'pending'
                        ? 'bg-slate-600 hover:bg-slate-500'
                        : 'bg-rose-600 hover:bg-rose-500'
                  }\`}
                >
                  {isPending ? 'กำลังบันทึก...' : 'ยืนยัน'}
                </button>`;

pageFile = pageFile.replace(oldSubmitBtn, newSubmitBtn);

fs.writeFileSync('app/admin/leaves/page.tsx', pageFile);
console.log('Fixed files');
