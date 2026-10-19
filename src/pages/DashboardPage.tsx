import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useEcomit } from '../context/EcomitContext';
import { Department, Member } from '../types';

const DEPARTMENTS: Department[] = [
  'Ban Chủ nhiệm',
  'Ban Truyền thông',
  'Ban Kỹ thuật',
  'Ban Sự kiện & Host',
];

const DEPT_THEME: Record<
  Department,
  { short: string; color: string; bg: string; text: string; bar: string }
> = {
  'Ban Chủ nhiệm': {
    short: 'Chủ nhiệm',
    color: '#4f46e5',
    bg: 'bg-indigo-50',
    text: 'text-indigo-700',
    bar: 'bg-indigo-600',
  },
  'Ban Truyền thông': {
    short: 'Truyền thông',
    color: '#2563eb',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    bar: 'bg-blue-600',
  },
  'Ban Kỹ thuật': {
    short: 'Kỹ thuật',
    color: '#059669',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    bar: 'bg-emerald-600',
  },
  'Ban Sự kiện & Host': {
    short: 'Sự kiện',
    color: '#d97706',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    bar: 'bg-amber-500',
  },
};

const EVENT_BAR: Record<string, { bar: string; badge: string }> = {
  indigo: { bar: 'bg-indigo-600', badge: 'bg-indigo-50 text-indigo-700' },
  blue: { bar: 'bg-blue-600', badge: 'bg-blue-50 text-blue-700' },
  emerald: { bar: 'bg-emerald-600', badge: 'bg-emerald-50 text-emerald-700' },
  amber: { bar: 'bg-amber-500', badge: 'bg-amber-50 text-amber-800' },
};

