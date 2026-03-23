import DangPhi from "../models/dangphi/dangphi.model.js";
import DangVienPhi from "../models/dangphi/dangvienphi.model.js";
import HeSoLuong from "../models/dangphi/hesoluong.model.js";
import LuongCoSo from "../models/dangphi/luongcoso.model.js";

const tinhThuNhapVaDangPhi = async (dangvien_phi_id, thang, nam) => {
  const dvPhi = await DangVienPhi.findById(dangvien_phi_id).populate("dang_vien_id");
  if (!dvPhi) throw new Error("Không tìm thấy thông tin đảng viên phí");

  // Kiểm tra miễn đảng phí trong tháng/năm này
  const targetDate = new Date(nam, thang - 1, 15); // Ngày giữa tháng để kiểm tra
  const isMien = dvPhi.mien_dang_phi.some((m) => {
    const tu = new Date(m.tu_ngay);
    const den = m.den_ngay ? new Date(m.den_ngay) : new Date(9999, 11, 31);
    return targetDate >= tu && targetDate <= den;
  });

  if (isMien) {
    return { thu_nhap: 0, dang_phi: 0 };
  }

  // Lấy hệ số lương
  const hsl = await HeSoLuong.findOne({ ma_ngach: dvPhi.ma_ngach, bac: dvPhi.bac });
  if (!hsl) throw new Error(`Không tìm thấy hệ số lương cho ngạch ${dvPhi.ma_ngach} bậc ${dvPhi.bac}`);
  //  chỗ này ko có lưu lại lương cơ sở lúc này
  // Lấy lương cơ sở hiện hành (hoặc phù hợp thời điểm - tạm lấy null ket thuc)
  const lcs = await LuongCoSo.findOne({ ngay_ket_thuc: null }).sort({ ngay_bat_dau: -1 });
  if (!lcs) throw new Error("Không tìm thấy mức lương cơ sở hiện hành");

  // const luongCoBan = hsl.he_so_luong * lcs.luong_co_so;
  // const thu_nhap =
  //   luongCoBan +
  //   dvPhi.hs_pccv * luongCoBan +
  //   dvPhi.pc_tham_nien_nha_giao * luongCoBan

  const thu_nhap = (dvPhi.hs_pccv + hsl.he_so_luong) * (1 + dvPhi.pc_tham_nien_nha_giao / 100) * lcs.luong_co_so;

  const dang_phi = Math.round(thu_nhap * 0.01); // ROUND như công thức Excel của bạn

  return { thu_nhap, dang_phi };
};

export const create = async (payload) => {
  try {
    const { dangvien_phi_id, thang, nam, truy_thu = 0, ghi_chu = "" } = payload;

    const exist = await DangPhi.findOne({ dangvien_phi_id, thang, nam });
    if (exist) throw new Error("Đã tồn tại bản ghi đảng phí cho tháng/năm này");

    const { thu_nhap, dang_phi } = await tinhThuNhapVaDangPhi(dangvien_phi_id, thang, nam);
    const tong_dang_phi = dang_phi + truy_thu;

    return await DangPhi.create({
      dangvien_phi_id,
      thang,
      nam,
      thu_nhap,
      dang_phi,
      truy_thu,
      tong_dang_phi,
      ghi_chu,
    });
  } catch (err) {
    throw new Error(err.message || "Lỗi khi tạo đảng phí");
  }
};

export const getAll = async (query = {}) => {
  try {
    return await DangPhi.find(query)
      .populate({
        path: "dangvien_phi_id",
        populate: { path: "dang_vien_id", select: "ho_ten so_the_dang_vien" },
      })
      .sort({ nam: -1, thang: -1 })
      .lean();
  } catch (err) {
    throw new Error(err.message || "Lỗi khi lấy danh sách đảng phí");
  }
};

export const getById = async (id) => {
  try {
    const record = await DangPhi.findById(id).populate("dangvien_phi_id");
    if (!record) throw new Error("Không tìm thấy bản ghi đảng phí");
    return record;
  } catch (err) {
    throw new Error(err.message || "Lỗi khi lấy đảng phí theo ID");
  }
};

export const update = async (id, payload) => {
  try {
    // Nếu update truy_thu hoặc ghi_chu → tính lại tong
    const updated = await DangPhi.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
    if (!updated) throw new Error("Không tìm thấy để cập nhật");
    if (payload.truy_thu !== undefined) {
      updated.tong_dang_phi = updated.dang_phi + updated.truy_thu;
      await updated.save();
    }

    return updated;
  } catch (err) {
    throw new Error(err.message || "Lỗi khi cập nhật đảng phí");
  }
};

export const remove = async (id) => {
  try {
    const deleted = await DangPhi.findByIdAndDelete(id);
    if (!deleted) throw new Error("Không tìm thấy để xóa");
    return { success: true, message: "Xóa thành công" };
  } catch (err) {
    throw new Error(err.message || "Lỗi khi xóa đảng phí");
  }
};

// Bonus: Tính tổng cho tháng/năm (dùng cho nộp cấp trên)
export const tinhTongDangPhi = async (thang, nam) => {
  const ds = await DangPhi.find({ thang, nam });
  const tongThu = ds.reduce((sum, r) => sum + r.tong_dang_phi, 0);
  return { tongThu, soLuong: ds.length };
};

// Service - dangphi.service.js
export const tinhDangPhiChoTatCaDangVienThangHienTai = async () => {
  try {
    const now = new Date();
    const thang = now.getMonth() + 1;
    const nam = now.getFullYear() + 1;

    // Lấy tất cả đảng viên phí
    const tatCaDVP = await DangVienPhi.find().populate("dang_vien_id");

    let createdCount = 0;
    let skippedCount = 0;
    let errors = [];

    for (const dvp of tatCaDVP) {
      try {
        const exist = await DangPhi.findOne({
          dangvien_phi_id: dvp._id,
          thang,
          nam,
        });

        if (exist) {
          skippedCount++;
          continue; // hoặc update nếu bạn muốn overwrite
        }

        const { thu_nhap, dang_phi } = await tinhThuNhapVaDangPhi(dvp._id, thang, nam);
        const tong_dang_phi = dang_phi + 0; // truy_thu mặc định 0

        await DangPhi.create({
          dangvien_phi_id: dvp._id,
          thang,
          nam,
          thu_nhap,
          dang_phi,
          truy_thu: 0,
          tong_dang_phi,
        });

        createdCount++;
      } catch (err) {
        errors.push(`Lỗi với đảng viên ${dvp.dang_vien_id?.ho_ten || dvp._id}: ${err.message}`);
      }
    }

    return {
      success: true,
      thang,
      nam,
      created: createdCount,
      skipped: skippedCount,
      errors: errors.length ? errors : undefined,
    };
  } catch (err) {
    throw new Error(err.message || "Lỗi khi tính đảng phí tháng hiện tại");
  }
};
