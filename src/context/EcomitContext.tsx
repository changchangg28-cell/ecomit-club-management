import React, { createContext, useContext, useState, useEffect, useMemo, useRef } from 'react';
import {
  ClubEvent,
  Member,
  Task,
  TaskStatus,
  ComputedMemberStats,
  ComputedEventStats,
} from '../types';
import { INITIAL_EVENTS, INITIAL_MEMBERS, INITIAL_TASKS } from '../data/mockData';
import {
  CloudConfig,
  getCloudConfig,
  saveCloudConfig,
  pullFromCloud,
  pushToCloud,
} from '../services/cloudDb';

const STORAGE_KEY = 'ecomit_clean_v6_store';
const TODAY_STR = '2025-03-16';

export type SyncStatus = 'local' | 'syncing' | 'synced' | 'error';

interface EcomitContextType {
  members: Member[];
  tasks: Task[];
  events: ClubEvent[];
  memberStats: ComputedMemberStats[];
  eventStats: ComputedEventStats[];
  getMemberById: (id: string) => Member | undefined;
  getEventById: (id: string) => ClubEvent | undefined;
  getMemberStatsById: (id: string) => ComputedMemberStats | undefined;

  // Event (Công việc chính / Sự kiện) CRUD
  saveEvent: (eventData: Omit<ClubEvent, 'id' | 'code'> & { id?: string }) => void;
  deleteEvent: (id: string) => void;

  // Member CRUD
  saveMember: (memberData: Omit<Member, 'id'> & { id?: string }) => void;
  deleteMember: (id: string) => void;

  // Task (Task con) CRUD & Actions
  saveTask: (
    taskData: Omit<Task, 'id' | 'code' | 'checklist' | 'comments'> & {
      id?: string;
      checklistTexts?: string[];
    }
  ) => void;
  updateTaskStatus: (taskId: string, status: TaskStatus) => void;
  submitTaskDeliverable: (
    taskId: string,
    resultLink: string,
    resultNote: string,
    nextStatus: TaskStatus
  ) => void;
  toggleChecklistItem: (taskId: string, itemId: string) => void;
  addChecklistItem: (taskId: string, text: string) => void;
  addComment: (taskId: string, authorId: string, content: string) => void;
  deleteTask: (taskId: string) => void;

  // Cloud Database Sync
  cloudConfig: CloudConfig;
  syncStatus: SyncStatus;
  lastSyncedAt: string | null;
  isCloudModalOpen: boolean;
  setIsCloudModalOpen: (open: boolean) => void;
  updateCloudConfig: (cfg: CloudConfig) => Promise<void>;
  forceSyncNow: () => Promise<void>;

  // UI Global Modals & Filters
  activeTaskModalId: string | null;
  setActiveTaskModalId: (id: string | null) => void;
  isCreateTaskOpen: boolean;
  openCreateTask: (defaultAssigneeId?: string, defaultEventId?: string) => void;
  closeCreateTask: () => void;
  defaultAssigneeId: string | undefined;
  defaultEventId: string | undefined;

  resetAllData: () => void;
  toast: string | null;
  showToast: (msg: string) => void;
}

const EcomitContext = createContext<EcomitContextType | undefined>(undefined);

