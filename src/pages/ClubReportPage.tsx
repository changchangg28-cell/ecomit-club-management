import React, { useState } from 'react';
import { useEcomit } from '../context/EcomitContext';
import { Department, Member } from '../types';

const DEPARTMENTS: Department[] = [
  'Ban Chủ nhiệm',
  'Ban Truyền thông',
  'Ban Kỹ thuật',
  'Ban Sự kiện & Host',
];

const DEPT_BADGE: Record<Department, { short: string; cls: string; bar: string; color: string }> = {
  'Ban Chủ nhiệm': {
    short: 'Chủ nhiệm',
    cls: 'bg-indigo-50 text-indigo-700 border-indigo-200/80',
    bar: 'bg-indigo-600',
    color: '#6366f1',
  },
  'Ban Truyền thông': {
    short: 'Truyền thông',
    cls: 'bg-blue-50 text-blue-700 border-blue-200/80',
    bar: 'bg-blue-600',
    color: '#2563eb',
  },
  'Ban Kỹ thuật': {
    short: 'Kỹ thuật',
    cls: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    bar: 'bg-emerald-600',
    color: '#10b981',
  },
  'Ban Sự kiện & Host': {
    short: 'Sự kiện',
    cls: 'bg-amber-50 text-amber-800 border-amber-200/80',
    bar: 'bg-amber-500',
    color: '#f59e0b',
  },
};

const RANK_BADGE: Record<string, string> = {
  'Xuất sắc': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Tốt: 'bg-blue-50 text-blue-700 border-blue-200',
  Đạt: 'bg-amber-50 text-amber-800 border-amber-200',
  'Cần cố gắng': 'bg-rose-50 text-rose-700 border-rose-200',
};

const renderAvatar = (member: Member, size = 'w-9 h-9') => {
  if (member.avatar) {
    return (
      <img
        src={member.avatar}
        alt={member.fullName}
        className={`${size} rounded-full object-cover ring-2 ring-white shadow-md shrink-0`}
      />
    );
  }
  const parts = (member.fullName || '').trim().split(' ');
  const initials =
    parts.length >= 2
      ? (parts[parts.length - 2][0] + parts[parts.length - 1][0]).toUpperCase()
      : (member.fullName || 'EC').slice(0, 2).toUpperCase();
  return (
    <div
      className={`${size} rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center shrink-0`}
    >
      {initials}
    </div>
  );
};

