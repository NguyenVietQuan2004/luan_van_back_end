import mongoose from "mongoose";

const ReportSchema = new mongoose.Schema(
  {
    so: {
      type: Number,
      required: true,
    },
    code_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ReportCode",
      required: true,
    },
    title: {
      type: String,
      trim: true,
    },
    ngay_ban_hanh: {
      type: Date,
    },
    file_url: {
      type: String,
    },
    file_name: {
      type: String,
    },
  },
  { timestamps: true },
);

// Unique index: không cho phép trùng (code + số)
ReportSchema.index({ code_id: 1, so: 1 }, { unique: true });

export const Report = mongoose.model("Report", ReportSchema);
