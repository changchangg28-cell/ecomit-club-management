import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEcomit } from '../context/EcomitContext';
import { Department, Member, TaskStatus } from '../types';

const DEPARTMENTS: Department[] = [
  'Ban Chủ nhiệm',
  'Ban Truyền thông',
  'Ban Kỹ thuật',
  'Ban Sự kiện & Host',
];

const DEPT_THEME: Record<
  Department,
  {
    short: string;
    bg: string;
    text: string;
    bar: string;
    gradient: string;
  }
> = {
  'Ban Chủ nhiệm': {
    short: 'Chủ nhiệm',
    bg: 'bg-indigo-50',
    text: 'text-indigo-700',
    bar: 'bg-indigo-600',
    gradient: 'from-indigo-600 to-violet-500',
  },
  'Ban Truyền thông': {
    short: 'Truyền thông',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    bar: 'bg-blue-600',
    gradient: 'from-blue-600 to-cyan-400',
  },
  'Ban Kỹ thuật': {
    short: 'Kỹ thuật',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    bar: 'bg-emerald-600',
    gradient: 'from-emerald-600 to-teal-400',
  },
  'Ban Sự kiện & Host': {
    short: 'Sự kiện',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    bar: 'bg-amber-500',
    gradient: 'from-amber-500 to-orange-400',
  },
};

