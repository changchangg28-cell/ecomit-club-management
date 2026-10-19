import React, { useState, useEffect } from 'react';
import { useEcomit } from '../../context/EcomitContext';
import { Department, TaskPriority } from '../../types';

export const AssignTaskModal: React.FC = () => {
  const {
    isCreateTaskOpen,
    closeCreateTask,
    members,
    events,
    memberStats,
    defaultAssigneeId,
    defaultEventId,
    saveTask,
  } = useEcomit();

  const [eventId, setEventId] = useState<string>('ev1');
  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState<Department>('Ban Truyền thông');
  const [assigneeId, setAssigneeId] = useState<string>('m4');
  const [priority, setPriority] = useState<TaskPriority>('Cao');
  const [deadline, setDeadline] = useState('2025-03-20');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (defaultEventId) {
      setEventId(defaultEventId);
    } else if (events.length > 0) {
      setEventId(events[0].id);
    }

    if (defaultAssigneeId) {
      setAssigneeId(defaultAssigneeId);
      const found = members.find((m) => m.id === defaultAssigneeId);
      if (found) setDepartment(found.department);
    } else if (members.length > 0) {
      const inDept = members.find((m) => m.department === department) || members[0];
      setAssigneeId(inDept.id);
    }
  }, [defaultAssigneeId, defaultEventId, isCreateTaskOpen]);

  if (!isCreateTaskOpen) return null;

  const deptMembers = members.filter((m) => m.department === department);
  const availableMembers = deptMembers.length > 0 ? deptMembers : members;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    saveTask({
      eventId,
      title: title.trim(),
      description: description.trim() || 'Thực hiện công việc và đính kèm link kết quả.',
      assigneeId,
      department,
      priority,
      deadline,
      status: 'Todo',
    });
    setTitle('');
    setDescription('');
    closeCreateTask();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 backdrop-blur-xs p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-float border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Giao Task con mới</h2>
            <p className="text-xs text-slate-500">
              Chọn Sự kiện / Công việc chính và phân công cho thành viên
            </p>
          </div>
          <button
            type="button"
            onClick={closeCreateTask}
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Chọn Sự kiện / Công việc chính */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Thuộc Sự kiện / Công việc chính <span className="text-rose-500">*</span>
            </label>
            <select
              value={eventId}
              onChange={(e) => setEventId(e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-blue-200 bg-blue-50/40 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {events.map((ev) => (
                <option key={ev.id} value={ev.id}>
                  [{ev.code}] {ev.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Tên Task con <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="VD: Thiết kế Standee sự kiện..."
              className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Ban phụ trách
              </label>
              <select
                value={department}
                onChange={(e) => {
                  const nextDept = e.target.value as Department;
                  setDepartment(nextDept);
                  const first = members.find((m) => m.department === nextDept);
                  if (first) setAssigneeId(first.id);
                }}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Ban Chủ nhiệm">Ban Chủ nhiệm</option>
                <option value="Ban Truyền thông">Ban Truyền thông</option>
                <option value="Ban Kỹ thuật">Ban Kỹ thuật</option>
                <option value="Ban Sự kiện & Host">Ban Sự kiện &amp; Host</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Người nhận việc
              </label>
              <select
                value={assigneeId}
                onChange={(e) => setAssigneeId(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {availableMembers.map((m) => {
                  const st = memberStats.find((s) => s.member.id === m.id);
                  const activeCount = st ? st.totalTasks - st.doneTasks : 0;
                  return (
                    <option key={m.id} value={m.id}>
                      {m.fullName} ({activeCount} việc mở)
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Mức độ ưu tiên
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Cao">Cao</option>
                <option value="Trung bình">Trung bình</option>
                <option value="Thấp">Thấp</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Hạn hoàn thành
              </label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Ghi chú ngắn
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Yêu cầu đầu ra (VD: Nộp link Canva / Google Drive)..."
              className="w-full p-3 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={closeCreateTask}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm"
            >
              Giao việc
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
