import mongoose from "mongoose";

const DangVienSchema = new mongoose.Schema(
  {
    so_tt: Number,
    ho_ten: String,
    ho_ten_khai_sinh: String,
    ngay_sinh: Date,
    gioi_tinh: String,
    dan_toc: String,
    ton_giao: String,
    que_quan: String,
    trinh_do: {
      van_hoa: String,
      ly_luan: String,
      ngoai_ngu: String,
      chuyen_mon: String,
    },
    nghe_nghiep: [
      {
        ten_nghe: String,
        tu_ngay: Date,
        den_ngay: Date, // null = hiện tại
      },
    ],
    // 14
    so_the_dang_vien: String,
    ngay_vao_dang: Date,
    ngay_vao_dang_chinh_thuc: Date,
    // 17
    huy_hieu: [
      {
        loai: String, // "40_nam", "50_nam", ...
        ngay_nhan: Date,
      },
    ],
    // 21
    doi_tuong: String,
    trang_thai_quan_doi: String,
    tinh_trang_huu_tri: String,
    // 24
    lich_su_chuyen_dang: [
      {
        ngay_chuyen_di: Date,
        noi_den: String,
        ngay_chuyen_den: Date,
        noi_di: String,
      },
    ],
    // 28
    // trang_thai: {
    //   type: String,
    //   enum: ["dang_vien", "da_mat", "ra_dang"],
    //   default: "dang_vien",
    // },
    thong_tin_khac: {
      ngay_mat: Date,
      ly_do_mat: String,
      ngay_ra_dang: Date,
      hinh_thuc_ra_dang: String,
    },
    // 🪖 Khác
    ghi_chu: String,

    deletedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

const dangvien = mongoose.model("dangvien", DangVienSchema);

export default dangvien;
