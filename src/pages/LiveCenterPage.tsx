import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useEcomit } from '../context/EcomitContext';

export const LiveCenterPage: React.FC = () => {
  const {
    liveCrew,
    liveProducts,
    toggleCrewReadyStatus,
    toggleProductPinStatus,
    addLiveProduct,
    openAssignModal,
  } = useEcomit();

  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newSku, setNewSku] = useState('LHU-GIFT-06');
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState('Quà lưu niệm LHU');
  const [newOrigPrice, setNewOrigPrice] = useState(150000);
  const [newLivePrice, setNewLivePrice] = useState(89000);
  const [newStock, setNewStock] = useState(50);
  const [newSlot, setNewSlot] = useState('21:00 - 21:20');

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    addLiveProduct({
      sku: newSku,
      name: newName.trim(),
      category: newCategory,
      supplier: 'CLB ECOMIT Store',
      originalPrice: Number(newOrigPrice),
      livePrice: Number(newLivePrice),
      discountLabel: 'Deal Sinh Viên',
      stockQty: Number(newStock),
      slotTime: newSlot,
      hostNote: 'Giới thiệu ưu đãi độc quyền dành cho sinh viên LHU trên sóng.',
      status: 'Chờ lên sóng',
    });
    setNewName('');
    setShowAddProduct(false);
  };

  const formatVND = (n: number) => n.toLocaleString('vi-VN') + 'đ';

  return (
    <div className="flex flex-col w-full pb-16">
      {/* Top Banner Header (Screen 09) */}
      <section className="mt-4 mb-6 rounded-3xl bg-gradient-to-br from-primary via-primary-container to-[#0d3b82] text-white p-6 sm:p-8 shadow-lg relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-64 h-64 rounded-full bg-secondary/25 blur-2xl pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary text-on-secondary font-label-sm uppercase">
                <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
                Screen 09 • Live Center Studio
              </span>
              <span className="px-3 py-1 rounded-full bg-white/15 font-label-sm">
                Phòng Studio P.A201 • Cơ sở 1 LHU
              </span>
              <span className="px-3 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-sm font-bold">
                19:30 - 21:30 Tối nay (14/03/2025)
              </span>
            </div>
            <h1 className="font-display-lg text-display-lg text-white tracking-tight">
              Điều Phối Nhân Sự &amp; Danh Mục Sản Phẩm Live Stream #12
            </h1>
            <p className="font-body-md text-primary-fixed max-w-3xl mt-1">
              Bảng điều khiển trực chiến trước giờ G: kiểm tra trạng thái sẵn sàng của Ekip Host/OBS và quản lý thứ tự ghim sản phẩm Flash Sale trên TikTok Shop.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap shrink-0">
            <button
              type="button"
              onClick={() => openAssignModal()}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-label-md transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">add_task</span>
              <span>Giao việc hậu cần Live</span>
            </button>
            <Link
              to="/reports"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-secondary text-on-secondary hover:bg-secondary-container font-label-lg font-semibold shadow-md transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">monitoring</span>
              <span>Xem Báo Cáo Doanh Số (10)</span>
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 1: EKIP STUDIO & NHÂN SỰ HOST (Screen 09) */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-primary-container text-on-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">mic_external_on</span>
            </div>
            <div>
              <h2 className="font-headline-md text-headline-md text-primary">
                Ekip Studio &amp; Nhân Sự Host ({liveCrew.length} vị trí trực chiến)
              </h2>
              <p className="font-body-sm text-on-surface-variant">
                Nhấn vào nút trạng thái của từng vị trí để điểm danh sẵn sàng tại phòng Studio P.A201
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
          {liveCrew.map((slot) => (
            <div
              key={slot.id}
              className="rounded-2xl bg-surface-container-lowest p-5 shadow-sm border border-outline-variant/30 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-surface-container-high text-primary font-label-sm text-[11px]">
                    {slot.memberDepartment}
                  </span>
                  <button
                    type="button"
                    onClick={() => toggleCrewReadyStatus(slot.id)}
                    className={`px-2.5 py-0.5 rounded-full font-label-sm text-[11px] cursor-pointer transition-colors ${
                      slot.readyStatus === 'Sẵn sàng'
                        ? 'bg-emerald-100 text-emerald-800'
                        : slot.readyStatus === 'Đang setup'
                        ? 'bg-tertiary-fixed text-on-tertiary-fixed'
                        : 'bg-secondary-fixed text-on-secondary-fixed'
                    }`}
                  >
                    ● {slot.readyStatus}
                  </button>
                </div>

                <h3 className="font-label-lg text-primary mb-2">{slot.roleTitle}</h3>

                <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-surface-container-low mb-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-label-md font-bold shrink-0 ${slot.memberAvatarBg}`}
                  >
                    {slot.memberAvatar}
                  </div>
                  <div className="min-w-0">
                    <div className="font-label-md text-on-surface truncate">{slot.memberName}</div>
                    <div className="font-mono text-[11px] text-outline">
                      MSSV: {slot.memberStudentId}
                    </div>
                  </div>
                </div>

                <p className="font-body-sm text-on-surface-variant text-xs leading-relaxed">
                  {slot.responsibilities}
                </p>
              </div>

              <div className="mt-4 pt-2.5 border-t border-surface-container-high flex items-center justify-between text-[11px] text-outline">
                <span>🕒 {slot.shiftTime}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 2: DANH MỤC SẢN PHẨM LÊN SÓNG (Screen 09) */}
      <section>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-secondary text-on-secondary flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">shopping_bag</span>
            </div>
            <div>
              <h2 className="font-headline-md text-headline-md text-primary">
                Danh Mục Sản Phẩm Lên Sóng ({liveProducts.length} mã SKU)
              </h2>
              <p className="font-body-sm text-on-surface-variant">
                Quản lý thứ tự ghim giỏ hàng TikTok Shop, giá Flash Sale và kịch bản tư vấn cho Host
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowAddProduct((v) => !v)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary text-on-primary hover:bg-primary-container font-label-md shadow-sm transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">add_shopping_cart</span>
            <span>+ Thêm sản phẩm vào giỏ Live</span>
          </button>
        </div>

        {/* Optional Quick Add Product Form */}
        {showAddProduct && (
          <form
            onSubmit={handleAddProduct}
            className="rounded-2xl bg-surface-container-lowest p-5 shadow-md border-2 border-primary/20 mb-5 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-3 items-end"
          >
            <div className="sm:col-span-2">
              <label className="block font-label-sm text-primary mb-1">Tên sản phẩm lên sóng</label>
              <input
                type="text"
                required
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="VD: Móc khóa Gấu LHU Tốt Nghiệp..."
                className="w-full h-10 px-3 rounded-xl bg-surface-container-low text-body-sm"
              />
            </div>
            <div>
              <label className="block font-label-sm text-primary mb-1">Mã SKU</label>
              <input
                type="text"
                value={newSku}
                onChange={(e) => setNewSku(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-surface-container-low font-mono text-xs"
              />
            </div>
            <div>
              <label className="block font-label-sm text-primary mb-1">Giá gốc (đ)</label>
              <input
                type="number"
                value={newOrigPrice}
                onChange={(e) => setNewOrigPrice(Number(e.target.value))}
                className="w-full h-10 px-3 rounded-xl bg-surface-container-low text-body-sm"
              />
            </div>
            <div>
              <label className="block font-label-sm text-primary mb-1">Giá Flash Sale (đ)</label>
              <input
                type="number"
                value={newLivePrice}
                onChange={(e) => setNewLivePrice(Number(e.target.value))}
                className="w-full h-10 px-3 rounded-xl bg-surface-container-low text-body-sm font-bold text-secondary"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 h-10 rounded-xl bg-secondary text-on-secondary font-label-md"
              >
                Lưu SP
              </button>
              <button
                type="button"
                onClick={() => setShowAddProduct(false)}
                className="px-3 h-10 rounded-xl bg-surface-container-high text-on-surface-variant"
              >
                Đóng
              </button>
            </div>
          </form>
        )}

        {/* Product Catalog Table */}
        <div className="rounded-2xl bg-surface-container-lowest shadow-sm border border-outline-variant/30 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant/30 text-outline font-label-sm uppercase">
                  <th className="py-3.5 px-4">Thứ tự / Mã SKU</th>
                  <th className="py-3.5 px-4">Sản phẩm &amp; Nhà cung cấp</th>
                  <th className="py-3.5 px-4">Giá gốc → Giá Live</th>
                  <th className="py-3.5 px-4">Tồn kho / Đã bán</th>
                  <th className="py-3.5 px-4">Khung giờ &amp; Ghi chú Host</th>
                  <th className="py-3.5 px-4 text-right">Trạng thái Giỏ hàng</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container-high font-body-sm">
                {liveProducts.map((prod) => {
                  const pctSold = Math.min(
                    100,
                    Math.round((prod.soldQty / Math.max(1, prod.stockQty)) * 100)
                  );
                  return (
                    <tr key={prod.id} className="hover:bg-surface-container-low/60 transition-colors">
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="w-7 h-7 rounded-lg bg-primary text-on-primary font-mono text-xs font-bold flex items-center justify-center">
                            #{prod.pinOrder}
                          </span>
                          <div>
                            <span className="font-mono text-xs text-primary font-bold block">
                              {prod.sku}
                            </span>
                            <span className="text-[11px] text-outline">{prod.category}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4 max-w-xs">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          {prod.isHotDeal && (
                            <span className="px-2 py-0.5 rounded bg-secondary text-white font-label-sm text-[10px]">
                              HOT DEAL
                            </span>
                          )}
                          <span className="font-label-lg text-primary">{prod.name}</span>
                        </div>
                        <span className="text-xs text-outline">Nguồn: {prod.supplier}</span>
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="text-xs text-outline line-through">
                          {formatVND(prod.originalPrice)}
                        </div>
                        <div className="font-headline-sm text-secondary font-extrabold">
                          {formatVND(prod.livePrice)}
                        </div>
                        <span className="inline-block px-2 py-0.5 rounded bg-secondary-fixed text-on-secondary-fixed font-label-sm text-[10px] mt-0.5">
                          {prod.discountLabel}
                        </span>
                      </td>

                      <td className="py-4 px-4 min-w-[160px]">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="font-semibold text-primary">
                            Đã bán: {prod.soldQty}/{prod.stockQty}
                          </span>
                          <span className="text-outline">{pctSold}%</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-surface-container-high overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              pctSold >= 90 ? 'bg-secondary' : 'bg-primary'
                            }`}
                            style={{ width: `${pctSold}%` }}
                          ></div>
                        </div>
                      </td>

                      <td className="py-4 px-4 max-w-xs">
                        <span className="inline-block px-2.5 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-[11px] mb-1">
                          🕒 {prod.slotTime}
                        </span>
                        <p className="text-xs text-on-surface-variant line-clamp-2">
                          {prod.hostNote}
                        </p>
                      </td>

                      <td className="py-4 px-4 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => toggleProductPinStatus(prod.id)}
                          className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-label-sm transition-all ${
                            prod.status === 'Đang ghim'
                              ? 'bg-secondary text-on-secondary shadow-sm'
                              : prod.status === 'Cháy hàng'
                              ? 'bg-slate-200 text-slate-700'
                              : 'bg-primary-fixed text-on-primary-fixed hover:bg-primary hover:text-white'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[16px]">
                            {prod.status === 'Đang ghim' ? 'keep' : 'push_pin'}
                          </span>
                          <span>{prod.status}</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};