export const ClubReportPage: React.FC = () => {
  const { tasks, memberStats } = useEcomit();
  const [selectedDept, setSelectedDept] = useState<string>('ALL');

  const sortedAll = [...memberStats].sort((a, b) => b.totalPoints - a.totalPoints);
  const top3 = sortedAll.slice(0, 3);

  const filteredMemberStats = sortedAll.filter(
    (s) => selectedDept === 'ALL' || s.member.department === selectedDept
  );

  const excCount = memberStats.filter((m) => m.rankLabel === 'Xuất sắc').length;
  const goodCount = memberStats.filter((m) => m.rankLabel === 'Tốt').length;
  const passCount = memberStats.filter((m) => m.rankLabel === 'Đạt').length;
  const lowCount = memberStats.filter((m) => m.rankLabel === 'Cần cố gắng').length;

  const handleExportCSV = () => {
    const headers = [
      'MSSV',
      'Ho va Ten',
      'Ban',
      'Chuc Vu',
      'Hoan Thanh',
      'Ty Le (%)',
      'Tong Diem',
      'Xep Loai',
    ];
    const rows = filteredMemberStats.map((s) => [
      s.member.studentId,
      `"${s.member.fullName}"`,
      `"${s.member.department}"`,
      `"${s.member.role}"`,
      `${s.doneTasks}/${s.totalTasks}`,
      `${s.completionRate}%`,
      s.totalPoints,
      `"${s.rankLabel}"`,
    ]);

    const csv =
      '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Xep_Hang_ECOMIT_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* ROW 1: VISUAL TOP 3 PODIUM + DEPARTMENT RADAR/BAR COMPARISON */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Visual Podium Top 3 (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-200/80 shadow-card p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-extrabold text-slate-900">
              Bục Vinh Danh Top 3
            </h2>
            <span className="px-2.5 py-0.5 rounded-lg text-xs font-extrabold bg-amber-50 text-amber-600">
              Học kỳ II
            </span>
          </div>

          <div className="grid grid-cols-3 gap-4 items-end pt-6 px-2">
            {/* #2 Silver */}
            {top3[1] && (
              <div className="flex flex-col items-center">
                {renderAvatar(top3[1].member, 'w-14 h-14')}
                <span className="text-xs font-extrabold text-slate-800 mt-2 truncate max-w-full">
                  {top3[1].member.fullName.split(' ').slice(-2).join(' ')}
                </span>
                <span className="text-xs font-black text-slate-500 mb-2">
                  {top3[1].totalPoints} đ
                </span>
                <div className="w-full h-24 rounded-t-2xl bg-gradient-to-t from-slate-200 to-slate-100 border-t-4 border-slate-300 flex items-center justify-center">
                  <span className="text-2xl font-black text-slate-500">2</span>
                </div>
              </div>
            )}

            {/* #1 Gold */}
            {top3[0] && (
              <div className="flex flex-col items-center">
                <div className="relative">
                  {renderAvatar(top3[0].member, 'w-16 h-16')}
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-amber-400 text-slate-950 text-xs font-black flex items-center justify-center shadow">
                    ★
                  </span>
                </div>
                <span className="text-xs font-extrabold text-slate-900 mt-2 truncate max-w-full">
                  {top3[0].member.fullName.split(' ').slice(-2).join(' ')}
                </span>
                <span className="text-xs font-black text-amber-600 mb-2">
                  {top3[0].totalPoints} đ
                </span>
                <div className="w-full h-32 rounded-t-2xl bg-gradient-to-t from-amber-200 via-amber-100 to-amber-50 border-t-4 border-amber-400 flex items-center justify-center shadow-sm">
                  <span className="text-3xl font-black text-amber-600">1</span>
                </div>
              </div>
            )}

            {/* #3 Bronze */}
            {top3[2] && (
              <div className="flex flex-col items-center">
                {renderAvatar(top3[2].member, 'w-14 h-14')}
                <span className="text-xs font-extrabold text-slate-800 mt-2 truncate max-w-full">
                  {top3[2].member.fullName.split(' ').slice(-2).join(' ')}
                </span>
                <span className="text-xs font-black text-orange-600 mb-2">
                  {top3[2].totalPoints} đ
                </span>
                <div className="w-full h-20 rounded-t-2xl bg-gradient-to-t from-orange-100 to-orange-50 border-t-4 border-orange-300 flex items-center justify-center">
                  <span className="text-2xl font-black text-orange-600">3</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Biểu đồ Phân bổ Xếp loại & Tiến độ 4 Ban (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-200/80 shadow-card p-6 flex flex-col justify-between gap-5">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-extrabold text-slate-900">
                Biểu đồ Xếp loại Nhân sự
              </h2>
              <button
                onClick={handleExportCSV}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer"
              >
                <span className="material-symbols-outlined text-[15px]">download</span>
                <span>Xuất CSV</span>
              </button>
            </div>

            <div className="grid grid-cols-4 gap-2.5 text-center">
              <div className="p-3 rounded-2xl bg-emerald-50">
                <div className="text-2xl font-black text-emerald-600">{excCount}</div>
                <div className="text-[11px] font-bold text-emerald-800 mt-0.5">
                  Xuất sắc
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-blue-50">
                <div className="text-2xl font-black text-blue-600">{goodCount}</div>
                <div className="text-[11px] font-bold text-blue-800 mt-0.5">Tốt</div>
              </div>
              <div className="p-3 rounded-2xl bg-amber-50">
                <div className="text-2xl font-black text-amber-600">{passCount}</div>
                <div className="text-[11px] font-bold text-amber-800 mt-0.5">Đạt</div>
              </div>
              <div className="p-3 rounded-2xl bg-rose-50">
                <div className="text-2xl font-black text-rose-600">{lowCount}</div>
                <div className="text-[11px] font-bold text-rose-800 mt-0.5">
                  Cố gắng
                </div>
              </div>
            </div>
          </div>

          {/* Horizontal Bar Chart for 4 Departments */}
          <div className="space-y-2.5 pt-2 border-t border-slate-100">
            {DEPARTMENTS.map((dept) => {
              const dTasks = tasks.filter((t) => t.department === dept);
              const dDone = dTasks.filter((t) => t.status === 'Done').length;
              const dRate =
                dTasks.length > 0 ? Math.round((dDone / dTasks.length) * 100) : 0;
              const theme = DEPT_BADGE[dept];

              return (
                <div key={dept} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-slate-700">
                    <span>{theme.short}</span>
                    <span>{dRate}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${theme.bar}`}
                      style={{ width: `${dRate}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ROW 2: CLEAN LEADERBOARD TABLE */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-card overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-sm font-extrabold text-slate-900">
            Bảng Xếp Hạng Điểm
          </h2>

          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="h-9 px-3 text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl text-slate-700"
          >
            <option value="ALL">Tất cả Ban</option>
            {DEPARTMENTS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3.5 px-6">Hạng</th>
                <th className="py-3.5 px-4">Thành viên</th>
                <th className="py-3.5 px-4">Ban</th>
                <th className="py-3.5 px-4">Tiến độ</th>
                <th className="py-3.5 px-4 text-right">Điểm</th>
                <th className="py-3.5 px-6 text-center">Xếp loại</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredMemberStats.map((stat, index) => {
                const theme = DEPT_BADGE[stat.member.department];
                return (
                  <tr key={stat.member.id} className="hover:bg-slate-50/70">
                    <td className="py-3.5 px-6 font-black text-slate-500 text-xs">
                      #{index + 1}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        {renderAvatar(stat.member, 'w-8 h-8')}
                        <span className="font-bold text-slate-900">
                          {stat.member.fullName}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-lg text-xs font-bold border ${theme.cls}`}
                      >
                        {theme.short}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 w-44">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${theme.bar}`}
                            style={{ width: `${stat.completionRate}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold text-slate-600">
                          {stat.doneTasks}/{stat.totalTasks}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right font-black text-blue-600">
                      {stat.totalPoints} đ
                    </td>
                    <td className="py-3.5 px-6 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-lg text-xs font-bold border ${
                          RANK_BADGE[stat.rankLabel] || RANK_BADGE['Đạt']
                        }`}
                      >
                        {stat.rankLabel}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
