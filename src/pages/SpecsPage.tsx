import React from 'react';
import { Link } from 'react-router-dom';
import { useEcomit } from '../context/EcomitContext';

export const SpecsPage: React.FC = () => {
  const { triggerToast, members, tasks, livestreams } = useEcomit();

  const copyText = (txt: string, label?: string) => {
    navigator.clipboard.writeText(txt);
    triggerToast(`Đã sao chép ${label || txt} vào bộ nhớ tạm!`);
  };

  const folderTreeText = `ecomit-club-management/
├── src/
│   ├── main.tsx                       # React DOM Root + BrowserRouter + EcomitProvider
│   ├── App.tsx                        # Hệ thống định tuyến 10 màn hình Stitch
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppShell.tsx           # Khung bố cục Sidebar + Topbar + Global Modals
│   │   │   ├── Sidebar.tsx            # Điều hướng chính (Logo ECOMIT LHU, Badges)
│   │   │   ├── Topbar.tsx             # Tìm kiếm toàn cục, cảnh báo Live, Giao việc mới
│   │   │   └── ComingSoonPage.tsx     # Giao diện chờ cho các phân hệ mở rộng Phase 2
│   │   ├── modals/
│   │   │   ├── AssignTaskModal.tsx    # [Screen 05] Modal tạo & giao việc mới
│   │   │   └── MemberProfileModal.tsx # Hồ sơ chi tiết thành viên & điểm cống hiến
│   │   └── tasks/
│   │       ├── TaskKanbanView.tsx     # [Screen 04] Bảng Kanban 3 cột trạng thái
│   │       ├── MyTasksSubmitView.tsx  # [Screen 06] Công việc của tôi & Nộp link kết quả
│   │       └── TaskListView.tsx       # [Screen 07] Danh sách công việc dạng bảng
│   ├── pages/
│   │   ├── SpecsPage.tsx              # [Screen 01] Architecture & Phase 1 Specs
│   │   ├── DashboardPage.tsx          # [Screen 02] Dashboard Tổng Quan
│   │   ├── MembersPage.tsx            # [Screen 03] Quản Lý Thành Viên (20 thành viên)
│   │   ├── TasksPage.tsx              # Điều phối Kanban / List / My Tasks
│   │   ├── TaskDetailPage.tsx         # [Screen 08] Chi Tiết Công Việc & Chỉ đạo Cố vấn
│   │   ├── LiveCenterPage.tsx         # [Screen 09] Phân Công Host & Sản Phẩm Live
│   │   └── LiveResultsReportPage.tsx  # [Screen 10] Báo Cáo Doanh Số Sau Phiên Live
│   ├── context/
│   │   └── EcomitContext.tsx          # Global State + LocalStorage Persistence
│   ├── types/
│   │   └── index.ts                   # TypeScript Interfaces (Member, Task, Live...)
│   └── data/
│       └── mockData.ts                # 20 thành viên LHU, 15 tasks, 5 phiên Live`;

  const tsCodeText = `export type Department = 'Ban Chủ nhiệm' | 'Ban Truyền thông' | 'Ban Kỹ thuật' | 'Team Host';
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
}`;

  return (
    <div className="flex flex-col w-full pb-16 max-w-7xl mx-auto">
      {/* Hero Banner */}
      <section className="mt-6 mb-8 relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary-container to-[#0d3b82] text-on-primary p-8 shadow-lg">
        <div className="absolute -right-12 -top-12 w-72 h-72 rounded-full bg-secondary/20 blur-2xl pointer-events-none"></div>
        <div className="absolute right-24 -bottom-16 w-64 h-64 rounded-full bg-tertiary-fixed-dim/20 blur-2xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex flex-col gap-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary text-on-secondary font-label-sm text-label-sm uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                Screen 01 • System Blueprint
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/15 text-white font-label-sm text-label-sm backdrop-blur-sm">
                Đại học Lạc Hồng (LHU)
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm font-bold">
                10/10 Stitch Screens Integrated
              </span>
            </div>
            <h1 className="font-display-lg text-display-lg tracking-tight text-white">
              ECOMIT Architecture &amp; Phase 1 Specifications
            </h1>
            <p className="font-body-lg text-body-lg text-primary-fixed leading-relaxed">
              Bản thiết kế kiến trúc hệ thống, bảng màu chuẩn nhận diện <strong>Đại học Lạc Hồng (LHU)</strong>, cấu trúc mã nguồn và mô hình dữ liệu TypeScript cho <strong>CLB Thương mại Điện tử &amp; Đổi mới Sáng tạo (E-Commerce &amp; Digital Innovation Club)</strong>.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 min-w-[260px]">
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
              <span className="font-display-lg text-display-lg font-extrabold text-tertiary-fixed-dim">
                10
              </span>
              <p className="font-label-md text-label-md text-primary-fixed mt-1">
                Màn hình UI Hoạt động
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
              <span className="font-display-lg text-display-lg font-extrabold text-white">
                {members.length}
              </span>
              <p className="font-label-md text-label-md text-primary-fixed mt-1">
                Thành viên (4 Ban)
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
              <span className="font-display-lg text-display-lg font-extrabold text-secondary-fixed">
                {tasks.length}
              </span>
              <p className="font-label-md text-label-md text-primary-fixed mt-1">
                Công việc thực tế
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
              <span className="font-display-lg text-display-lg font-extrabold text-emerald-300">
                {livestreams.length}
              </span>
              <p className="font-label-md text-label-md text-primary-fixed mt-1">
                Phiên Livestream
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 1: TONE & MOOD & BẢNG MÀU CHUẨN LHU */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-container text-on-primary flex items-center justify-center font-headline-sm font-bold shadow-sm">
              01
            </div>
            <div>
              <h2 className="font-headline-md text-headline-md text-primary">
                Phân Tích Yêu Cầu, Tone &amp; Mood (Chuẩn LHU)
              </h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Nhấn vào từng mã màu bên dưới để sao chép trực tiếp mã Hex
              </p>
            </div>
          </div>
          <span className="font-label-sm text-label-sm uppercase px-3 py-1 rounded-full bg-surface-container-highest text-primary">
            LHU Brand Identity
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-space-lg">
          {/* LHU Navy Blue */}
          <div className="rounded-2xl bg-surface-container-lowest p-6 shadow-sm border border-outline-variant/30 flex flex-col justify-between">
            <div>
              <div className="h-28 rounded-xl bg-gradient-to-r from-[#002B66] to-[#0D3B82] p-4 flex flex-col justify-between text-white shadow-inner mb-4">
                <div className="flex items-center justify-between">
                  <span className="font-label-sm text-label-sm uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full">
                    Primary Brand
                  </span>
                  <span className="material-symbols-outlined text-[20px]">palette</span>
                </div>
                <div className="flex items-center justify-between font-mono text-xs">
                  <span>#002B66</span>
                  <span>#0D3B82</span>
                </div>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-primary mb-1">
                LHU Navy Blue (Màu chủ đạo)
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Màu xanh đậm học thuật của Đại học Lạc Hồng. Dùng cho Sidebar active, tiêu đề chính, thẻ thống kê và nền tảng cấu trúc.
              </p>
            </div>
            <div className="flex items-center gap-2 mt-4 pt-3 border-t border-surface-container-high">
              <button
                type="button"
                onClick={() => copyText('#002B66', 'mã màu #002B66')}
                className="flex-1 py-1.5 px-3 rounded-lg bg-surface-container-low hover:bg-surface-container-high text-primary font-mono text-xs font-semibold transition-colors"
              >
                Copy #002B66
              </button>
              <button
                type="button"
                onClick={() => copyText('#0D3B82', 'mã màu #0D3B82')}
                className="flex-1 py-1.5 px-3 rounded-lg bg-surface-container-low hover:bg-surface-container-high text-primary font-mono text-xs font-semibold transition-colors"
              >
                Copy #0D3B82
              </button>
            </div>
          </div>

          {/* LHU Traditional Red */}
          <div className="rounded-2xl bg-surface-container-lowest p-6 shadow-sm border border-outline-variant/30 flex flex-col justify-between">
            <div>
              <div className="h-28 rounded-xl bg-gradient-to-r from-[#D02129] to-[#C8102E] p-4 flex flex-col justify-between text-white shadow-inner mb-4">
                <div className="flex items-center justify-between">
                  <span className="font-label-sm text-label-sm uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full">
                    Secondary Accent
                  </span>
                  <span className="material-symbols-outlined text-[20px]">
                    local_fire_department
                  </span>
                </div>
                <div className="flex items-center justify-between font-mono text-xs">
                  <span>#D02129</span>
                  <span>#C8102E</span>
                </div>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-secondary mb-1">
                Đỏ Truyền Thống LHU
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Thể hiện nhiệt huyết và tốc độ thương mại điện tử. Sử dụng cho nút CTA ("Giao việc mới"), tín hiệu ON AIR / LIVE và cảnh báo trễ hạn.
              </p>
            </div>
            <div className="flex items-center gap-2 mt-4 pt-3 border-t border-surface-container-high">
              <button
                type="button"
                onClick={() => copyText('#D02129', 'mã màu #D02129')}
                className="flex-1 py-1.5 px-3 rounded-lg bg-secondary-fixed/50 hover:bg-secondary-fixed text-on-secondary-fixed font-mono text-xs font-semibold transition-colors"
              >
                Copy #D02129
              </button>
              <button
                type="button"
                onClick={() => copyText('#C8102E', 'mã màu #C8102E')}
                className="flex-1 py-1.5 px-3 rounded-lg bg-secondary-fixed/50 hover:bg-secondary-fixed text-on-secondary-fixed font-mono text-xs font-semibold transition-colors"
              >
                Copy #C8102E
              </button>
            </div>
          </div>

          {/* Dynamic Amber Gold */}
          <div className="rounded-2xl bg-surface-container-lowest p-6 shadow-sm border border-outline-variant/30 flex flex-col justify-between">
            <div>
              <div className="h-28 rounded-xl bg-gradient-to-r from-[#FDB813] to-[#F59E0B] p-4 flex flex-col justify-between text-on-tertiary-fixed shadow-inner mb-4">
                <div className="flex items-center justify-between">
                  <span className="font-label-sm text-label-sm uppercase tracking-wider bg-black/10 px-2.5 py-0.5 rounded-full">
                    Tertiary Dynamic
                  </span>
                  <span className="material-symbols-outlined text-[20px]">bolt</span>
                </div>
                <div className="flex items-center justify-between font-mono text-xs font-semibold">
                  <span>#FDB813</span>
                  <span>#F59E0B</span>
                </div>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-on-tertiary-fixed-variant mb-1">
                Vàng Cam Năng Động
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Tạo sắc thái trẻ trung, đổi mới sáng tạo của sinh viên. Dùng cho huy hiệu điểm cống hiến, khung giờ vàng (Golden Slot) và thông báo.
              </p>
            </div>
            <div className="flex items-center gap-2 mt-4 pt-3 border-t border-surface-container-high">
              <button
                type="button"
                onClick={() => copyText('#FDB813', 'mã màu #FDB813')}
                className="flex-1 py-1.5 px-3 rounded-lg bg-tertiary-fixed/60 hover:bg-tertiary-fixed text-on-tertiary-fixed font-mono text-xs font-semibold transition-colors"
              >
                Copy #FDB813
              </button>
              <button
                type="button"
                onClick={() => copyText('#F59E0B', 'mã màu #F59E0B')}
                className="flex-1 py-1.5 px-3 rounded-lg bg-tertiary-fixed/60 hover:bg-tertiary-fixed text-on-tertiary-fixed font-mono text-xs font-semibold transition-colors"
              >
                Copy #F59E0B
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: DANH MỤC 10 MÀN HÌNH STITCH ĐÃ TÍCH HỢP */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-secondary text-on-secondary flex items-center justify-center font-headline-sm font-bold shadow-sm">
              02
            </div>
            <div>
              <h2 className="font-headline-md text-headline-md text-primary">
                Bản Đồ 10 Màn Hình Chức Năng Trong Hệ Thống React
              </h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Nhấn vào bất kỳ thẻ màn hình nào để chuyển trực tiếp đến giao diện tương tác
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              num: '01',
              title: 'Architecture & Phase 1 Specs',
              desc: 'Tài liệu kiến trúc hệ thống, chuẩn màu LHU, cây thư mục & TypeScript types.',
              to: '/specs',
              badge: 'Đang xem',
              color: 'bg-primary text-white',
            },
            {
              num: '02',
              title: 'Dashboard Tổng Quan CLB',
              desc: '4 thẻ KPI, đếm ngược phiên Live #12, việc của tôi, đội ngũ nòng cốt & hoạt động.',
              to: '/dashboard',
              badge: 'Core Module',
              color: 'bg-emerald-100 text-emerald-800',
            },
            {
              num: '03',
              title: 'Quản Lý Thành Viên (20)',
              desc: 'Danh bạ 20 thành viên 4 Ban, lọc theo Ban/Trạng thái, Modal hồ sơ chi tiết.',
              to: '/members',
              badge: 'Core Module',
              color: 'bg-emerald-100 text-emerald-800',
            },
            {
              num: '04',
              title: 'Quản Lý Công Việc (Kanban)',
              desc: 'Bảng Kanban 3 cột (Chưa làm, Đang làm, Đã xong), chuyển trạng thái tức thì.',
              to: '/tasks?view=kanban',
              badge: 'Core Module',
              color: 'bg-emerald-100 text-emerald-800',
            },
            {
              num: '05',
              title: 'Modal Giao Công Việc Mới',
              desc: 'Biểu mẫu giao việc theo Ban chuyên môn, chọn người nhận, hạn chót & mẫu tạo nhanh.',
              to: '/tasks?view=kanban',
              badge: 'Global Modal',
              color: 'bg-secondary-fixed text-on-secondary-fixed',
            },
            {
              num: '06',
              title: 'Công Việc Của Tôi & Nộp Link',
              desc: 'Chọn công việc cá nhân và nộp link kết quả Google Drive / Canva / Docs.',
              to: '/tasks?view=my-tasks',
              badge: 'Core Module',
              color: 'bg-emerald-100 text-emerald-800',
            },
            {
              num: '07',
              title: 'Danh Sách Công Việc (List View)',
              desc: 'Chế độ bảng tổng hợp kèm quy chuẩn nghiệm thu task & liên kết phiên Live #12.',
              to: '/tasks?view=list',
              badge: 'Core Module',
              color: 'bg-emerald-100 text-emerald-800',
            },
            {
              num: '08',
              title: 'Chi Tiết Công Việc & Cố Vấn',
              desc: 'Checklist bàn giao, danh sách file đã nộp và luồng trao đổi với Giảng viên Cố vấn.',
              to: '/tasks/task-01',
              badge: 'Deep View',
              color: 'bg-primary-fixed text-on-primary-fixed',
            },
            {
              num: '09',
              title: 'Live Center: Ekip & Sản Phẩm',
              desc: 'Điều phối nhân sự Host/OBS tại phòng P.A201 và quản lý giỏ hàng sản phẩm lên sóng.',
              to: '/live-center',
              badge: 'Live Module',
              color: 'bg-secondary-fixed text-on-secondary-fixed',
            },
            {
              num: '10',
              title: 'Báo Cáo Doanh Số Sau Phiên Live',
              desc: 'Phân tích GMV, biểu đồ mắt xem, khung giờ vàng 25 phút & Top 4 sản phẩm bán chạy.',
              to: '/reports',
              badge: 'Analytics',
              color: 'bg-tertiary-fixed text-on-tertiary-fixed',
            },
          ].map((item) => (
            <Link
              key={item.num}
              to={item.to}
              className="group rounded-2xl bg-surface-container-lowest p-5 shadow-sm hover:shadow-md border border-outline-variant/30 hover:border-primary/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-surface-container-high text-primary">
                    Screen #{item.num}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full font-label-sm text-label-sm ${item.color}`}>
                    {item.badge}
                  </span>
                </div>
                <h3 className="font-headline-sm text-headline-sm text-primary group-hover:text-secondary transition-colors mb-1">
                  {item.title}
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant">{item.desc}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-surface-container-high flex items-center justify-between text-primary font-label-md">
                <span>Mở màn hình</span>
                <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* SECTION 3: FOLDER STRUCTURE & TYPESCRIPT MODELS */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-space-lg">
        {/* Folder Structure */}
        <div className="rounded-2xl bg-[#0b1528] text-slate-100 p-6 shadow-md border border-slate-800 flex flex-col">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#ff5f56]"></span>
              <span className="w-3 h-3 rounded-full bg-[#ffbd2e]"></span>
              <span className="w-3 h-3 rounded-full bg-[#27c93f]"></span>
              <span className="ml-2 font-mono text-xs text-slate-300">
                03. Cấu Trúc Thư Mục Dự Án
              </span>
            </div>
            <button
              type="button"
              onClick={() => copyText(folderTreeText, 'cấu trúc thư mục')}
              className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-xs font-mono text-white transition-colors"
            >
              Copy Tree
            </button>
          </div>
          <pre className="font-mono text-xs leading-6 text-slate-200 overflow-x-auto">
            {folderTreeText}
          </pre>
        </div>

        {/* TypeScript Models */}
        <div className="rounded-2xl bg-[#0b1528] text-slate-100 p-6 shadow-md border border-slate-800 flex flex-col">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-emerald-400 text-[18px]">code</span>
              <span className="font-mono text-xs text-slate-300">
                04. Mô Hình Dữ Liệu (src/types/index.ts)
              </span>
            </div>
            <button
              type="button"
              onClick={() => copyText(tsCodeText, 'mã TypeScript index.ts')}
              className="px-2.5 py-1 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-xs font-mono text-emerald-300 transition-colors"
            >
              Copy TypeScript
            </button>
          </div>
          <pre className="font-mono text-xs leading-6 text-slate-200 overflow-x-auto">
            {tsCodeText}
          </pre>
        </div>
      </section>
    </div>
  );
};
