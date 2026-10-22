import React, { useState, useEffect, useRef } from 'react';
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
    exportBackupJson,
    importBackupJson,
  } = useEcomit();

  const [mode, setMode] = useState<CloudConfig['mode']>(cloudConfig.mode);
  const [githubRepo, setGithubRepo] = useState(
    cloudConfig.githubRepo || 'changchangg28-cell/ecomit-club-management'
  );
  const [githubToken, setGithubToken] = useState(cloudConfig.githubToken || '');
  const [firebaseDatabaseUrl, setFirebaseDatabaseUrl] = useState(
    cloudConfig.firebaseDatabaseUrl
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isCloudModalOpen) {
      setMode(cloudConfig.mode);
      setGithubRepo(
        cloudConfig.githubRepo || 'changchangg28-cell/ecomit-club-management'
      );
      setGithubToken(cloudConfig.githubToken || '');
      setFirebaseDatabaseUrl(cloudConfig.firebaseDatabaseUrl);
    }
  }, [isCloudModalOpen, cloudConfig]);

  if (!isCloudModalOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateCloudConfig({
      ...cloudConfig,
      mode,
      githubRepo: githubRepo.trim() || 'changchangg28-cell/ecomit-club-management',
      githubToken: githubToken.trim(),
      firebaseDatabaseUrl: firebaseDatabaseUrl.trim(),
    });
    setIsCloudModalOpen(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        const ok = importBackupJson(reader.result);
        if (ok) setIsCloudModalOpen(false);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-xl rounded-2xl bg-white shadow-float border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-[22px]">cloud_done</span>
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                Lưu Trữ Dữ Liệu Trực Tiếp Trên GitHub (Đơn Giản Nhất)
              </h2>
              <p className="text-xs text-slate-500">
                Tự động lưu online vào file <code className="font-mono text-indigo-600">ecomit-db.json</code> ngay trên kho GitHub của CLB
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
            <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">
              Chế độ lưu trữ Database CLB
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => setMode('github')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  mode === 'github'
                    ? 'border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-500/20'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="material-symbols-outlined text-[20px] text-indigo-600">
                    cloud_sync
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-emerald-100 text-emerald-700">
                    Khuyên dùng
                  </span>
                </div>
                <div className="text-xs font-extrabold text-slate-900">
                  Lưu trên GitHub
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Lưu thẳng lên kho Git của bạn (Online 100%)
                </div>
              </button>

              <button
                type="button"
                onClick={() => setMode('local')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  mode === 'local'
                    ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/20'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="material-symbols-outlined text-[20px] text-blue-600">
                    computer
                  </span>
                  {mode === 'local' && (
                    <span className="w-2 h-2 rounded-full bg-blue-600" />
                  )}
                </div>
                <div className="text-xs font-extrabold text-slate-900">
                  Lưu trên Máy
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Tự lưu vào trình duyệt + Xuất file JSON
                </div>
              </button>

              <button
                type="button"
                onClick={() => setMode('firebase')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
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
                <div className="text-xs font-extrabold text-slate-900">
                  Firebase URL
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Tùy chọn phụ nếu dùng Firebase
                </div>
              </button>
            </div>
          </div>

          {/* Mode details */}
          {mode === 'github' && (
            <div className="space-y-3 p-4 rounded-xl bg-indigo-50/50 border border-indigo-200/80">
              <div className="flex items-center gap-2 text-xs font-extrabold text-indigo-900">
                <span className="material-symbols-outlined text-[18px] text-emerald-600">
                  verified
                </span>
                <span>
                  Đã kết nối trực tiếp với kho GitHub của bạn — Không cần cài đặt thêm!
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Kho lưu trữ GitHub (Repository)
                  </label>
                  <input
                    type="text"
                    value={githubRepo}
                    onChange={(e) => setGithubRepo(e.target.value)}
                    placeholder="changchangg28-cell/ecomit-club-management"
                    className="w-full h-9 px-3 rounded-xl border border-slate-200 bg-white text-xs font-mono text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    GitHub Token mới (Để trống nếu dùng mặc định)
                  </label>
                  <input
                    type="password"
                    value={githubToken}
                    onChange={(e) => setGithubToken(e.target.value)}
                    placeholder="Đang dùng khóa kết nối tích hợp sẵn"
                    className="w-full h-9 px-3 rounded-xl border border-slate-200 bg-white text-xs text-slate-800"
                  />
                </div>
              </div>

              <p className="text-[11px] text-slate-600 leading-relaxed">
                💡 Mọi thao tác <strong>Thêm thành viên, Giao việc, Đổi trạng thái</strong> trên web sẽ tự động ghi thẳng vào file{' '}
                <code className="font-mono font-bold text-indigo-700">ecomit-db.json</code> trên kho GitHub của bạn. Tất cả thành viên mở link web đều thấy dữ liệu mới nhất!
              </p>
            </div>
          )}

          {mode === 'local' && (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 space-y-1.5">
              <div className="font-bold text-slate-800 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-blue-600">
                  info
                </span>
                Chế độ Lưu trên trình duyệt (Local AutoSave)
              </div>
              <p>
                Mọi thay đổi tự động lưu ngay trên trình duyệt máy của bạn. Bạn cũng có thể bấm nút <strong>Tải file dữ liệu (.json)</strong> bên dưới để gửi qua Zalo.
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
                  className="w-full h-10 px-3.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900"
                />
              </div>
            </div>
          )}

          {/* Quick File Backup Section (1-Click JSON Export / Import) */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="text-xs font-extrabold text-slate-800">
                Sao lưu / Chia sẻ qua File (.json)
              </div>
              <div className="text-[11px] text-slate-500">
                Tải toàn bộ dữ liệu CLB thành 1 file để cất giữ hoặc gửi qua Zalo
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={exportBackupJson}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[15px]">download</span>
                <span>Tải file .json</span>
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-blue-600 border border-blue-200 text-xs font-bold transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[15px]">upload_file</span>
                <span>Nhập file</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <div className="text-xs text-slate-500">
              Trạng thái:{' '}
              <strong className="text-emerald-600">
                {syncStatus === 'synced'
                  ? `Đã lưu lên GitHub (${lastSyncedAt || 'vừa xong'})`
                  : syncStatus === 'syncing'
                  ? 'Đang lưu lên GitHub...'
                  : syncStatus === 'error'
                  ? 'Đang lưu trên máy (Local)'
                  : 'Tự động lưu'}
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
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm cursor-pointer"
              >
                Lưu &amp; Đồng bộ GitHub ngay
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
