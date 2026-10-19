import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { AssignTaskModal } from '../modals/AssignTaskModal';
import { TaskDetailDrawer } from '../modals/TaskDetailDrawer';
import { CloudSetupModal } from '../modals/CloudSetupModal';
import { useEcomit } from '../../context/EcomitContext';

export const AppShell: React.FC = () => {
  const { toast } = useEcomit();

  return (
    <div className="min-h-screen bg-slate-50/80 text-slate-900">
      <Sidebar />
      <div className="pl-64 flex flex-col min-h-screen">
        <Topbar />
        <main className="flex-1 p-6 max-w-[1440px] w-full mx-auto">
          <Outlet />
        </main>
      </div>

      <AssignTaskModal />
      <TaskDetailDrawer />
      <CloudSetupModal />

      {toast && (
        <div className="fixed bottom-5 right-5 z-50 px-4 py-3 rounded-xl bg-slate-900 text-white text-xs font-semibold shadow-float flex items-center gap-2.5 border border-slate-700">
          <span className="material-symbols-outlined text-emerald-400 text-[18px]">
            check_circle
          </span>
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
};
