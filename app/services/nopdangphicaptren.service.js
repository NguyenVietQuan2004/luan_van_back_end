import NopDangPhiCapTren from "../models/dangphi/NopDangPhiCapTren.model.js";
import DangPhi from "../models/dangphi/dangphi.model.js";
import DangVienPhi from "../models/dangphi/dangvienphi.model.js";
import HeSoLuong from "../models/dangphi/hesoluong.model.js";
import LuongCoSo from "../models/dangphi/luongcoso.model.js";

const TY_LE_GIU_LAI = 0.3; // 30% giữ lại chi bộ (có thể config sau, hoặc lấy từ DB nếu cần)

export const create = async (payload) => {
  try {
    const { thang, nam, ngay_nop, ghi_chu = "" } = payload;

    // Kiểm tra đã tồn tại
    const exist = await NopDangPhiCapTren.findOne({ thang, nam });
    if (exist) throw new Error("Đã tồn tại bản ghi nộp đảng phí cấp trên cho tháng/năm này");

    // Tính tổng thu từ bảng dangphi
    const dsDangPhi = await DangPhi.find({ thang, nam });
    const tong_thu = dsDangPhi.reduce((sum, record) => sum + record.tong_dang_phi, 0);

    // Tính phần giữ lại và phần nộp
    const trich_giu_lai = Math.round(tong_thu * TY_LE_GIU_LAI);
    const phai_nop_cap_tren = tong_thu - trich_giu_lai;

    return await NopDangPhiCapTren.create({
      thang,
      nam,
      ngay_nop: ngay_nop || new Date(), // fallback nếu không truyền
      tong_thu,
      trich_giu_lai,
      phai_nop_cap_tren,
      da_nop_cap_tren: 0, // mặc định chưa nộp
      nguoi_nhan: "",
      ghi_chu,
    });
  } catch (err) {
    throw new Error(err.message || "Lỗi khi tạo bản ghi nộp đảng phí cấp trên");
  }
};

export const getAll = async () => {
  try {
    return await NopDangPhiCapTren.find().sort({ nam: -1, thang: -1 }).lean();
  } catch (err) {
    throw new Error(err.message || "Lỗi khi lấy danh sách nộp đảng phí cấp trên");
  }
};

export const getById = async (id) => {
  try {
    const record = await NopDangPhiCapTren.findById(id);
    if (!record) throw new Error("Không tìm thấy bản ghi nộp đảng phí cấp trên");
    return record;
  } catch (err) {
    throw new Error(err.message || "Lỗi khi lấy bản ghi theo ID");
  }
};

export const getByThangNam = async (nam) => {
  try {
    const record = await NopDangPhiCapTren.find({ nam }).lean();
    // return await NopDangPhiCapTren.find().sort({ nam: -1, thang: -1 }).lean();
    if (!record) throw new Error("Không tìm thấy bản ghi cho tháng/năm này");
    return record;
  } catch (err) {
    throw new Error(err.message || "Lỗi khi lấy bản ghi theo tháng/năm");
  }
};

export const update = async (id, payload) => {
  try {
    // Cho phép cập nhật da_nop_cap_tren, nguoi_nhan, ghi_chu...
    const updated = await NopDangPhiCapTren.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    });
    if (!updated) throw new Error("Không tìm thấy bản ghi để cập nhật");
    return updated;
  } catch (err) {
    throw new Error(err.message || "Lỗi khi cập nhật nộp đảng phí cấp trên");
  }
};

export const remove = async (id) => {
  try {
    const deleted = await NopDangPhiCapTren.findByIdAndDelete(id);
    if (!deleted) throw new Error("Không tìm thấy bản ghi để xóa");
    return { success: true, message: "Xóa thành công" };
  } catch (err) {
    throw new Error(err.message || "Lỗi khi xóa bản ghi nộp đảng phí cấp trên");
  }
};

// Bonus: Kiểm tra xem tháng/năm đã nộp đủ chưa
export const kiemTraDaNopDu = async (thang, nam) => {
  const record = await NopDangPhiCapTren.findOne({ thang, nam });
  if (!record) return false;
  return record.da_nop_cap_tren >= record.phai_nop_cap_tren;
};
