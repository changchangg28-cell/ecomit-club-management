import React from 'react';
import { NavLink } from 'react-router-dom';
import { useEcomit } from '../../context/EcomitContext';

export const Sidebar: React.FC = () => {
  const {
    members,
    tasks,
    events,
    resetAllData,
    syncStatus,
    cloudConfig,
    setIsCloudModalOpen,
  } = useEcomit();

  const doneCount = tasks.filter((t) => t.status === 'Done').length;
  const reviewCount = tasks.filter((t) => t.status === 'Review').length;
  const inProgressCount = tasks.filter((t) => t.status === 'InProgress').length;
  const pendingCount = tasks.length - doneCount;
  const progressPct = tasks.length > 0 ? Math.round((doneCount / tasks.length) * 100) : 0;

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-150 ${
      isActive
        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/25'
        : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
    }`;

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-[#0f172a] text-white border-r border-slate-800 z-40 flex flex-col justify-between select-none">
      <div>
        {/* Brand Header */}
        <div className="h-16 px-5 flex items-center gap-3 border-b border-slate-800/90">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 text-white font-extrabold text-sm flex items-center justify-center shadow-md shadow-indigo-500/30 ring-2 ring-white/10">
            EC
          </div>
          <div>
            <div className="font-extrabold text-white text-sm tracking-tight leading-none flex items-center gap-1.5">
              <span>ECOMIT PRO</span>
              <span className="px-1.5 py-0.5 text-[9px] font-bold bg-blue-500/20 text-blue-300 rounded border border-blue-400/30">
                v6
              </span>
            </div>
            <div className="text-[11px] font-medium text-slate-400 mt-1">
              ĐH Lạc Hồng • Quản trị CLB
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="p-3.5 space-y-1.5">
          <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-400">
            Menu Điều Hành
          </div>

          <NavLink to="/dashboard" className={linkClass}>
            {({ isActive }) => (
              <>
                <div className="flex items-center gap-3">
                  <span
                    className={`material-symbols-outlined text-[20px] ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'
                    }`}
                  >
                    space_dashboard
                  </span>
                  <span>Dashboard &amp; Thống kê</span>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-blue-400'
                  }`}
                >
                  Live
                </span>
              </>
            )}
          </NavLink>

          <NavLink to="/members" className={linkClass}>
            {({ isActive }) => (
              <>
                <div className="flex items-center gap-3">
                  <span
                    className={`material-symbols-outlined text-[20px] ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'
                    }`}
                  >
                    groups
                  </span>
                  <span>Thành viên &amp; Nhân sự</span>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-300'
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
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'
                    }`}
                  >
                    assignment_turned_in
                  </span>
                  <span>Sự kiện &amp; Công việc</span>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
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
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'
                    }`}
                  >
                    analytics
                  </span>
                  <span>Báo cáo &amp; Xếp hạng</span>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}
                >
                  {progressPct}%
                </span>
              </>
            )}
          </NavLink>
        </div>

        {/* Mini Analytics Widget in Sidebar */}
        <div className="mx-3.5 mt-2 p-4 rounded-2xl bg-slate-800/90 border border-slate-700/80 shadow-inner">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-semibold text-slate-300">Hiệu suất toàn CLB</span>
            <span className="font-extrabold text-emerald-400">{progressPct}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 via-indigo-400 to-emerald-400 transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>

          <div className="grid grid-cols-3 gap-1.5 mt-3 pt-3 border-t border-slate-700/70 text-center">
            <div className="bg-slate-900/90 rounded-lg py-1.5 px-1">
              <div className="text-xs font-extrabold text-emerald-400">{doneCount}</div>
              <div className="text-[10px] text-slate-400">Đã xong</div>
            </div>
            <div className="bg-slate-900/90 rounded-lg py-1.5 px-1">
              <div className="text-xs font-extrabold text-blue-400">{inProgressCount}</div>
              <div className="text-[10px] text-slate-400">Đang làm</div>
            </div>
            <div className="bg-slate-900/90 rounded-lg py-1.5 px-1">
              <div className="text-xs font-extrabold text-amber-400">{reviewCount}</div>
              <div className="text-[10px] text-slate-400">Chờ duyệt</div>
            </div>
          </div>

          <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400">
            <span>Chiến dịch đang chạy:</span>
            <span className="font-bold text-white">{events.length} sự kiện</span>
          </div>
        </div>
      </div>

      {/* Footer: Cloud DB Status + Reset */}
      <div className="p-3.5 border-t border-slate-800 space-y-2">
        <button
          type="button"
          onClick={() => setIsCloudModalOpen(true)}
          className="w-full p-2.5 rounded-xl border border-slate-700/80 hover:border-blue-500/60 bg-slate-800/60 hover:bg-slate-800 flex items-center justify-between transition-all text-left"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <span
              className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                syncStatus === 'synced'
                  ? 'bg-emerald-400 ring-4 ring-emerald-400/20'
                  : syncStatus === 'syncing'
                  ? 'bg-amber-400 animate-pulse'
                  : syncStatus === 'error'
                  ? 'bg-rose-500'
                  : 'bg-blue-400'
              }`}
            />
            <div className="min-w-0">
              <div className="text-xs font-bold text-slate-100 truncate">
                {cloudConfig.mode === 'github'
                  ? 'GitHub Cloud DB (Online)'
                  : cloudConfig.mode === 'local'
                  ? 'Database: Local AutoSave'
                  : cloudConfig.mode === 'firebase'
                  ? 'Cloud: Firebase RTDB'
                  : 'Cloud: Supabase SQL'}
              </div>
              <div className="text-[10px] text-slate-400 truncate">
                Đồng bộ dữ liệu thời gian thực
              </div>
            </div>
          </div>
          <span className="material-symbols-outlined text-[18px] text-slate-400">
            settings
          </span>
        </button>

        <div className="px-2 pt-1 flex items-center justify-between text-[11px] text-slate-400">
          <span>Học kỳ II • 2025-2026</span>
          <button
            type="button"
            onClick={resetAllData}
            className="text-slate-400 hover:text-white font-medium inline-flex items-center gap-1 transition-colors"
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
