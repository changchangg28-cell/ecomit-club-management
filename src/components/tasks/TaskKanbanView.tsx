import React from 'react';
import { Link } from 'react-router-dom';
import { Task, TaskStatus } from '../../types';
import { useEcomit } from '../../context/EcomitContext';

interface TaskKanbanViewProps {
  tasks: Task[];
}

export const TaskKanbanView: React.FC<TaskKanbanViewProps> = ({ tasks }) => {
  const { updateTaskStatus, openAssignModal } = useEcomit();

  const columns: {
    status: TaskStatus;
    title: string;
    subtitle: string;
    badgeBg: string;
    dotColor: string;
  }[] = [
    {
      status: 'Not Started',
      title: 'Chưa Thực Hiện',
      subtitle: 'Mới giao • Chờ nhận việc',
      badgeBg: 'bg-surface-container-highest text-primary',
      dotColor: 'bg-outline',
    },
    {
      status: 'In Progress',
      title: 'Đang Thực Hiện',
      subtitle: 'Đang triển khai • Chờ nộp link',
      badgeBg: 'bg-primary-fixed text-on-primary-fixed',
      dotColor: 'bg-primary',
    },
    {
      status: 'Completed',
      title: 'Đã Hoàn Thành',
      subtitle: 'Đã nộp link Drive/Canva • Đã nghiệm thu',
      badgeBg: 'bg-emerald-100 text-emerald-800',
      dotColor: 'bg-emerald-500',
    },
  ];

  const getDeptBadge = (dept: string) => {
    switch (dept) {
      case 'Ban Chủ nhiệm':
        return 'bg-primary-fixed text-on-primary-fixed';
      case 'Ban Truyền thông':
        return 'bg-tertiary-fixed text-on-tertiary-fixed';
      case 'Ban Kỹ thuật':
        return 'bg-surface-container-highest text-primary';
      default:
        return 'bg-secondary-fixed text-on-secondary-fixed';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-space-lg items-start">
      {columns.map((col) => {
        const colTasks = tasks.filter((t) => t.status === col.status);

        return (
          <div
            key={col.status}
            className="rounded-2xl bg-surface-container-low p-4 border border-outline-variant/30 flex flex-col gap-3.5 min-h-[540px]"
          >
            {/* Column Header */}
            <div className="flex items-center justify-between px-1 pb-2 border-b border-outline-variant/30">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${col.dotColor}`}></span>
                <div>
                  <h3 className="font-headline-sm text-headline-sm text-primary">{col.title}</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    {col.subtitle}
                  </p>
                </div>
              </div>
              <span
                className={`px-2.5 py-1 rounded-full font-label-sm text-label-sm font-bold ${col.badgeBg}`}
              >
                {colTasks.length}
              </span>
            </div>

            {/* Cards List */}
            <div className="flex flex-col gap-3">
              {colTasks.map((task) => (
                <div
                  key={task.id}
                  className="group rounded-2xl bg-surface-container-lowest p-4 shadow-sm hover:shadow-md border border-outline-variant/30 transition-all flex flex-col gap-3"
                >
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span
                      className={`px-2.5 py-0.5 rounded-full font-label-sm text-label-sm ${getDeptBadge(
                        task.team
                      )}`}
                    >
                      {task.team}
                    </span>

                    <div className="flex items-center gap-1.5">
                      {task.isOverdue && task.status !== 'Completed' && (
                        <span className="px-2 py-0.5 rounded-full bg-secondary text-on-secondary font-label-sm text-label-sm">
                          Trễ hạn
                        </span>
                      )}
                      <span
                        className={`px-2 py-0.5 rounded-full font-label-sm text-label-sm ${
                          task.priority === 'Khẩn cấp'
                            ? 'bg-secondary-fixed text-on-secondary-fixed'
                            : task.priority === 'Cao'
                            ? 'bg-tertiary-fixed text-on-tertiary-fixed'
                            : 'bg-surface-container-high text-on-surface-variant'
                        }`}
                      >
                        {task.priority}
                      </span>
                    </div>
                  </div>

                  {/* Task Title & Code */}
                  <div>
                    <span className="font-mono text-[11px] text-outline block mb-0.5">
                      {task.code} {task.liveSessionCode ? `• ${task.liveSessionCode}` : ''}
                    </span>
                    <Link
                      to={`/tasks/${task.id}`}
                      className="font-label-lg text-label-lg text-primary group-hover:text-secondary transition-colors line-clamp-2"
                    >
                      {task.title}
                    </Link>
                  </div>

                  {/* Expected / Actual Result Box */}
                  <div className="p-2.5 rounded-xl bg-surface-container-low text-body-sm space-y-1.5">
                    <div className="text-on-surface-variant line-clamp-2">
                      <strong className="text-primary">Kỳ vọng:</strong> {task.expectedResult}
                    </div>
                    {task.actualResultLink && (
                      <a
                        href={task.actualResultLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-emerald-700 hover:underline font-label-sm"
                      >
                        <span className="material-symbols-outlined text-[15px]">link</span>
                        <span>
                          Đã nộp link ({task.actualResultPlatform || 'Google Drive'})
                        </span>
                      </a>
                    )}
                  </div>

                  {/* Assignee & Deadline Footer */}
                  <div className="flex items-center justify-between pt-2 border-t border-surface-container-high">
                    <div className="flex items-center gap-2 min-w-0">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center font-label-sm text-label-sm shrink-0 ${task.assignedMemberAvatarBg}`}
                      >
                        {task.assignedMemberAvatar}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-label-md text-label-md text-on-surface truncate">
                          {task.assignedMemberName}
                        </span>
                        <span className="text-[11px] text-outline flex items-center gap-1">
                          <span className="material-symbols-outlined text-[13px]">schedule</span>
                          {task.deadline}
                        </span>
                      </div>
                    </div>

                    {/* Quick Status Move & Detail Link */}
                    <div className="flex items-center gap-1">
                      {task.status !== 'Not Started' && (
                        <button
                          type="button"
                          title="Chuyển lùi trạng thái"
                          onClick={() =>
                            updateTaskStatus(
                              task.id,
                              task.status === 'Completed' ? 'In Progress' : 'Not Started'
                            )
                          }
                          className="w-7 h-7 rounded-lg bg-surface-container-low hover:bg-surface-container-high text-on-surface-variant flex items-center justify-center"
                        >
                          <span className="material-symbols-outlined text-[16px]">
                            chevron_left
                          </span>
                        </button>
                      )}
                      {task.status !== 'Completed' && (
                        <button
                          type="button"
                          title="Chuyển tiếp trạng thái"
                          onClick={() =>
                            updateTaskStatus(
                              task.id,
                              task.status === 'Not Started' ? 'In Progress' : 'Completed'
                            )
                          }
                          className="w-7 h-7 rounded-lg bg-primary-fixed hover:bg-primary hover:text-white text-on-primary-fixed flex items-center justify-center transition-colors"
                        >
                          <span className="material-symbols-outlined text-[16px]">
                            chevron_right
                          </span>
                        </button>
                      )}
                      <Link
                        to={`/tasks/${task.id}`}
                        title="Xem chi tiết công việc (Screen 08)"
                        className="w-7 h-7 rounded-lg bg-surface-container-low hover:bg-secondary hover:text-white text-primary flex items-center justify-center transition-colors"
                      >
                        <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}

              {/* Add Task Button at bottom of column */}
              <button
                type="button"
                onClick={() => openAssignModal()}
                className="w-full py-2.5 rounded-xl border border-dashed border-outline-variant text-on-surface-variant hover:text-primary hover:border-primary hover:bg-surface-container-lowest transition-all font-label-md text-label-md flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
                <span>Thêm công việc mới</span>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
