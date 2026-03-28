// models/Document.ts
import mongoose from "mongoose";

const DocumentSchema = new mongoose.Schema({
  file_name: {
    type: String,
    required: true,
  },
  file_path: {
    type: String,
    required: true,
  },
  markdown: {
    type: String,
    default: null,
  },
  reminderSent: {
    type: Boolean,
    default: false,
  },
  deadline: {
    type: Date,
    default: null,
  },
  summary: {
    type: String,
    default: "",
  },
  uploaded_at: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Document", DocumentSchema);