const renderAvatar = (member: Member | undefined, size = 'w-8 h-8') => {
  if (!member) {
    return (
      <div
        className={`${size} rounded-full bg-slate-100 text-slate-400 flex items-center justify-center text-xs font-bold`}
      >
        ?
      </div>
    );
  }
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
      className={`${size} rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold shrink-0`}
    >
      {initials}
    </div>
  );
};

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    members,
    tasks,
    events,
    eventStats,
    memberStats,
    openCreateTask,
  } = useEcomit();

  const totalTasks = tasks.length;
  const doneTasks = tasks.filter((t) => t.status === 'Done').length;
  const reviewTasks = tasks.filter((t) => t.status === 'Review').length;
  const inProgressTasks = tasks.filter((t) => t.status === 'InProgress').length;
  const todoTasks = tasks.filter((t) => t.status === 'Todo').length;
  const completionPct = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  // Tính góc Conic Gradient cho biểu đồ Donut
  const doneDeg = totalTasks > 0 ? (doneTasks / totalTasks) * 360 : 0;
  const reviewDeg = totalTasks > 0 ? (reviewTasks / totalTasks) * 360 : 0;
  const progDeg = totalTasks > 0 ? (inProgressTasks / totalTasks) * 360 : 0;

  const stop1 = doneDeg;
  const stop2 = stop1 + reviewDeg;
  const stop3 = stop2 + progDeg;

  const donutGradient =
    totalTasks > 0
      ? `conic-gradient(#10b981 0deg ${stop1}deg, #f59e0b ${stop1}deg ${stop2}deg, #2563eb ${stop2}deg ${stop3}deg, #e2e8f0 ${stop3}deg 360deg)`
      : 'conic-gradient(#e2e8f0 0deg 360deg)';

  // Top 5 thành viên
  const topMembers = [...memberStats]
    .sort((a, b) => b.totalPoints - a.totalPoints)
    .slice(0, 5);

  return (
    <div className="space-y-5">
      {/* Row 1: 4 Minimal Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => navigate('/members')}
          className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-card hover:border-indigo-300 cursor-pointer transition-all flex items-center justify-between"
        >
          <div>
            <span className="text-xs font-semibold text-slate-400">Thành viên CLB</span>
            <p className="text-2xl font-extrabold text-slate-900 mt-1">{members.length}</p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <span className="material-symbols-outlined text-[22px]">groups</span>
          </div>
        </div>

        <div
          onClick={() => navigate('/tasks')}
          className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-card hover:border-blue-300 cursor-pointer transition-all flex items-center justify-between"
        >
          <div>
            <span className="text-xs font-semibold text-slate-400">Sự kiện / Việc chính</span>
            <p className="text-2xl font-extrabold text-blue-600 mt-1">{events.length}</p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <span className="material-symbols-outlined text-[22px]">account_tree</span>
          </div>
        </div>

        <div
          onClick={() => navigate('/tasks')}
          className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-card hover:border-amber-300 cursor-pointer transition-all flex items-center justify-between"
        >
          <div>
            <span className="text-xs font-semibold text-slate-400">Task chờ duyệt</span>
            <p className="text-2xl font-extrabold text-amber-500 mt-1">{reviewTasks}</p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <span className="material-symbols-outlined text-[22px]">schedule</span>
          </div>
        </div>

        <div
          onClick={() => navigate('/reports')}
          className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-card hover:border-emerald-300 cursor-pointer transition-all flex items-center justify-between"
        >
          <div>
            <span className="text-xs font-semibold text-slate-400">Task hoàn thành</span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <p className="text-2xl font-extrabold text-emerald-600">{doneTasks}</p>
              <span className="text-xs font-bold text-slate-400">/ {totalTasks}</span>
            </div>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <span className="material-symbols-outlined text-[22px]">check_circle</span>
          </div>
        </div>
      </div>

      {/* Row 2: Visual Charts Section (Donut Chart + Department Bar Chart) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Donut Chart: Tỷ trọng trạng thái công việc (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 shadow-card p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-slate-900">Biểu đồ Trạng thái Task</h2>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-lg">
              {completionPct}% hoàn tất
            </span>
          </div>

          <div className="flex items-center justify-around gap-6 my-auto py-2">
            {/* Donut Ring */}
            <div
              className="relative w-36 h-36 rounded-full flex items-center justify-center shrink-0"
              style={{ background: donutGradient }}
            >
              <div className="w-24 h-24 rounded-full bg-white flex flex-col items-center justify-center shadow-inner">
                <span className="text-2xl font-extrabold text-slate-900">
                  {totalTasks}
                </span>
                <span className="text-[11px] font-medium text-slate-400">Task con</span>
              </div>
            </div>

            {/* Legend */}
            <div className="space-y-2.5 text-xs flex-1 max-w-[180px]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-sm bg-emerald-500" />
                  <span className="text-slate-600 font-medium">Hoàn thành</span>
                </div>
                <span className="font-bold text-slate-900">{doneTasks}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-sm bg-amber-500" />
                  <span className="text-slate-600 font-medium">Chờ duyệt</span>
                </div>
                <span className="font-bold text-slate-900">{reviewTasks}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-sm bg-blue-600" />
                  <span className="text-slate-600 font-medium">Đang làm</span>
                </div>
                <span className="font-bold text-slate-900">{inProgressTasks}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-sm bg-slate-200" />
                  <span className="text-slate-600 font-medium">Chưa mở</span>
                </div>
                <span className="font-bold text-slate-900">{todoTasks}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Column Bar Chart: Hiệu suất 4 Ban chuyên môn (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 shadow-card p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-slate-900">
              Biểu đồ Tiến độ 4 Ban chuyên môn
            </h2>
            <div className="flex items-center gap-3 text-[11px] font-medium text-slate-500">
              <span className="inline-flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-xs bg-blue-600" /> Đã xong
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-xs bg-slate-200" /> Tổng giao
              </span>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4 items-end h-40 pt-4 px-2">
            {DEPARTMENTS.map((dept) => {
              const dTasks = tasks.filter((t) => t.department === dept);
              const dDone = dTasks.filter((t) => t.status === 'Done').length;
              const dTotal = dTasks.length;
              const pct = dTotal > 0 ? Math.round((dDone / dTotal) * 100) : 0;
              const theme = DEPT_THEME[dept];

              return (
                <div
                  key={dept}
                  onClick={() => navigate('/tasks')}
                  className="flex flex-col items-center h-full justify-end cursor-pointer group"
                >
                  <span className="text-xs font-extrabold text-slate-800 mb-1.5">
                    {pct}%
                  </span>
                  <div className="w-full max-w-[54px] h-24 bg-slate-100 rounded-xl overflow-hidden flex items-end p-1 group-hover:ring-2 ring-blue-200 transition-all">
                    <div
                      className={`w-full rounded-lg transition-all duration-500 ${theme.bar}`}
                      style={{ height: `${Math.max(pct, 12)}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-slate-700 mt-2 text-center truncate w-full">
                    {theme.short}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {dDone}/{dTotal} việc
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Row 3: Tiến độ các Sự kiện / Công việc chính + Top Thành viên */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Tiến độ theo Sự kiện / Công việc chính (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 shadow-card overflow-hidden">
          <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">
              Tiến độ Sự kiện / Công việc chính
            </h2>
            <button
              onClick={() => navigate('/tasks')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700"
            >
              Xem chi tiết task con →
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {eventStats.map((st) => {
              const { event } = st;
              const lead = members.find((m) => m.id === event.leadId);
              const evColor = EVENT_BAR[event.color] || EVENT_BAR.indigo;

              return (
                <div
                  key={event.id}
                  onClick={() => navigate('/tasks')}
                  className="px-5 py-3.5 hover:bg-slate-50 cursor-pointer transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold ${evColor.badge}`}
                      >
                        {event.code}
                      </span>
                      <p className="text-sm font-bold text-slate-900 truncate">
                        {event.title}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      {renderAvatar(lead, 'w-4 h-4')}
                      <span>{lead?.fullName}</span>
                      <span>• {st.doneTasks}/{st.totalTasks} task con hoàn thành</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="w-28">
                      <div className="flex justify-between text-[11px] font-bold text-slate-700 mb-1">
                        <span>Tiến độ</span>
                        <span>{st.completionRate}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${evColor.bar}`}
                          style={{ width: `${st.completionRate}%` }}
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        openCreateTask(undefined, event.id);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-600 text-slate-700 hover:text-white text-[11px] font-semibold transition-colors"
                    >
                      + Task
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Top 5 Thành viên có Avatar (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 shadow-card overflow-hidden">
          <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">Top thành viên tiêu biểu</h2>
            <button
              onClick={() => navigate('/reports')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700"
            >
              Bảng điểm →
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {topMembers.map((stat, idx) => {
              const deptTheme = DEPT_THEME[stat.member.department];
              return (
                <div
                  key={stat.member.id}
                  onClick={() => navigate('/members')}
                  className="px-5 py-3 hover:bg-slate-50 cursor-pointer transition-colors flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`w-5 h-5 rounded-full text-[11px] font-extrabold flex items-center justify-center shrink-0 ${
                        idx === 0
                          ? 'bg-amber-100 text-amber-700'
                          : idx === 1
                          ? 'bg-slate-200 text-slate-700'
                          : idx === 2
                          ? 'bg-orange-100 text-orange-700'
                          : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      {idx + 1}
                    </span>
                    {renderAvatar(stat.member, 'w-9 h-9')}
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate">
                        {stat.member.fullName}
                      </p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span
                          className={`px-1.5 py-0.2 rounded text-[10px] font-semibold ${deptTheme.bg} ${deptTheme.text}`}
                        >
                          {deptTheme.short}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          • {stat.doneTasks}/{stat.totalTasks} task
                        </span>
                      </div>
                    </div>
                  </div>

                  <span className="text-xs font-extrabold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg shrink-0">
                    {stat.totalPoints} đ
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
