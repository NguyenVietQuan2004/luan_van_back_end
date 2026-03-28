import mongoose from "mongoose";

const ReportTypeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
  },
  { timestamps: true },
);

export const ReportType = mongoose.model("ReportType", ReportTypeSchema);
