import mongoose from "mongoose";

const PartyEmailsSchema = new mongoose.Schema(
  {
    emails: {
      type: String,
      default: "", // mặc định rỗng
      trim: true,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

// Chỉ nên có duy nhất 1 document → dùng fixed _id hoặc tìm theo điều kiện
PartyEmailsSchema.index({ _id: 1 }); // không cần unique khác

const PartyEmails = mongoose.model("PartyEmails", PartyEmailsSchema);

export default PartyEmails;
