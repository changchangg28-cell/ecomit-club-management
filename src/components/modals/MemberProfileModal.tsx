import React from 'react';
import { Link } from 'react-router-dom';
import { useEcomit } from '../../context/EcomitContext';
import { MemberStatus } from '../../types';

export const MemberProfileModal: React.FC = () => {
  const {
    selectedMemberModal,
    closeMemberModal,
    tasks,
    openAssignModal,
    updateMemberStatus,
    addMemberPoints,
    deleteMember,
  } = useEcomit();

  if (!selectedMemberModal) return null;

  const member = selectedMemberModal;
  const memberTasks = tasks.filter((t) => t.assignedMemberId === member.id);
  const completedTasks = memberTasks.filter((t) => t.status === 'Completed');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#00173e]/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-3xl bg-surface-container-lowest shadow-2xl border border-outline-variant/40 overflow-hidden my-8">
        {/* Top Banner */}
        <div className="bg-gradient-to-r from-primary via-primary-container to-[#0d3b82] p-6 text-white relative">
          <button
            type="button"
            onClick={closeMemberModal}
            className="absolute top-5 right-5 w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div
              className={`w-16 h-16 rounded-2xl flex items-center justify-center font-display-lg text-2xl font-extrabold shadow-lg ring-4 ring-white/20 ${member.avatarBg}`}
            >
              {member.avatar}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h2 className="font-headline-md text-headline-md text-white">{member.fullName}</h2>
                <span className="px-2.5 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm">
                  MSSV: {member.studentId}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full font-label-sm text-label-sm ${
                    member.status === 'Active'
                      ? 'bg-emerald-400/20 text-emerald-200 border border-emerald-300/30'
                      : member.status === 'Inactive'
                      ? 'bg-amber-400/20 text-amber-200'
                      : 'bg-white/20 text-white'
                  }`}
                >
                  {member.status === 'Active'
                    ? 'Đang hoạt động'
                    : member.status === 'Inactive'
                    ? 'Tạm nghỉ'
                    : 'Cựu thành viên (Alumni)'}
                </span>
              </div>
              <p className="font-body-md text-primary-fixed">
                {member.role} • <strong>{member.department}</strong> • Lớp {member.classCode}
              </p>
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="p-6 space-y-5">
          {member.bio && (
            <p className="font-body-md text-on-surface-variant bg-surface-container-low p-4 rounded-2xl border border-outline-variant/30">
              {member.bio}
            </p>
          )}

          {/* Quick Management Controls: Status & Contribution Points */}
          <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="font-label-sm text-primary uppercase block mb-1.5">
                Cập nhật trạng thái thành viên
              </span>
              <div className="flex items-center gap-1.5">
                {(['Active', 'Inactive', 'Alumni'] as MemberStatus[]).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => updateMemberStatus(member.id, st)}
                    className={`px-3 py-1 rounded-lg font-label-sm transition-colors ${
                      member.status === st
                        ? 'bg-primary text-white shadow-sm'
                        : 'bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-high'
                    }`}
                  >
                    {st === 'Active' ? 'Hoạt động' : st === 'Inactive' ? 'Tạm nghỉ' : 'Alumni'}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="font-label-sm text-primary uppercase block mb-1.5">
                Thưởng / Điều chỉnh Điểm cống hiến
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => addMemberPoints(member.id, 10)}
                  className="px-2.5 py-1 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-label-sm"
                >
                  +10 điểm
                </button>
                <button
                  type="button"
                  onClick={() => addMemberPoints(member.id, 25)}
                  className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-label-sm"
                >
                  +25 điểm
                </button>
                <button
                  type="button"
                  onClick={() => addMemberPoints(member.id, -10)}
                  className="px-2.5 py-1 rounded-lg bg-secondary-fixed hover:bg-secondary text-on-secondary-fixed hover:text-white font-label-sm transition-colors"
                >
                  -10 điểm
                </button>
              </div>
            </div>
          </div>

          {/* 3 KPIs */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl bg-surface-container-low text-center">
              <span className="font-headline-md text-headline-md text-primary font-extrabold">
                {member.contributionPoints}
              </span>
              <p className="font-label-sm text-label-sm text-on-surface-variant uppercase mt-0.5">
                Điểm cống hiến
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-surface-container-low text-center">
              <span className="font-headline-md text-headline-md text-secondary font-extrabold">
                {member.completedTasksCount}
              </span>
              <p className="font-label-sm text-label-sm text-on-surface-variant uppercase mt-0.5">
                Tổng Tasks Đã Xong
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-surface-container-low text-center">
              <span className="font-headline-md text-headline-md text-emerald-700 font-extrabold">
                {completedTasks.length}/{memberTasks.length}
              </span>
              <p className="font-label-sm text-label-sm text-on-surface-variant uppercase mt-0.5">
                Task Đợt Này
              </p>
            </div>
          </div>

          {/* Contact & Skills */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-surface-container-low space-y-2 text-body-sm">
              <div className="font-label-md text-primary uppercase tracking-wider mb-1">
                Thông tin liên hệ LHU
              </div>
              <div className="flex items-center gap-2 text-on-surface">
                <span className="material-symbols-outlined text-outline text-[18px]">mail</span>
                <span className="truncate">{member.email}</span>
              </div>
              <div className="flex items-center gap-2 text-on-surface">
                <span className="material-symbols-outlined text-outline text-[18px]">call</span>
                <span>{member.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-on-surface">
                <span className="material-symbols-outlined text-outline text-[18px]">
                  calendar_month
                </span>
                <span>Gia nhập CLB: {member.joinDate}</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-surface-container-low">
              <div className="font-label-md text-primary uppercase tracking-wider mb-2">
                Kỹ năng chuyên môn CLB
              </div>
              <div className="flex flex-wrap gap-1.5">
                {member.skills.map((sk) => (
                  <span
                    key={sk}
                    className="px-2.5 py-1 rounded-lg bg-surface-container-lowest text-primary font-label-sm text-label-sm shadow-sm"
                  >
                    {sk}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Assigned Tasks List */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-label-lg text-label-lg text-primary">
                Công việc được giao trong kỳ ({memberTasks.length})
              </h4>
            </div>
            {memberTasks.length === 0 ? (
              <p className="text-body-sm text-on-surface-variant italic">
                Chưa có công việc nào được giao trong đợt này.
              </p>
            ) : (
              <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                {memberTasks.map((t) => (
                  <Link
                    key={t.id}
                    to={`/tasks/${t.id}`}
                    onClick={closeMemberModal}
                    className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low hover:bg-surface-container-high transition-colors"
                  >
                    <div className="min-w-0 pr-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-outline">{t.code}</span>
                        <span className="font-label-md text-on-surface truncate">{t.title}</span>
                      </div>
                      <span className="text-xs text-on-surface-variant">Hạn: {t.deadline}</span>
                    </div>
                    <span
                      className={`shrink-0 px-2.5 py-1 rounded-full font-label-sm text-label-sm ${
                        t.status === 'Completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : t.status === 'In Progress'
                          ? 'bg-primary-fixed text-on-primary-fixed'
                          : 'bg-secondary-fixed text-on-secondary-fixed'
                      }`}
                    >
                      {t.status === 'Completed'
                        ? 'Đã xong'
                        : t.status === 'In Progress'
                        ? 'Đang làm'
                        : 'Chưa làm'}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-surface-container-high flex items-center justify-between gap-2.5">
            <button
              type="button"
              onClick={() => deleteMember(member.id)}
              className="px-3.5 py-2 rounded-xl text-secondary hover:bg-secondary-fixed/50 font-label-sm transition-colors flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px]">person_remove</span>
              <span>Xóa thành viên</span>
            </button>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={closeMemberModal}
                className="px-4 py-2 rounded-xl bg-surface-container-high text-on-surface-variant font-label-md"
              >
                Đóng
              </button>
              <button
                type="button"
                onClick={() => {
                  const id = member.id;
                  closeMemberModal();
                  openAssignModal(id);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-secondary text-on-secondary hover:bg-secondary-container font-label-md shadow-sm transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">add_task</span>
                <span>Giao việc cho {member.fullName}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
