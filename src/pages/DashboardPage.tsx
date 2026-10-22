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
    icon: string;
    bg: string;
    text: string;
    border: string;
    bar: string;
    gradient: string;
  }
> = {
  'Ban Chủ nhiệm': {
    short: 'Ban Chủ nhiệm',
    icon: 'verified_user',
    bg: 'bg-indigo-50',
    text: 'text-indigo-700',
    border: 'border-indigo-200',
    bar: 'bg-indigo-600',
    gradient: 'from-indigo-600 to-violet-600',
  },
  'Ban Truyền thông': {
    short: 'Ban Truyền thông',
    icon: 'campaign',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    bar: 'bg-blue-600',
    gradient: 'from-blue-600 to-cyan-500',
  },
  'Ban Kỹ thuật': {
    short: 'Ban Kỹ thuật',
    icon: 'terminal',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    bar: 'bg-emerald-600',
    gradient: 'from-emerald-600 to-teal-500',
  },
  'Ban Sự kiện & Host': {
    short: 'Ban Sự kiện & Host',
    icon: 'celebration',
    bg: 'bg-amber-50',
    text: 'text-amber-800',
    border: 'border-amber-200',
    bar: 'bg-amber-500',
    gradient: 'from-amber-500 to-orange-500',
  },
};

const STATUS_BADGE: Record<TaskStatus, { label: string; cls: string; dot: string }> = {
  Todo: {
    label: 'Chưa mở',
    cls: 'bg-slate-100 text-slate-700 border-slate-200',
    dot: 'bg-slate-400',
  },
  InProgress: {
    label: 'Đang làm',
    cls: 'bg-blue-50 text-blue-700 border-blue-200',
    dot: 'bg-blue-600',
  },
  Review: {
    label: 'Chờ duyệt',
    cls: 'bg-amber-50 text-amber-800 border-amber-200',
    dot: 'bg-amber-500',
  },
  Done: {
    label: 'Hoàn thành',
    cls: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dot: 'bg-emerald-500',
  },
};

const PRIORITY_BADGE: Record<string, string> = {
  Cao: 'bg-rose-50 text-rose-700 border-rose-200',
  'Trung bình': 'bg-sky-50 text-sky-700 border-sky-200',
  Thấp: 'bg-slate-100 text-slate-600 border-slate-200',
};

