import mongoose from "mongoose";
const MienDangPhiSchema = new mongoose.Schema(
  {
    tu_ngay: {
      type: Date,
      required: true,
    },

    den_ngay: {
      type: Date,
      default: null,
    },

    ly_do: {
      type: String,
      default: "",
    },
  },
  { _id: false },
);
const DangVienPhiSchema = new mongoose.Schema(
  {
    ma_cb: {
      type: String,
      required: true,
    },

    ma_cc: {
      type: String,
      required: true,
    },

    dang_vien_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "dangvien",
      required: true,
    },

    ma_ngach: {
      type: String,
      required: true,
    },

    bac: {
      type: Number,
      required: true,
    },

    hs_pccv: {
      type: Number,
      default: 0,
    },

    pc_tham_nien_nha_giao: {
      type: Number, // ví dụ 0.21 = 21%
      default: 0,
    },

    pc_tham_nien_vuot_khung: {
      type: Number,
      default: 0,
    },
    mien_dang_phi: {
      type: [MienDangPhiSchema],
      default: [],
    },
  },
  { timestamps: true },
);

const DangVienPhi = mongoose.model("dangvienphi", DangVienPhiSchema);

export default DangVienPhi;
