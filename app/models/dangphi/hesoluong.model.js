import mongoose from "mongoose";

const HeSoLuongSchema = new mongoose.Schema(
  {
    ma_ngach: {
      type: String,
      required: true,
    },

    bac: {
      type: Number,
      required: true,
    },

    he_so_luong: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true },
);
HeSoLuongSchema.index({ ma_ngach: 1, bac: 1 }, { unique: true });
const HeSoLuong = mongoose.model("hesoluong", HeSoLuongSchema);

export default HeSoLuong;
