import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useEcomit } from '../context/EcomitContext';
import { TaskStatus } from '../types';

export const TaskDetailPage: React.FC = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();
  const {
    tasks,
    updateTaskStatus,
    toggleTaskChecklist,
    deleteTask,
    submitTaskResult,
    addTaskComment,
    currentUser,
  } = useEcomit();

  const task = tasks.find((t) => t.id === taskId) || tasks[0];

  const [commentText, setCommentText] = useState('');
  const [quickLink, setQuickLink] = useState('');
  const [quickPlatform, setQuickPlatform] = useState<
    'Google Drive' | 'Canva' | 'Google Docs' | 'Figma'
  >('Google Docs');

  if (!task) return null;

  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addTaskComment(task.id, commentText);
    setCommentText('');
  };

  const handleQuickSubmitLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickLink.trim()) return;
    submitTaskResult(
      task.id,
      quickLink.trim(),
      quickPlatform,
      'Cập nhật file bàn giao bổ sung từ trang Chi tiết công việc',
      true
    );
    setQuickLink('');
  };

  return (
    <div className="flex flex-col w-full pb-16 max-w-7xl mx-auto">
      {/* Top Back Navigation */}
      <div className="pt-4 mb-4 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2 text-body-sm">
          <Link
            to="/tasks"
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-surface-container-lowest text-primary hover:bg-surface-container-high font-label-md shadow-sm transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            <span>Quay lại Danh sách Task</span>
          </Link>
          <span className="text-outline">/</span>
          <span className="font-mono text-xs text-primary font-semibold">{task.code}</span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-label-sm text-outline uppercase">Đổi trạng thái:</span>
          {(['Not Started', 'In Progress', 'Completed'] as TaskStatus[]).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => updateTaskStatus(task.id, st)}
              className={`px-3 py-1.5 rounded-xl font-label-sm transition-colors ${
                task.status === st
                  ? st === 'Completed'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : st === 'In Progress'
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-secondary text-white shadow-sm'
                  : 'bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              {st === 'Not Started'
                ? 'Chưa làm'
                : st === 'In Progress'
                ? 'Đang thực hiện'
                : 'Đã hoàn thành'}
            </button>
          ))}
          <button
            type="button"
            onClick={() => {
              deleteTask(task.id);
              navigate('/tasks');
            }}
            className="px-3 py-1.5 rounded-xl bg-secondary-fixed/50 text-secondary hover:bg-secondary hover:text-white font-label-sm transition-colors"
          >
            Xóa task
          </button>
        </div>
      </div>

      {/* Hero Task Header */}
      <section className="rounded-3xl bg-surface-container-lowest p-6 sm:p-8 shadow-sm border border-outline-variant/30 mb-6">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm uppercase">
            🔥 Ưu tiên: {task.priority}
          </span>
          <span className="px-3 py-1 rounded-full bg-surface-container-highest text-primary font-label-sm">
            {task.team}
          </span>
          {task.liveSessionCode && (
            <span className="px-3 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-sm">
              📌 Hạng mục: {task.liveSessionCode}
            </span>
          )}
        </div>

        <h1 className="font-headline-lg text-headline-lg text-primary mb-4">{task.title}</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-surface-container-high">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center font-label-lg font-bold ${task.assignedMemberAvatarBg}`}
            >
              {task.assignedMemberAvatar}
            </div>
            <div>
              <span className="text-xs text-outline block">Người thực hiện (Assignee)</span>
              <span className="font-label-md text-primary">{task.assignedMemberName}</span>
            </div>
          </div>

          <div>
            <span className="text-xs text-outline block">Chức vụ trong CLB</span>
            <span className="font-label-md text-on-surface">{task.assignedMemberRole}</span>
          </div>

          <div>
            <span className="text-xs text-outline block">Hạn chót bàn giao</span>
            <span className="font-label-md text-secondary font-semibold">{task.deadline}</span>
          </div>

          <div>
            <span className="text-xs text-outline block">Trạng thái nghiệm thu</span>
            <span
              className={`inline-flex items-center gap-1.5 font-label-md ${
                task.status === 'Completed'
                  ? 'text-emerald-700'
                  : task.status === 'In Progress'
                  ? 'text-primary'
                  : 'text-secondary'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-current"></span>
              {task.status === 'Completed'
                ? 'Đã Hoàn Thành & Nghiệm Thu'
                : task.status === 'In Progress'
                ? 'Đang Thực Hiện'
                : 'Chưa Thực Hiện'}
            </span>
          </div>
        </div>
      </section>

      {/* Main 2-Column Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
        {/* Left 7 Cols: Goal, Checklist & Deliverables */}
        <div className="lg:col-span-7 flex flex-col gap-space-lg">
          {/* Card 1: Mục tiêu & Kết quả bàn giao kỳ vọng */}
          <div className="rounded-2xl bg-surface-container-lowest p-6 shadow-sm border border-outline-variant/30">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-9 h-9 rounded-xl bg-primary-container text-on-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">flag</span>
              </div>
              <h2 className="font-headline-sm text-headline-sm text-primary">
                Mục tiêu &amp; Kết quả bàn giao kỳ vọng
              </h2>
            </div>

            <p className="font-body-md text-on-surface-variant leading-relaxed mb-4">
              {task.description}
            </p>

            <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/30 mb-4">
              <span className="font-label-sm text-primary uppercase tracking-wider block mb-1">
                Đầu ra chuẩn nghiệm thu (Expected Output):
              </span>
              <p className="font-body-sm text-on-surface font-medium">{task.expectedResult}</p>
            </div>

            {task.checklist && task.checklist.length > 0 && (
              <div>
                <h4 className="font-label-md text-primary mb-2">
                  Checklist các bước thực hiện (Nhấn để đánh dấu hoàn thành:{' '}
                  {task.checklist.filter((c) => c.done).length}/{task.checklist.length})
                </h4>
                <div className="space-y-2">
                  {task.checklist.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggleTaskChecklist(task.id, item.id)}
                      className="w-full text-left flex items-start gap-2.5 p-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container-high transition-colors text-body-sm"
                    >
                      <span
                        className={`material-symbols-outlined text-[18px] mt-0.5 ${
                          item.done ? 'text-emerald-600' : 'text-outline'
                        }`}
                      >
                        {item.done ? 'check_box' : 'check_box_outline_blank'}
                      </span>
                      <span
                        className={
                          item.done
                            ? 'text-on-surface line-through opacity-80'
                            : 'text-on-surface font-medium'
                        }
                      >
                        {item.text}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Card 2: Sản phẩm thực tế & File nộp duyệt */}
          <div className="rounded-2xl bg-surface-container-lowest p-6 shadow-sm border border-outline-variant/30">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">folder_special</span>
                </div>
                <div>
                  <h2 className="font-headline-sm text-headline-sm text-primary">
                    Sản phẩm thực tế &amp; File nộp duyệt
                  </h2>
                  <p className="text-xs text-outline">
                    Các đường dẫn Google Drive, Canva và tài liệu đã đính kèm
                  </p>
                </div>
              </div>
            </div>

            {/* Primary Actual Link */}
            {task.actualResultLink && (
              <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="px-2 py-0.5 rounded bg-emerald-600 text-white font-label-sm text-[10px]">
                      {task.actualResultPlatform || 'Google Drive'}
                    </span>
                    <span className="font-label-md text-emerald-950 truncate">
                      Link bàn giao chính thức
                    </span>
                  </div>
                  <a
                    href={task.actualResultLink}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-xs text-emerald-700 hover:underline break-all"
                  >
                    {task.actualResultLink}
                  </a>
                  {task.actualResultNotes && (
                    <p className="text-xs text-emerald-900 mt-1">{task.actualResultNotes}</p>
                  )}
                </div>
                <a
                  href={task.actualResultLink}
                  target="_blank"
                  rel="noreferrer"
                  className="shrink-0 inline-flex items-center gap-1 px-3.5 py-2 rounded-xl bg-emerald-700 text-white font-label-sm hover:bg-emerald-800 transition-colors"
                >
                  <span>Mở file</span>
                  <span className="material-symbols-outlined text-[15px]">open_in_new</span>
                </a>
              </div>
            )}

            {/* Deliverables List */}
            {task.deliverables && task.deliverables.length > 0 && (
              <div className="space-y-2.5 mb-5">
                {task.deliverables.map((del) => (
                  <div
                    key={del.id}
                    className="flex items-center justify-between p-3.5 rounded-xl bg-surface-container-low"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="material-symbols-outlined text-primary">description</span>
                      <div className="min-w-0">
                        <div className="font-label-md text-primary truncate">{del.title}</div>
                        <div className="text-xs text-outline">
                          {del.platform} • Nộp lúc {del.submittedAt}
                        </div>
                      </div>
                    </div>
                    <span
                      className={`px-2.5 py-0.5 rounded-full font-label-sm text-[11px] ${
                        del.status === 'Đã duyệt'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-tertiary-fixed text-on-tertiary-fixed'
                      }`}
                    >
                      {del.status}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Quick Attach New Link Form */}
            <form
              onSubmit={handleQuickSubmitLink}
              className="pt-4 border-t border-surface-container-high flex flex-col sm:flex-row gap-2"
            >
              <select
                value={quickPlatform}
                onChange={(e) =>
                  setQuickPlatform(
                    e.target.value as 'Google Drive' | 'Canva' | 'Google Docs' | 'Figma'
                  )
                }
                className="h-10 px-3 rounded-xl bg-surface-container-low font-label-sm text-primary"
              >
                <option value="Google Docs">Google Docs</option>
                <option value="Google Drive">Google Drive</option>
                <option value="Canva">Canva</option>
                <option value="Figma">Figma</option>
              </select>
              <input
                type="url"
                required
                value={quickLink}
                onChange={(e) => setQuickLink(e.target.value)}
                placeholder="Dán thêm link file bàn giao mới (https://...)..."
                className="flex-1 h-10 px-3.5 rounded-xl bg-surface-container-low text-body-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                type="submit"
                className="h-10 px-4 rounded-xl bg-primary text-on-primary hover:bg-primary-container font-label-md shrink-0 transition-colors"
              >
                + Đính kèm link
              </button>
            </form>
          </div>
        </div>

        {/* Right 5 Cols: Trao đổi & Chỉ đạo Cố vấn */}
        <div className="lg:col-span-5 rounded-2xl bg-surface-container-lowest p-6 shadow-sm border border-outline-variant/30 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-surface-container-high">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-secondary text-on-secondary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">forum</span>
                </div>
                <div>
                  <h2 className="font-headline-sm text-headline-sm text-primary">
                    Trao đổi &amp; Nhận xét Nghiệm thu
                  </h2>
                  <p className="text-xs text-outline">
                    Góp ý từ Ban Cố vấn Khoa QT-KTQT &amp; Ban Chủ nhiệm
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-surface-container-high font-label-sm text-primary">
                {(task.comments || []).length} phản hồi
              </span>
            </div>

            {/* Comments List */}
            <div className="space-y-3.5 max-h-[420px] overflow-y-auto pr-1 mb-5">
              {(task.comments || []).length === 0 ? (
                <p className="text-body-sm text-outline italic py-4 text-center">
                  Chưa có bình luận nào. Hãy để lại chỉ đạo hoặc báo cáo tiến độ bên dưới!
                </p>
              ) : (
                (task.comments || []).map((cmt) => (
                  <div
                    key={cmt.id}
                    className={`p-4 rounded-2xl border ${
                      cmt.isAdvisor
                        ? 'bg-tertiary-fixed/35 border-tertiary-fixed-dim'
                        : 'bg-surface-container-low border-outline-variant/20'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center font-label-sm font-bold ${
                            cmt.isAdvisor
                              ? 'bg-on-tertiary-container text-white'
                              : 'bg-primary text-white'
                          }`}
                        >
                          {cmt.authorAvatar}
                        </div>
                        <div>
                          <span className="font-label-md text-primary block">{cmt.authorName}</span>
                          <span className="text-[11px] text-outline">{cmt.authorRole}</span>
                        </div>
                      </div>
                      <span className="text-[11px] text-outline">{cmt.createdAt}</span>
                    </div>
                    <p className="font-body-sm text-on-surface leading-relaxed">{cmt.content}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Add New Comment Form */}
          <form onSubmit={handleSendComment} className="pt-3 border-t border-surface-container-high">
            <label className="block font-label-sm text-outline mb-1.5">
              Bình luận với tư cách: <strong className="text-primary">{currentUser.fullName}</strong>
            </label>
            <textarea
              rows={3}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Nhập nhận xét nghiệm thu, góp ý chỉnh sửa hoặc báo cáo vướng mắc..."
              className="w-full p-3 rounded-xl bg-surface-container-low border border-outline-variant/50 text-body-sm focus:outline-none focus:ring-2 focus:ring-primary mb-2.5"
            />
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-secondary text-on-secondary hover:bg-secondary-container font-label-lg text-label-lg font-semibold shadow-sm transition-colors flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[18px]">send</span>
              <span>Gửi Phản Hồi / Nhận Xét</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
