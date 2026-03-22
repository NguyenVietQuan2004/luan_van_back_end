import mongoose from "mongoose";

const ApplicantSchema = new mongoose.Schema(
  {
    name: String,
    dob: Date,
    gender: String,

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
