import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEcomit } from '../../context/EcomitContext';

export const Topbar: React.FC = () => {
  const {
    tasks,
    openCreateTask,
    syncStatus,
    cloudConfig,
    setIsCloudModalOpen,
  } = useEcomit();
  const location = useLocation();
  const navigate = useNavigate();

  const reviewCount = tasks.filter((t) => t.status === 'Review').length;

  const pageTitle: Record<string, string> = {
    '/dashboard': 'Tổng quan',
    '/members': 'Thành viên CLB',
    '/tasks': 'Công việc',
    '/reports': 'Báo cáo & Xếp loại',
  };

  return (
    <header className="sticky top-0 z-30 h-15 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <h1 className="text-lg font-extrabold text-slate-900 tracking-tight">
          {pageTitle[location.pathname] || 'Tổng quan'}
        </h1>
      </div>

      <div className="flex items-center gap-2.5">
        {/* Cloud Sync Pill */}
        <button
          type="button"
          onClick={() => setIsCloudModalOpen(true)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
            syncStatus === 'synced'
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : syncStatus === 'error'
              ? 'bg-rose-50 text-rose-700 border-rose-200'
              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">
            {cloudConfig.mode === 'local' ? 'cloud_upload' : 'cloud_done'}
          </span>
          <span className="hidden sm:inline">
            {cloudConfig.mode === 'local'
              ? 'Cloud DB'
              : cloudConfig.mode === 'firebase'
              ? 'Firebase'
              : 'Supabase'}
          </span>
        </button>

        {/* Pending Review Alert */}
        {reviewCount > 0 && (
          <button
            type="button"
            onClick={() => navigate('/tasks')}
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 text-xs font-semibold transition-colors"
          >
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span>{reviewCount} chờ duyệt</span>
          </button>
        )}

        {/* Primary CTA */}
        <button
          type="button"
          onClick={() => openCreateTask()}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm shadow-blue-600/20 transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px]">add</span>
          <span>Giao việc</span>
        </button>
      </div>
    </header>
  );
};
