import DangPhi from "../models/dangphi/dangphi.model.js";
import DangVienPhi from "../models/dangphi/dangvienphi.model.js";
import HeSoLuong from "../models/dangphi/hesoluong.model.js";
import LuongCoSo from "../models/dangphi/luongcoso.model.js";

export const create = async (payload) => {
  try {
    return await HeSoLuong.create(payload);
  } catch (err) {
    throw new Error(err.message || "Lỗi khi tạo hệ số lương");
  }
};

export const getAll = async () => {
  try {
    return await HeSoLuong.find().sort({ ma_ngach: 1, bac: 1 }).lean(); // lean() để trả về plain object, nhanh hơn
  } catch (err) {
    throw new Error(err.message || "Lỗi khi lấy danh sách hệ số lương");
  }
};

export const getById = async (id) => {
  try {
    return await HeSoLuong.findById(id);
  } catch (err) {
    throw new Error(err.message || "Lỗi khi lấy hệ số lương theo ID");
  }
};

export const update = async (id, payload) => {
  try {
    const updated = await HeSoLuong.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    });
    if (!updated) throw new Error("Không tìm thấy hệ số lương để cập nhật");
    return updated;
  } catch (err) {
    throw new Error(err.message || "Lỗi khi cập nhật hệ số lương");
  }
};

export const remove = async (id) => {
  try {
    const deleted = await HeSoLuong.findByIdAndDelete(id);
    if (!deleted) throw new Error("Không tìm thấy hệ số lương để xóa");
    return { success: true, message: "Xóa thành công" };
  } catch (err) {
    throw new Error(err.message || "Lỗi khi xóa hệ số lương");
  }
};

// Bonus: Tìm hệ số lương theo ma_ngach và bac (dùng nhiều trong tính đảng phí)
export const findByNgachAndBac = async (ma_ngach, bac) => {
  try {
    return await HeSoLuong.findOne({ ma_ngach, bac });
  } catch (err) {
    throw new Error(err.message || "Lỗi khi tìm hệ số lương theo ngạch và bậc");
  }
};
