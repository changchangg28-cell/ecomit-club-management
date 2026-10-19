import React, { useState } from 'react';
import { useEcomit } from '../context/EcomitContext';
import { Department, Member } from '../types';

const DEPARTMENTS: Department[] = [
  'Ban Chủ nhiệm',
  'Ban Truyền thông',
  'Ban Kỹ thuật',
  'Ban Sự kiện & Host',
];

const DEPT_BADGE: Record<Department, { short: string; cls: string; bar: string }> = {
  'Ban Chủ nhiệm': {
    short: 'Ban Chủ nhiệm',
    cls: 'bg-indigo-50 text-indigo-700 border-indigo-200/80',
    bar: 'bg-indigo-600',
  },
  'Ban Truyền thông': {
    short: 'Ban Truyền thông',
    cls: 'bg-blue-50 text-blue-700 border-blue-200/80',
    bar: 'bg-blue-600',
  },
  'Ban Kỹ thuật': {
    short: 'Ban Kỹ thuật',
    cls: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    bar: 'bg-emerald-600',
  },
  'Ban Sự kiện & Host': {
    short: 'Ban Sự kiện & Host',
    cls: 'bg-amber-50 text-amber-800 border-amber-200/80',
    bar: 'bg-amber-500',
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
        className={`${size} rounded-full object-cover border border-slate-200 shrink-0`}
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
  const { members, tasks, memberStats } = useEcomit();
  const [selectedDept, setSelectedDept] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'points' | 'done' | 'rate'>('points');

  const totalTasks = tasks.length;
  const doneTasks = tasks.filter((t) => t.status === 'Done').length;
  const reviewTasks = tasks.filter((t) => t.status === 'Review').length;
  const inProgressTasks = tasks.filter((t) => t.status === 'InProgress').length;
  const overallRate = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  const filteredMemberStats = memberStats
    .filter((s) => selectedDept === 'ALL' || s.member.department === selectedDept)
    .sort((a, b) => {
      if (sortBy === 'points') return b.totalPoints - a.totalPoints;
      if (sortBy === 'done') return b.doneTasks - a.doneTasks;
      return b.completionRate - a.completionRate;
    });

  const handleExportCSV = () => {
    const headers = [
      'MSSV',
      'Ho va Ten',
      'Ban Chuyen Mon',
      'Chuc Vu',
      'Tong Cong Viec',
      'Da Hoan Thanh',
      'Dang Lam / Cho Duyet',
      'Ty Le Hoan Thanh (%)',
      'Tong Diem',
      'Xep Loai',
    ];
    const rows = filteredMemberStats.map((s) => [
      s.member.studentId,
      `"${s.member.fullName}"`,
      `"${s.member.department}"`,
      `"${s.member.role}"`,
      s.totalTasks,
      s.doneTasks,
      s.inProgressTasks + s.reviewTasks,
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
    a.download = `Bao_Cao_CLB_ECOMIT_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-5">
      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-card">
          <span className="text-xs font-semibold text-slate-400">Tỷ lệ hoàn thành</span>
          <p className="text-2xl font-extrabold text-blue-600 mt-1">{overallRate}%</p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-card">
          <span className="text-xs font-semibold text-slate-400">Việc đã xong</span>
          <p className="text-2xl font-extrabold text-emerald-600 mt-1">
            {doneTasks} <span className="text-sm font-medium text-slate-400">/ {totalTasks}</span>
          </p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-card">
          <span className="text-xs font-semibold text-slate-400">Đang xử lý</span>
          <p className="text-2xl font-extrabold text-amber-500 mt-1">
            {inProgressTasks + reviewTasks}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-card">
          <span className="text-xs font-semibold text-slate-400">Loại Xuất sắc</span>
          <p className="text-2xl font-extrabold text-indigo-600 mt-1">
            {memberStats.filter((m) => m.rankLabel === 'Xuất sắc').length}{' '}
            <span className="text-sm font-medium text-slate-400">/ {members.length} TV</span>
          </p>
        </div>
      </div>

      {/* Section 1: Department Comparison */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card overflow-hidden">
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900">1. Tiến độ theo Ban</h2>
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs"
          >
            <span className="material-symbols-outlined text-[15px]">download</span>
            <span>Xuất CSV</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-5">Ban chuyên môn</th>
                <th className="py-3 px-4 text-center">Nhân sự</th>
                <th className="py-3 px-4 text-center">Tổng việc</th>
                <th className="py-3 px-4 text-center">Đang làm</th>
                <th className="py-3 px-4 text-center">Chờ duyệt</th>
                <th className="py-3 px-4 text-center">Đã xong</th>
                <th className="py-3 px-5">Tiến độ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {DEPARTMENTS.map((dept) => {
                const deptMembers = members.filter((m) => m.department === dept).length;
                const dTasks = tasks.filter((t) => t.department === dept);
                const dProg = dTasks.filter((t) => t.status === 'InProgress').length;
                const dRev = dTasks.filter((t) => t.status === 'Review').length;
                const dDone = dTasks.filter((t) => t.status === 'Done').length;
                const dRate =
                  dTasks.length > 0 ? Math.round((dDone / dTasks.length) * 100) : 0;
                const theme = DEPT_BADGE[dept];

                return (
                  <tr key={dept} className="hover:bg-slate-50/70">
                    <td className="py-3.5 px-5">
                      <span
                        className={`px-2.5 py-0.5 rounded-lg text-xs font-semibold border ${theme.cls}`}
                      >
                        {theme.short}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center text-slate-600 text-xs font-semibold">
                      {deptMembers}
                    </td>
                    <td className="py-3.5 px-4 text-center font-bold text-slate-800">
                      {dTasks.length}
                    </td>
                    <td className="py-3.5 px-4 text-center text-blue-600 font-semibold">
                      {dProg}
                    </td>
                    <td className="py-3.5 px-4 text-center text-amber-600 font-semibold">
                      {dRev}
                    </td>
                    <td className="py-3.5 px-4 text-center text-emerald-600 font-extrabold">
                      {dDone}
                    </td>
                    <td className="py-3.5 px-5 w-48">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${theme.bar}`}
                            style={{ width: `${dRate}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold text-slate-700 w-9 text-right">
                          {dRate}%
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 2: Member Ranking Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card overflow-hidden">
        <div className="px-5 py-3.5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-sm font-bold text-slate-900">
            2. Bảng xếp hạng Thành viên
          </h2>

          <div className="flex items-center gap-2">
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="h-8 px-3 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl text-slate-700"
            >
              <option value="ALL">Tất cả Ban</option>
              {DEPARTMENTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'points' | 'done' | 'rate')}
              className="h-8 px-3 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl text-slate-700"
            >
              <option value="points">Điểm cao nhất</option>
              <option value="done">Xong nhiều việc</option>
              <option value="rate">Tỷ lệ hoàn thành</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-5">Hạng</th>
                <th className="py-3 px-4">Thành viên</th>
                <th className="py-3 px-4">Ban</th>
                <th className="py-3 px-4 text-center">Hoàn thành</th>
                <th className="py-3 px-4 text-center">Tỷ lệ</th>
                <th className="py-3 px-4 text-right">Điểm</th>
                <th className="py-3 px-5 text-center">Xếp loại</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredMemberStats.map((stat, index) => {
                const theme = DEPT_BADGE[stat.member.department];
                return (
                  <tr key={stat.member.id} className="hover:bg-slate-50/70">
                    <td className="py-3 px-5 font-extrabold text-slate-500 text-xs">
                      #{index + 1}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        {renderAvatar(stat.member, 'w-8 h-8')}
                        <div>
                          <p className="font-bold text-slate-900 text-sm">
                            {stat.member.fullName}
                          </p>
                          <p className="text-[11px] text-slate-400">
                            {stat.member.studentId} • {stat.member.role}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-lg text-xs font-semibold border ${theme.cls}`}
                      >
                        {theme.short.replace('Ban ', '')}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-slate-800">
                      <span className="text-emerald-600">{stat.doneTasks}</span>/{stat.totalTasks}
                    </td>
                    <td className="py-3 px-4 text-center text-xs font-bold text-slate-700">
                      {stat.completionRate}%
                    </td>
                    <td className="py-3 px-4 text-right font-extrabold text-blue-600">
                      {stat.totalPoints} đ
                    </td>
                    <td className="py-3 px-5 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-lg text-xs font-semibold border ${
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
