import React from 'react';
import { Link } from 'react-router-dom';
import { useEcomit } from '../context/EcomitContext';

export const LiveResultsReportPage: React.FC = () => {
  const { liveProducts, triggerToast } = useEcomit();

  const totalRevenue = liveProducts.reduce((acc, p) => acc + p.revenue, 0);
  const totalSold = liveProducts.reduce((acc, p) => acc + p.soldQty, 0);

  const formatVND = (n: number) => n.toLocaleString('vi-VN') + 'đ';

  const timeSeriesSlots = [
    { time: '19:30', gmv: 2.4, viewers: 420, label: 'Mở màn & Minigame' },
    { time: '19:45', gmv: 6.8, viewers: 890, label: 'Lên sóng Combo VPP 49K' },
    { time: '20:00', gmv: 14.5, viewers: 1450, label: '🔥 Golden Slot: Áo Polo ECOMIT', isPeak: true },
    { time: '20:25', gmv: 22.9, viewers: 1280, label: 'Bình Giữ Nhiệt Smart Thermo' },
    { time: '20:50', gmv: 30.8, viewers: 960, label: 'Cà Phê Mộc OCOP Đồng Nai' },
    { time: '21:15', gmv: 34.5, viewers: 740, label: 'Túi Tote Canvas ECOMIT' },
    { time: '21:30', gmv: 36.3, viewers: 610, label: 'Tổng kết & Tri ân khán giả' },
  ];

  return (
    <div className="flex flex-col w-full pb-16">
      {/* Page Header (Screen 10) */}
      <section className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-lg mb-6 pt-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm uppercase">
              Screen 10 • Post-Live Analytics
            </span>
            <span className="text-xs text-outline">
              • Phiên TikTok Shop #12 (14/03/2025 • Phòng P.A201)
            </span>
          </div>
          <h1 className="font-display-lg text-display-lg text-primary tracking-tight">
            Báo Cáo Doanh Số &amp; Hiệu Suất Phiên Live #12
          </h1>
          <p className="font-body-md text-on-surface-variant">
            Phân tích tổng doanh thu (GMV), lưu lượng mắt xem đồng thời (PCU), khoảnh khắc vàng 25 phút và Top sản phẩm bán chạy nhất.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Link
            to="/live-center"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-surface-container-lowest text-primary shadow-sm hover:bg-surface-container-high font-label-md transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">sensors</span>
            <span>Về Live Center (09)</span>
          </Link>
          <button
            type="button"
            onClick={() =>
              triggerToast('Đã xuất file Báo cáo Doanh số Phiên Live #12 (PDF & Excel) thành công!')
            }
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary text-on-primary hover:bg-primary-container font-label-lg font-semibold shadow-sm transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            <span>Xuất Báo Cáo GMV</span>
          </button>
        </div>
      </section>

      {/* 4 Post-Live KPI Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-space-lg mb-8">
        <div className="rounded-2xl bg-surface-container-lowest p-6 shadow-sm border border-outline-variant/30">
          <div className="flex items-center justify-between mb-3">
            <div className="w-11 h-11 rounded-xl bg-primary-container text-on-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">payments</span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-label-sm">
              +145% mục tiêu
            </span>
          </div>
          <span className="font-display-lg text-2xl sm:text-3xl text-primary font-extrabold block">
            {formatVND(totalRevenue)}
          </span>
          <span className="font-label-md text-on-surface-variant uppercase">
            Tổng Doanh Số (GMV Thực Đạt)
          </span>
          <p className="text-xs text-outline mt-1">Mục tiêu đề ra: 25.000.000đ</p>
        </div>

        <div className="rounded-2xl bg-surface-container-lowest p-6 shadow-sm border border-outline-variant/30">
          <div className="flex items-center justify-between mb-3">
            <div className="w-11 h-11 rounded-xl bg-secondary text-on-secondary flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">shopping_cart_checkout</span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm">
              Tỷ lệ hủy &lt; 1.5%
            </span>
          </div>
          <span className="font-display-lg text-2xl sm:text-3xl text-primary font-extrabold block">
            {totalSold} đơn
          </span>
          <span className="font-label-md text-on-surface-variant uppercase">
            Tổng Đơn Hàng Thanh Toán
          </span>
          <p className="text-xs text-outline mt-1">Giá trị trung bình (AOV): 102.300đ/đơn</p>
        </div>

        <div className="rounded-2xl bg-surface-container-lowest p-6 shadow-sm border border-outline-variant/30">
          <div className="flex items-center justify-between mb-3">
            <div className="w-11 h-11 rounded-xl bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">visibility</span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-sm">
              Kỷ lục CLB
            </span>
          </div>
          <span className="font-display-lg text-2xl sm:text-3xl text-primary font-extrabold block">
            1.450 PCU
          </span>
          <span className="font-label-md text-on-surface-variant uppercase">
            Đỉnh Mắt Xem Đồng Thời
          </span>
          <p className="text-xs text-outline mt-1">Tổng lượt xem tích lũy: 18.420 lượt</p>
        </div>

        <div className="rounded-2xl bg-surface-container-lowest p-6 shadow-sm border border-outline-variant/30">
          <div className="flex items-center justify-between mb-3">
            <div className="w-11 h-11 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">ads_click</span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-label-sm">
              Cao hơn TB ngành
            </span>
          </div>
          <span className="font-display-lg text-2xl sm:text-3xl text-primary font-extrabold block">
            13.8%
          </span>
          <span className="font-label-md text-on-surface-variant uppercase">
            Tỷ Lệ Chuyển Đổi (Click-to-Order)
          </span>
          <p className="text-xs text-outline mt-1">84.500 lượt thả tim &amp; 3.120 bình luận</p>
        </div>
      </section>

      {/* Main Analytics Row: Chart + Golden 25-Minute Slot (Screen 10) */}
      <section className="grid grid-cols-1 xl:grid-cols-12 gap-space-lg mb-8">
        {/* Left: Diễn Biến Doanh Số & Mắt Xem Trực Tiếp (8 cols) */}
        <div className="xl:col-span-8 rounded-3xl bg-surface-container-lowest p-6 shadow-sm border border-outline-variant/30">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
            <div>
              <h2 className="font-headline-sm text-headline-sm text-primary">
                Diễn Biến Doanh Số &amp; Mắt Xem Trực Tiếp (19:30 — 21:30)
              </h2>
              <p className="font-body-sm text-on-surface-variant">
                Biểu đồ tương quan giữa thời điểm tung Deal Flash Sale và lưu lượng người xem
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5 font-semibold text-primary">
                <span className="w-3 h-3 rounded bg-primary inline-block"></span> GMV Lũy kế (Triệu đ)
              </span>
              <span className="flex items-center gap-1.5 font-semibold text-secondary">
                <span className="w-3 h-3 rounded-full bg-secondary inline-block"></span> Mắt xem (PCU)
              </span>
            </div>
          </div>

          {/* Interactive Visual Bar + Trend Chart */}
          <div className="grid grid-cols-7 gap-3 items-end h-64 pt-6 px-2 border-b border-surface-container-high">
            {timeSeriesSlots.map((slot) => {
              const gmvHeightPct = Math.round((slot.gmv / 38) * 100);
              const viewerHeightPct = Math.round((slot.viewers / 1500) * 100);

              return (
                <div
                  key={slot.time}
                  className="flex flex-col items-center justify-end h-full group relative"
                >
                  {/* Tooltip on Hover */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-12 z-20 bg-[#00173e] text-white text-[11px] px-2.5 py-1.5 rounded-xl shadow-lg whitespace-nowrap pointer-events-none">
                    <div className="font-bold">{slot.label}</div>
                    <div>
                      GMV: {slot.gmv}M • {slot.viewers} mắt xem
                    </div>
                  </div>

                  {slot.isPeak && (
                    <span className="mb-1 px-2 py-0.5 rounded-full bg-secondary text-white font-label-sm text-[10px] animate-bounce">
                      ĐỈNH 1.450
                    </span>
                  )}

                  <div className="w-full flex items-end justify-center gap-1.5 h-48">
                    <div
                      style={{ height: `${gmvHeightPct}%` }}
                      className={`w-5 sm:w-7 rounded-t-xl transition-all ${
                        slot.isPeak
                          ? 'bg-gradient-to-t from-primary to-[#254581]'
                          : 'bg-primary-container/85 group-hover:bg-primary'
                      }`}
                    ></div>
                    <div
                      style={{ height: `${viewerHeightPct}%` }}
                      className={`w-3 sm:w-4 rounded-t-xl transition-all ${
                        slot.isPeak
                          ? 'bg-secondary'
                          : 'bg-secondary-fixed-dim group-hover:bg-secondary'
                      }`}
                    ></div>
                  </div>

                  <span className="font-mono text-xs font-semibold text-primary mt-2">
                    {slot.time}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-on-surface-variant flex-wrap gap-2">
            <span>📌 19:30: Tung deal mồi Combo VPP LHU 49K (Cháy 100 suất trong 12 phút)</span>
            <span className="font-semibold text-secondary">
              🔥 20:00: Khung giờ vàng Áo Polo ECOMIT Gen 2025 đạt đỉnh 1.450 mắt xem
            </span>
          </div>
        </div>

        {/* Right: Khoảnh khắc vàng (Golden 25-Minute Slot) (4 cols) */}
        <div className="xl:col-span-4 rounded-3xl bg-gradient-to-br from-[#271500] via-[#432800] to-[#653e00] text-white p-6 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-sm uppercase">
                <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
                Highlight Phân Tích
              </span>
              <span className="font-mono text-xs text-tertiary-fixed-dim">20:00 — 20:25</span>
            </div>

            <h2 className="font-headline-md text-headline-md text-tertiary-fixed mb-2">
              Khoảnh khắc vàng (Golden 25-Minute Slot)
            </h2>
            <p className="font-body-sm text-amber-100/90 leading-relaxed mb-5">
              Trong 25 phút cao điểm khi Lead Host <strong>Võ Thảo My</strong> và Co-Host{' '}
              <strong>Nguyễn Thị Mai Anh</strong> lên mẫu trực tiếp <strong>Áo Polo ECOMIT Gen 2025</strong> kết hợp tung mã Freeship của Ban Kỹ thuật, doanh số tăng vọt <strong>+14.9 triệu đồng</strong>.
            </p>

            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-between">
                <span className="text-xs text-amber-200">Tốc độ chốt đơn đỉnh điểm</span>
                <span className="font-headline-sm text-white font-bold">11.4 đơn / phút</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-between">
                <span className="text-xs text-amber-200">Tỷ lệ giữ chân khán giả</span>
                <span className="font-headline-sm text-emerald-300 font-bold">4 phút 38 giây</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-between">
                <span className="text-xs text-amber-200">Đóng góp vào tổng GMV</span>
                <span className="font-headline-sm text-tertiary-fixed-dim font-bold">
                  41.2% toàn phiên
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/15 text-xs text-amber-200 flex items-center justify-between">
            <span>Đánh giá từ Ban Cố vấn: Xuất sắc (A+)</span>
            <Link to="/tasks/task-01" className="underline text-white font-semibold">
              Xem kịch bản gốc →
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 3: TOP 4 SẢN PHẨM BÁN CHẠY NHẤT (Screen 10) */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-primary-container text-on-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">emoji_events</span>
            </div>
            <div>
              <h2 className="font-headline-md text-headline-md text-primary">
                Top 4 Sản Phẩm Bán Chạy Nhất Phiên Live #12
              </h2>
              <p className="font-body-sm text-on-surface-variant">
                Xếp hạng theo doanh thu thực tế và tỷ lệ chuyển đổi đơn hàng
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-space-lg">
          {liveProducts.slice(0, 4).map((prod, idx) => (
            <div
              key={prod.id}
              className="rounded-2xl bg-surface-container-lowest p-5 shadow-sm border border-outline-variant/30 flex flex-col justify-between relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-3">
                <span
                  className={`px-3 py-1 rounded-full font-label-sm font-bold ${
                    idx === 0
                      ? 'bg-tertiary-fixed text-on-tertiary-fixed'
                      : idx === 1
                      ? 'bg-primary-fixed text-on-primary-fixed'
                      : 'bg-surface-container-highest text-primary'
                  }`}
                >
                  TOP #{idx + 1} • {prod.category}
                </span>
                <span className="font-mono text-xs text-outline">{prod.sku}</span>
              </div>

              <div>
                <h3 className="font-headline-sm text-headline-sm text-primary mb-2 line-clamp-2">
                  {prod.name}
                </h3>

                <div className="p-3.5 rounded-2xl bg-surface-container-low space-y-2 mb-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-outline">Doanh thu (GMV):</span>
                    <span className="font-headline-sm text-secondary font-extrabold">
                      {formatVND(prod.revenue)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-outline">Số lượng bán ra:</span>
                    <span className="font-bold text-primary">
                      {prod.soldQty} / {prod.stockQty} sản phẩm
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-outline">Tỷ lệ chuyển đổi (CR):</span>
                    <span className="font-bold text-emerald-700">{prod.conversionRate}%</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-surface-container-high flex items-center justify-between text-xs">
                <span className="text-outline">Giá Live: {formatVND(prod.livePrice)}</span>
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">
                  {prod.discountLabel}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