export const EcomitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<ClubEvent[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed.events) && parsed.events.length > 0) {
          return parsed.events;
        }
      }
    } catch {
      // ignore
    }
    return INITIAL_EVENTS;
  });

  const [members, setMembers] = useState<Member[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed.members) && parsed.members.length > 0) {
          return parsed.members;
        }
      }
    } catch {
      // ignore
    }
    return INITIAL_MEMBERS;
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed.tasks) && parsed.tasks.length > 0) {
          return parsed.tasks;
        }
      }
    } catch {
      // ignore
    }
    return INITIAL_TASKS;
  });

  const [cloudConfig, setCloudConfig] = useState<CloudConfig>(() => getCloudConfig());
  const [syncStatus, setSyncStatus] = useState<SyncStatus>(() =>
    getCloudConfig().mode === 'local' ? 'local' : 'synced'
  );
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);
  const [isCloudModalOpen, setIsCloudModalOpen] = useState(false);

  const [activeTaskModalId, setActiveTaskModalId] = useState<string | null>(null);
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [defaultAssigneeId, setDefaultAssigneeId] = useState<string | undefined>(undefined);
  const [defaultEventId, setDefaultEventId] = useState<string | undefined>(undefined);
  const [toast, setToast] = useState<string | null>(null);

  const isInitialPullDone = useRef(false);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => {
      setToast((prev) => (prev === msg ? null : prev));
    }, 2800);
  };

  useEffect(() => {
    const initCloud = async () => {
      if (cloudConfig.mode === 'local') {
        setSyncStatus('local');
        isInitialPullDone.current = true;
        return;
      }
      setSyncStatus('syncing');
      try {
        const remote = await pullFromCloud(cloudConfig);
        if (remote) {
          setMembers(remote.members);
          setTasks(remote.tasks);
          if (remote.events && remote.events.length > 0) {
            setEvents(remote.events);
          }
        } else {
          await pushToCloud(cloudConfig, { members, tasks, events });
        }
        setSyncStatus('synced');
        setLastSyncedAt(new Date().toLocaleTimeString('vi-VN'));
      } catch {
        setSyncStatus('error');
      } finally {
        isInitialPullDone.current = true;
      }
    };
    initCloud();
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ members, tasks, events }));
    } catch {
      // ignore
    }

    if (!isInitialPullDone.current || cloudConfig.mode === 'local') return;

    let cancelled = false;
    const syncTimer = setTimeout(async () => {
      setSyncStatus('syncing');
      try {
        await pushToCloud(cloudConfig, { members, tasks, events });
        if (!cancelled) {
          setSyncStatus('synced');
          setLastSyncedAt(new Date().toLocaleTimeString('vi-VN'));
        }
      } catch {
        if (!cancelled) setSyncStatus('error');
      }
    }, 350);

    return () => {
      cancelled = true;
      clearTimeout(syncTimer);
    };
  }, [members, tasks, events, cloudConfig]);

  const updateCloudConfig = async (cfg: CloudConfig) => {
    saveCloudConfig(cfg);
    setCloudConfig(cfg);
    if (cfg.mode === 'local') {
      setSyncStatus('local');
      showToast('Đã chuyển sang lưu trữ Trình duyệt (Local)');
      return;
    }

    setSyncStatus('syncing');
    try {
      const remote = await pullFromCloud(cfg);
      if (remote) {
        setMembers(remote.members);
        setTasks(remote.tasks);
        if (remote.events && remote.events.length > 0) {
          setEvents(remote.events);
        }
        showToast('Đã kết nối và tải dữ liệu từ Cloud Database!');
      } else {
        await pushToCloud(cfg, { members, tasks, events });
        showToast('Đã đồng bộ dữ liệu CLB lên Cloud Database!');
      }
      setSyncStatus('synced');
      setLastSyncedAt(new Date().toLocaleTimeString('vi-VN'));
    } catch {
      setSyncStatus('error');
      showToast('Không thể kết nối Cloud DB. Kiểm tra lại URL / Key.');
    }
  };

  const forceSyncNow = async () => {
    if (cloudConfig.mode === 'local') {
      setIsCloudModalOpen(true);
      return;
    }
    setSyncStatus('syncing');
    try {
      await pushToCloud(cloudConfig, { members, tasks, events });
      setSyncStatus('synced');
      setLastSyncedAt(new Date().toLocaleTimeString('vi-VN'));
      showToast('Đã đồng bộ Cloud thành công!');
    } catch {
      setSyncStatus('error');
      showToast('Lỗi đồng bộ Cloud Database');
    }
  };

  // Tính toán trực tiếp tiến độ từng Sự kiện / Công việc chính từ danh sách Task con
  const eventStats: ComputedEventStats[] = useMemo(() => {
    return events.map((event) => {
      const evTasks = tasks.filter((t) => t.eventId === event.id);
      const totalTasks = evTasks.length;
      const todoTasks = evTasks.filter((t) => t.status === 'Todo').length;
      const inProgressTasks = evTasks.filter((t) => t.status === 'InProgress').length;
      const reviewTasks = evTasks.filter((t) => t.status === 'Review').length;
      const doneTasks = evTasks.filter((t) => t.status === 'Done').length;
      const completionRate =
        totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

      return {
        event,
        tasks: evTasks,
        totalTasks,
        todoTasks,
        inProgressTasks,
        reviewTasks,
        doneTasks,
        completionRate,
      };
    });
  }, [events, tasks]);

  // Tính toán trực tiếp chỉ số của từng thành viên từ danh sách Task con
  const memberStats: ComputedMemberStats[] = useMemo(() => {
    return members.map((member) => {
      const memberTasks = tasks.filter((t) => t.assigneeId === member.id);
      const totalTasks = memberTasks.length;
      const todoTasks = memberTasks.filter((t) => t.status === 'Todo').length;
      const inProgressTasks = memberTasks.filter((t) => t.status === 'InProgress').length;
      const reviewTasks = memberTasks.filter((t) => t.status === 'Review').length;
      const doneTasks = memberTasks.filter((t) => t.status === 'Done').length;
      const overdueTasks = memberTasks.filter(
        (t) => t.status !== 'Done' && t.deadline < TODAY_STR
      ).length;

      const completionRate =
        totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

      const totalPoints = member.bonusPoints + doneTasks * 25 + reviewTasks * 10;

      let rankLabel: ComputedMemberStats['rankLabel'] = 'Đạt';
      if (totalPoints >= 120 && overdueTasks === 0) {
        rankLabel = 'Xuất sắc';
      } else if (totalPoints >= 95) {
        rankLabel = 'Tốt';
      } else if (overdueTasks > 0) {
        rankLabel = 'Cần cố gắng';
      }

      return {
        member,
        totalTasks,
        todoTasks,
        inProgressTasks,
        reviewTasks,
        doneTasks,
        overdueTasks,
        completionRate,
        totalPoints,
        rankLabel,
      };
    });
  }, [members, tasks]);

  const getMemberById = (id: string) => members.find((m) => m.id === id);
  const getEventById = (id: string) => events.find((ev) => ev.id === id);
  const getMemberStatsById = (id: string) => memberStats.find((s) => s.member.id === id);

  const saveEvent = (eventData: Omit<ClubEvent, 'id' | 'code'> & { id?: string }) => {
    if (eventData.id) {
      setEvents((prev) =>
        prev.map((ev) =>
          ev.id === eventData.id ? { ...eventData, id: ev.id, code: ev.code } : ev
        )
      );
      showToast(`Đã cập nhật sự kiện: ${eventData.title}`);
    } else {
      const nextNum = events.length + 1;
      const newEv: ClubEvent = {
        ...eventData,
        id: `ev-${Date.now()}`,
        code: `EV-${String(nextNum).padStart(2, '0')}`,
      };
      setEvents((prev) => [newEv, ...prev]);
      showToast(`Đã tạo công việc chính / sự kiện: ${newEv.title}`);
    }
  };

  const deleteEvent = (id: string) => {
    const fallbackEvId = events.find((e) => e.id !== id)?.id || 'ev1';
    setTasks((prev) =>
      prev.map((t) => (t.eventId === id ? { ...t, eventId: fallbackEvId } : t))
    );
    setEvents((prev) => prev.filter((e) => e.id !== id));
    showToast('Đã xóa sự kiện');
  };

  const saveMember = (memberData: Omit<Member, 'id'> & { id?: string }) => {
    if (memberData.id) {
      setMembers((prev) =>
        prev.map((m) => (m.id === memberData.id ? { ...memberData, id: m.id } : m))
      );
      showToast(`Đã cập nhật thành viên ${memberData.fullName}`);
    } else {
      const newMember: Member = {
        ...memberData,
        id: `m-${Date.now()}`,
      };
      setMembers((prev) => [newMember, ...prev]);
      showToast(`Đã thêm thành viên mới: ${newMember.fullName}`);
    }
  };

  const deleteMember = (id: string) => {
    const target = getMemberById(id);
    const hasTasks = tasks.some((t) => t.assigneeId === id);
    if (hasTasks) {
      const fallbackId = members.find((m) => m.id !== id)?.id || 'm1';
      setTasks((prev) =>
        prev.map((t) => (t.assigneeId === id ? { ...t, assigneeId: fallbackId } : t))
      );
    }
    setMembers((prev) => prev.filter((m) => m.id !== id));
    if (target) {
      showToast(`Đã xóa thành viên ${target.fullName}`);
    }
  };

  const saveTask = (
    taskData: Omit<Task, 'id' | 'code' | 'checklist' | 'comments'> & {
      id?: string;
      checklistTexts?: string[];
    }
  ) => {
    if (taskData.id) {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskData.id
            ? {
                ...t,
                eventId: taskData.eventId || t.eventId,
                title: taskData.title,
                description: taskData.description,
                assigneeId: taskData.assigneeId,
                department: taskData.department,
                priority: taskData.priority,
                deadline: taskData.deadline,
                status: taskData.status,
                resultLink: taskData.resultLink,
                resultNote: taskData.resultNote,
              }
            : t
        )
      );
      showToast('Đã lưu cập nhật công việc');
    } else {
      const nextNum = tasks.length + 1;
      const code = `TSK-${String(nextNum).padStart(2, '0')}`;
      const checklist = (
        taskData.checklistTexts && taskData.checklistTexts.length > 0
          ? taskData.checklistTexts
          : ['Tiếp nhận yêu cầu công việc', 'Thực hiện và nộp link kết quả']
      ).map((txt, idx) => ({
        id: `chk-${Date.now()}-${idx}`,
        text: txt,
        done: false,
      }));

      const newTask: Task = {
        id: `t-${Date.now()}`,
        code,
        eventId: taskData.eventId || events[0]?.id || 'ev1',
        title: taskData.title,
        description: taskData.description,
        assigneeId: taskData.assigneeId,
        department: taskData.department,
        priority: taskData.priority,
        deadline: taskData.deadline,
        status: taskData.status || 'Todo',
        resultLink: taskData.resultLink,
        resultNote: taskData.resultNote,
        checklist,
        comments: [],
      };
      setTasks((prev) => [newTask, ...prev]);
      const assignee = getMemberById(newTask.assigneeId);
      showToast(
        `Đã giao task "${newTask.code}" cho ${assignee?.fullName || 'thành viên'}`
      );
    }
  };

  const updateTaskStatus = (taskId: string, status: TaskStatus) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status } : t))
    );
    const labelMap: Record<TaskStatus, string> = {
      Todo: 'Chưa mở',
      InProgress: 'Đang làm',
      Review: 'Chờ duyệt (+10đ)',
      Done: 'Hoàn thành (+25đ)',
    };
    showToast(`Trạng thái: ${labelMap[status]}`);
  };

  const submitTaskDeliverable = (
    taskId: string,
    resultLink: string,
    resultNote: string,
    nextStatus: TaskStatus
  ) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              resultLink: resultLink.trim(),
              resultNote: resultNote.trim(),
              status: nextStatus,
            }
          : t
      )
    );
    showToast('Đã lưu link bàn giao kết quả!');
  };

  const toggleChecklistItem = (taskId: string, itemId: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              checklist: t.checklist.map((c) =>
                c.id === itemId ? { ...c, done: !c.done } : c
              ),
            }
          : t
      )
    );
  };

  const addChecklistItem = (taskId: string, text: string) => {
    if (!text.trim()) return;
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              checklist: [
                ...t.checklist,
                { id: `chk-${Date.now()}`, text: text.trim(), done: false },
              ],
            }
          : t
      )
    );
  };

  const addComment = (taskId: string, authorId: string, content: string) => {
    if (!content.trim()) return;
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')} hôm nay`;

    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              comments: [
                ...t.comments,
                {
                  id: `cm-${Date.now()}`,
                  authorId,
                  content: content.trim(),
                  createdAt: timeStr,
                },
              ],
            }
          : t
      )
    );
  };

  const deleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    if (activeTaskModalId === taskId) {
      setActiveTaskModalId(null);
    }
    showToast('Đã xóa công việc');
  };

  const openCreateTask = (assigneeId?: string, eventId?: string) => {
    setDefaultAssigneeId(assigneeId);
    setDefaultEventId(eventId);
    setIsCreateTaskOpen(true);
  };

  const closeCreateTask = () => {
    setIsCreateTaskOpen(false);
    setDefaultAssigneeId(undefined);
    setDefaultEventId(undefined);
  };

  const resetAllData = () => {
    localStorage.removeItem(STORAGE_KEY);
    setEvents(INITIAL_EVENTS);
    setMembers(INITIAL_MEMBERS);
    setTasks(INITIAL_TASKS);
    showToast('Đã khôi phục dữ liệu mẫu ban đầu');
  };

  return (
    <EcomitContext.Provider
      value={{
        members,
        tasks,
        events,
        memberStats,
        eventStats,
        getMemberById,
        getEventById,
        getMemberStatsById,
        saveEvent,
        deleteEvent,
        saveMember,
        deleteMember,
        saveTask,
        updateTaskStatus,
        submitTaskDeliverable,
        toggleChecklistItem,
        addChecklistItem,
        addComment,
        deleteTask,
        cloudConfig,
        syncStatus,
        lastSyncedAt,
        isCloudModalOpen,
        setIsCloudModalOpen,
        updateCloudConfig,
        forceSyncNow,
        activeTaskModalId,
        setActiveTaskModalId,
        isCreateTaskOpen,
        openCreateTask,
        closeCreateTask,
        defaultAssigneeId,
        defaultEventId,
        resetAllData,
        toast,
        showToast,
      }}
    >
      {children}
    </EcomitContext.Provider>
  );
};

export const useEcomit = () => {
  const ctx = useContext(EcomitContext);
  if (!ctx) throw new Error('useEcomit must be used inside EcomitProvider');
  return ctx;
};
