import React from 'react';
import { Link } from 'react-router-dom';
import { Task, TaskStatus } from '../../types';
import { useEcomit } from '../../context/EcomitContext';

interface TaskListViewProps {
  tasks: Task[];
  onSwitchToMyTasks: () => void;
}

export const TaskListView: React.FC<TaskListViewProps> = ({ tasks, onSwitchToMyTasks }) => {
  const { updateTaskStatus, deleteTask } = useEcomit();

  const getStatusBadge = (status: TaskStatus) => {
    switch (status) {
      case 'Completed':
        return 'bg-emerald-100 text-emerald-800';
      case 'In Progress':
        return 'bg-primary-fixed text-on-primary-fixed';
      default:
        return 'bg-surface-container-highest text-on-surface-variant';
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-space-lg items-start">
      {/* Main Table (9 cols) */}
      <div className="xl:col-span-9 rounded-2xl bg-surface-container-lowest shadow-sm border border-outline-variant/30 overflow-hidden">
        <div className="px-6 py-4 bg-surface-container-low border-b border-outline-variant/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">table_rows</span>
            <h3 className="font-headline-sm text-headline-sm text-primary">
              Bảng Danh Sách Công Việc Toàn CLB ({tasks.length})
            </h3>
          </div>
          <span className="font-label-sm text-label-sm text-outline uppercase">
            Chế độ Bảng Tổng Hợp
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-surface-container-high text-outline font-label-sm text-label-sm uppercase">
                <th className="py-3.5 px-4">Mã / Công việc</th>
                <th className="py-3.5 px-4">Người phụ trách</th>
                <th className="py-3.5 px-4">Ban chuyên môn</th>
                <th className="py-3.5 px-4">Hạn chót</th>
                <th className="py-3.5 px-4">Link kết quả</th>
                <th className="py-3.5 px-4">Trạng thái</th>
                <th className="py-3.5 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-high font-body-sm">
              {tasks.map((task) => (
                <tr
                  key={task.id}
                  className="hover:bg-surface-container-low/70 transition-colors group"
                >
                  <td className="py-3.5 px-4 max-w-xs">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-mono text-xs text-outline">{task.code}</span>
                      {task.priority === 'Khẩn cấp' && (
                        <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-[10px]">
                          Khẩn cấp
                        </span>
                      )}
                      {task.isOverdue && task.status !== 'Completed' && (
                        <span className="px-2 py-0.5 rounded-full bg-secondary text-on-secondary font-label-sm text-[10px]">
                          Trễ hạn
                        </span>
                      )}
                    </div>
                    <Link
                      to={`/tasks/${task.id}`}
                      className="font-label-lg text-primary group-hover:text-secondary transition-colors line-clamp-2"
                    >
                      {task.title}
                    </Link>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-label-sm shrink-0 ${task.assignedMemberAvatarBg}`}
                      >
                        {task.assignedMemberAvatar}
                      </div>
                      <div className="min-w-0">
                        <div className="font-label-md text-on-surface truncate">
                          {task.assignedMemberName}
                        </div>
                        <div className="text-xs text-outline truncate">{task.assignedMemberRole}</div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-1 rounded-full bg-surface-container-high text-primary font-label-sm text-label-sm">
                      {task.team}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-1 text-on-surface-variant">
                      <span className="material-symbols-outlined text-[15px] text-outline">
                        event
                      </span>
                      <span>{task.deadline}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    {task.actualResultLink ? (
                      <a
                        href={task.actualResultLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-label-sm text-label-sm"
                      >
                        <span className="material-symbols-outlined text-[15px]">folder_open</span>
                        <span>{task.actualResultPlatform || 'Drive Link'}</span>
                      </a>
                    ) : (
                      <button
                        type="button"
                        onClick={onSwitchToMyTasks}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-container-low hover:bg-secondary-fixed text-on-surface-variant hover:text-on-secondary-fixed font-label-sm text-label-sm transition-colors"
                      >
                        <span className="material-symbols-outlined text-[15px]">upload_file</span>
                        <span>Nộp link ngay</span>
                      </button>
                    )}
                  </td>

                  <td className="py-3.5 px-4">
                    <select
                      value={task.status}
                      onChange={(e) => updateTaskStatus(task.id, e.target.value as TaskStatus)}
                      className={`px-2.5 py-1 rounded-full font-label-sm text-label-sm cursor-pointer focus:outline-none ${getStatusBadge(
                        task.status
                      )}`}
                    >
                      <option value="Not Started">Chưa Thực Hiện</option>
                      <option value="In Progress">Đang Thực Hiện</option>
                      <option value="Completed">Đã Hoàn Thành</option>
                    </select>
                  </td>

                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="inline-flex items-center gap-1">
                      <Link
                        to={`/tasks/${task.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-primary-fixed text-on-primary-fixed hover:bg-primary hover:text-white font-label-sm text-label-sm transition-colors"
                      >
                        <span>Chi tiết</span>
                      </Link>
                      <button
                        type="button"
                        onClick={() => deleteTask(task.id)}
                        title="Xóa công việc"
                        className="p-1.5 rounded-xl text-outline hover:text-secondary hover:bg-secondary-fixed/40 transition-colors"
                      >
                        <span className="material-symbols-outlined text-[16px]">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Right Column Cards (3 cols) */}
      <div className="xl:col-span-3 flex flex-col gap-space-lg">
        {/* Card 1: Quy Chuẩn Nghiệm Thu Task */}
        <div className="rounded-2xl bg-surface-container-lowest p-5 shadow-sm border border-outline-variant/30">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-9 h-9 rounded-xl bg-primary-container text-on-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">verified</span>
            </div>
            <h3 className="font-headline-sm text-headline-sm text-primary">
              Quy Chuẩn Nghiệm Thu Task
            </h3>
          </div>
          <ul className="space-y-2.5 font-body-sm text-on-surface-variant">
            <li className="flex items-start gap-2">
              <span className="material-symbols-outlined text-emerald-600 text-[18px] mt-0.5">
                check_circle
              </span>
              <span>
                Mọi thiết kế Canva / Drive phải bật quyền <strong>Anyone with the link</strong>.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="material-symbols-outlined text-emerald-600 text-[18px] mt-0.5">
                check_circle
              </span>
              <span>
                Đính kèm đầy đủ link sản phẩm thực tế trước khi chuyển sang <strong>Đã Hoàn Thành</strong>.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="material-symbols-outlined text-emerald-600 text-[18px] mt-0.5">
                check_circle
              </span>
              <span>
                Hoàn thành đúng hạn được cộng tự động <strong>+25 điểm cống hiến</strong> học kỳ.
              </span>
            </li>
          </ul>
        </div>

        {/* Card 2: Báo Cáo Tổng Hợp CLB */}
        <div className="rounded-2xl bg-gradient-to-br from-primary via-primary-container to-[#0d3b82] text-white p-5 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-secondary text-on-secondary font-label-sm text-label-sm uppercase">
              Thống kê CLB
            </span>
            <span className="font-mono text-xs text-primary-fixed">Học kỳ II</span>
          </div>
          <h3 className="font-headline-sm text-headline-sm text-white mb-1">
            Báo Cáo Hiệu Suất &amp; Điểm Cống Hiến
          </h3>
          <p className="font-body-sm text-primary-fixed mb-4">
            Xem tổng hợp tiến độ công việc của 4 Ban và bảng xếp hạng đóng góp của toàn bộ thành viên.
          </p>
          <Link
            to="/reports"
            className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl bg-white text-primary font-label-md text-label-md hover:bg-primary-fixed transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">assessment</span>
            <span>Mở Trang Báo Cáo CLB</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
