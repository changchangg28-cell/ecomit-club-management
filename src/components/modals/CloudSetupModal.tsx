import React, { useState, useEffect } from 'react';
import { useEcomit } from '../../context/EcomitContext';
import { CloudConfig } from '../../services/cloudDb';

export const CloudSetupModal: React.FC = () => {
  const {
    isCloudModalOpen,
    setIsCloudModalOpen,
    cloudConfig,
    updateCloudConfig,
    syncStatus,
    lastSyncedAt,
  } = useEcomit();

  const [mode, setMode] = useState<CloudConfig['mode']>(cloudConfig.mode);
  const [supabaseUrl, setSupabaseUrl] = useState(cloudConfig.supabaseUrl);
  const [supabaseAnonKey, setSupabaseAnonKey] = useState(cloudConfig.supabaseAnonKey);
  const [firebaseDatabaseUrl, setFirebaseDatabaseUrl] = useState(
    cloudConfig.firebaseDatabaseUrl
  );

  useEffect(() => {
    if (isCloudModalOpen) {
      setMode(cloudConfig.mode);
      setSupabaseUrl(cloudConfig.supabaseUrl);
      setSupabaseAnonKey(cloudConfig.supabaseAnonKey);
      setFirebaseDatabaseUrl(cloudConfig.firebaseDatabaseUrl);
    }
  }, [isCloudModalOpen, cloudConfig]);

  if (!isCloudModalOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateCloudConfig({
      mode,
      supabaseUrl: supabaseUrl.trim(),
      supabaseAnonKey: supabaseAnonKey.trim(),
      firebaseDatabaseUrl: firebaseDatabaseUrl.trim(),
    });
    setIsCloudModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 backdrop-blur-xs p-4">
      <div className="w-full max-w-xl rounded-2xl bg-white shadow-float border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-[22px]">cloud_sync</span>
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Cấu hình Cloud Database (Dùng chung cho cả CLB)
              </h2>
              <p className="text-xs text-slate-500">
                Đồng bộ dữ liệu Thành viên &amp; Công việc theo thời gian thực qua Supabase hoặc Firebase
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsCloudModalOpen(false)}
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-5">
          {/* Mode Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Chọn phương thức lưu trữ Database
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => setMode('local')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  mode === 'local'
                    ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/20'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="material-symbols-outlined text-[20px] text-slate-700">
                    computer
                  </span>
                  {mode === 'local' && (
                    <span className="w-2 h-2 rounded-full bg-blue-600" />
                  )}
                </div>
                <div className="text-xs font-bold text-slate-900">Local Browser</div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Lưu nhanh trên trình duyệt máy này
                </div>
              </button>

              <button
                type="button"
                onClick={() => setMode('firebase')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  mode === 'firebase'
                    ? 'border-amber-500 bg-amber-50/50 ring-2 ring-amber-500/20'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="material-symbols-outlined text-[20px] text-amber-600">
                    local_fire_department
                  </span>
                  {mode === 'firebase' && (
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                  )}
                </div>
                <div className="text-xs font-bold text-slate-900">Firebase Cloud</div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Realtime DB (Chỉ cần dán 1 link URL)
                </div>
              </button>

              <button
                type="button"
                onClick={() => setMode('supabase')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  mode === 'supabase'
                    ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="material-symbols-outlined text-[20px] text-emerald-600">
                    database
                  </span>
                  {mode === 'supabase' && (
                    <span className="w-2 h-2 rounded-full bg-emerald-600" />
                  )}
                </div>
                <div className="text-xs font-bold text-slate-900">Supabase PostgreSQL</div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Chuẩn SQL Cloud cho CLB
                </div>
              </button>
            </div>
          </div>

          {/* Mode details */}
          {mode === 'local' && (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 space-y-1.5">
              <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-blue-600">
                  info
                </span>
                Chế độ Local Browser đang bật
              </div>
              <p>
                Mọi thay đổi khi bạn thêm thành viên, giao việc hay duyệt việc đều tự động lưu vào bộ nhớ trình duyệt trên máy của bạn. Để cả CLB truy cập chung trên nhiều thiết bị, hãy chọn <strong>Firebase Cloud</strong> hoặc <strong>Supabase</strong> ở trên.
              </p>
            </div>
          )}

          {mode === 'firebase' && (
            <div className="space-y-3 p-4 rounded-xl bg-amber-50/40 border border-amber-200/80">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Firebase Realtime Database URL <span className="text-rose-500">*</span>
                </label>
                <input
                  type="url"
                  required
                  value={firebaseDatabaseUrl}
                  onChange={(e) => setFirebaseDatabaseUrl(e.target.value)}
                  placeholder="https://ecomit-lhu-default-rtdb.asia-southeast1.firebasedatabase.app"
                  className="w-full h-10 px-3.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div className="text-[11px] text-slate-600 leading-relaxed space-y-1">
                <p className="font-semibold text-slate-800">
                  Hướng dẫn tạo miễn phí trong 30 giây:
                </p>
                <p>
                  1. Vào <strong>console.firebase.google.com</strong> → Tạo project → Chọn <strong>Realtime Database</strong> → <strong>Create Database (Start in Test Mode)</strong>.
                </p>
                <p>
                  2. Copy đường link URL của Database dán vào ô trên và bấm Lưu. Hệ thống sẽ tự động đẩy toàn bộ dữ liệu CLB lên Cloud!
                </p>
              </div>
            </div>
          )}

          {mode === 'supabase' && (
            <div className="space-y-3 p-4 rounded-xl bg-emerald-50/40 border border-emerald-200/80">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Supabase Project URL <span className="text-rose-500">*</span>
                </label>
                <input
                  type="url"
                  required
                  value={supabaseUrl}
                  onChange={(e) => setSupabaseUrl(e.target.value)}
                  placeholder="https://xyzcompany.supabase.co"
                  className="w-full h-10 px-3.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Supabase Anon Public Key <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={supabaseAnonKey}
                  onChange={(e) => setSupabaseAnonKey(e.target.value)}
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  className="w-full h-10 px-3.5 rounded-xl border border-slate-200 bg-white text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div className="text-[11px] text-slate-600 leading-relaxed space-y-1">
                <p className="font-semibold text-slate-800">
                  Lệnh SQL tạo bảng trong Supabase SQL Editor:
                </p>
                <pre className="p-2.5 rounded-lg bg-slate-900 text-emerald-300 font-mono text-[10px] overflow-x-auto">
{`create table if not exists public.ecomit_store (
  id text primary key,
  payload jsonb not null,
  updated_at timestamptz default now()
);
alter table public.ecomit_store disable row level security;`}
                </pre>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <div className="text-xs text-slate-500">
              Trạng thái:{' '}
              <strong className="text-slate-800">
                {syncStatus === 'synced'
                  ? `Đã đồng bộ Cloud (${lastSyncedAt || 'vừa xong'})`
                  : syncStatus === 'syncing'
                  ? 'Đang đồng bộ...'
                  : syncStatus === 'error'
                  ? 'Lỗi kết nối Cloud'
                  : 'Lưu cục bộ (LocalStorage)'}
              </strong>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsCloudModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold"
              >
                Đóng
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm"
              >
                Lưu &amp; Đồng bộ ngay
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
