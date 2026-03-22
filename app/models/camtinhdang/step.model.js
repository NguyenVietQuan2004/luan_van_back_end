import mongoose from "mongoose";

const StepSchema = new mongoose.Schema(
  {
    name: String,
    step_order: Number,
    template_file: String,
    note: String,
  },
  { timestamps: true },
);

export const Step = mongoose.model("Step", StepSchema);
