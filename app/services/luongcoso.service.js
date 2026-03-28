import DangPhi from "../models/dangphi/dangphi.model.js";
import DangVienPhi from "../models/dangphi/dangvienphi.model.js";
import HeSoLuong from "../models/dangphi/hesoluong.model.js";
import LuongCoSo from "../models/dangphi/luongcoso.model.js";

export const create = async (payload) => {
  try {
    // Chỉ xử lý logic tự động khi record mới là "hiện hành" (ngay_ket_thuc = null hoặc không truyền)
    const isNewActive = payload.ngay_ket_thuc === null || payload.ngay_ket_thuc === undefined;

    if (isNewActive) {
      // Tìm record đang hiệu lực (ngay_ket_thuc = null)
      const currentActive = await LuongCoSo.findOne({ ngay_ket_thuc: null }).sort({ ngay_bat_dau: -1 });

      if (currentActive) {
        // Ngày kết thúc của record cũ = ngày bắt đầu của record mới
        const ketThucDate = payload.ngay_bat_dau || new Date(); // fallback nếu không có ngay_bat_dau

        await LuongCoSo.findByIdAndUpdate(currentActive._id, {
          $set: { ngay_ket_thuc: ketThucDate },
        });
      }
    }

    // Tạo record mới
    const newRecord = await LuongCoSo.create(payload);

    return newRecord;
  } catch (err) {
    throw new Error(err.message || "Lỗi khi tạo mức lương cơ sở");
  }
};

export const getAll = async () => {
  try {
    return await LuongCoSo.find().sort({ ngay_bat_dau: -1 }).lean();
  } catch (err) {
    throw new Error(err.message || "Lỗi khi lấy danh sách lương cơ sở");
  }
};

export const getById = async (id) => {
  try {
    return await LuongCoSo.findById(id);
  } catch (err) {
    throw new Error(err.message || "Lỗi khi lấy lương cơ sở theo ID");
  }
};

export const getCurrent = async () => {
  try {
    return await LuongCoSo.findOne({ ngay_ket_thuc: null }).sort({ ngay_bat_dau: -1 });
  } catch (err) {
    throw new Error(err.message || "Lỗi khi lấy mức lương cơ sở hiện hành");
  }
};

export const update = async (id, payload) => {
  try {
    // Lấy record hiện tại trước khi update
    const currentRecord = await LuongCoSo.findById(id);
    if (!currentRecord) {
      throw new Error("Không tìm thấy mức lương cơ sở để cập nhật");
    }

    // Chuẩn bị dữ liệu mới
    const newNgayBatDau = payload.ngay_bat_dau ? new Date(payload.ngay_bat_dau) : currentRecord.ngay_bat_dau;
    const newNgayKetThuc = payload.ngay_ket_thuc !== undefined ? payload.ngay_ket_thuc : currentRecord.ngay_ket_thuc;

    // Trường hợp 1: Record này đang là hiện hành (sau update vẫn null)
    const isCurrentlyActive = currentRecord.ngay_ket_thuc === null;
    const willBeActiveAfterUpdate = newNgayKetThuc === null;

    if (isCurrentlyActive && willBeActiveAfterUpdate && payload.ngay_bat_dau) {
      // Ngày bắt đầu thay đổi → cần điều chỉnh record cũ (nếu có)

      // Tìm record cũ: record có ngay_bat_dau < newNgayBatDau, gần nhất
      const previousRecord = await LuongCoSo.findOne({
        ngay_bat_dau: { $lt: newNgayBatDau },
        _id: { $ne: id }, // không phải chính nó
      })
        .sort({ ngay_bat_dau: -1 }) // gần nhất
        .limit(1);

      if (previousRecord) {
        // Cập nhật ngay_ket_thuc của record cũ = ngày bắt đầu mới
        await LuongCoSo.findByIdAndUpdate(previousRecord._id, {
          $set: { ngay_ket_thuc: newNgayBatDau },
        });
      }
    }

    const updated = await LuongCoSo.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    });

    return updated;
  } catch (err) {
    throw new Error(err.message || "Lỗi khi cập nhật lương cơ sở");
  }
};

export const remove = async (id) => {
  try {
    // Tìm record cần xóa
    const recordToDelete = await LuongCoSo.findById(id);
    if (!recordToDelete) {
      throw new Error("Không tìm thấy mức lương cơ sở để xóa");
    }

    const isActiveRecord = recordToDelete.ngay_ket_thuc === null;

    // Xóa record
    await LuongCoSo.findByIdAndDelete(id);

    // Nếu đây là record đang hiệu lực → khôi phục record trước đó thành hiện hành
    if (isActiveRecord) {
      // Tìm record trước đó (ngày bắt đầu nhỏ hơn và gần nhất)
      const previousRecord = await LuongCoSo.findOne({
        ngay_bat_dau: { $lt: recordToDelete.ngay_bat_dau },
      })
        .sort({ ngay_bat_dau: -1 }) // gần nhất
        .limit(1);

      if (previousRecord) {
        // Set lại thành hiện hành
        await LuongCoSo.findByIdAndUpdate(previousRecord._id, {
          $set: { ngay_ket_thuc: null },
        });
        console.log(`Đã khôi phục mức lương cơ sở hiện hành: ID ${previousRecord._id}`);
      } else {
        console.warn("Cảnh báo: Đã xóa mức lương cơ sở hiện hành cuối cùng. Hiện không còn mức nào hiệu lực.");
      }
    }

    return { success: true, message: "Xóa thành công" };
  } catch (err) {
    throw new Error(err.message || "Lỗi khi xóa lương cơ sở");
  }
};