const STATUS_BADGE: Record<TaskStatus, { label: string; cls: string }> = {
  Todo: { label: 'Chờ', cls: 'bg-slate-100 text-slate-600 border-slate-200' },
  InProgress: { label: 'Đang làm', cls: 'bg-blue-50 text-blue-700 border-blue-200' },
  Review: { label: 'Chờ duyệt', cls: 'bg-amber-50 text-amber-700 border-amber-200' },
  Done: { label: 'Xong', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
};

const renderAvatar = (member: Member | undefined, size = 'w-8 h-8') => {
  if (!member) {
    return (
      <div
        className={`${size} rounded-full bg-slate-100 text-slate-400 flex items-center justify-center text-xs font-bold shrink-0`}
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
        className={`${size} rounded-full object-cover ring-2 ring-white shadow-sm shrink-0`}
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
    setActiveTaskModalId,
    updateTaskStatus,
    getEventById,
  } = useEcomit();

  const [deptFilter, setDeptFilter] = useState<string>('ALL');
  const [activeTab, setActiveTab] = useState<'tasks' | 'events' | 'members'>('tasks');
  const [search, setSearch] = useState('');

  const scopedTasks =
    deptFilter === 'ALL' ? tasks : tasks.filter((t) => t.department === deptFilter);
  const scopedMembers =
    deptFilter === 'ALL'
      ? memberStats
      : memberStats.filter((m) => m.member.department === deptFilter);

  const totalTasks = scopedTasks.length;
  const doneTasks = scopedTasks.filter((t) => t.status === 'Done').length;
  const reviewTasks = scopedTasks.filter((t) => t.status === 'Review').length;
  const inProgressTasks = scopedTasks.filter((t) => t.status === 'InProgress').length;
  const todoTasks = scopedTasks.filter((t) => t.status === 'Todo').length;
  const completionPct = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;
  const totalPoints = scopedMembers.reduce((s, m) => s + m.totalPoints, 0);

  // Donut Chart Angles
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

  const filteredTasks = scopedTasks.filter((t) => {
    const q = search.toLowerCase().trim();
    return !q || t.title.toLowerCase().includes(q) || t.code.toLowerCase().includes(q);
  });

  const sortedMembers = [...scopedMembers].sort((a, b) => b.totalPoints - a.totalPoints);

  return (
    <div className="space-y-6">
      {/* Top Sleek Department Filter Pills */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex items-center gap-1.5 p-1 rounded-2xl bg-white border border-slate-200/80 shadow-card overflow-x-auto">
          <button
            onClick={() => setDeptFilter('ALL')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              deptFilter === 'ALL'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Tất cả
          </button>
          {DEPARTMENTS.map((dept) => (
            <button
              key={dept}
              onClick={() => setDeptFilter(dept)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                deptFilter === dept
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {DEPT_THEME[dept].short}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/tasks')}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/80 text-xs font-bold shadow-card inline-flex items-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">view_kanban</span>
            <span>Kanban</span>
          </button>
        </div>
      </div>

      {/* Row 1: 4 Luxury KPI Cards (Minimal Text, High Visual Impact) */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <div
          onClick={() => navigate('/members')}
          className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-card hover:shadow-soft transition-all cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Thành viên</span>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
              <span className="material-symbols-outlined text-[20px]">groups</span>
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black text-slate-900">{scopedMembers.length}</div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full mt-3 overflow-hidden">
              <div className="h-full bg-indigo-600 rounded-full w-4/5" />
            </div>
          </div>
        </div>

        <div
          onClick={() => navigate('/tasks')}
          className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-card hover:shadow-soft transition-all cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Hoàn thành</span>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
              <span className="material-symbols-outlined text-[20px]">check_circle</span>
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-emerald-600">{completionPct}%</span>
              <span className="text-xs font-bold text-slate-400">
                {doneTasks}/{totalTasks}
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full mt-3 overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${completionPct}%` }}
              />
            </div>
          </div>
        </div>

        <div
          onClick={() => navigate('/tasks')}
          className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-card hover:shadow-soft transition-all cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Đang xử lý</span>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-400 text-white flex items-center justify-center shadow-md shadow-amber-500/20">
              <span className="material-symbols-outlined text-[20px]">bolt</span>
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900">
                {inProgressTasks + reviewTasks}
              </span>
              {reviewTasks > 0 && (
                <span className="text-xs font-bold text-amber-600">
                  {reviewTasks} duyệt
                </span>
              )}
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full mt-3 overflow-hidden">
              <div className="h-full bg-amber-500 rounded-full w-3/5" />
            </div>
          </div>
        </div>

        <div
          onClick={() => navigate('/reports')}
          className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-card hover:shadow-soft transition-all cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Tổng điểm</span>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              <span className="material-symbols-outlined text-[20px]">workspace_premium</span>
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900">{totalPoints}</span>
              <span className="text-xs font-bold text-blue-600">{events.length} sự kiện</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full mt-3 overflow-hidden">
              <div className="h-full bg-blue-600 rounded-full w-4/5" />
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: 2 Sleek Visual Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Donut Chart (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/80 shadow-card p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-extrabold text-slate-900">Trạng thái Task</h3>
            <span className="px-2.5 py-0.5 rounded-lg text-xs font-extrabold bg-emerald-50 text-emerald-600">
              {completionPct}%
            </span>
          </div>

          <div className="flex items-center justify-around gap-6 my-auto py-2">
            <div
              className="relative w-36 h-36 rounded-full flex items-center justify-center shrink-0 shadow-sm"
              style={{ background: donutGradient }}
            >
              <div className="w-24 h-24 rounded-full bg-white flex flex-col items-center justify-center shadow-inner">
                <span className="text-2xl font-black text-slate-900">{totalTasks}</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Tasks
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5 flex-1 max-w-[200px]">
              <div className="p-2.5 rounded-2xl bg-emerald-50/70">
                <div className="text-lg font-black text-emerald-600">{doneTasks}</div>
                <div className="text-[11px] font-bold text-slate-500">Xong</div>
              </div>
              <div className="p-2.5 rounded-2xl bg-amber-50/70">
                <div className="text-lg font-black text-amber-600">{reviewTasks}</div>
                <div className="text-[11px] font-bold text-slate-500">Chờ duyệt</div>
              </div>
              <div className="p-2.5 rounded-2xl bg-blue-50/70">
                <div className="text-lg font-black text-blue-600">{inProgressTasks}</div>
                <div className="text-[11px] font-bold text-slate-500">Đang làm</div>
              </div>
              <div className="p-2.5 rounded-2xl bg-slate-100/80">
                <div className="text-lg font-black text-slate-600">{todoTasks}</div>
                <div className="text-[11px] font-bold text-slate-500">Chờ</div>
              </div>
            </div>
          </div>
        </div>

        {/* Gradient Column Chart for 4 Departments (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/80 shadow-card p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-extrabold text-slate-900">Tiến độ 4 Ban</h3>
            <span className="text-xs font-bold text-slate-400">Tỷ lệ hoàn thành</span>
          </div>

          <div className="grid grid-cols-4 gap-5 items-end h-44 pt-4 px-2">
            {DEPARTMENTS.map((dept) => {
              const dTasks = tasks.filter((t) => t.department === dept);
              const dDone = dTasks.filter((t) => t.status === 'Done').length;
              const dTotal = dTasks.length;
              const pct = dTotal > 0 ? Math.round((dDone / dTotal) * 100) : 0;
              const theme = DEPT_THEME[dept];

              return (
                <div
                  key={dept}
                  onClick={() => setDeptFilter(deptFilter === dept ? 'ALL' : dept)}
                  className="flex flex-col items-center h-full justify-end cursor-pointer group"
                >
                  <span className="text-xs font-black text-slate-800 mb-1.5">
                    {pct}%
                  </span>
                  <div className="w-full max-w-[56px] h-28 bg-slate-100/90 rounded-2xl overflow-hidden flex items-end p-1 group-hover:ring-2 ring-blue-200 transition-all">
                    <div
                      className={`w-full rounded-xl bg-gradient-to-t ${theme.gradient} transition-all duration-500`}
                      style={{ height: `${Math.max(pct, 14)}%` }}
                    />
                  </div>
                  <span className="text-xs font-extrabold text-slate-700 mt-2.5 truncate">
                    {theme.short}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400">
                    {dDone}/{dTotal}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Row 3: Sleek All-in-One Dashboard Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-card overflow-hidden">
        {/* Clean Tab Bar */}
        <div className="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="inline-flex items-center gap-1 p-1 rounded-2xl bg-slate-100/80">
            <button
              onClick={() => setActiveTab('tasks')}
              className={`px-4 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                activeTab === 'tasks'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Công việc ({scopedTasks.length})
            </button>
            <button
              onClick={() => setActiveTab('events')}
              className={`px-4 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                activeTab === 'events'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Sự kiện ({events.length})
            </button>
            <button
              onClick={() => setActiveTab('members')}
              className={`px-4 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                activeTab === 'members'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Top Thành viên ({scopedMembers.length})
            </button>
          </div>

          {activeTab === 'tasks' && (
            <div className="relative w-full sm:w-56">
              <span className="material-symbols-outlined text-[16px] text-slate-400 absolute left-3 top-1/2 -translate-y-1/2">
                search
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm nhanh..."
                className="w-full h-9 pl-9 pr-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500"
              />
            </div>
          )}
        </div>

        {/* TAB 1: TASKS TABLE */}
        {activeTab === 'tasks' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3.5 px-6">Công việc</th>
                  <th className="py-3.5 px-4">Sự kiện</th>
                  <th className="py-3.5 px-4">Ban</th>
                  <th className="py-3.5 px-4">Phụ trách</th>
                  <th className="py-3.5 px-4">Hạn</th>
                  <th className="py-3.5 px-6 text-right">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredTasks.map((task) => {
                  const assignee = members.find((m) => m.id === task.assigneeId);
                  const parentEv = getEventById(task.eventId);
                  const deptTheme = DEPT_THEME[task.department];
                  const stBadge = STATUS_BADGE[task.status];

                  return (
                    <tr
                      key={task.id}
                      onClick={() => setActiveTaskModalId(task.id)}
                      className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                    >
                      <td className="py-3.5 px-6 font-bold text-slate-900">
                        {task.title}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-600">
                          {parentEv?.code || 'EV'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold ${deptTheme.bg} ${deptTheme.text}`}
                        >
                          {deptTheme.short}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          {renderAvatar(assignee, 'w-7 h-7')}
                          <span className="text-xs font-bold text-slate-800">
                            {assignee?.fullName}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-xs font-semibold text-slate-400">
                        {task.deadline}
                      </td>
                      <td
                        className="py-3.5 px-6 text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <select
                          value={task.status}
                          onChange={(e) =>
                            updateTaskStatus(task.id, e.target.value as TaskStatus)
                          }
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold border cursor-pointer focus:outline-none ${stBadge.cls}`}
                        >
                          <option value="Todo">Chờ</option>
                          <option value="InProgress">Đang làm</option>
                          <option value="Review">Chờ duyệt</option>
                          <option value="Done">Xong</option>
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 2: EVENTS PROGRESS */}
        {activeTab === 'events' && (
          <div className="divide-y divide-slate-100">
            {eventStats.map((st) => {
              const { event } = st;
              const lead = members.find((m) => m.id === event.leadId);
              return (
                <div
                  key={event.id}
                  onClick={() => navigate('/tasks')}
                  className="px-6 py-4 hover:bg-slate-50 cursor-pointer flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <span className="px-2.5 py-1 rounded-xl text-xs font-black bg-indigo-50 text-indigo-600">
                      {event.code}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-extrabold text-slate-900 truncate">
                        {event.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                        {renderAvatar(lead, 'w-4 h-4')}
                        <span className="font-semibold text-slate-600">
                          {lead?.fullName}
                        </span>
                        <span>• {event.endDate}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <div className="w-36">
                      <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                        <span>
                          {st.doneTasks}/{st.totalTasks}
                        </span>
                        <span className="text-blue-600">{st.completionRate}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-blue-600 to-emerald-500"
                          style={{ width: `${st.completionRate}%` }}
                        />
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openCreateTask(undefined, event.id);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-600 text-slate-700 hover:text-white text-xs font-bold transition-colors"
                    >
                      + Task
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 3: LEADERBOARD */}
        {activeTab === 'members' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3.5 px-6">Hạng</th>
                  <th className="py-3.5 px-4">Thành viên</th>
                  <th className="py-3.5 px-4">Ban</th>
                  <th className="py-3.5 px-4">Tiến độ</th>
                  <th className="py-3.5 px-6 text-right">Điểm</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {sortedMembers.map((stat, idx) => {
                  const deptTheme = DEPT_THEME[stat.member.department];
                  return (
                    <tr
                      key={stat.member.id}
                      onClick={() => navigate('/members')}
                      className="hover:bg-slate-50/80 cursor-pointer"
                    >
                      <td className="py-3.5 px-6">
                        <span
                          className={`w-6 h-6 rounded-full text-xs font-black inline-flex items-center justify-center ${
                            idx === 0
                              ? 'bg-amber-400 text-slate-950'
                              : idx === 1
                              ? 'bg-slate-200 text-slate-800'
                              : idx === 2
                              ? 'bg-orange-200 text-orange-900'
                              : 'text-slate-400'
                          }`}
                        >
                          {idx + 1}
                        </span>
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
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold ${deptTheme.bg} ${deptTheme.text}`}
                        >
                          {deptTheme.short}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 w-44">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${deptTheme.bar}`}
                              style={{ width: `${stat.completionRate}%` }}
                            />
                          </div>
                          <span className="text-xs font-bold text-slate-500">
                            {stat.doneTasks}/{stat.totalTasks}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-6 text-right">
                        <span className="px-2.5 py-1 rounded-xl text-xs font-black bg-blue-50 text-blue-600">
                          {stat.totalPoints} đ
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
