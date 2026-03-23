import DangPhi from "../models/dangphi/dangphi.model.js";
import DangVienPhi from "../models/dangphi/dangvienphi.model.js";
import HeSoLuong from "../models/dangphi/hesoluong.model.js";
import LuongCoSo from "../models/dangphi/luongcoso.model.js";

import DangVien from "../models/dangvien/dangvien.model.js"; // giả sử đường dẫn đúng

export const create = async (payload) => {
  try {
    // Kiểm tra đảng viên tồn tại
    const dv = await DangVien.findById(payload.dang_vien_id);
    if (!dv) throw new Error("Đảng viên không tồn tại");

    // Kiểm tra đã có record cho đảng viên này chưa
    const exist = await DangVienPhi.findOne({ dang_vien_id: payload.dang_vien_id });
    if (exist) throw new Error("Đảng viên này đã có thông tin lương và đảng phí");

    return await DangVienPhi.create(payload);
  } catch (err) {
    throw new Error(err.message || "Lỗi khi tạo thông tin đảng viên phí");
  }
};

export const getAll = async (query = {}) => {
  try {
    // Có thể truyền query filter nếu cần (ví dụ: { ma_ngach: "..." })
    return await DangVienPhi.find(query)
      .populate("dang_vien_id", "ho_ten so_the_dang_vien ngay_sinh gioi_tinh")
      .sort({ ma_cb: 1, ma_cc: 1 })
      .lean();
  } catch (err) {
    throw new Error(err.message || "Lỗi khi lấy danh sách đảng viên phí");
  }
};

export const getById = async (id) => {
  try {
    const record = await DangVienPhi.findById(id).populate("dang_vien_id", "ho_ten so_the_dang_vien");
    if (!record) throw new Error("Không tìm thấy thông tin đảng viên phí");
    return record;
  } catch (err) {
    throw new Error(err.message || "Lỗi khi lấy thông tin đảng viên phí theo ID");
  }
};

export const getByDangVienId = async (dang_vien_id) => {
  try {
    const record = await DangVienPhi.findOne({ dang_vien_id }).populate("dang_vien_id");
    if (!record) throw new Error("Không tìm thấy thông tin lương cho đảng viên này");
    return record;
  } catch (err) {
    throw new Error(err.message || "Lỗi khi lấy thông tin theo đảng viên ID");
  }
};

export const update = async (id, payload) => {
  try {
    const updated = await DangVienPhi.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    });
    if (!updated) throw new Error("Không tìm thấy thông tin đảng viên phí để cập nhật");
    return updated;
  } catch (err) {
    throw new Error(err.message || "Lỗi khi cập nhật thông tin đảng viên phí");
  }
};

export const remove = async (id) => {
  try {
    // 1. Tìm bản ghi DangVienPhi cần xóa
    const dangVienPhi = await DangVienPhi.findById(id);
    if (!dangVienPhi) {
      throw new Error("Không tìm thấy thông tin đảng viên phí để xóa");
    }

    // 2. Kiểm tra xem có bản ghi đảng phí nào (DangPhi) đang tham chiếu đến nó không
    const dangPhiTonTai = await DangPhi.findOne({
      dangvien_phi_id: id, // hoặc: dangvien_phi_id: dangVienPhi._id
    }).lean(); // lean để nhanh, không cần full document

    if (dangPhiTonTai) {
      throw new Error(
        `Không thể xóa thông tin đảng viên phí này vì đã có dữ liệu đảng phí được tính toán (có ít nhất 1 tháng/năm đã thu đảng phí)`,
      );
    }

    // 3. Nếu không có đảng phí nào → cho phép xóa
    await DangVienPhi.findByIdAndDelete(id);

    return {
      success: true,
      message: "Xóa thông tin đảng viên phí thành công",
    };
  } catch (err) {
    throw new Error(err.message || "Lỗi khi xóa thông tin đảng viên phí");
  }
};
