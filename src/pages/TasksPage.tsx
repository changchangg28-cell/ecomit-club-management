import React, { useState } from 'react';
import { useEcomit } from '../context/EcomitContext';
import { ClubEvent, Department, Member, TaskStatus } from '../types';

const COLUMNS: {
  status: TaskStatus;
  title: string;
  dot: string;
  bg: string;
  headerBorder: string;
}[] = [
  {
    status: 'Todo',
    title: 'Chưa mở',
    dot: 'bg-slate-400',
    bg: 'bg-slate-100/75',
    headerBorder: 'border-slate-300',
  },
  {
    status: 'InProgress',
    title: 'Đang làm',
    dot: 'bg-blue-600',
    bg: 'bg-blue-50/45',
    headerBorder: 'border-blue-300',
  },
  {
    status: 'Review',
    title: 'Chờ duyệt',
    dot: 'bg-amber-500',
    bg: 'bg-amber-50/45',
    headerBorder: 'border-amber-300',
  },
  {
    status: 'Done',
    title: 'Hoàn thành',
    dot: 'bg-emerald-600',
    bg: 'bg-emerald-50/45',
    headerBorder: 'border-emerald-300',
  },
];

const DEPARTMENTS: Department[] = [
  'Ban Chủ nhiệm',
  'Ban Truyền thông',
  'Ban Kỹ thuật',
  'Ban Sự kiện & Host',
];

const DEPT_BADGE: Record<Department, { short: string; cls: string }> = {
  'Ban Chủ nhiệm': { short: 'Chủ nhiệm', cls: 'bg-indigo-50 text-indigo-700' },
  'Ban Truyền thông': { short: 'Truyền thông', cls: 'bg-blue-50 text-blue-700' },
  'Ban Kỹ thuật': { short: 'Kỹ thuật', cls: 'bg-emerald-50 text-emerald-700' },
  'Ban Sự kiện & Host': { short: 'Sự kiện', cls: 'bg-amber-50 text-amber-800' },
};

const EVENT_THEME: Record<
  ClubEvent['color'],
  { bar: string; badge: string; border: string; headerBg: string }
> = {
  indigo: {
    bar: 'bg-indigo-600',
    badge: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    border: 'border-indigo-200/80',
    headerBg: 'bg-indigo-50/35',
  },
  blue: {
    bar: 'bg-blue-600',
    badge: 'bg-blue-50 text-blue-700 border-blue-200',
    border: 'border-blue-200/80',
    headerBg: 'bg-blue-50/35',
  },
  emerald: {
    bar: 'bg-emerald-600',
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    border: 'border-emerald-200/80',
    headerBg: 'bg-emerald-50/35',
  },
  amber: {
    bar: 'bg-amber-500',
    badge: 'bg-amber-50 text-amber-800 border-amber-200',
    border: 'border-amber-200/80',
    headerBg: 'bg-amber-50/35',
  },
};

const STATUS_BADGE: Record<TaskStatus, { label: string; cls: string }> = {
  Todo: { label: 'Chưa mở', cls: 'bg-slate-100 text-slate-600' },
  InProgress: { label: 'Đang làm', cls: 'bg-blue-50 text-blue-700' },
  Review: { label: 'Chờ duyệt', cls: 'bg-amber-50 text-amber-800' },
  Done: { label: 'Hoàn thành', cls: 'bg-emerald-50 text-emerald-700' },
};

const PRIORITY_STYLE: Record<string, string> = {
  Cao: 'bg-rose-50 text-rose-700',
  'Trung bình': 'bg-slate-100 text-slate-600',
  Thấp: 'bg-slate-100 text-slate-500',
};

const renderAvatar = (member: Member | undefined, size = 'w-6 h-6') => {
  if (!member) return null;
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
      className={`${size} rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold flex items-center justify-center shrink-0`}
    >
      {initials}
    </div>
  );
};

