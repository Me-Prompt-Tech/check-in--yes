const fs = require('fs');
let content = fs.readFileSync('app/admin/employees/page.tsx', 'utf8').replace(/\r\n/g, '\n');

// 1. Update the table column
const oldNameCol = `<td className="py-4 px-4 font-semibold text-slate-200">{emp.firstName} {emp.lastName}</td>`;
const newNameCol = `<td className="py-4 px-4 font-semibold text-slate-200">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold overflow-hidden shrink-0">
                            {emp.profilePicture ? (
                              <img src={emp.profilePicture} alt={emp.firstName} className="w-full h-full object-cover" />
                            ) : (
                              (emp.firstName?.charAt(0) || emp.username.charAt(0)).toUpperCase()
                            )}
                          </div>
                          <span>{emp.firstName} {emp.lastName}</span>
                        </div>
                      </td>`;

content = content.replace(oldNameCol, newNameCol);

// 2. Update View Modal
const oldViewModal = `<div className="mt-6 border-t border-slate-800 pt-6">
              <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">`;

const newViewModal = `
              <div className="flex flex-col items-center mb-6">
                <div className="w-24 h-24 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center text-3xl font-bold overflow-hidden mb-3">
                  {selectedEmployee.profilePicture ? (
                    <img src={selectedEmployee.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    (selectedEmployee.firstName?.charAt(0) || selectedEmployee.username.charAt(0)).toUpperCase()
                  )}
                </div>
                <h4 className="text-lg font-bold text-slate-100">{selectedEmployee.firstName} {selectedEmployee.lastName}</h4>
                <span className="text-xs text-slate-400">{selectedEmployee.role}</span>
              </div>
              <div className="mt-2 border-t border-slate-800 pt-6">
              <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">`;

content = content.replace(oldViewModal, newViewModal);

fs.writeFileSync('app/admin/employees/page.tsx', content);
console.log('Fixed app/admin/employees/page.tsx');
