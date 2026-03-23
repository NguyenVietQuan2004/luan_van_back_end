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
    // 1. Tìm bản ghi hệ số lương cần xóa
    const heSoLuong = await HeSoLuong.findById(id);
    if (!heSoLuong) {
      throw new Error("Không tìm thấy hệ số lương để xóa");
    }

    // 2. Kiểm tra xem có đảng viên phí nào đang dùng cặp ma_ngach + bac này không
    const dangVienDangDung = await DangVienPhi.findOne({
      ma_ngach: heSoLuong.ma_ngach,
      bac: heSoLuong.bac,
    }).lean(); // lean để nhanh hơn, không cần hydrate document

    if (dangVienDangDung) {
      throw new Error(
        `Không thể xóa hệ số lương này vì đang có đảng viên sử dụng (ma_ngach: ${heSoLuong.ma_ngach}, bac: ${heSoLuong.bac})`,
      );
    }

    // 3. Nếu không ai dùng → tiến hành xóa
    await HeSoLuong.findByIdAndDelete(id);

    return {
      success: true,
      message: "Xóa hệ số lương thành công",
    };
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
