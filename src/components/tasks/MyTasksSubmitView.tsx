import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useEcomit } from '../../context/EcomitContext';
import { Task } from '../../types';

interface MyTasksSubmitViewProps {
  tasks: Task[];
}

export const MyTasksSubmitView: React.FC<MyTasksSubmitViewProps> = ({ tasks }) => {
  const { currentUser, submitTaskResult, updateTaskStatus } = useEcomit();
  const [onlyMine, setOnlyMine] = useState(false);

  const displayedTasks = onlyMine
    ? tasks.filter((t) => t.assignedMemberId === currentUser.id)
    : tasks;

  const [selectedTaskId, setSelectedTaskId] = useState<string>(
    displayedTasks[0]?.id || tasks[0]?.id || ''
  );

  const selectedTask =
    displayedTasks.find((t) => t.id === selectedTaskId) ||
    displayedTasks[0] ||
    tasks[0];

  const [platform, setPlatform] = useState<'Google Drive' | 'Canva' | 'Google Docs' | 'Figma'>(
    'Google Drive'
  );
  const [linkUrl, setLinkUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [markCompleted, setMarkCompleted] = useState(true);

  useEffect(() => {
    if (selectedTask) {
      setLinkUrl(selectedTask.actualResultLink || '');
      setPlatform(selectedTask.actualResultPlatform || 'Google Drive');
      setNotes(selectedTask.actualResultNotes || '');
    }
  }, [selectedTask?.id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTask || !linkUrl.trim()) return;
    submitTaskResult(selectedTask.id, linkUrl.trim(), platform, notes.trim(), markCompleted);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
      {/* Left Column: Personal Tasks Queue (7 cols) */}
      <div className="lg:col-span-7 flex flex-col gap-4">
        <div className="rounded-2xl bg-surface-container-lowest p-5 shadow-sm border border-outline-variant/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-headline-sm text-headline-sm text-primary">
                Danh Sách Công Việc Cần Nộp Kết Quả
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm">
                Screen 06
              </span>
            </div>
            <p className="font-body-sm text-on-surface-variant">
              Chọn 1 công việc bên dưới để đính kèm link Google Drive / Canva / Docs nghiệm thu
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-surface-container-low p-1 rounded-xl shrink-0">
            <button
              type="button"
              onClick={() => setOnlyMine(false)}
              className={`px-3 py-1.5 rounded-lg font-label-sm text-label-sm transition-colors ${
                !onlyMine
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              Tất cả ({tasks.length})
            </button>
            <button
              type="button"
              onClick={() => setOnlyMine(true)}
              className={`px-3 py-1.5 rounded-lg font-label-sm text-label-sm transition-colors ${
                onlyMine
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              Của {currentUser.fullName.split(' ').slice(-2).join(' ')} (
              {tasks.filter((t) => t.assignedMemberId === currentUser.id).length})
            </button>
          </div>
        </div>

        {/* Task Cards */}
        <div className="space-y-3">
          {displayedTasks.map((task) => {
            const isSelected = selectedTask?.id === task.id;
            return (
              <div
                key={task.id}
                onClick={() => setSelectedTaskId(task.id)}
                className={`cursor-pointer rounded-2xl p-5 transition-all border ${
                  isSelected
                    ? 'bg-surface-container-lowest border-2 border-primary shadow-md ring-4 ring-primary/5'
                    : 'bg-surface-container-lowest border-outline-variant/30 hover:border-primary/40 shadow-sm'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs text-outline">{task.code}</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-surface-container-high text-primary font-label-sm text-label-sm">
                      {task.team}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full font-label-sm text-label-sm ${
                        task.status === 'Completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : task.status === 'In Progress'
                          ? 'bg-primary-fixed text-on-primary-fixed'
                          : 'bg-secondary-fixed text-on-secondary-fixed'
                      }`}
                    >
                      {task.status === 'Completed'
                        ? 'Đã Hoàn Thành'
                        : task.status === 'In Progress'
                        ? 'Đang Thực Hiện'
                        : 'Chưa Thực Hiện'}
                    </span>
                  </div>

                  <span className="font-label-sm text-label-sm text-outline flex items-center gap-1 shrink-0">
                    <span className="material-symbols-outlined text-[15px]">schedule</span>
                    {task.deadline}
                  </span>
                </div>

                <h4 className="font-headline-sm text-headline-sm text-primary mb-1.5">
                  {task.title}
                </h4>
                <p className="font-body-sm text-on-surface-variant mb-3">
                  <strong>Yêu cầu đầu ra:</strong> {task.expectedResult}
                </p>

                <div className="flex items-center justify-between pt-3 border-t border-surface-container-high">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center font-label-sm ${task.assignedMemberAvatarBg}`}
                    >
                      {task.assignedMemberAvatar}
                    </div>
                    <span className="font-label-md text-on-surface">{task.assignedMemberName}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {task.actualResultLink && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-label-sm text-label-sm">
                        <span className="material-symbols-outlined text-[15px]">task_alt</span>
                        <span>Đã đính kèm link</span>
                      </span>
                    )}
                    <Link
                      to={`/tasks/${task.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="px-3 py-1 rounded-lg bg-surface-container-low hover:bg-primary hover:text-white text-primary font-label-sm text-label-sm transition-colors"
                    >
                      Mở chi tiết
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Column: Deliverable Submission Form (5 cols - Screen 06) */}
      <div className="lg:col-span-5 sticky top-20">
        {selectedTask && (
          <div className="rounded-3xl bg-surface-container-lowest shadow-lg border border-outline-variant/40 overflow-hidden">
            <div className="bg-gradient-to-r from-primary via-primary-container to-[#0d3b82] text-white p-6">
              <div className="flex items-center gap-2 mb-1">
                <span className="material-symbols-outlined text-tertiary-fixed-dim">
                  cloud_upload
                </span>
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary-fixed">
                  Cổng nộp sản phẩm • {selectedTask.code}
                </span>
              </div>
              <h3 className="font-headline-md text-headline-md text-white">
                Nộp Kết Quả &amp; Báo Cáo Hoàn Thành
              </h3>
              <p className="font-body-sm text-primary-fixed mt-1 line-clamp-2">
                Đang chọn: <strong>{selectedTask.title}</strong>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Platform Selector */}
              <div>
                <label className="block font-label-md text-label-md text-primary mb-2">
                  1. Chọn nền tảng lưu trữ kết quả
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['Google Drive', 'Canva', 'Google Docs', 'Figma'] as const).map((plat) => (
                    <button
                      key={plat}
                      type="button"
                      onClick={() => setPlatform(plat)}
                      className={`py-2 px-2.5 rounded-xl font-label-sm text-label-sm border transition-all ${
                        platform === plat
                          ? 'bg-primary-fixed border-primary text-primary font-bold shadow-sm'
                          : 'bg-surface-container-low border-transparent text-on-surface-variant hover:bg-surface-container-high'
                      }`}
                    >
                      {plat}
                    </button>
                  ))}
                </div>
              </div>

              {/* URL Input */}
              <div>
                <label className="block font-label-md text-label-md text-primary mb-1.5">
                  2. Đường dẫn kết quả thực tế (Link URL) <span className="text-secondary">*</span>
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-[18px]">
                    link
                  </span>
                  <input
                    type="url"
                    required
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    placeholder="https://drive.google.com/... hoặc https://www.canva.com/..."
                    className="w-full h-11 pl-10 pr-4 rounded-xl bg-surface-container-low border border-outline-variant/50 text-on-surface font-body-sm focus:outline-none focus:ring-2 focus:ring-primary-container"
                  />
                </div>
                <div className="flex items-center gap-2 mt-1.5">
                  <button
                    type="button"
                    onClick={() =>
                      setLinkUrl('https://drive.google.com/drive/folders/ecomit-lhu-deliverable-2025')
                    }
                    className="text-[11px] text-primary hover:underline font-semibold"
                  >
                    + Điền nhanh link Drive mẫu
                  </button>
                  <span className="text-outline">•</span>
                  <button
                    type="button"
                    onClick={() =>
                      setLinkUrl('https://www.canva.com/design/ecomit-lhu-live12-banner')
                    }
                    className="text-[11px] text-secondary hover:underline font-semibold"
                  >
                    + Điền nhanh link Canva mẫu
                  </button>
                </div>
              </div>

              {/* Handover Notes */}
              <div>
                <label className="block font-label-md text-label-md text-primary mb-1.5">
                  3. Ghi chú bàn giao cho Trưởng ban / Chủ nhiệm
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Mô tả tóm tắt những gì đã hoàn thành, số lượng file hoặc điểm cần lưu ý khi duyệt..."
                  className="w-full p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/50 text-on-surface font-body-sm focus:outline-none focus:ring-2 focus:ring-primary-container"
                />
              </div>

              {/* Checkbox Mark Completed */}
              <label className="flex items-center gap-2.5 p-3 rounded-xl bg-surface-container-low cursor-pointer">
                <input
                  type="checkbox"
                  checked={markCompleted}
                  onChange={(e) => setMarkCompleted(e.target.checked)}
                  className="w-4 h-4 rounded text-primary focus:ring-primary"
                />
                <span className="font-label-md text-on-surface">
                  Đánh dấu công việc <strong>Đã Hoàn Thành (Completed)</strong> ngay khi nộp
                </span>
              </label>

              {/* Submit Buttons */}
              <div className="flex items-center gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => updateTaskStatus(selectedTask.id, 'In Progress')}
                  className="px-4 py-2.5 rounded-xl bg-surface-container-high text-primary font-label-md hover:bg-surface-container-highest transition-colors"
                >
                  Lưu nháp
                </button>
                <button
                  type="submit"
                  className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-secondary text-on-secondary hover:bg-secondary-container font-label-lg text-label-lg font-semibold shadow-md transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]">send</span>
                  <span>Nộp Kết Quả Nghiệm Thu</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
