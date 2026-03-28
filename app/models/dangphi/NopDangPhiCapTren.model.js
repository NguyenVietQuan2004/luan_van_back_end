import mongoose from "mongoose";

const NopDangPhiCapTrenSchema = new mongoose.Schema(
  {
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

    ngay_nop: {
      type: Date,
      required: true,
    },

    tong_thu: {
      type: Number,
      default: 0,
    },

    trich_giu_lai: {
      type: Number,
      default: 0,
    },

    phai_nop_cap_tren: {
      type: Number,
      default: 0,
    },

    da_nop_cap_tren: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

// mỗi tháng chỉ có 1 record
NopDangPhiCapTrenSchema.index({ thang: 1, nam: 1 }, { unique: true });

const NopDangPhiCapTren = mongoose.model("nopdangphicaptren", NopDangPhiCapTrenSchema);

export default NopDangPhiCapTren;
