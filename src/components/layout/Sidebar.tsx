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
    `group flex items-center justify-between px-4 py-3 rounded-2xl text-[13px] font-bold transition-all duration-200 ${
      isActive
        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/25'
        : 'text-slate-400 hover:bg-white/5 hover:text-white'
    }`;

  return (
    <aside className="fixed left-0 top-0 h-screen w-60 bg-[#0B0F19] text-white border-r border-slate-800/80 z-40 flex flex-col justify-between select-none">
      <div>
        {/* Brand */}
        <div className="h-16 px-5 flex items-center gap-3 border-b border-white/5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-cyan-400 text-white font-black text-sm flex items-center justify-center shadow-md shadow-blue-500/20">
            EC
          </div>
          <div>
            <div className="font-extrabold text-white text-sm tracking-tight leading-none">
              ECOMIT
            </div>
            <div className="text-[10px] font-semibold text-slate-500 mt-1 uppercase tracking-wider">
              LHU Club OS
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="p-3.5 space-y-1.5 mt-1">
          <NavLink to="/dashboard" className={linkClass}>
            {({ isActive }) => (
              <>
                <div className="flex items-center gap-3">
                  <span
                    className={`material-symbols-outlined text-[20px] ${
                      isActive ? 'text-white' : 'text-slate-500 group-hover:text-blue-400'
                    }`}
                  >
                    space_dashboard
                  </span>
                  <span>Dashboard</span>
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
                      isActive ? 'text-white' : 'text-slate-500 group-hover:text-blue-400'
                    }`}
                  >
                    groups
                  </span>
                  <span>Thành viên</span>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-lg text-[11px] font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-white/5 text-slate-400'
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
                      isActive ? 'text-white' : 'text-slate-500 group-hover:text-blue-400'
                    }`}
                  >
                    view_kanban
                  </span>
                  <span>Công việc</span>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-lg text-[11px] font-bold ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-amber-500/15 text-amber-400'
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
                      isActive ? 'text-white' : 'text-slate-500 group-hover:text-blue-400'
                    }`}
                  >
                    leaderboard
                  </span>
                  <span>Xếp hạng</span>
                </div>
              </>
            )}
          </NavLink>
        </div>
      </div>

      {/* Bottom Compact Status */}
      <div className="p-3.5 space-y-3">
        {/* Sleek Progress Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-b from-white/[0.06] to-white/[0.02] border border-white/10">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-semibold text-slate-400">Tiến độ CLB</span>
            <span className="font-extrabold text-emerald-400">{progressPct}%</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-emerald-400 transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* GitHub Sync Button */}
        <button
          type="button"
          onClick={() => setIsCloudModalOpen(true)}
          className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 flex items-center justify-between transition-all cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <span
              className={`w-2 h-2 rounded-full ${
                syncStatus === 'synced'
                  ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]'
                  : syncStatus === 'syncing'
                  ? 'bg-amber-400 animate-pulse'
                  : 'bg-blue-400'
              }`}
            />
            <span className="text-xs font-bold text-slate-200">
              {cloudConfig.mode === 'github'
                ? 'GitHub Sync'
                : cloudConfig.mode === 'local'
                ? 'Local Save'
                : 'Cloud DB'}
            </span>
          </div>
          <span className="material-symbols-outlined text-[16px] text-slate-400">
            tune
          </span>
        </button>

        <div className="px-1 flex items-center justify-between text-[11px] text-slate-500">
          <span>2025 • LHU</span>
          <button
            type="button"
            onClick={resetAllData}
            className="hover:text-slate-300 transition-colors cursor-pointer"
          >
            Reset
          </button>
        </div>
      </div>
    </aside>
  );
};
