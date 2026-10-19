import React, { useState, useEffect } from 'react';
import { useEcomit } from '../../context/EcomitContext';
import { Department, TaskPriority, TaskStatus } from '../../types';

export const TaskDetailDrawer: React.FC = () => {
  const {
    tasks,
    members,
    events,
    activeTaskModalId,
    setActiveTaskModalId,
    saveTask,
    updateTaskStatus,
    submitTaskDeliverable,
    toggleChecklistItem,
    addChecklistItem,
    addComment,
    deleteTask,
    getMemberById,
    getEventById,
  } = useEcomit();

  const task = tasks.find((t) => t.id === activeTaskModalId);

  const [linkInput, setLinkInput] = useState('');
  const [noteInput, setNoteInput] = useState('');
  const [newCheckText, setNewCheckText] = useState('');
  const [commentText, setCommentText] = useState('');

  useEffect(() => {
    if (task) {
      setLinkInput(task.resultLink || '');
      setNoteInput(task.resultNote || '');
    }
  }, [task?.id, task?.resultLink, task?.resultNote]);

  if (!task) return null;

  const assignee = getMemberById(task.assigneeId);
  const parentEvent = getEventById(task.eventId);

  const statusOptions: { value: TaskStatus; label: string; color: string }[] = [
    { value: 'Todo', label: 'Chưa mở', color: 'bg-slate-100 text-slate-700' },
    { value: 'InProgress', label: 'Đang làm', color: 'bg-blue-50 text-blue-700' },
    { value: 'Review', label: 'Chờ duyệt', color: 'bg-amber-50 text-amber-700' },
    { value: 'Done', label: 'Hoàn thành', color: 'bg-emerald-50 text-emerald-700' },
  ];

  const handleSaveDeliverable = (e: React.FormEvent) => {
    e.preventDefault();
    const nextSt: TaskStatus =
      task.status === 'Todo' || task.status === 'InProgress' ? 'Review' : task.status;
    submitTaskDeliverable(task.id, linkInput, noteInput, nextSt);
  };

  const handleAddChecklist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCheckText.trim()) return;
    addChecklistItem(task.id, newCheckText);
    setNewCheckText('');
  };

  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addComment(task.id, task.assigneeId, commentText);
    setCommentText('');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs">
      <div className="w-full max-w-xl bg-white h-full shadow-2xl border-l border-slate-200 flex flex-col justify-between overflow-y-auto">
        <div>
          {/* Top Header */}
          <div className="sticky top-0 z-10 bg-white px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 shrink-0">
                {task.code}
              </span>
              {parentEvent && (
                <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-semibold truncate">
                  {parentEvent.title}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => deleteTask(task.id)}
                title="Xóa công việc này"
                className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
              >
                <span className="material-symbols-outlined text-[19px]">delete</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTaskModalId(null)}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Title & Description */}
            <div>
              <h2 className="text-lg font-bold text-slate-900 leading-snug mb-2">
                {task.title}
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">{task.description}</p>
            </div>

            {/* Quick Status Switcher */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Trạng thái công việc
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {statusOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => updateTaskStatus(task.id, opt.value)}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                      task.status === opt.value
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Reassign Event / Member / Department / Deadline */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                  Thuộc Sự kiện / Công việc chính
                </label>
                <select
                  value={task.eventId}
                  onChange={(e) =>
                    saveTask({
                      ...task,
                      id: task.id,
                      eventId: e.target.value,
                    })
                  }
                  className="w-full h-9 px-2.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-900"
                >
                  {events.map((ev) => (
                    <option key={ev.id} value={ev.id}>
                      [{ev.code}] {ev.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                  Thành viên phụ trách
                </label>
                <select
                  value={task.assigneeId}
                  onChange={(e) => {
                    const nextMember = getMemberById(e.target.value);
                    saveTask({
                      ...task,
                      id: task.id,
                      assigneeId: e.target.value,
                      department: nextMember ? nextMember.department : task.department,
                    });
                  }}
                  className="w-full h-9 px-2.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-900"
                >
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.fullName} ({m.department})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                  Mức ưu tiên
                </label>
                <select
                  value={task.priority}
                  onChange={(e) =>
                    saveTask({
                      ...task,
                      id: task.id,
                      priority: e.target.value as TaskPriority,
                    })
                  }
                  className="w-full h-9 px-2.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-900"
                >
                  <option value="Cao">Cao</option>
                  <option value="Trung bình">Trung bình</option>
                  <option value="Thấp">Thấp</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                  Hạn hoàn thành
                </label>
                <input
                  type="date"
                  value={task.deadline}
                  onChange={(e) =>
                    saveTask({
                      ...task,
                      id: task.id,
                      deadline: e.target.value,
                    })
                  }
                  className="w-full h-9 px-2.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-900"
                />
              </div>
              </div>
            </div>

            {/* Deliverable Link Submission Box */}
            <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-blue-600 text-[20px]">
                    link
                  </span>
                  <h3 className="text-sm font-bold text-slate-900">
                    Link kết quả bàn giao (Drive / Canva / Docs)
                  </h3>
                </div>
                {task.resultLink && (
                  <a
                    href={task.resultLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline"
                  >
                    <span>Mở link</span>
                    <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                  </a>
                )}
              </div>

              <form onSubmit={handleSaveDeliverable} className="space-y-2.5">
                <input
                  type="url"
                  value={linkInput}
                  onChange={(e) => setLinkInput(e.target.value)}
                  placeholder="Dán link Google Drive, Canva hoặc Docs kết quả vào đây..."
                  className="w-full h-9 px-3 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                  placeholder="Ghi chú kết quả bàn giao (tùy chọn)..."
                  className="w-full h-9 px-3 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors"
                  >
                    Lưu link kết quả
                  </button>
                  {task.status !== 'Done' && (
                    <button
                      type="button"
                      onClick={() =>
                        submitTaskDeliverable(task.id, linkInput, noteInput, 'Done')
                      }
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors"
                    >
                      Duyệt &amp; Hoàn thành (+25đ)
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Checklist */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Các bước thực hiện ({task.checklist.filter((c) => c.done).length}/
                  {task.checklist.length})
                </span>
              </div>

              <div className="space-y-1.5 mb-2.5">
                {task.checklist.map((item) => (
                  <label
                    key={item.id}
                    onClick={() => toggleChecklistItem(task.id, item.id)}
                    className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 cursor-pointer text-sm transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={item.done}
                      onChange={() => {}}
                      className="rounded text-blue-600"
                    />
                    <span className={item.done ? 'line-through text-slate-400' : 'text-slate-800'}>
                      {item.text}
                    </span>
                  </label>
                ))}
              </div>

              <form onSubmit={handleAddChecklist} className="flex gap-2">
                <input
                  type="text"
                  value={newCheckText}
                  onChange={(e) => setNewCheckText(e.target.value)}
                  placeholder="Thêm đầu việc nhỏ..."
                  className="flex-1 h-9 px-3 rounded-xl border border-slate-200 text-xs"
                />
                <button
                  type="submit"
                  className="px-3 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium"
                >
                  + Thêm
                </button>
              </form>
            </div>

            {/* Short Comments */}
            <div>
              <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Trao đổi ({task.comments.length})
              </span>
              <div className="space-y-2 mb-3">
                {task.comments.map((cm) => {
                  const author = getMemberById(cm.authorId);
                  return (
                    <div key={cm.id} className="p-3 rounded-xl bg-slate-50 text-xs">
                      <div className="flex justify-between mb-1">
                        <strong className="text-slate-800">
                          {author?.fullName || assignee?.fullName || 'Thành viên'}
                        </strong>
                        <span className="text-slate-400">{cm.createdAt}</span>
                      </div>
                      <p className="text-slate-600">{cm.content}</p>
                    </div>
                  );
                })}
              </div>

              <form onSubmit={handleSendComment} className="flex gap-2">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Viết nhận xét hoặc ghi chú nhanh..."
                  className="flex-1 h-9 px-3 rounded-xl border border-slate-200 text-xs"
                />
                <button
                  type="submit"
                  className="px-4 h-9 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium"
                >
                  Gửi
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
