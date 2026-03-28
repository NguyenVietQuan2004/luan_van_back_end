import mongoose from "mongoose";

const ApplicantSchema = new mongoose.Schema(
  {
    dang_vien_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "dangvien", // tên model của anh là "dangvien"
      required: true,
      unique: true, // đảm bảo 1 cảm tình chỉ ref 1 đảng viên
    },

    steps: [
      {
        step_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Step",
        },
        completed: {
          type: Boolean,
          default: false,
        },
        details: {
          type: Object,
          default: {},
        },
        file_url: String, // link Cloudinary/S3
        file_name: String, // tên file
        uploaded_at: Date,
      },
    ],
  },
  { timestamps: true },
);

export const Applicant = mongoose.model("Applicant", ApplicantSchema);
