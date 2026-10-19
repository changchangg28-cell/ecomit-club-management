export type Department =
  | 'Ban Chủ nhiệm'
  | 'Ban Truyền thông'
  | 'Ban Kỹ thuật'
  | 'Ban Sự kiện & Host';

export type MemberStatus = 'Đang hoạt động' | 'Tạm nghỉ' | 'Cựu thành viên';

export interface Member {
  id: string;
  fullName: string;
  studentId: string;
  classCode: string;
  email: string;
  phone: string;
  department: Department;
  role: string;
  status: MemberStatus;
  joinDate: string;
  avatar?: string;
  bonusPoints: number;
}

export type TaskStatus = 'Todo' | 'InProgress' | 'Review' | 'Done';
export type TaskPriority = 'Cao' | 'Trung bình' | 'Thấp';

export interface TaskChecklistItem {
  id: string;
  text: string;
  done: boolean;
}

export interface TaskComment {
  id: string;
  authorId: string;
  content: string;
  createdAt: string;
}

/**
 * Sự kiện / Công việc chính (Parent Event / Project)
 * Mỗi Công việc chính chứa nhiều Task con (Sub-tasks) phân bổ cho các thành viên
 */
export interface ClubEvent {
  id: string;
  code: string;
  title: string;
  category: 'Sự kiện lớn' | 'Tuyển quân & Nội bộ' | 'Truyền thông' | 'Chuyên môn';
  startDate: string;
  endDate: string;
  leadId: string; // Thành viên phụ trách chính sự kiện này
  color: 'indigo' | 'blue' | 'emerald' | 'amber';
}

export interface Task {
  id: string;
  code: string;
  eventId: string; // Liên kết trực tiếp tới Sự kiện / Công việc chính (ClubEvent.id)
  title: string;
  description: string;
  assigneeId: string; // Liên kết trực tiếp tới Member.id
  department: Department;
  priority: TaskPriority;
  deadline: string; // YYYY-MM-DD
  status: TaskStatus;
  resultLink?: string;
  resultNote?: string;
  checklist: TaskChecklistItem[];
  comments: TaskComment[];
}

export interface ComputedMemberStats {
  member: Member;
  totalTasks: number;
  todoTasks: number;
  inProgressTasks: number;
  reviewTasks: number;
  doneTasks: number;
  overdueTasks: number;
  completionRate: number;
  totalPoints: number; // bonusPoints + doneTasks * 25 + reviewTasks * 10
  rankLabel: 'Xuất sắc' | 'Tốt' | 'Đạt' | 'Cần cố gắng';
}

export interface ComputedEventStats {
  event: ClubEvent;
  tasks: Task[];
  totalTasks: number;
  todoTasks: number;
  inProgressTasks: number;
  reviewTasks: number;
  doneTasks: number;
  completionRate: number;
}