export const TasksPage: React.FC = () => {
  const {
    tasks,
    members,
    events,
    openCreateTask,
    setActiveTaskModalId,
    updateTaskStatus,
    saveEvent,
    deleteEvent,
    getEventById,
  } = useEcomit();

  const [viewMode, setViewMode] = useState<'events' | 'board' | 'table'>('board');
  const [selectedEventId, setSelectedEventId] = useState<string>('ALL');
  const [selectedDept, setSelectedDept] = useState<string>('ALL');
  const [selectedAssignee, setSelectedAssignee] = useState<string>('ALL');
  const [search, setSearch] = useState('');

  // Modal tạo Sự kiện / Công việc chính
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [evTitle, setEvTitle] = useState('');
  const [evCategory, setEvCategory] = useState<ClubEvent['category']>('Sự kiện lớn');
  const [evLeadId, setEvLeadId] = useState('m1');
  const [evEndDate, setEvEndDate] = useState('2025-03-25');
  const [evColor, setEvColor] = useState<ClubEvent['color']>('indigo');

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!evTitle.trim()) return;
    saveEvent({
      title: evTitle.trim(),
      category: evCategory,
      startDate: '2025-03-15',
      endDate: evEndDate,
      leadId: evLeadId,
      color: evColor,
    });
    setEvTitle('');
    setIsEventModalOpen(false);
  };

  const filteredTasks = tasks.filter((t) => {
    const matchEvent = selectedEventId === 'ALL' || t.eventId === selectedEventId;
    const matchDept = selectedDept === 'ALL' || t.department === selectedDept;
    const matchAssignee = selectedAssignee === 'ALL' || t.assigneeId === selectedAssignee;
    const q = search.toLowerCase().trim();
    const matchSearch =
      !q ||
      (t.title || '').toLowerCase().includes(q) ||
      (t.code || '').toLowerCase().includes(q);
    return matchEvent && matchDept && matchAssignee && matchSearch;
  });

  const getNextStatus = (current: TaskStatus): TaskStatus | null => {
    if (current === 'Todo') return 'InProgress';
    if (current === 'InProgress') return 'Review';
    if (current === 'Review') return 'Done';
    return null;
  };

  const visibleEvents = events.filter(
    (ev) => selectedEventId === 'ALL' || ev.id === selectedEventId
  );

  return (
    <div className="space-y-5">
      {/* Compact Toolbar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-3.5 shadow-card flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-3">
        {/* Left Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedEventId}
            onChange={(e) => setSelectedEventId(e.target.value)}
            className="h-9 px-3 text-xs font-bold bg-indigo-50/60 border border-indigo-200 rounded-xl text-indigo-800 focus:outline-none focus:border-indigo-500"
          >
            <option value="ALL">Tất cả Sự kiện / Việc chính ({events.length})</option>
            {events.map((ev) => (
              <option key={ev.id} value={ev.id}>
                [{ev.code}] {ev.title}
              </option>
            ))}
          </select>

          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="h-9 px-3 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">Tất cả Ban ({tasks.length} task)</option>
            {DEPARTMENTS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>

          <select
            value={selectedAssignee}
            onChange={(e) => setSelectedAssignee(e.target.value)}
            className="h-9 px-3 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">Tất cả thành viên</option>
            {members.map((m) => (
              <option key={m.id} value={m.id}>
                {m.fullName}
              </option>
            ))}
          </select>
        </div>

        {/* Right Controls: Search + 3-Way View Switcher + Add Event/Task */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 sm:w-48">
            <span className="material-symbols-outlined text-[16px] text-slate-400 absolute left-3 top-1/2 -translate-y-1/2">
              search
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm task..."
              className="w-full h-9 pl-9 pr-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white text-slate-800"
            />
          </div>

          <div className="inline-flex rounded-xl border border-slate-200 bg-slate-50 p-0.5">
            <button
              onClick={() => setViewMode('events')}
              className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                viewMode === 'events'
                  ? 'bg-white text-blue-600 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Xem theo Sự kiện / Công việc chính & Task con"
            >
              <span className="material-symbols-outlined text-[16px]">account_tree</span>
              <span>Theo Sự kiện</span>
            </button>
            <button
              onClick={() => setViewMode('board')}
              className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                viewMode === 'board'
                  ? 'bg-white text-blue-600 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Xem bảng Kanban"
            >
              <span className="material-symbols-outlined text-[16px]">view_kanban</span>
              <span>Kanban</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                viewMode === 'table'
                  ? 'bg-white text-blue-600 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Xem dạng Bảng"
            >
              <span className="material-symbols-outlined text-[16px]">table_rows</span>
            </button>
          </div>

          <button
            onClick={() => setIsEventModalOpen(true)}
            className="inline-flex items-center gap-1 px-3 py-2 rounded-xl border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">folder_Special</span>
            <span>+ Sự kiện chính</span>
          </button>

          <button
            onClick={() => openCreateTask()}
            className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            <span>+ Task con</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: THEO SỰ KIỆN / CÔNG VIỆC CHÍNH & TASK CON (Parent Event -> Sub-tasks) */}
      {viewMode === 'events' && (
        <div className="space-y-4">
          {visibleEvents.map((ev) => {
            const subTasks = filteredTasks.filter((t) => t.eventId === ev.id);
            const allEvTasks = tasks.filter((t) => t.eventId === ev.id);
            const doneCount = allEvTasks.filter((t) => t.status === 'Done').length;
            const totalCount = allEvTasks.length;
            const pct = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;
            const lead = members.find((m) => m.id === ev.leadId);
            const theme = EVENT_THEME[ev.color] || EVENT_THEME.indigo;

            return (
              <div
                key={ev.id}
                className={`bg-white rounded-2xl border ${theme.border} shadow-card overflow-hidden`}
              >
                {/* Parent Event Header */}
                <div
                  className={`px-5 py-4 border-b border-slate-100 ${theme.headerBg} flex flex-col md:flex-row md:items-center justify-between gap-4`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`px-2.5 py-1 rounded-xl text-xs font-extrabold border ${theme.badge} shrink-0`}
                    >
                      {ev.code}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-extrabold text-slate-900 truncate">
                          {ev.title}
                        </h3>
                        <span className="hidden sm:inline-block px-2 py-0.5 rounded-md text-[10px] font-bold bg-white text-slate-600 border border-slate-200">
                          {ev.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                        <span className="inline-flex items-center gap-1.5">
                          <span>Phụ trách chính:</span>
                          {renderAvatar(lead, 'w-4 h-4')}
                          <strong className="text-slate-700">{lead?.fullName}</strong>
                        </span>
                        <span>• Hạn sự kiện: {ev.endDate}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Event Progress Bar + Add Sub-task Button */}
                  <div className="flex items-center gap-4 shrink-0">
                    <div className="w-36 sm:w-44">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-slate-500 font-medium">
                          {doneCount}/{totalCount} task con
                        </span>
                        <span className="font-extrabold text-slate-800">{pct}%</span>
                      </div>
                      <div className="w-full h-2 bg-white rounded-full overflow-hidden border border-slate-200/60">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${theme.bar}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>

                    <button
                      onClick={() => openCreateTask(undefined, ev.id)}
                      className="px-3 py-1.5 rounded-xl bg-white hover:bg-blue-600 text-blue-600 hover:text-white border border-blue-200 text-xs font-bold inline-flex items-center gap-1 transition-all shadow-2xs"
                    >
                      <span className="material-symbols-outlined text-[15px]">add</span>
                      <span>Task con</span>
                    </button>

                    {events.length > 1 && (
                      <button
                        onClick={() => {
                          if (window.confirm(`Xóa sự kiện "${ev.title}"?`)) {
                            deleteEvent(ev.id);
                          }
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600"
                        title="Xóa sự kiện"
                      >
                        <span className="material-symbols-outlined text-[16px]">delete</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Sub-tasks List */}
                <div className="divide-y divide-slate-100">
                  {subTasks.length === 0 ? (
                    <div className="py-6 text-center text-xs text-slate-400">
                      Chưa có task con nào trong sự kiện này. Bấm <strong>+ Task con</strong> để thêm.
                    </div>
                  ) : (
                    subTasks.map((task) => {
                      const assignee = members.find((m) => m.id === task.assigneeId);
                      const deptBadge = DEPT_BADGE[task.department];
                      const stBadge = STATUS_BADGE[task.status];
                      const nextSt = getNextStatus(task.status);

                      return (
                        <div
                          key={task.id}
                          onClick={() => setActiveTaskModalId(task.id)}
                          className="px-5 py-3 hover:bg-slate-50/90 cursor-pointer transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                        >
                          {/* Sub-task Left */}
                          <div className="flex items-center gap-3 min-w-0">
                            <span
                              className={`material-symbols-outlined text-[18px] shrink-0 ${
                                task.status === 'Done'
                                  ? 'text-emerald-600'
                                  : task.status === 'Review'
                                  ? 'text-amber-500'
                                  : task.status === 'InProgress'
                                  ? 'text-blue-600'
                                  : 'text-slate-300'
                              }`}
                            >
                              {task.status === 'Done'
                                ? 'check_circle'
                                : task.status === 'Review'
                                ? 'schedule'
                                : 'radio_button_unchecked'}
                            </span>

                            <span className="font-mono text-[11px] font-bold text-slate-400 shrink-0">
                              {task.code}
                            </span>

                            <span
                              className={`text-sm font-bold truncate ${
                                task.status === 'Done'
                                  ? 'line-through text-slate-400'
                                  : 'text-slate-900'
                              }`}
                            >
                              {task.title}
                            </span>

                            <span
                              className={`hidden md:inline-block px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${deptBadge.cls}`}
                            >
                              {deptBadge.short}
                            </span>

                            {task.resultLink && (
                              <span className="hidden lg:inline-flex items-center gap-0.5 text-[11px] text-blue-600 font-semibold shrink-0">
                                <span className="material-symbols-outlined text-[13px]">
                                  link
                                </span>
                                Đã nộp link
                              </span>
                            )}
                          </div>

                          {/* Sub-task Right: Assignee + Deadline + Status */}
                          <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                            <div className="flex items-center gap-2">
                              {renderAvatar(assignee, 'w-6 h-6')}
                              <span className="text-xs font-semibold text-slate-700">
                                {assignee?.fullName}
                              </span>
                            </div>

                            <span className="text-xs text-slate-400 w-20 text-right">
                              {task.deadline}
                            </span>

                            <span
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold w-22 text-center ${stBadge.cls}`}
                            >
                              {stBadge.label}
                            </span>

                            {nextSt && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  updateTaskStatus(task.id, nextSt);
                                }}
                                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                                  nextSt === 'Done'
                                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                    : 'bg-slate-100 hover:bg-blue-600 text-slate-700 hover:text-white'
                                }`}
                              >
                                {nextSt === 'InProgress'
                                  ? 'Làm'
                                  : nextSt === 'Review'
                                  ? 'Nộp'
                                  : 'Duyệt'}
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW 2: KANBAN BOARD */}
      {viewMode === 'board' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {COLUMNS.map((col) => {
            const colTasks = filteredTasks.filter((t) => t.status === col.status);

            return (
              <div
                key={col.status}
                className={`rounded-2xl border border-slate-200/80 ${col.bg} p-3 flex flex-col min-h-[460px]`}
              >
                <div
                  className={`flex items-center justify-between px-1 pb-2.5 mb-2.5 border-b-2 ${col.headerBorder}`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${col.dot}`} />
                    <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                      {col.title}
                    </h3>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-xs font-extrabold bg-white text-slate-700 border border-slate-200">
                    {colTasks.length}
                  </span>
                </div>

                <div className="space-y-2.5 flex-1">
                  {colTasks.map((task) => {
                    const assignee = members.find((m) => m.id === task.assigneeId);
                    const parentEv = getEventById(task.eventId);
                    const nextSt = getNextStatus(task.status);
                    const deptBadge = DEPT_BADGE[task.department];

                    return (
                      <div
                        key={task.id}
                        onClick={() => setActiveTaskModalId(task.id)}
                        className="group bg-white rounded-2xl p-3.5 border border-slate-200/90 shadow-card hover:shadow-soft hover:border-blue-400 cursor-pointer transition-all flex flex-col justify-between gap-3"
                      >
                        <div>
                          {/* Event & Dept Tag */}
                          <div className="flex items-center justify-between gap-1.5 mb-2">
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-600 truncate max-w-[140px]">
                              {parentEv?.title || 'Việc chung'}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded-md text-[10px] font-bold shrink-0 ${deptBadge.cls}`}
                            >
                              {deptBadge.short}
                            </span>
                          </div>

                          <h4 className="text-sm font-bold text-slate-900 leading-snug group-hover:text-blue-600 transition-colors">
                            {task.title}
                          </h4>

                          <div className="flex items-center justify-between mt-2.5 text-[11px] text-slate-400">
                            <span>Hạn: {task.deadline}</span>
                            {task.resultLink && (
                              <span className="inline-flex items-center gap-0.5 text-blue-600 font-semibold">
                                <span className="material-symbols-outlined text-[13px]">link</span>
                                Link
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            {renderAvatar(assignee, 'w-6 h-6')}
                            <span className="text-xs font-semibold text-slate-700 truncate">
                              {assignee?.fullName || 'Chưa giao'}
                            </span>
                          </div>

                          {nextSt && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                updateTaskStatus(task.id, nextSt);
                              }}
                              className={`px-2 py-1 rounded-lg text-[11px] font-semibold transition-all shrink-0 ${
                                nextSt === 'Done'
                                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                  : 'bg-slate-100 hover:bg-blue-600 text-slate-700 hover:text-white'
                              }`}
                            >
                              {nextSt === 'InProgress'
                                ? 'Làm'
                                : nextSt === 'Review'
                                ? 'Nộp'
                                : 'Duyệt'}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW 3: CLEAN TABLE */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Task con</th>
                  <th className="py-3 px-4">Sự kiện / Công việc chính</th>
                  <th className="py-3 px-4">Ban</th>
                  <th className="py-3 px-4">Phụ trách</th>
                  <th className="py-3 px-4">Hạn</th>
                  <th className="py-3 px-4">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredTasks.map((task) => {
                  const assignee = members.find((m) => m.id === task.assigneeId);
                  const parentEv = getEventById(task.eventId);
                  const deptBadge = DEPT_BADGE[task.department];
                  return (
                    <tr
                      key={task.id}
                      onClick={() => setActiveTaskModalId(task.id)}
                      className="hover:bg-slate-50 cursor-pointer"
                    >
                      <td className="py-3 px-4 font-bold text-slate-900">
                        <span className="font-mono text-xs text-slate-400 mr-2">
                          {task.code}
                        </span>
                        {task.title}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700">
                          {parentEv?.title}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-lg text-xs font-semibold ${deptBadge.cls}`}
                        >
                          {deptBadge.short}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          {renderAvatar(assignee, 'w-6 h-6')}
                          <span className="text-xs font-semibold text-slate-800">
                            {assignee?.fullName}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-xs text-slate-500">{task.deadline}</td>
                      <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                        <select
                          value={task.status}
                          onChange={(e) =>
                            updateTaskStatus(task.id, e.target.value as TaskStatus)
                          }
                          className="px-2.5 py-1 rounded-xl text-xs font-semibold border border-slate-200 bg-slate-50"
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
        </div>
      )}

      {/* Modal Tạo Sự kiện / Công việc chính mới */}
      {isEventModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/45 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-float w-full max-w-md overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">
                Thêm Sự kiện / Công việc chính
              </h3>
              <button
                onClick={() => setIsEventModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tên Sự kiện / Công việc chính *
                </label>
                <input
                  type="text"
                  required
                  value={evTitle}
                  onChange={(e) => setEvTitle(e.target.value)}
                  placeholder="VD: Cuộc thi E-Commerce Hackathon 2025..."
                  className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nhóm hoạt động
                  </label>
                  <select
                    value={evCategory}
                    onChange={(e) =>
                      setEvCategory(e.target.value as ClubEvent['category'])
                    }
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl bg-white"
                  >
                    <option value="Sự kiện lớn">Sự kiện lớn</option>
                    <option value="Tuyển quân & Nội bộ">Tuyển quân &amp; Nội bộ</option>
                    <option value="Truyền thông">Truyền thông</option>
                    <option value="Chuyên môn">Chuyên môn</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Màu sắc phân biệt
                  </label>
                  <select
                    value={evColor}
                    onChange={(e) => setEvColor(e.target.value as ClubEvent['color'])}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl bg-white"
                  >
                    <option value="indigo">Tím Indigo</option>
                    <option value="blue">Xanh dương</option>
                    <option value="emerald">Xanh ngọc</option>
                    <option value="amber">Vàng cam</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Trưởng dự án / Sự kiện
                  </label>
                  <select
                    value={evLeadId}
                    onChange={(e) => setEvLeadId(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl bg-white"
                  >
                    {members.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.fullName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Ngày kết thúc
                  </label>
                  <input
                    type="date"
                    value={evEndDate}
                    onChange={(e) => setEvEndDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEventModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
                >
                  Tạo sự kiện
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
