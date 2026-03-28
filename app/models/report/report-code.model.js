import mongoose from "mongoose";

const ReportCodeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    type_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ReportType",
      required: true,
    },
    template_file: {
      type: String,
    },
  },
  { timestamps: true },
);

ReportCodeSchema.index({ type_id: 1, code: 1 });

export const ReportCode = mongoose.model("ReportCode", ReportCodeSchema);
