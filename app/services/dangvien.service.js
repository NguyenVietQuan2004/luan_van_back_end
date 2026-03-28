import DangVien from "../models/dangvien/dangvien.model.js";
// export const create = async (payload) => {

//   const count = await DangVien.countDocuments();

//   const newData = {
//     ...payload,
//     so_tt: count + 1,
//   };

//   return DangVien.create(newData);
// };

export const create = async (payload) => {
  const count = await DangVien.countDocuments({ deletedAt: null });

  const newData = {
    ...payload,
    so_tt: count + 1,
  };

  // Tạo đảng viên trước
  const newDangVien = await DangVien.create(newData);

  // Nếu là cảm tình đảng → tự động tạo hồ sơ Applicant
  if (newDangVien.la_cam_tinh_dang === true) {
    try {
      // Kiểm tra xem đã có Applicant chưa (phòng trường hợp lỗi)
      const existingApplicant = await Applicant.findOne({ dang_vien_id: newDangVien._id });
      if (!existingApplicant) {
        const steps = await Step.find().sort({ step_order: 1 });

        const stepData = steps.map((s) => ({
          step_id: s._id,
          completed: false,
          details: {},
        }));

        await Applicant.create({
          dang_vien_id: newDangVien._id,
          steps: stepData,
        });

        console.log(`✅ Đã tự động tạo hồ sơ cảm tình đảng cho đảng viên ID: ${newDangVien._id}`);
      }
    } catch (applicantError) {
      console.error("❌ Lỗi khi tự động tạo Applicant:", applicantError);
      // Không throw lỗi để tránh làm hỏng việc tạo đảng viên
      // Có thể ghi log hoặc xử lý thêm nếu cần
    }
  }

  return newDangVien; // Trả về đảng viên (frontend chủ yếu cần thông tin này)
};

export const getAll = () => {
  return DangVien.find({ deletedAt: null }).sort({ createdAt: 1 });
};

export const getById = (id) => {
  return DangVien.findById(id);
};

// export const update = (id, payload) => {
//   return DangVien.findByIdAndUpdate(id, payload, { new: true });
// };

// dangvien.service.js
import { Applicant } from "../models/camtinhdang/applicant.model.js";
import { Step } from "../models/camtinhdang/step.model.js";
export const update = async (id, payload) => {
  // Cập nhật thông tin đảng viên
  const updatedDangVien = await DangVien.findByIdAndUpdate(id, payload, { new: true });

  if (!updatedDangVien) {
    throw new Error("Không tìm thấy đảng viên để cập nhật");
  }

  const isCamTinhDang = updatedDangVien.la_cam_tinh_dang === true;

  try {
    if (isCamTinhDang) {
      // === TRƯỜNG HỢP: Là cảm tình đảng ===
      const existingApplicant = await Applicant.findOne({ dang_vien_id: id });

      if (!existingApplicant) {
        // Tạo mới Applicant nếu chưa có
        const steps = await Step.find().sort({ step_order: 1 });
        const stepData = steps.map((s) => ({
          step_id: s._id,
          completed: false,
          details: {},
        }));

        await Applicant.create({
          dang_vien_id: id,
          steps: stepData,
        });

        console.log(`✅ Đã tự động tạo hồ sơ cảm tình đảng cho đảng viên ${id}`);
      }
    } else {
      // === TRƯỜNG HỢP: Không còn là cảm tình đảng nữa ===
      const deletedApplicant = await Applicant.findOneAndDelete({ dang_vien_id: id });

      if (deletedApplicant) {
        console.log(`🗑️ Đã xóa hồ sơ cảm tình đảng của đảng viên ${id} vì la_cam_tinh_dang = false`);
      }
    }
  } catch (error) {
    console.error("Lỗi khi xử lý Applicant khi update đảng viên:", error);
    // Không throw lỗi để tránh làm hỏng việc update đảng viên chính
  }

  return updatedDangVien;
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

// dangvien.service.js
export const getAllPartyEmails = async () => {
  try {
    const dangViens = await DangVien.find(
      {
        deletedAt: null, // chỉ lấy đảng viên chưa xóa
        email: { $exists: true, $ne: null, $ne: "" }, // email phải tồn tại và không rỗng
      },
      { email: 1, _id: 0 }, // chỉ lấy trường email (projection - tối ưu)
    ).lean();

    return dangViens.map((dv) => dv.email).filter(Boolean); // đảm bảo không có null/undefined
  } catch (error) {
    console.error("Lỗi lấy danh sách email đảng viên:", error);
    throw new Error("Không thể lấy danh sách email đảng viên");
  }
};
