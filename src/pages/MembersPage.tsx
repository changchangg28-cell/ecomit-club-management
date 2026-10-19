import React, { useState } from 'react';
import { useEcomit } from '../context/EcomitContext';
import { PRESET_AVATARS } from '../data/mockData';
import { Department, Member, MemberStatus } from '../types';

const DEPARTMENTS: Department[] = [
  'Ban Chủ nhiệm',
  'Ban Truyền thông',
  'Ban Kỹ thuật',
  'Ban Sự kiện & Host',
];

const ROLES: string[] = [
  'Chủ nhiệm CLB',
  'Phó Chủ nhiệm',
  'Trưởng ban',
  'Phó ban',
  'Thành viên',
  'Cộng tác viên',
];

// Chuẩn màu thống nhất cho 4 Ban chuyên môn
const DEPT_THEME: Record<
  Department,
  { short: string; badge: string; bar: string; ring: string }
> = {
  'Ban Chủ nhiệm': {
    short: 'Ban Chủ nhiệm',
    badge: 'bg-indigo-50 text-indigo-700 border-indigo-200/80',
    bar: 'bg-indigo-600',
    ring: 'ring-indigo-100',
  },
  'Ban Truyền thông': {
    short: 'Ban Truyền thông',
    badge: 'bg-blue-50 text-blue-700 border-blue-200/80',
    bar: 'bg-blue-600',
    ring: 'ring-blue-100',
  },
  'Ban Kỹ thuật': {
    short: 'Ban Kỹ thuật',
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    bar: 'bg-emerald-600',
    ring: 'ring-emerald-100',
  },
  'Ban Sự kiện & Host': {
    short: 'Ban Sự kiện & Host',
    badge: 'bg-amber-50 text-amber-800 border-amber-200/80',
    bar: 'bg-amber-500',
    ring: 'ring-amber-100',
  },
};

