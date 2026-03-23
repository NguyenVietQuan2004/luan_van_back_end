import DangVien from "../models/dangvien/dangvien.model.js";
export const create = async (payload) => {
  const count = await DangVien.countDocuments();

  const newData = {
    ...payload,
    so_tt: count + 1,
  };

  return DangVien.create(newData);
};
export const getAll = () => {
  return DangVien.find({ deletedAt: null }).sort({ createdAt: 1 });
};

export const getById = (id) => {
  return DangVien.findById(id);
};

export const update = (id, payload) => {
  return DangVien.findByIdAndUpdate(id, payload, { new: true });
};

// export const remove = async (id) => {
//   const deleted = await DangVien.findById(id);
//   if (!deleted || deleted.deletedAt) return null;

//   const deletedSTT = deleted.so_tt;

//   await DangVien.findByIdAndUpdate(id, {
//     deletedAt: new Date(),
//   });
//   await DangVien.updateMany(
//     {
//       so_tt: { $gt: deletedSTT },
//       deletedAt: null,
//     },
//     { $inc: { so_tt: -1 } },
//   );

//   return { success: true };
// };

import CuocThiDangKy from "../models/contest/contest.registration.model.js";
export const remove = async (id) => {
  try {
    // 1. Tìm đảng viên cần xóa (soft delete)
    const dangVien = await DangVien.findById(id);
    if (!dangVien || dangVien.deletedAt) {
      return null; // hoặc throw Error nếu muốn báo rõ
    }

    // 2. Kiểm tra xem đảng viên này có đang đăng ký cuộc thi nào không
    const dangKyTonTai = await CuocThiDangKy.findOne({
      "members.party_member_id": id, // tìm trong mảng members
      // status: { $in: ["registered", "approved"] }   // ← optional: chỉ tính các đăng ký còn hiệu lực
    }).lean();

    if (dangKyTonTai) {
      throw new Error(
        "Không thể xóa đảng viên này vì đang có đăng ký cuộc thi liên quan. " +
          "Vui lòng hủy/xóa đăng ký cuộc thi trước.",
      );
    }

    // 3. Nếu không có đăng ký nào → tiến hành soft delete + điều chỉnh số thứ tự
    const deletedSTT = dangVien.so_tt;

    await DangVien.findByIdAndUpdate(id, {
      deletedAt: new Date(),
    });

    // Điều chỉnh lại so_tt cho các đảng viên còn lại (giữ thứ tự tăng dần)
    await DangVien.updateMany(
      {
        so_tt: { $gt: deletedSTT },
        deletedAt: null,
      },
      { $inc: { so_tt: -1 } },
    );

    return { success: true, message: "Xóa đảng viên thành công (soft delete)" };
  } catch (err) {
    throw new Error(err.message || "Lỗi khi xóa đảng viên");
  }
};
