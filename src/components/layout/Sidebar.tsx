import React from 'react';
import { NavLink } from 'react-router-dom';
import { useEcomit } from '../../context/EcomitContext';

export const Sidebar: React.FC = () => {
  const {
    members,
    tasks,
    resetAllData,
    syncStatus,
    cloudConfig,
    setIsCloudModalOpen,
  } = useEcomit();

  const doneCount = tasks.filter((t) => t.status === 'Done').length;
  const pendingCount = tasks.length - doneCount;
  const progressPct = tasks.length > 0 ? Math.round((doneCount / tasks.length) * 100) : 0;

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-150 ${
      isActive
        ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/20'
        : 'text-slate-600 hover:bg-slate-100/90 hover:text-slate-900'
    }`;

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-slate-200/80 z-40 flex flex-col justify-between select-none">
      <div>
        {/* Brand Header */}
        <div className="h-16 px-5 flex items-center gap-3 border-b border-slate-100">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-extrabold text-sm flex items-center justify-center shadow-sm shadow-blue-600/25">
            EC
          </div>
          <div>
            <div className="font-extrabold text-slate-900 text-sm tracking-tight leading-none">
              ECOMIT CLUB
            </div>
            <div className="text-[11px] font-medium text-slate-400 mt-1">
              Đại học Lạc Hồng (LHU)
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="p-3.5 space-y-1">
          <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-400">
            Không gian quản trị
          </div>

          <NavLink to="/dashboard" className={linkClass}>
            {({ isActive }) => (
              <>
                <div className="flex items-center gap-3">
                  <span
                    className={`material-symbols-outlined text-[20px] ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-600'
                    }`}
                  >
                    space_dashboard
                  </span>
                  <span>Tổng quan CLB</span>
                </div>
              </>
            )}
          </NavLink>

          <NavLink to="/members" className={linkClass}>
            {({ isActive }) => (
              <>
                <div className="flex items-center gap-3">
                  <span
                    className={`material-symbols-outlined text-[20px] ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-600'
                    }`}
                  >
                    groups
                  </span>
                  <span>Thành viên CLB</span>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {members.length}
                </span>
              </>
            )}
          </NavLink>

          <NavLink to="/tasks" className={linkClass}>
            {({ isActive }) => (
              <>
                <div className="flex items-center gap-3">
                  <span
                    className={`material-symbols-outlined text-[20px] ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-600'
                    }`}
                  >
                    assignment_turned_in
                  </span>
                  <span>Công việc (Tasks)</span>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-amber-50 text-amber-700 border border-amber-200/60'
                  }`}
                >
                  {pendingCount}
                </span>
              </>
            )}
          </NavLink>

          <NavLink to="/reports" className={linkClass}>
            {({ isActive }) => (
              <>
                <div className="flex items-center gap-3">
                  <span
                    className={`material-symbols-outlined text-[20px] ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-600'
                    }`}
                  >
                    analytics
                  </span>
                  <span>Báo cáo &amp; Xếp loại</span>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                  }`}
                >
                  {progressPct}%
                </span>
              </>
            )}
          </NavLink>
        </div>

        {/* Live Progress Card */}
        <div className="mx-3.5 mt-3 p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-sm">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-medium text-slate-300">Tiến độ công việc</span>
            <span className="font-bold text-emerald-400">
              {doneCount}/{tasks.length} hoàn tất
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-white/15 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-400 to-emerald-400 transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400">
            <span>Đạt {progressPct}% kế hoạch</span>
            <span>Còn {pendingCount} việc</span>
          </div>
        </div>
      </div>

      {/* Footer: Cloud DB Status + Reset */}
      <div className="p-3.5 border-t border-slate-100 space-y-2">
        <button
          type="button"
          onClick={() => setIsCloudModalOpen(true)}
          className="w-full p-2.5 rounded-xl border border-slate-200/80 hover:border-blue-300 bg-slate-50/70 hover:bg-blue-50/40 flex items-center justify-between transition-all text-left"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <span
              className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                syncStatus === 'synced'
                  ? 'bg-emerald-500 ring-4 ring-emerald-500/15'
                  : syncStatus === 'syncing'
                  ? 'bg-amber-500 animate-pulse'
                  : syncStatus === 'error'
                  ? 'bg-rose-500'
                  : 'bg-blue-500'
              }`}
            />
            <div className="min-w-0">
              <div className="text-xs font-bold text-slate-800 truncate">
                {cloudConfig.mode === 'local'
                  ? 'Database: Local AutoSave'
                  : cloudConfig.mode === 'firebase'
                  ? 'Cloud: Firebase RTDB'
                  : 'Cloud: Supabase SQL'}
              </div>
              <div className="text-[10px] text-slate-500 truncate">
                Bấm để cấu hình Cloud CLB
              </div>
            </div>
          </div>
          <span className="material-symbols-outlined text-[18px] text-slate-400">
            settings
          </span>
        </button>

        <div className="px-2 pt-1 flex items-center justify-between text-[11px] text-slate-400">
          <span>Học kỳ II • 2025</span>
          <button
            type="button"
            onClick={resetAllData}
            className="text-slate-400 hover:text-slate-700 font-medium inline-flex items-center gap-1 transition-colors"
            title="Khôi phục dữ liệu mẫu"
          >
            <span className="material-symbols-outlined text-[14px]">restart_alt</span>
            Reset mẫu
          </button>
        </div>
      </div>
    </aside>
  );
};
