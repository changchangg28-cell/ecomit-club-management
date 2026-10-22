import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEcomit } from '../../context/EcomitContext';

export const Topbar: React.FC = () => {
  const {
    tasks,
    members,
    events,
    openCreateTask,
    syncStatus,
    cloudConfig,
    setIsCloudModalOpen,
  } = useEcomit();
  const location = useLocation();
  const navigate = useNavigate();

  const reviewCount = tasks.filter((t) => t.status === 'Review').length;
  const doneCount = tasks.filter((t) => t.status === 'Done').length;

  const pageMeta: Record<string, { title: string; subtitle: string }> = {
    '/dashboard': {
      title: 'Bảng Điều Hành & Thống Kê Tổng Hợp',
      subtitle: 'Theo dõi KPI, biểu đồ tiến độ 4 Ban chuyên môn, sự kiện và bảng dữ liệu trực tuyến',
    },
    '/members': {
      title: 'Quản Trị Nhân Sự & Thành Viên CLB',
      subtitle: `Danh sách ${members.length} thành viên thuộc 4 Ban chuyên môn ECOMIT LHU`,
    },
    '/tasks': {
      title: 'Quản Lý Sự Kiện & Phân Công Công Việc',
      subtitle: `${events.length} Sự kiện chính • ${tasks.length} Công việc (${doneCount} hoàn thành)`,
    },
    '/reports': {
      title: 'Báo Cáo Tổng Kết & Bảng Xếp Hạng Điểm Rèn Luyện',
      subtitle: 'Thống kê chi tiết và xuất báo cáo CSV cho Ban Chủ nhiệm & Khoa',
    },
  };

  const currentMeta = pageMeta[location.pathname] || pageMeta['/dashboard'];

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/90 px-6 flex items-center justify-between shadow-sm">
      <div className="min-w-0">
        <div className="flex items-center gap-2.5">
          <h1 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight truncate">
            {currentMeta.title}
          </h1>
          <span className="hidden lg:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
            HK2 • 2025-2026
          </span>
        </div>
        <p className="text-xs text-slate-500 truncate hidden sm:block">
          {currentMeta.subtitle}
        </p>
      </div>

      <div className="flex items-center gap-2.5 shrink-0">
        {/* Quick Summary Pill */}
        <div className="hidden xl:flex items-center gap-3 px-3.5 py-1.5 rounded-xl bg-slate-100/80 border border-slate-200/80 text-xs">
          <span className="text-slate-600">
            Nhân sự: <strong className="text-slate-900">{members.length}</strong>
          </span>
          <span className="text-slate-300">|</span>
          <span className="text-slate-600">
            Hoàn thành:{' '}
            <strong className="text-emerald-600">
              {doneCount}/{tasks.length}
            </strong>
          </span>
        </div>

        {/* Cloud Sync Pill */}
        <button
          type="button"
          onClick={() => setIsCloudModalOpen(true)}
          className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-bold transition-all ${
            syncStatus === 'synced'
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : syncStatus === 'error'
              ? 'bg-rose-50 text-rose-700 border-rose-200'
              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">
            {cloudConfig.mode === 'local' ? 'database' : 'cloud_done'}
          </span>
          <span className="hidden sm:inline">
            {cloudConfig.mode === 'github'
              ? 'GitHub DB'
              : cloudConfig.mode === 'local'
              ? 'Local DB'
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
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold transition-colors"
          >
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span>{reviewCount} chờ duyệt</span>
          </button>
        )}

        {/* Primary CTA */}
        <button
          type="button"
          onClick={() => openCreateTask()}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold shadow-sm shadow-blue-600/25 transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px]">add_task</span>
          <span>Giao việc mới</span>
        </button>
      </div>
    </header>
  );
};
