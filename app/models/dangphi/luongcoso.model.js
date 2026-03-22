import mongoose from "mongoose";

const LuongCoSoSchema = new mongoose.Schema(
  {
    ngay_bat_dau: {
      type: Date,
      required: true,
    },

    ngay_ket_thuc: {
      type: Date,
      default: null, // null = vẫn còn hiệu lực
    },

    luong_co_so: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true },
);

const LuongCoSo = mongoose.model("luongcoso", LuongCoSoSchema);

export default LuongCoSo;
