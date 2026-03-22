import mongoose from "mongoose";

const ContestSchema = new mongoose.Schema(
  {
    name: String,
    start_date: Date,
    end_date: Date,
    registration_deadline: Date,
    max_members: Number,
    location: String,
    type: {
      type: String,
      enum: ["online", "offline"],
    },
    rules_file: String, // /uploads/xxx.pdf
    note: String,
  },
  { timestamps: true },
);

const cuocthi = mongoose.model("cuocthi", ContestSchema);

export default cuocthi;
