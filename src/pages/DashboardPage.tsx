import React, { useState } from 'react';
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
  {
    short: string;
    color: string;
    lightColor: string;
    bg: string;
    text: string;
  }
> = {
  'Ban Chủ nhiệm': {
    short: 'Chủ nhiệm',
    color: '#6366f1',
    lightColor: '#e0e7ff',
    bg: 'bg-indigo-50',
    text: 'text-indigo-700',
  },
  'Ban Truyền thông': {
    short: 'Truyền thông',
    color: '#2563eb',
    lightColor: '#dbeafe',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
  },
  'Ban Kỹ thuật': {
    short: 'Kỹ thuật',
    color: '#10b981',
    lightColor: '#d1fae5',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
  },
  'Ban Sự kiện & Host': {
    short: 'Sự kiện',
    color: '#f59e0b',
    lightColor: '#fef3c7',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
  },
};

const renderAvatar = (member: Member | undefined, size = 'w-10 h-10') => {
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
  } = useEcomit();

  const [deptFilter, setDeptFilter] = useState<string>('ALL');

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

  // SVG Donut Calculations (r = 70, circumference = 439.82)
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const doneLen = totalTasks > 0 ? (doneTasks / totalTasks) * circumference : 0;
  const reviewLen = totalTasks > 0 ? (reviewTasks / totalTasks) * circumference : 0;
  const progLen = totalTasks > 0 ? (inProgressTasks / totalTasks) * circumference : 0;
  const todoLen = totalTasks > 0 ? (todoTasks / totalTasks) * circumference : 0;

  // Dữ liệu đường xu hướng hoạt động 6 tuần (SVG Area Spline Chart)
  const weeklyTrend = [
    { label: 'T1', done: Math.max(1, Math.round(doneTasks * 0.25)), total: Math.max(2, Math.round(totalTasks * 0.35)) },
    { label: 'T2', done: Math.max(2, Math.round(doneTasks * 0.42)), total: Math.max(4, Math.round(totalTasks * 0.5)) },
    { label: 'T3', done: Math.max(3, Math.round(doneTasks * 0.58)), total: Math.max(6, Math.round(totalTasks * 0.68)) },
    { label: 'T4', done: Math.max(4, Math.round(doneTasks * 0.75)), total: Math.max(8, Math.round(totalTasks * 0.82)) },
    { label: 'T5', done: Math.max(5, Math.round(doneTasks * 0.9)), total: Math.max(10, Math.round(totalTasks * 0.92)) },
    { label: 'T6', done: doneTasks, total: totalTasks },
  ];
  const maxTrendVal = Math.max(...weeklyTrend.map((d) => d.total), 10);

  // Tọa độ SVG cho biểu đồ vùng (Width: 560, Height: 190, Padding: 32)
  const chartW = 540;
  const chartH = 170;
  const padX = 36;
  const padY = 20;
  const usableW = chartW - padX * 2;
  const usableH = chartH - padY * 2;

  const donePoints = weeklyTrend.map((pt, i) => {
    const x = padX + (i / (weeklyTrend.length - 1)) * usableW;
    const y = padY + usableH - (pt.done / maxTrendVal) * usableH;
    return { x, y, val: pt.done, label: pt.label };
  });

  const totalPointsCoords = weeklyTrend.map((pt, i) => {
    const x = padX + (i / (weeklyTrend.length - 1)) * usableW;
    const y = padY + usableH - (pt.total / maxTrendVal) * usableH;
    return { x, y, val: pt.total, label: pt.label };
  });

  const buildSmoothPath = (pts: { x: number; y: number }[]) => {
    if (pts.length === 0) return '';
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const xc = (pts[i].x + pts[i + 1].x) / 2;
      d += ` C ${xc} ${pts[i].y}, ${xc} ${pts[i + 1].y}, ${pts[i + 1].x} ${pts[i + 1].y}`;
    }
    return d;
  };

  const doneLinePath = buildSmoothPath(donePoints);
  const totalLinePath = buildSmoothPath(totalPointsCoords);
  const doneAreaPath = `${doneLinePath} L ${donePoints[donePoints.length - 1].x} ${padY + usableH} L ${donePoints[0].x} ${padY + usableH} Z`;
  const totalAreaPath = `${totalLinePath} L ${totalPointsCoords[totalPointsCoords.length - 1].x} ${padY + usableH} L ${totalPointsCoords[0].x} ${padY + usableH} Z`;

  const topMembers = [...scopedMembers]
    .sort((a, b) => b.totalPoints - a.totalPoints)
    .slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Filter Pills */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex items-center gap-1.5 p-1.5 rounded-2xl bg-white border border-slate-200/80 shadow-card">
          <button
            onClick={() => setDeptFilter('ALL')}
            className={`px-4 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              deptFilter === 'ALL'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Toàn CLB
          </button>
          {DEPARTMENTS.map((dept) => (
            <button
              key={dept}
              onClick={() => setDeptFilter(dept)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                deptFilter === dept
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {DEPT_THEME[dept].short}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/tasks')}
            className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/80 text-xs font-bold shadow-card inline-flex items-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px] text-blue-600">
              view_kanban
            </span>
            <span>Mở Kanban</span>
          </button>
        </div>
      </div>

      {/* ROW 1: 4 VISUAL KPI CARDS WITH MINI SVG GAUGES & SPARKLINES */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Card 1: Tiến độ Hoàn thành (with SVG Circular Ring) */}
        <div
          onClick={() => navigate('/tasks')}
          className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-card hover:shadow-soft transition-all cursor-pointer flex items-center justify-between"
        >
          <div>
            <span className="text-xs font-bold text-slate-400">Hoàn thành</span>
            <div className="text-3xl font-black text-emerald-600 mt-1">
              {completionPct}%
            </div>
            <span className="text-[11px] font-bold text-slate-400">
              {doneTasks}/{totalTasks} tasks
            </span>
          </div>
          <svg className="w-16 h-16 -rotate-90 shrink-0" viewBox="0 0 64 64">
            <circle
              cx="32"
              cy="32"
              r="26"
              fill="none"
              stroke="#ecfdf5"
              strokeWidth="7"
            />
            <circle
              cx="32"
              cy="32"
              r="26"
              fill="none"
              stroke="#10b981"
              strokeWidth="7"
              strokeLinecap="round"
              strokeDasharray={`${(completionPct / 100) * 163.36} 163.36`}
            />
          </svg>
        </div>

        {/* Card 2: Nhân sự (with Mini SVG Bar Sparkline) */}
        <div
          onClick={() => navigate('/members')}
          className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-card hover:shadow-soft transition-all cursor-pointer flex items-center justify-between"
        >
          <div>
            <span className="text-xs font-bold text-slate-400">Thành viên</span>
            <div className="text-3xl font-black text-slate-900 mt-1">
              {scopedMembers.length}
            </div>
            <span className="text-[11px] font-bold text-indigo-600">4 Ban chuyên môn</span>
          </div>
          <div className="flex items-end gap-1.5 h-12 px-2">
            <div className="w-2.5 h-6 rounded-full bg-indigo-200" />
            <div className="w-2.5 h-9 rounded-full bg-indigo-400" />
            <div className="w-2.5 h-12 rounded-full bg-indigo-600" />
            <div className="w-2.5 h-8 rounded-full bg-blue-500" />
          </div>
        </div>

        {/* Card 3: Đang chạy & Chờ duyệt */}
        <div
          onClick={() => navigate('/tasks')}
          className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-card hover:shadow-soft transition-all cursor-pointer flex items-center justify-between"
        >
          <div>
            <span className="text-xs font-bold text-slate-400">Đang xử lý</span>
            <div className="text-3xl font-black text-blue-600 mt-1">
              {inProgressTasks + reviewTasks}
            </div>
            <span className="text-[11px] font-bold text-amber-600">
              {reviewTasks} chờ duyệt
            </span>
          </div>
          <svg className="w-16 h-12 shrink-0" viewBox="0 0 80 48">
            <path
              d="M4 38 Q 22 18, 38 28 T 76 10"
              fill="none"
              stroke="#f59e0b"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <circle cx="76" cy="10" r="4.5" fill="#f59e0b" />
          </svg>
        </div>

        {/* Card 4: Tổng điểm CLB */}
        <div
          onClick={() => navigate('/reports')}
          className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-card hover:shadow-soft transition-all cursor-pointer flex items-center justify-between"
        >
          <div>
            <span className="text-xs font-bold text-slate-400">Điểm hoạt động</span>
            <div className="text-3xl font-black text-slate-900 mt-1">
              {totalPoints}
            </div>
            <span className="text-[11px] font-bold text-blue-600">
              {events.length} Sự kiện lớn
            </span>
          </div>
          <svg className="w-16 h-12 shrink-0" viewBox="0 0 80 48">
            <path
              d="M4 40 C 20 35, 35 15, 52 22 C 65 26, 70 8, 76 6"
              fill="none"
              stroke="#2563eb"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <circle cx="76" cy="6" r="4.5" fill="#2563eb" />
          </svg>
        </div>
      </div>

      {/* ROW 2: 2 TRUE SVG INTERACTIVE CHARTS (AREA SPLINE CHART + MULTI-RING SVG DONUT) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* CHART 1 (7 cols): SVG Smooth Area & Line Chart — Xu hướng Tiến độ Công việc */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/80 shadow-card p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">
                Biểu đồ Xu hướng Công việc
              </h3>
            </div>
            <div className="flex items-center gap-4 text-xs font-bold">
              <span className="inline-flex items-center gap-1.5 text-slate-500">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-400" /> Tổng giao
              </span>
              <span className="inline-flex items-center gap-1.5 text-emerald-600">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Hoàn thành
              </span>
            </div>
          </div>

          <div className="w-full overflow-hidden pt-2">
            <svg
              viewBox={`0 0 ${chartW} ${chartH + 18}`}
              className="w-full h-52 overflow-visible"
            >
              <defs>
                <linearGradient id="totalGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity="0.22" />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="doneGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.32" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Horizontal Gridlines */}
              {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
                const y = padY + ratio * usableH;
                const val = Math.round(maxTrendVal * (1 - ratio));
                return (
                  <g key={idx}>
                    <line
                      x1={padX}
                      y1={y}
                      x2={chartW - padX}
                      y2={y}
                      stroke="#f1f5f9"
                      strokeWidth="1.5"
                      strokeDasharray="4 4"
                    />
                    <text
                      x={8}
                      y={y + 4}
                      fontSize="10"
                      fontWeight="700"
                      fill="#94a3b8"
                    >
                      {val}
                    </text>
                  </g>
                );
              })}

              {/* Area Fills */}
              <path d={totalAreaPath} fill="url(#totalGrad)" />
              <path d={doneAreaPath} fill="url(#doneGrad)" />

              {/* Smooth Bezier Lines */}
              <path
                d={totalLinePath}
                fill="none"
                stroke="#818cf8"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <path
                d={doneLinePath}
                fill="none"
                stroke="#10b981"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* Data Nodes & X-Axis Labels */}
              {totalPointsCoords.map((pt, i) => (
                <g key={`tot-${i}`}>
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="4"
                    fill="#ffffff"
                    stroke="#6366f1"
                    strokeWidth="2.5"
                  />
                </g>
              ))}

              {donePoints.map((pt, i) => (
                <g key={`done-${i}`}>
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="5"
                    fill="#10b981"
                    stroke="#ffffff"
                    strokeWidth="2"
                  />
                  <text
                    x={pt.x}
                    y={pt.y - 10}
                    textAnchor="middle"
                    fontSize="10"
                    fontWeight="800"
                    fill="#059669"
                  >
                    {pt.val}
                  </text>
                  <text
                    x={pt.x}
                    y={chartH + 12}
                    textAnchor="middle"
                    fontSize="11"
                    fontWeight="700"
                    fill="#64748b"
                  >
                    {pt.label}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>

        {/* CHART 2 (5 cols): True SVG Multi-Segment Donut Chart */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/80 shadow-card p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-slate-900">
              Cơ cấu Trạng thái
            </h3>
            <span className="px-2.5 py-0.5 rounded-lg text-xs font-extrabold bg-emerald-50 text-emerald-600">
              {completionPct}% Xong
            </span>
          </div>

          <div className="flex items-center justify-around gap-4 my-auto py-2">
            <div className="relative w-44 h-44 flex items-center justify-center shrink-0">
              <svg className="w-44 h-44 -rotate-90" viewBox="0 0 180 180">
                <circle
                  cx="90"
                  cy="90"
                  r={radius}
                  fill="none"
                  stroke="#f1f5f9"
                  strokeWidth="18"
                />
                {/* Todo Segment */}
                <circle
                  cx="90"
                  cy="90"
                  r={radius}
                  fill="none"
                  stroke="#cbd5e1"
                  strokeWidth="18"
                  strokeDasharray={`${todoLen} ${circumference}`}
                  strokeDashoffset={-(doneLen + reviewLen + progLen)}
                />
                {/* InProgress Segment */}
                <circle
                  cx="90"
                  cy="90"
                  r={radius}
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="18"
                  strokeDasharray={`${progLen} ${circumference}`}
                  strokeDashoffset={-(doneLen + reviewLen)}
                />
                {/* Review Segment */}
                <circle
                  cx="90"
                  cy="90"
                  r={radius}
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="18"
                  strokeDasharray={`${reviewLen} ${circumference}`}
                  strokeDashoffset={-doneLen}
                />
                {/* Done Segment */}
                <circle
                  cx="90"
                  cy="90"
                  r={radius}
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="18"
                  strokeDasharray={`${doneLen} ${circumference}`}
                  strokeDashoffset={0}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-slate-900">{totalTasks}</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Tasks
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5 flex-1 max-w-[190px]">
              <div className="p-3 rounded-2xl bg-emerald-50/80">
                <div className="text-xl font-black text-emerald-600">{doneTasks}</div>
                <div className="text-[11px] font-bold text-slate-500">Hoàn thành</div>
              </div>
              <div className="p-3 rounded-2xl bg-amber-50/80">
                <div className="text-xl font-black text-amber-600">{reviewTasks}</div>
                <div className="text-[11px] font-bold text-slate-500">Chờ duyệt</div>
              </div>
              <div className="p-3 rounded-2xl bg-blue-50/80">
                <div className="text-xl font-black text-blue-600">{inProgressTasks}</div>
                <div className="text-[11px] font-bold text-slate-500">Đang làm</div>
              </div>
              <div className="p-3 rounded-2xl bg-slate-100">
                <div className="text-xl font-black text-slate-600">{todoTasks}</div>
                <div className="text-[11px] font-bold text-slate-500">Chưa mở</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ROW 3: GROUPED BAR CHART 4 BAN + VISUAL EVENT TIMELINE & PODIUM */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* CHART 3 (6 cols): Biểu đồ Cột Đôi 4 Ban Có Lưới Tọa Độ */}
        <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-200/80 shadow-card p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-extrabold text-slate-900">
              Biểu đồ Hiệu suất 4 Ban
            </h3>
            <div className="flex items-center gap-3 text-[11px] font-bold text-slate-400">
              <span className="inline-flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-sm bg-blue-600" /> Xong
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-sm bg-slate-200" /> Tổng giao
              </span>
            </div>
          </div>

          <div className="relative h-52 pt-6 px-2 flex flex-col justify-end">
            {/* Y-Axis Gridlines */}
            <div className="absolute inset-x-2 top-4 bottom-8 flex flex-col justify-between pointer-events-none">
              {[100, 75, 50, 25, 0].map((tick) => (
                <div
                  key={tick}
                  className="w-full border-b border-dashed border-slate-100 flex items-center"
                >
                  <span className="text-[10px] font-bold text-slate-300 -mt-3">
                    {tick}%
                  </span>
                </div>
              ))}
            </div>

            {/* Bars */}
            <div className="relative z-10 grid grid-cols-4 gap-4 items-end h-36 pl-7">
              {DEPARTMENTS.map((dept) => {
                const dTasks = tasks.filter((t) => t.department === dept);
                const dDone = dTasks.filter((t) => t.status === 'Done').length;
                const dTotal = dTasks.length;
                const pct = dTotal > 0 ? Math.round((dDone / dTotal) * 100) : 0;
                const totalHeightPct = Math.min(100, Math.max(30, dTotal * 22));
                const theme = DEPT_THEME[dept];

                return (
                  <div
                    key={dept}
                    onClick={() => setDeptFilter(deptFilter === dept ? 'ALL' : dept)}
                    className="flex flex-col items-center h-full justify-end cursor-pointer group"
                  >
                    <span className="text-xs font-black text-slate-800 mb-1">
                      {pct}%
                    </span>
                    <div className="flex items-end gap-1.5 h-full w-full justify-center">
                      {/* Total Assigned Bar */}
                      <div
                        className="w-4 rounded-t-lg transition-all duration-500"
                        style={{
                          height: `${totalHeightPct}%`,
                          backgroundColor: theme.lightColor,
                        }}
                        title={`Tổng: ${dTotal}`}
                      />
                      {/* Completed Bar */}
                      <div
                        className="w-6 rounded-t-xl transition-all duration-500 shadow-sm group-hover:brightness-110"
                        style={{
                          height: `${Math.max(pct, 12)}%`,
                          backgroundColor: theme.color,
                        }}
                        title={`Hoàn thành: ${dDone}/${dTotal}`}
                      />
                    </div>
                    <span className="text-xs font-extrabold text-slate-700 mt-2 truncate">
                      {theme.short}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* CHART 4 (6 cols): Biểu đồ Thanh Stacked Tiến độ Sự kiện & Bục Top Thành viên */}
        <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-200/80 shadow-card p-6 flex flex-col justify-between gap-5">
          {/* Multi-Segment Stacked Bars for Events */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-extrabold text-slate-900">
                Tiến độ Sự kiện
              </h3>
              <button
                onClick={() => navigate('/tasks')}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
              >
                Chi tiết →
              </button>
            </div>

            <div className="space-y-3">
              {eventStats.map((st) => {
                const total = Math.max(st.totalTasks, 1);
                const doneW = (st.doneTasks / total) * 100;
                const revW = (st.reviewTasks / total) * 100;
                const progW = (st.inProgressTasks / total) * 100;

                return (
                  <div
                    key={st.event.id}
                    onClick={() => navigate('/tasks')}
                    className="cursor-pointer group"
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-bold text-slate-800 truncate group-hover:text-blue-600">
                        {st.event.title}
                      </span>
                      <span className="font-black text-slate-900 shrink-0 ml-2">
                        {st.completionRate}%
                      </span>
                    </div>
                    <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden flex">
                      <div
                        className="h-full bg-emerald-500 transition-all duration-500"
                        style={{ width: `${doneW}%` }}
                      />
                      <div
                        className="h-full bg-amber-400 transition-all duration-500"
                        style={{ width: `${revW}%` }}
                      />
                      <div
                        className="h-full bg-blue-500 transition-all duration-500"
                        style={{ width: `${progW}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Visual Top 4 Avatar Podium Row */}
          <div className="pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-extrabold text-slate-900">
                Top Thành viên
              </h3>
              <button
                onClick={() => navigate('/reports')}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
              >
                Bảng điểm →
              </button>
            </div>

            <div className="grid grid-cols-4 gap-2.5">
              {topMembers.map((stat, idx) => (
                <div
                  key={stat.member.id}
                  onClick={() => navigate('/members')}
                  className="p-2.5 rounded-2xl bg-slate-50/90 hover:bg-blue-50/60 border border-slate-100 flex flex-col items-center text-center cursor-pointer transition-all"
                >
                  <div className="relative">
                    {renderAvatar(stat.member, 'w-11 h-11')}
                    <span
                      className={`absolute -top-1 -right-1 w-5 h-5 rounded-full text-[10px] font-black flex items-center justify-center shadow-sm ${
                        idx === 0
                          ? 'bg-amber-400 text-slate-950'
                          : idx === 1
                          ? 'bg-slate-300 text-slate-900'
                          : idx === 2
                          ? 'bg-orange-300 text-slate-950'
                          : 'bg-white text-slate-600'
                      }`}
                    >
                      {idx + 1}
                    </span>
                  </div>
                  <span className="text-xs font-extrabold text-slate-900 mt-2 truncate w-full">
                    {stat.member.fullName.split(' ').slice(-2).join(' ')}
                  </span>
                  <span className="text-[11px] font-black text-blue-600 mt-0.5">
                    {stat.totalPoints} đ
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
