import mongoose from "mongoose";

const DangPhiSchema = new mongoose.Schema(
  {
    dangvien_phi_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "dangvienphi", // tham chiếu tới bảng chứa thông tin giảng viên
    },

    thang: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
    },

    nam: {
      type: Number,
      required: true,
    },

    thu_nhap: {
      type: Number,
      required: true,
    },

    dang_phi: {
      type: Number,
      required: true,
    },

    truy_thu: {
      type: Number,
      default: 0,
    },

    tong_dang_phi: {
      type: Number,
      required: true,
    },
    da_thu: {
      type: Number,
      default: 0, // mặc định 0 khi tạo mới
      min: 0,
    },
  },
  { timestamps: true },
);
DangPhiSchema.index({ dangvien_phi_id: 1, thang: 1, nam: 1 }, { unique: true });
const DangPhi = mongoose.model("dangphi", DangPhiSchema);

export default DangPhi;
