# ECOMIT LHU — Hệ Thống Quản Lý CLB Thương Mại Điện Tử & Đổi Mới Sáng Tạo

Ứng dụng quản trị nhân sự, sự kiện chính, phân công task con và báo cáo xếp loại thành viên CLB ECOMIT (Đại học Lạc Hồng).

## Tính năng chính
1. **Tổng quan (`/dashboard`)**: Biểu đồ tròn trạng thái Task, biểu đồ cột tiến độ 4 Ban chuyên môn, theo dõi tiến độ các Sự kiện chính.
2. **Thành viên CLB (`/members`)**: Quản lý hồ sơ thành viên có ảnh đại diện (Avatar), lọc theo 4 Ban, xem các việc đang phụ trách và giao việc 1-click.
3. **Công việc & Sự kiện (`/tasks`)**: Quản lý phân cấp theo **Sự kiện / Công việc chính → Task con**, hoặc chuyển sang **Bảng Kanban 4 cột** / **Bảng danh sách**.
4. **Báo cáo & Xếp loại (`/reports`)**: Tự động tính điểm đóng góp và xếp loại thành viên, hỗ trợ xuất file Excel (CSV).
5. **Cloud Database Sync**: Hỗ trợ kết nối trực tiếp **Firebase Realtime Database** hoặc **Supabase PostgreSQL** ngay trên giao diện để cả CLB dùng chung dữ liệu thời gian thực.

## Chạy trên máy cá nhân (Local)
```bash
npm install
npm run dev
```
