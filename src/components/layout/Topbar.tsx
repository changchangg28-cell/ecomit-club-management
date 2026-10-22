import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEcomit } from '../../context/EcomitContext';

export const Topbar: React.FC = () => {
  const {
    tasks,
    openCreateTask,
    syncStatus,
    setIsCloudModalOpen,
  } = useEcomit();
  const location = useLocation();
  const navigate = useNavigate();

  const reviewCount = tasks.filter((t) => t.status === 'Review').length;

  const pageTitle: Record<string, string> = {
    '/dashboard': 'Dashboard',
    '/members': 'Thành viên',
    '/tasks': 'Công việc',
    '/reports': 'Xếp hạng',
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/85 backdrop-blur-xl border-b border-slate-200/70 px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <h1 className="text-lg font-extrabold text-slate-900 tracking-tight">
          {pageTitle[location.pathname] || 'Dashboard'}
        </h1>
      </div>

      <div className="flex items-center gap-2.5">
        {reviewCount > 0 && (
          <button
            type="button"
            onClick={() => navigate('/tasks')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200/70 text-xs font-bold transition-colors cursor-pointer"
          >
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span>{reviewCount} chờ duyệt</span>
          </button>
        )}

        <button
          type="button"
          onClick={() => setIsCloudModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100/80 hover:bg-slate-200/70 text-slate-700 text-xs font-bold transition-all cursor-pointer"
        >
          <span
            className={`w-2 h-2 rounded-full ${
              syncStatus === 'synced' ? 'bg-emerald-500' : 'bg-blue-500'
            }`}
          />
          <span>GitHub Online</span>
        </button>

        <button
          type="button"
          onClick={() => openCreateTask()}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold shadow-md shadow-blue-600/20 transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px]">add</span>
          <span>Giao việc</span>
        </button>
      </div>
    </header>
  );
};
