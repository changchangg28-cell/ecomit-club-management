# ECOMIT Club Management System - Phase 1 Architecture & Specifications

## 1. Phân Tích Yêu Cầu & Tone & Mood
- **Tên hệ thống:** ECOMIT Club Management System (CLB Thương mại Điện tử & Đổi mới Sáng tạo - E-Commerce & Digital Innovation Club).
- **Trường đại học & Màu sắc chuẩn LHU (Đại học Lạc Hồng):**
  - Màu chủ đạo: LHU Navy Blue (`#002B66` / `#0D3B82`) kết hợp Đỏ truyền thống LHU (`#D02129` / `#C8102E`) và Vàng cam năng động (`#FDB813` / `#F59E0B`).
  - Phong cách: Trẻ trung, hiện đại, năng động sinh viên, tinh tế, không khô cứng hành chính nhưng vẫn chuyên nghiệp.
- **Phạm vi Phase 1:**
  - 3 Module chính hoạt động đầy đủ: **Dashboard**, **Members** (kèm Modal xem Member Profile chi tiết), **Tasks** (Kanban / List, Task Card đơn giản, Modal Tạo task nhanh, View "My Tasks" cập nhật kết quả/link Drive/Canva).
  - Các mục khác trên Sidebar (Activities, Live Center, Products, Ideas & Feedback, Reports) có trạng thái "Coming Soon".
  - Mock data phong phú: 20 thành viên (Ban Chủ nhiệm, Ban Truyền thông, Ban Kỹ thuật, Team Host), 15+ tasks thực tế, 5 lịch livestream sắp tới, thống kê hoạt động.

---

## 2. Propose Folder Structure (Next.js App Router Architecture)

```
ecomit-club-management/
├── src/
│   ├── app/
│   │   ├── layout.tsx                 # Root layout with Sidebar, Topbar, Global state
│   │   ├── page.tsx                   # Redirect or Default Dashboard
│   │   ├── dashboard/
│   │   │   └── page.tsx               # Dashboard view (KPIs, My Tasks, Livestream preview, Recent activity)
│   │   ├── members/
│   │   │   ├── page.tsx               # Member directory (Search, Filter, Member Grid/Table)
│   │   │   └── [id]/page.tsx          # Member profile detail or Modal overlay
│   │   ├── tasks/
│   │   │   └── page.tsx               # Simple Task Management (Kanban / My Tasks / New Task modal)
│   │   ├── activities/page.tsx        # Coming Soon placeholder
│   │   ├── live-center/page.tsx       # Coming Soon placeholder (Prepared for Live Calendar, Sessions, Hosts)
│   │   ├── products/page.tsx          # Coming Soon placeholder
│   │   ├── feedback/page.tsx          # Coming Soon placeholder
│   │   └── reports/page.tsx           # Coming Soon placeholder
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx            # Main Navigation (Active badges, LHU ECOMIT logo)
│   │   │   ├── Topbar.tsx             # Club status, search, notification, user profile switch
│   │   │   └── ComingSoonView.tsx     # Clean empty state for future phases
│   │   ├── dashboard/
│   │   │   ├── StatCard.tsx           # Member, Task, Live, Activity metrics
│   │   │   ├── LivePreviewWidget.tsx  # Next livestream preview & countdown
│   │   │   ├── MyTasksSummary.tsx     # Compact personal task widget
│   │   │   └── RecentActivityList.tsx # Audit log & club timeline
│   │   ├── members/
│   │   │   ├── MemberCard.tsx         # Card with Avatar, Student ID, Role, Department badge, Skills
│   │   │   ├── MemberFilters.tsx      # Team dropdown & Status filter (Active/Inactive/Alumni)
│   │   │   └── MemberProfileModal.tsx # Full profile modal (Tasks, Activities, Live participation, Contribution)
│   │   └── tasks/
│   │       ├── TaskCard.tsx           # Simple task card (Title, Assignee, Team, Deadline, Expected/Actual result)
│   │       ├── TaskModal.tsx          # Simple creation form (Title, Assignee, Team, Deadline, Expected result)
│   │       ├── MyTasksBoard.tsx       # Interactive status & link submission (Drive / Canva / Doc)
│   │       └── TaskColumn.tsx         # Column wrapper for Not Started, In Progress, Completed
│   ├── types/
│   │   └── index.ts                   # TypeScript interfaces (Member, Task, LiveSession, Activity)
│   ├── data/
│   │   └── mockData.ts                # 20 members, 15 tasks, 5 livestreams, activities
│   └── lib/
│       └── utils.ts                   # Date formatting, status color helpers
```

---

## 3. Data Model Summary (TypeScript Types)

```typescript
export type Department = 'Ban Chủ nhiệm' | 'Ban Truyền thông' | 'Ban Kỹ thuật' | 'Team Host';
export type MemberStatus = 'Active' | 'Inactive' | 'Alumni';

export interface Member {
  id: string;
  fullName: string;
  studentId: string; // e.g. "21110023" (format sinh viên LHU)
  email: string;
  phone: string;
  department: Department;
  role: string; // Trưởng ban, Phó ban, Thành viên, Host chính...
  skills: string[];
  status: MemberStatus;
  avatar: string;
  joinDate: string;
  contributionPoints: number;
}

export type TaskStatus = 'Not Started' | 'In Progress' | 'Completed';

export interface Task {
  id: string;
  title: string;
  assignedMemberId: string;
  assignedMemberName: string;
  assignedMemberAvatar: string;
  team: Department;
  deadline: string;
  status: TaskStatus;
  expectedResult: string;
  actualResultLink?: string; // Google Drive / Canva / tài liệu
  actualResultNotes?: string;
}

export interface LivestreamPreview {
  id: string;
  title: string;
  platform: 'TikTok Shop' | 'Shopee Live' | 'Facebook Live';
  hostName: string;
  hostAvatar: string;
  coHostName?: string;
  scheduledTime: string;
  productCount: number;
  status: 'Upcoming' | 'Live' | 'Ended';
}
```