const RANK_BADGE: Record<string, string> = {
  'Xuất sắc': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Tốt: 'bg-blue-50 text-blue-700 border-blue-200',
  Đạt: 'bg-amber-50 text-amber-800 border-amber-200',
  'Cần cố gắng': 'bg-rose-50 text-rose-700 border-rose-200',
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
    setActiveTaskModalId,
    updateTaskStatus,
    getEventById,
  } = useEcomit();

  // Bộ lọc nhanh toàn Dashboard
  const [selectedDeptFilter, setSelectedDeptFilter] = useState<string>('ALL');
  const [activeTableTab, setActiveTableTab] = useState<'tasks' | 'events' | 'members'>('tasks');
  const [tableSearch, setTableSearch] = useState('');
  const [taskStatusFilter, setTaskStatusFilter] = useState<string>('ALL');

  // Áp dụng bộ lọc Ban cho số liệu thống kê
  const scopedTasks =
    selectedDeptFilter === 'ALL'
      ? tasks
      : tasks.filter((t) => t.department === selectedDeptFilter);

  const scopedMembers =
    selectedDeptFilter === 'ALL'
      ? memberStats
      : memberStats.filter((m) => m.member.department === selectedDeptFilter);

  const totalTasks = scopedTasks.length;
  const doneTasks = scopedTasks.filter((t) => t.status === 'Done').length;
  const reviewTasks = scopedTasks.filter((t) => t.status === 'Review').length;
  const inProgressTasks = scopedTasks.filter((t) => t.status === 'InProgress').length;
  const todoTasks = scopedTasks.filter((t) => t.status === 'Todo').length;
  const completionPct = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  const highPriorityTasks = scopedTasks.filter((t) => t.priority === 'Cao').length;
  const highPriorityDone = scopedTasks.filter(
    (t) => t.priority === 'Cao' && t.status === 'Done'
  ).length;
  const mediumPriorityTasks = scopedTasks.filter((t) => t.priority === 'Trung bình').length;
  const lowPriorityTasks = scopedTasks.filter((t) => t.priority === 'Thấp').length;

  const totalClubPoints = scopedMembers.reduce((sum, m) => sum + m.totalPoints, 0);
  const avgMemberPoints =
    scopedMembers.length > 0 ? Math.round(totalClubPoints / scopedMembers.length) : 0;
  const excellentCount = scopedMembers.filter((m) => m.rankLabel === 'Xuất sắc').length;

  // Conic Gradient cho biểu đồ Donut
  const doneDeg = totalTasks > 0 ? (doneTasks / totalTasks) * 360 : 0;
  const reviewDeg = totalTasks > 0 ? (reviewTasks / totalTasks) * 360 : 0;
  const progDeg = totalTasks > 0 ? (inProgressTasks / totalTasks) * 360 : 0;
  const stop1 = doneDeg;
  const stop2 = stop1 + reviewDeg;
  const stop3 = stop2 + progDeg;

  const donutGradient =
    totalTasks > 0
      ? `conic-gradient(#10b981 0deg ${stop1}deg, #f59e0b ${stop1}deg ${stop2}deg, #2563eb ${stop2}deg ${stop3}deg, #cbd5e1 ${stop3}deg 360deg)`
      : 'conic-gradient(#e2e8f0 0deg 360deg)';

  // Dữ liệu lọc cho Bảng Dashboard bên dưới
  const filteredTableTasks = scopedTasks.filter((t) => {
    const matchStatus = taskStatusFilter === 'ALL' || t.status === taskStatusFilter;
    const q = tableSearch.toLowerCase().trim();
    const assignee = members.find((m) => m.id === t.assigneeId);
    const matchQ =
      !q ||
      t.title.toLowerCase().includes(q) ||
      t.code.toLowerCase().includes(q) ||
      (assignee?.fullName || '').toLowerCase().includes(q);
    return matchStatus && matchQ;
  });

  const filteredTableMembers = [...scopedMembers]
    .filter((st) => {
      const q = tableSearch.toLowerCase().trim();
      return (
        !q ||
        st.member.fullName.toLowerCase().includes(q) ||
        st.member.studentId.toLowerCase().includes(q) ||
        st.member.role.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => b.totalPoints - a.totalPoints);

  // Xuất CSV nhanh từ Dashboard
  const handleQuickExportCSV = () => {
    const headers = [
      'Ma Task',
      'Ten Cong Viec',
      'Su Kien Chinh',
      'Ban Chuyen Mon',
      'Nguoi Phu Trach',
      'Uu Tien',
      'Han Hoan Thanh',
      'Trang Thai',
      'Diem Thuong',
    ];
    const rows = scopedTasks.map((t) => {
      const assignee = members.find((m) => m.id === t.assigneeId);
      const ev = getEventById(t.eventId);
      return [
        t.code,
        `"${t.title}"`,
        `"${ev?.title || 'Việc chung'}"`,
        `"${t.department}"`,
        `"${assignee?.fullName || ''}"`,
        `"${t.priority}"`,
        t.deadline,
        STATUS_BADGE[t.status].label,
        t.status === 'Done' ? '+25' : t.status === 'Review' ? '+10' : '+25 (khi xong)',
      ];
    });
    const csv = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Dashboard_ECOMIT_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* 1. EXECUTIVE HERO BANNER + DEPARTMENT FILTER BAR */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 text-white p-6 shadow-md border border-indigo-500/20">
        <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-5">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-semibold text-blue-200 mb-2.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Hệ thống Quản trị &amp; Thống kê CLB ECOMIT — Đại học Lạc Hồng</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
               Trung Tâm Điều Hành &amp; Phân Tích Hiệu Suất CLB
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              Tổng hợp số liệu trực tiếp từ <strong>{events.length} Sự kiện trọng điểm</strong>,{' '}
              <strong>{tasks.length} hạng mục công việc</strong> và{' '}
              <strong>{members.length} nhân sự</strong> thuộc 4 Ban chuyên môn.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => openCreateTask()}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[17px]">add_circle</span>
              <span>Giao việc mới</span>
            </button>
            <button
              onClick={() => navigate('/tasks')}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/15 text-xs font-bold transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[17px]">view_kanban</span>
              <span>Bảng Kanban</span>
            </button>
            <button
              onClick={handleQuickExportCSV}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 border border-emerald-400/30 text-xs font-bold transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[17px]">download</span>
              <span>Xuất dữ liệu CSV</span>
            </button>
          </div>
        </div>

        {/* Quick Department Filter Pills inside Hero */}
        <div className="relative z-10 mt-5 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-xs font-semibold text-slate-300 mr-1.5">Lọc thống kê:</span>
            <button
              onClick={() => setSelectedDeptFilter('ALL')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedDeptFilter === 'ALL'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'bg-white/10 text-slate-200 hover:bg-white/20'
              }`}
            >
              Toàn CLB ({tasks.length} việc)
            </button>
            {DEPARTMENTS.map((dept) => {
              const count = tasks.filter((t) => t.department === dept).length;
              return (
                <button
                  key={dept}
                  onClick={() => setSelectedDeptFilter(dept)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedDeptFilter === dept
                      ? 'bg-blue-500 text-white shadow-sm'
                      : 'bg-white/10 text-slate-200 hover:bg-white/20'
                  }`}
                >
                  {dept} ({count})
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-300">
            <span>
              Điểm TB thành viên:{' '}
              <strong className="text-amber-300">{avgMemberPoints} điểm</strong>
            </span>
            <span>•</span>
            <span>
              Tỷ lệ hoàn tất:{' '}
              <strong className="text-emerald-300">{completionPct}%</strong>
            </span>
          </div>
        </div>
      </div>

      {/* 2. ROW 1: 4 PREMIUM KPI STAT CARDS WITH BREAKDOWN & PROGRESS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* KPI 1: Nhân sự & Đội ngũ */}
        <div
          onClick={() => navigate('/members')}
          className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-card hover:shadow-soft hover:border-indigo-300 cursor-pointer transition-all flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Nhân sự &amp; Đội ngũ
              </span>
              <div className="flex items-baseline gap-2 mt-1.5">
                <span className="text-3xl font-extrabold text-slate-900">
                  {scopedMembers.length}
                </span>
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                  {excellentCount} Xuất sắc
                </span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white flex items-center justify-center shadow-sm shadow-indigo-500/25">
              <span className="material-symbols-outlined text-[24px]">groups</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
              <span>Tỷ lệ đạt Xuất sắc / Tốt</span>
              <span className="font-bold text-slate-800">
                {scopedMembers.filter((m) => m.rankLabel === 'Xuất sắc' || m.rankLabel === 'Tốt').length}
                /{scopedMembers.length} TV
              </span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-600 rounded-full"
                style={{
                  width: `${
                    scopedMembers.length > 0
                      ? Math.round(
                          (scopedMembers.filter(
                            (m) => m.rankLabel === 'Xuất sắc' || m.rankLabel === 'Tốt'
                          ).length /
                            scopedMembers.length) *
                            100
                        )
                      : 0
                  }%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* KPI 2: Tiến độ Hoàn thành Công việc */}
        <div
          onClick={() => navigate('/tasks')}
          className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-card hover:shadow-soft hover:border-emerald-300 cursor-pointer transition-all flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Hoàn thành Công việc
              </span>
              <div className="flex items-baseline gap-2 mt-1.5">
                <span className="text-3xl font-extrabold text-emerald-600">
                  {completionPct}%
                </span>
                <span className="text-xs font-bold text-slate-500">
                  ({doneTasks}/{totalTasks} việc)
                </span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-sm shadow-emerald-500/25">
              <span className="material-symbols-outlined text-[24px]">task_alt</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
              <span>Tiến độ thực tế so với kế hoạch</span>
              <span className="font-bold text-emerald-600">{doneTasks} hoàn tất</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${completionPct}%` }}
              />
            </div>
          </div>
        </div>

        {/* KPI 3: Đang thực hiện & Chờ duyệt */}
        <div
          onClick={() => navigate('/tasks')}
          className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-card hover:shadow-soft hover:border-amber-300 cursor-pointer transition-all flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Đang làm &amp; Chờ duyệt
              </span>
              <div className="flex items-baseline gap-2 mt-1.5">
                <span className="text-3xl font-extrabold text-blue-600">
                  {inProgressTasks + reviewTasks}
                </span>
                <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                  {reviewTasks} chờ duyệt
                </span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-sm shadow-amber-500/25">
              <span className="material-symbols-outlined text-[24px]">pending_actions</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
              <span>Task ưu tiên Cao đã xử lý</span>
              <span className="font-bold text-rose-600">
                {highPriorityDone}/{highPriorityTasks} việc gấp
              </span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-500 rounded-full"
                style={{
                  width: `${
                    highPriorityTasks > 0
                      ? Math.round((highPriorityDone / highPriorityTasks) * 100)
                      : 100
                  }%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* KPI 4: Tổng Điểm Hoạt động & Chiến dịch */}
        <div
          onClick={() => navigate('/reports')}
          className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-card hover:shadow-soft hover:border-blue-300 cursor-pointer transition-all flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Tổng Điểm Hoạt Động
              </span>
              <div className="flex items-baseline gap-2 mt-1.5">
                <span className="text-3xl font-extrabold text-slate-900">
                  {totalClubPoints.toLocaleString('vi-VN')}
                </span>
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                  ~{avgMemberPoints} đ/TV
                </span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white flex items-center justify-center shadow-sm shadow-blue-500/25">
              <span className="material-symbols-outlined text-[24px]">military_tech</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
              <span>Sự kiện lớn đang triển khai</span>
              <span className="font-bold text-blue-600">{events.length} chiến dịch</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 rounded-full w-4/5" />
            </div>
          </div>
        </div>
      </div>

      {/* 3. ROW 2: ANALYTICS & VISUAL CHARTS SUITE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left (5 cols): Biểu đồ Trạng thái Công việc + Phân tích Mức độ Ưu tiên */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/90 shadow-card p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">
                  Phân Bổ Trạng Thái &amp; Độ Ưu Tiên
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Tỷ trọng {totalTasks} công việc theo tiến độ thực tế
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-lg text-xs font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                {completionPct}% Xong
              </span>
            </div>

            {/* Donut Chart + Status Breakdown */}
            <div className="flex flex-col sm:flex-row items-center justify-around gap-6 py-5">
              <div
                className="relative w-36 h-36 rounded-full flex items-center justify-center shrink-0 shadow-sm"
                style={{ background: donutGradient }}
              >
                <div className="w-24 h-24 rounded-full bg-white flex flex-col items-center justify-center shadow-inner">
                  <span className="text-2xl font-extrabold text-slate-900">
                    {totalTasks}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-400">
                    Tổng Task
                  </span>
                </div>
              </div>

              <div className="space-y-2.5 text-xs flex-1 w-full max-w-[220px]">
                <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-50/60 border border-emerald-100">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-sm bg-emerald-500" />
                    <span className="text-slate-700 font-semibold">Hoàn thành</span>
                  </div>
                  <span className="font-extrabold text-emerald-700">
                    {doneTasks} ({totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0}%)
                  </span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-xl bg-amber-50/60 border border-amber-100">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-sm bg-amber-500" />
                    <span className="text-slate-700 font-semibold">Chờ duyệt</span>
                  </div>
                  <span className="font-extrabold text-amber-700">
                    {reviewTasks} ({totalTasks > 0 ? Math.round((reviewTasks / totalTasks) * 100) : 0}%)
                  </span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-xl bg-blue-50/60 border border-blue-100">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-sm bg-blue-600" />
                    <span className="text-slate-700 font-semibold">Đang thực hiện</span>
                  </div>
                  <span className="font-extrabold text-blue-700">
                    {inProgressTasks} (
                    {totalTasks > 0 ? Math.round((inProgressTasks / totalTasks) * 100) : 0}%)
                  </span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200/70">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-sm bg-slate-400" />
                    <span className="text-slate-700 font-semibold">Chưa mở</span>
                  </div>
                  <span className="font-extrabold text-slate-700">
                    {todoTasks} ({totalTasks > 0 ? Math.round((todoTasks / totalTasks) * 100) : 0}%)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Priority Breakdown Mini-Section */}
          <div className="pt-3.5 border-t border-slate-100">
            <div className="text-xs font-bold text-slate-700 mb-2">
              Thống kê theo Mức độ Ưu tiên:
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2.5 rounded-xl bg-rose-50/70 border border-rose-200/60">
                <div className="text-base font-extrabold text-rose-600">
                  {highPriorityTasks}
                </div>
                <div className="text-[11px] font-semibold text-rose-700">Ưu tiên Cao</div>
              </div>
              <div className="p-2.5 rounded-xl bg-sky-50/70 border border-sky-200/60">
                <div className="text-base font-extrabold text-sky-600">
                  {mediumPriorityTasks}
                </div>
                <div className="text-[11px] font-semibold text-sky-700">Trung bình</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="text-base font-extrabold text-slate-700">
                  {lowPriorityTasks}
                </div>
                <div className="text-[11px] font-semibold text-slate-500">Ưu tiên Thấp</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right (7 cols): Biểu đồ Hiệu suất & Ma trận Thống kê 4 Ban Chuyên Môn */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 shadow-card p-5 flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3.5 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">
                  Biểu Đồ So Sánh Hiệu Suất 4 Ban Chuyên Môn
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Tỷ lệ hoàn thành công việc, số lượng nhân sự và điểm trung bình từng Ban
                </p>
              </div>
              <div className="flex items-center gap-3 text-[11px] font-semibold text-slate-500">
                <span className="inline-flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" /> Xong
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-sm bg-amber-500" /> Duyệt
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-sm bg-blue-600" /> Đang làm
                </span>
              </div>
            </div>

            {/* Visual Column Chart for 4 Departments */}
            <div className="grid grid-cols-4 gap-4 items-end h-44 pt-5 px-2">
              {DEPARTMENTS.map((dept) => {
                const dTasks = tasks.filter((t) => t.department === dept);
                const dDone = dTasks.filter((t) => t.status === 'Done').length;
                const dReview = dTasks.filter((t) => t.status === 'Review').length;
                const dProg = dTasks.filter((t) => t.status === 'InProgress').length;
                const dTotal = dTasks.length;
                const pct = dTotal > 0 ? Math.round((dDone / dTotal) * 100) : 0;
                const theme = DEPT_THEME[dept];

                return (
                  <div
                    key={dept}
                    onClick={() =>
                      setSelectedDeptFilter(selectedDeptFilter === dept ? 'ALL' : dept)
                    }
                    className="flex flex-col items-center h-full justify-end cursor-pointer group"
                  >
                    <div className="text-xs font-extrabold text-slate-900 mb-1">
                      {pct}%
                    </div>
                    <div className="w-full max-w-[64px] h-28 bg-slate-100 rounded-xl overflow-hidden flex flex-col justify-end p-1 border border-slate-200/70 group-hover:ring-2 ring-blue-300 transition-all">
                      <div
                        className={`w-full rounded-lg bg-gradient-to-t ${theme.gradient} transition-all duration-500`}
                        style={{ height: `${Math.max(pct, 15)}%` }}
                      />
                    </div>
                    <span className="text-xs font-extrabold text-slate-800 mt-2 text-center truncate w-full">
                      {dept.replace('Ban ', '')}
                    </span>
                    <span className="text-[11px] font-medium text-slate-400">
                      {dDone}/{dTotal} xong • {dProg + dReview} xử lý
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mini Summary Matrix of 4 Departments below the bars */}
          <div className="mt-4 pt-3.5 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {DEPARTMENTS.map((dept) => {
              const deptMems = memberStats.filter((m) => m.member.department === dept);
              const avgPts =
                deptMems.length > 0
                  ? Math.round(
                      deptMems.reduce((s, m) => s + m.totalPoints, 0) / deptMems.length
                    )
                  : 0;
              const theme = DEPT_THEME[dept];
              return (
                <div
                  key={dept}
                  className={`p-2.5 rounded-xl border ${theme.border} ${theme.bg} flex flex-col justify-between`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-[11px] font-extrabold ${theme.text} truncate`}>
                      {dept.replace('Ban ', '')}
                    </span>
                    <span className="material-symbols-outlined text-[15px] opacity-75">
                      {theme.icon}
                    </span>
                  </div>
                  <div className="mt-1.5 flex items-baseline justify-between text-xs">
                    <span className="text-slate-600 font-medium">{deptMems.length} TV</span>
                    <span className={`font-extrabold ${theme.text}`}>TB: {avgPts}đ</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. ROW 3: TIẾN ĐỘ CHIẾN DỊCH / SỰ KIỆN LỚN + BẢNG XẾP HẠNG TOP 5 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left (7 cols): Tiến độ các Sự kiện / Dự án trọng điểm */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 shadow-card overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">
                Tiến Độ Các Sự Kiện &amp; Chiến Dịch Trọng Điểm
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Cấu trúc phân cấp Sự kiện lớn → Các công việc thành phần (Sub-tasks)
              </p>
            </div>
            <button
              onClick={() => navigate('/tasks')}
              className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold transition-colors"
            >
              Quản lý Sự kiện →
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {eventStats.map((st) => {
              const { event } = st;
              const lead = members.find((m) => m.id === event.leadId);
              const evTasks = tasks.filter((t) => t.eventId === event.id);
              const inProg = evTasks.filter((t) => t.status === 'InProgress').length;
              const rev = evTasks.filter((t) => t.status === 'Review').length;

              return (
                <div
                  key={event.id}
                  onClick={() => navigate('/tasks')}
                  className="px-5 py-4 hover:bg-slate-50/90 cursor-pointer transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded-md text-[11px] font-extrabold bg-indigo-50 text-indigo-700 border border-indigo-200">
                        {event.code}
                      </span>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-600">
                        {event.category}
                      </span>
                      <h4 className="text-sm font-extrabold text-slate-900 truncate">
                        {event.title}
                      </h4>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1.5">
                      <div className="inline-flex items-center gap-1.5">
                        {renderAvatar(lead, 'w-5 h-5')}
                        <span className="font-semibold text-slate-700">
                          {lead?.fullName}
                        </span>
                      </div>
                      <span>• Hạn: {event.endDate}</span>
                      <span className="text-emerald-600 font-semibold">
                        • {st.doneTasks} xong
                      </span>
                      {inProg + rev > 0 && (
                        <span className="text-amber-600 font-semibold">
                          • {inProg + rev} đang xử lý
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="w-32">
                      <div className="flex justify-between text-xs font-extrabold text-slate-700 mb-1">
                        <span>
                          {st.doneTasks}/{st.totalTasks} việc
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
                      type="button"
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
        </div>

        {/* Right (5 cols): Top 5 Thành viên Xuất sắc */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/90 shadow-card overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">
                Bảng Vàng Thành Viên Tiêu Biểu
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Xếp hạng theo điểm hoàn thành công việc &amp; đóng góp
              </p>
            </div>
            <button
              onClick={() => navigate('/reports')}
              className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold transition-colors"
            >
              Xem tất cả →
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {filteredTableMembers.slice(0, 5).map((stat, idx) => {
              const deptTheme = DEPT_THEME[stat.member.department];
              return (
                <div
                  key={stat.member.id}
                  onClick={() => navigate('/members')}
                  className="px-5 py-3.5 hover:bg-slate-50 cursor-pointer transition-colors flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`w-6 h-6 rounded-full text-xs font-extrabold flex items-center justify-center shrink-0 ${
                        idx === 0
                          ? 'bg-amber-400 text-slate-950 shadow-sm'
                          : idx === 1
                          ? 'bg-slate-300 text-slate-900'
                          : idx === 2
                          ? 'bg-amber-700 text-white'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {idx + 1}
                    </span>
                    {renderAvatar(stat.member, 'w-10 h-10')}
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-900 truncate">
                        {stat.member.fullName}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${deptTheme.bg} ${deptTheme.text}`}
                        >
                          {deptTheme.short.replace('Ban ', '')}
                        </span>
                        <span className="text-xs text-slate-400">
                          • {stat.doneTasks}/{stat.totalTasks} việc xong
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-sm font-extrabold text-blue-600 bg-blue-50 border border-blue-200/60 px-2.5 py-1 rounded-xl">
                      {stat.totalPoints} đ
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 5. ROW 4: BẢNG DASHBOARD ĐIỀU HÀNH TRỰC TUYẾN (FULL-WIDTH INTERACTIVE DATA TABLE) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-card overflow-hidden">
        {/* Table Header with 3 Tabs + Search + Filter */}
        <div className="p-5 border-b border-slate-200/80 bg-slate-50/50 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveTableTab('tasks')}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                activeTableTab === 'tasks'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">table_chart</span>
              <span>Bảng Theo Dõi Công Việc ({scopedTasks.length})</span>
            </button>

            <button
              onClick={() => setActiveTableTab('members')}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                activeTableTab === 'members'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">leaderboard</span>
              <span>Bảng Thống Kê Nhân Sự &amp; Điểm ({scopedMembers.length})</span>
            </button>

            <button
              onClick={() => setActiveTableTab('events')}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                activeTableTab === 'events'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">analytics</span>
              <span>Bảng Tổng Hợp 4 Ban Chuyên Môn (4)</span>
            </button>
          </div>

          {/* Search & Status Filter inside Dashboard Table */}
          <div className="flex flex-wrap items-center gap-2.5">
            {activeTableTab === 'tasks' && (
              <select
                value={taskStatusFilter}
                onChange={(e) => setTaskStatusFilter(e.target.value)}
                className="h-9 px-3 text-xs font-bold bg-white border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-blue-500"
              >
                <option value="ALL">Tất cả trạng thái ({scopedTasks.length})</option>
                <option value="Review">Chờ duyệt ({reviewTasks})</option>
                <option value="InProgress">Đang làm ({inProgressTasks})</option>
                <option value="Todo">Chưa mở ({todoTasks})</option>
                <option value="Done">Hoàn thành ({doneTasks})</option>
              </select>
            )}

            <div className="relative w-full sm:w-60">
              <span className="material-symbols-outlined text-[16px] text-slate-400 absolute left-3 top-1/2 -translate-y-1/2">
                search
              </span>
              <input
                type="text"
                value={tableSearch}
                onChange={(e) => setTableSearch(e.target.value)}
                placeholder="Tìm mã task, tên việc, thành viên..."
                className="w-full h-9 pl-9 pr-3 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-slate-800"
              />
            </div>
          </div>
        </div>

        {/* TAB 1 CONTENT: BẢNG THEO DÕI CÔNG VIỆC CHI TIẾT */}
        {activeTableTab === 'tasks' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Mã</th>
                  <th className="py-3.5 px-4">Hạng mục Công việc</th>
                  <th className="py-3.5 px-4">Sự kiện chính</th>
                  <th className="py-3.5 px-4">Ban chuyên môn</th>
                  <th className="py-3.5 px-4">Người phụ trách</th>
                  <th className="py-3.5 px-4 text-center">Ưu tiên</th>
                  <th className="py-3.5 px-4">Hạn chót</th>
                  <th className="py-3.5 px-4 text-center">Điểm</th>
                  <th className="py-3.5 px-4">Trạng thái (Đổi nhanh)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredTableTasks.map((task) => {
                  const assignee = members.find((m) => m.id === task.assigneeId);
                  const parentEv = getEventById(task.eventId);
                  const deptTheme = DEPT_THEME[task.department];
                  const stBadge = STATUS_BADGE[task.status];

                  return (
                    <tr
                      key={task.id}
                      onClick={() => setActiveTaskModalId(task.id)}
                      className="hover:bg-blue-50/30 cursor-pointer transition-colors"
                    >
                      <td className="py-3.5 px-4 font-mono text-xs font-extrabold text-slate-500">
                        {task.code}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{task.title}</div>
                        {task.resultLink && (
                          <span className="inline-flex items-center gap-1 text-[11px] text-blue-600 font-semibold mt-0.5">
                            <span className="material-symbols-outlined text-[13px]">
                              link
                            </span>
                            Đã đính kèm link kết quả
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-50/80 text-indigo-700 border border-indigo-200/60">
                          {parentEv?.title || 'Việc chung CLB'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${deptTheme.bg} ${deptTheme.text} ${deptTheme.border}`}
                        >
                          {deptTheme.short.replace('Ban ', '')}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          {renderAvatar(assignee, 'w-7 h-7')}
                          <div>
                            <div className="text-xs font-bold text-slate-900">
                              {assignee?.fullName || 'Chưa phân công'}
                            </div>
                            <div className="text-[10px] text-slate-400">
                              {assignee?.role}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold border ${
                            PRIORITY_BADGE[task.priority] || PRIORITY_BADGE['Trung bình']
                          }`}
                        >
                          {task.priority}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-xs font-semibold text-slate-600">
                        {task.deadline}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="text-xs font-extrabold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                          {task.status === 'Done' ? '+25đ' : '+25đ'}
                        </span>
                      </td>
                      <td
                        className="py-3.5 px-4"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <select
                          value={task.status}
                          onChange={(e) =>
                            updateTaskStatus(task.id, e.target.value as TaskStatus)
                          }
                          className={`px-2.5 py-1.5 rounded-xl text-xs font-bold border cursor-pointer focus:outline-none ${stBadge.cls}`}
                        >
                          <option value="Todo">Chưa mở</option>
                          <option value="InProgress">Đang làm</option>
                          <option value="Review">Chờ duyệt</option>
                          <option value="Done">Hoàn thành</option>
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 2 CONTENT: BẢNG THỐNG KÊ NHÂN SỰ & ĐIỂM */}
        {activeTableTab === 'members' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Hạng</th>
                  <th className="py-3.5 px-4">Thành viên</th>
                  <th className="py-3.5 px-4">Ban chuyên môn</th>
                  <th className="py-3.5 px-4">Chức vụ</th>
                  <th className="py-3.5 px-4 text-center">Đã giao</th>
                  <th className="py-3.5 px-4 text-center">Hoàn thành</th>
                  <th className="py-3.5 px-4">Tỷ lệ hoàn thành</th>
                  <th className="py-3.5 px-4 text-right">Tổng điểm</th>
                  <th className="py-3.5 px-4 text-center">Xếp loại</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredTableMembers.map((stat, idx) => {
                  const deptTheme = DEPT_THEME[stat.member.department];
                  return (
                    <tr
                      key={stat.member.id}
                      onClick={() => navigate('/members')}
                      className="hover:bg-slate-50/80 cursor-pointer"
                    >
                      <td className="py-3.5 px-4 font-extrabold text-slate-600 text-xs">
                        #{idx + 1}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          {renderAvatar(stat.member, 'w-8 h-8')}
                          <div>
                            <div className="font-bold text-slate-900 text-sm">
                              {stat.member.fullName}
                            </div>
                            <div className="text-[11px] text-slate-400">
                              MSSV: {stat.member.studentId} • Lớp {stat.member.classCode}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${deptTheme.bg} ${deptTheme.text} ${deptTheme.border}`}
                        >
                          {deptTheme.short}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-xs font-semibold text-slate-700">
                        {stat.member.role}
                      </td>
                      <td className="py-3.5 px-4 text-center font-bold text-slate-700">
                        {stat.totalTasks}
                      </td>
                      <td className="py-3.5 px-4 text-center font-extrabold text-emerald-600">
                        {stat.doneTasks}
                      </td>
                      <td className="py-3.5 px-4 w-44">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${deptTheme.bar}`}
                              style={{ width: `${stat.completionRate}%` }}
                            />
                          </div>
                          <span className="text-xs font-bold text-slate-700 w-9 text-right">
                            {stat.completionRate}%
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-right font-extrabold text-blue-600">
                        {stat.totalPoints} đ
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${
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
        )}

        {/* TAB 3 CONTENT: BẢNG TỔNG HỢP 4 BAN CHUYÊN MÔN */}
        {activeTableTab === 'events' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-5">Ban chuyên môn</th>
                  <th className="py-3.5 px-4 text-center">Nhân sự</th>
                  <th className="py-3.5 px-4 text-center">Tổng công việc</th>
                  <th className="py-3.5 px-4 text-center">Đã hoàn thành</th>
                  <th className="py-3.5 px-4 text-center">Đang làm</th>
                  <th className="py-3.5 px-4 text-center">Chờ duyệt</th>
                  <th className="py-3.5 px-4 text-center">Tổng điểm Ban</th>
                  <th className="py-3.5 px-5">Tiến độ hoàn thành</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {DEPARTMENTS.map((dept) => {
                  const deptMems = memberStats.filter((m) => m.member.department === dept);
                  const dTasks = tasks.filter((t) => t.department === dept);
                  const dDone = dTasks.filter((t) => t.status === 'Done').length;
                  const dProg = dTasks.filter((t) => t.status === 'InProgress').length;
                  const dRev = dTasks.filter((t) => t.status === 'Review').length;
                  const dPts = deptMems.reduce((s, m) => s + m.totalPoints, 0);
                  const dRate =
                    dTasks.length > 0 ? Math.round((dDone / dTasks.length) * 100) : 0;
                  const theme = DEPT_THEME[dept];

                  return (
                    <tr key={dept} className="hover:bg-slate-50/80">
                      <td className="py-4 px-5">
                        <span
                          className={`px-3 py-1 rounded-xl text-xs font-extrabold border ${theme.bg} ${theme.text} ${theme.border}`}
                        >
                          {dept}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center font-bold text-slate-700">
                        {deptMems.length} thành viên
                      </td>
                      <td className="py-4 px-4 text-center font-extrabold text-slate-900">
                        {dTasks.length}
                      </td>
                      <td className="py-4 px-4 text-center font-extrabold text-emerald-600">
                        {dDone}
                      </td>
                      <td className="py-4 px-4 text-center font-bold text-blue-600">
                        {dProg}
                      </td>
                      <td className="py-4 px-4 text-center font-bold text-amber-600">
                        {dRev}
                      </td>
                      <td className="py-4 px-4 text-center font-extrabold text-indigo-600">
                        {dPts} điểm
                      </td>
                      <td className="py-4 px-5 w-56">
                        <div className="flex items-center gap-2.5">
                          <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${theme.bar}`}
                              style={{ width: `${dRate}%` }}
                            />
                          </div>
                          <span className="text-xs font-extrabold text-slate-800 w-10 text-right">
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
        )}
      </div>
    </div>
  );
};
