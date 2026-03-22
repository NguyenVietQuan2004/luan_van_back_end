import mongoose from "mongoose";

const ContestRegistrationSchema = new mongoose.Schema(
  {
    contest_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "cuocthi",
    },
    members: {
      type: [
        {
          party_member_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "dangvien",
          },
          role: {
            type: String,
            default: "member",
          },
        },
      ],
      validate: {
        validator: function (v) {
          return v.length > 0;
        },
        message: "Phải có ít nhất 1 thành viên",
      },
    },
    status: {
      type: String,
      enum: ["registered", "approved", "rejected", "completed"],
      default: "registered",
    },
    team_name: String, // optional (chỉ dùng khi >1 người)
    register_date: {
      type: Date,
      default: Date.now,
    },
    result: {
      title: String, // Giải nhất
      rank: Number, // 1
      score: Number, // optional
    },
    note: String,
    certificate_file: String,
    // created_by: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "dangvien",
    // },
  },
  { timestamps: true },
);

const cuocthidangky = mongoose.model("cuocthidangky", ContestRegistrationSchema);

export default cuocthidangky;