const getInitials = (member: Member) => {
  const parts = (member.fullName || '').trim().split(' ');
  if (parts.length >= 2) {
    return (parts[parts.length - 2][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return (member.fullName || 'EC').slice(0, 2).toUpperCase();
};

export const MembersPage: React.FC = () => {
  const {
    memberStats,
    tasks,
    saveMember,
    deleteMember,
    openCreateTask,
    setActiveTaskModalId,
  } = useEcomit();

  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('ALL');
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [fullName, setFullName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [classCode, setClassCode] = useState('22TM111');
  const [role, setRole] = useState<string>('Thành viên');
  const [department, setDepartment] = useState<Department>('Ban Truyền thông');
  const [status, setStatus] = useState<MemberStatus>('Đang hoạt động');
  const [avatar, setAvatar] = useState<string>(PRESET_AVATARS[0]);
  const [bonusPoints, setBonusPoints] = useState<number>(80);

  const openAddModal = () => {
    setEditingMember(null);
    setFullName('');
    setStudentId(`23110${Math.floor(100 + Math.random() * 899)}`);
    setClassCode('23TM111');
    setRole('Thành viên');
    setDepartment('Ban Truyền thông');
    setStatus('Đang hoạt động');
    setAvatar(PRESET_AVATARS[Math.floor(Math.random() * PRESET_AVATARS.length)]);
    setBonusPoints(80);
    setIsModalOpen(true);
  };

  const openEditModal = (m: Member) => {
    setEditingMember(m);
    setFullName(m.fullName);
    setStudentId(m.studentId);
    setClassCode(m.classCode || '22TM111');
    setRole(m.role);
    setDepartment(m.department);
    setStatus(m.status);
    setAvatar(m.avatar || PRESET_AVATARS[0]);
    setBonusPoints(m.bonusPoints);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !studentId.trim()) return;

    saveMember({
      id: editingMember?.id,
      fullName: fullName.trim(),
      studentId: studentId.trim(),
      classCode: classCode.trim() || '22TM111',
      email: editingMember?.email || `${studentId.trim()}@lhu.edu.vn`,
      phone: editingMember?.phone || '0901234567',
      role,
      department,
      status,
      joinDate: editingMember?.joinDate || '2024-09',
      avatar: avatar.trim() || PRESET_AVATARS[0],
      bonusPoints: Number(bonusPoints) || 0,
    });
    setIsModalOpen(false);
  };

  const filteredStats = memberStats.filter((st) => {
    const m = st.member;
    const matchDept = selectedDept === 'ALL' || m.department === selectedDept;
    const q = search.toLowerCase().trim();
    const matchSearch =
      !q ||
      (m.fullName || '').toLowerCase().includes(q) ||
      (m.studentId || '').toLowerCase().includes(q) ||
      (m.role || '').toLowerCase().includes(q);
    return matchDept && matchSearch;
  });

  return (
    <div className="space-y-5">
      {/* Minimal Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-3.5 shadow-card flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Department Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0">
          <button
            onClick={() => setSelectedDept('ALL')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedDept === 'ALL'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            Tất cả ({memberStats.length})
          </button>
          {DEPARTMENTS.map((dept) => {
            const count = memberStats.filter((s) => s.member.department === dept).length;
            return (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedDept === dept
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
                }`}
              >
                {dept.replace('Ban ', '')} ({count})
              </button>
            );
          })}
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-56">
            <span className="material-symbols-outlined text-[16px] text-slate-400 absolute left-3 top-1/2 -translate-y-1/2">
              search
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm tên, MSSV..."
              className="w-full h-9 pl-9 pr-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white text-slate-800"
            />
          </div>

          <div className="inline-flex rounded-xl border border-slate-200 bg-slate-50 p-0.5">
            <button
              onClick={() => setViewMode('cards')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                viewMode === 'cards'
                  ? 'bg-white text-blue-600 shadow-2xs'
                  : 'text-slate-500'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">grid_view</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                viewMode === 'table'
                  ? 'bg-white text-blue-600 shadow-2xs'
                  : 'text-slate-500'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">table_rows</span>
            </button>
          </div>

          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm"
          >
            <span className="material-symbols-outlined text-[16px]">person_add</span>
            <span>Thêm TV</span>
          </button>
        </div>
      </div>

      {/* View Mode 1: Clean Member Cards with Photo Avatars */}
      {viewMode === 'cards' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredStats.map((stat) => {
            const { member } = stat;
            const memberTasks = tasks.filter((t) => t.assigneeId === member.id);
            const theme = DEPT_THEME[member.department];

            return (
              <div
                key={member.id}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-card hover:shadow-soft hover:border-blue-300 transition-all p-4 flex flex-col justify-between gap-4"
              >
                <div>
                  {/* Top: Avatar + Name + Edit/Delete */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3 min-w-0">
                      {member.avatar ? (
                        <img
                          src={member.avatar}
                          alt={member.fullName}
                          className={`w-12 h-12 rounded-2xl object-cover ring-2 ${theme.ring} shrink-0`}
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 font-bold text-sm flex items-center justify-center shrink-0">
                          {getInitials(member)}
                        </div>
                      )}
                      <div className="min-w-0">
                        <h3 className="text-sm font-bold text-slate-900 truncate">
                          {member.fullName}
                        </h3>
                        <p className="text-xs text-slate-500 truncate">{member.role}</p>
                        <p className="text-[11px] text-slate-400 font-mono">
                          {member.studentId}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-0.5 shrink-0">
                      <button
                        onClick={() => openEditModal(member)}
                        title="Đổi ảnh / Sửa"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                      >
                        <span className="material-symbols-outlined text-[15px]">edit</span>
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Xóa thành viên ${member.fullName}?`)) {
                            deleteMember(member.id);
                          }
                        }}
                        title="Xóa"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                      >
                        <span className="material-symbols-outlined text-[15px]">delete</span>
                      </button>
                    </div>
                  </div>

                  {/* Department Badge + Points */}
                  <div className="flex items-center justify-between mt-3.5">
                    <span
                      className={`px-2.5 py-0.5 rounded-lg text-[11px] font-semibold border ${theme.badge}`}
                    >
                      {theme.short}
                    </span>
                    <span className="text-xs font-extrabold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-lg">
                      {stat.totalPoints} đ
                    </span>
                  </div>

                  {/* Compact Workload Progress */}
                  <div className="mt-3.5 pt-3 border-t border-slate-100">
                    <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1.5">
                      <span>Tiến độ việc</span>
                      <span className="font-bold text-slate-700">
                        {stat.doneTasks}/{stat.totalTasks} hoàn thành
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mb-2.5">
                      <div
                        className={`h-full rounded-full ${theme.bar}`}
                        style={{ width: `${stat.completionRate}%` }}
                      />
                    </div>

                    {/* Task Pills (compact) */}
                    {memberTasks.length > 0 && (
                      <div className="space-y-1">
                        {memberTasks.slice(0, 2).map((t) => (
                          <button
                            key={t.id}
                            onClick={() => setActiveTaskModalId(t.id)}
                            className="w-full text-left px-2.5 py-1.5 rounded-xl bg-slate-50 hover:bg-blue-50/70 text-xs text-slate-700 flex items-center justify-between gap-1.5 transition-colors"
                          >
                            <span className="truncate font-medium">{t.title}</span>
                            <span
                              className={`w-2 h-2 rounded-full shrink-0 ${
                                t.status === 'Done'
                                  ? 'bg-emerald-500'
                                  : t.status === 'Review'
                                  ? 'bg-amber-500'
                                  : 'bg-blue-500'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Button */}
                <button
                  onClick={() => openCreateTask(member.id)}
                  className="w-full py-1.5 rounded-xl bg-slate-100 hover:bg-blue-600 text-slate-700 hover:text-white text-xs font-semibold inline-flex items-center justify-center gap-1 transition-all"
                >
                  <span className="material-symbols-outlined text-[15px]">add</span>
                  <span>Giao việc</span>
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        /* View Mode 2: Compact Table */
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Thành viên</th>
                  <th className="py-3 px-4">Ban chuyên môn</th>
                  <th className="py-3 px-4">Công việc</th>
                  <th className="py-3 px-4 text-center">Hoàn thành</th>
                  <th className="py-3 px-4 text-right">Điểm</th>
                  <th className="py-3 px-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredStats.map((stat) => {
                  const { member } = stat;
                  const memberTasks = tasks.filter((t) => t.assigneeId === member.id);
                  const theme = DEPT_THEME[member.department];

                  return (
                    <tr key={member.id} className="hover:bg-slate-50/80">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          {member.avatar ? (
                            <img
                              src={member.avatar}
                              alt={member.fullName}
                              className="w-9 h-9 rounded-full object-cover border border-slate-200"
                            />
                          ) : (
                            <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center">
                              {getInitials(member)}
                            </div>
                          )}
                          <div>
                            <p className="font-bold text-slate-900 text-sm">
                              {member.fullName}
                            </p>
                            <p className="text-xs text-slate-400">
                              {member.studentId} • {member.role}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-lg text-xs font-semibold border ${theme.badge}`}
                        >
                          {theme.short}
                        </span>
                      </td>

                      <td className="py-3 px-4 max-w-xs">
                        <div className="flex flex-wrap gap-1">
                          {memberTasks.map((t) => (
                            <button
                              key={t.id}
                              onClick={() => setActiveTaskModalId(t.id)}
                              className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 hover:bg-blue-50 text-slate-700 truncate max-w-[180px]"
                            >
                              {t.title}
                            </button>
                          ))}
                        </div>
                      </td>

                      <td className="py-3 px-4 text-center text-xs font-bold text-slate-700">
                        {stat.doneTasks}/{stat.totalTasks}
                      </td>

                      <td className="py-3 px-4 text-right font-extrabold text-blue-600">
                        {stat.totalPoints} đ
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            onClick={() => openCreateTask(member.id)}
                            className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-semibold"
                          >
                            + Giao việc
                          </button>
                          <button
                            onClick={() => openEditModal(member)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700"
                          >
                            <span className="material-symbols-outlined text-[16px]">edit</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Member Modal with Avatar Picker */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/45 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-float w-full max-w-md overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">
                {editingMember ? 'Cập nhật Thành viên' : 'Thêm Thành viên CLB'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSave} className="p-5 space-y-4">
              {/* Avatar Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Ảnh đại diện (Chọn nhanh hoặc dán link ảnh)
                </label>
                <div className="flex items-center gap-3 mb-2.5">
                  <img
                    src={avatar || PRESET_AVATARS[0]}
                    alt="Preview"
                    className="w-12 h-12 rounded-2xl object-cover border-2 border-blue-500 shrink-0"
                  />
                  <div className="flex flex-wrap gap-1.5">
                    {PRESET_AVATARS.map((url, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setAvatar(url)}
                        className={`w-8 h-8 rounded-lg overflow-hidden border-2 transition-all ${
                          avatar === url
                            ? 'border-blue-600 scale-105'
                            : 'border-transparent opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={url} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
                <input
                  type="url"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  placeholder="Hoặc dán link ảnh Avatar tùy chọn..."
                  className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Họ và tên *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Nguyễn Văn A"
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    MSSV *
                  </label>
                  <input
                    type="text"
                    required
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Ban chuyên môn
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value as Department)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl bg-white"
                  >
                    {DEPARTMENTS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Chức vụ
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl bg-white"
                  >
                    {ROLES.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                >
                  Lưu thành viên
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
