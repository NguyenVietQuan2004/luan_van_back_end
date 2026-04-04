// models/Syllabus.js
import mongoose from "mongoose";

const SectionSchema = new mongoose.Schema(
  {
    heading: { type: String },
    content: { type: String },
    is_empty: { type: Boolean, default: true },
    sub_fields: { type: mongoose.Schema.Types.Mixed },
    rows: [{ type: mongoose.Schema.Types.Mixed }],
    table_headers: [{ type: String }],
  },
  { _id: false },
);

const SyllabusSchema = new mongoose.Schema(
  {
    filename: {
      type: String,
      required: true,
    },
    originalName: {
      type: String,
      required: true,
    },
    file_path: {
      type: String,
      required: true,
    },
    extractedAt: {
      type: Date,
      default: Date.now,
    },

    // Lưu sections dạng Map (key = section_1, section_2, ...)
    sections: {
      type: Map,
      of: SectionSchema,
      required: true,
    },

    status: {
      type: String,
      enum: ["success", "failed"],
      default: "success",
    },
  },
  {
    timestamps: true,
    collection: "syllabuses",
  },
);

SyllabusSchema.index({ filename: 1 });
SyllabusSchema.index({ extractedAt: -1 });

const Syllabus = mongoose.model("Syllabus", SyllabusSchema);

export default Syllabus;
