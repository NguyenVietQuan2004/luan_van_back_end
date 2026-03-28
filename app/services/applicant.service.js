import { Applicant } from "../models/camtinhdang/applicant.model.js";
import { Step } from "../models/camtinhdang/step.model.js";

// export const createApplicant = async (data) => {
//   const steps = await Step.find().sort({ step_order: 1 });

//   const stepData = steps.map((s) => ({
//     step_id: s._id,
//     completed: false,
//     details: {},
//   }));

//   return Applicant.create({ ...data, steps: stepData });
// };
import DangVien from "../models/dangvien/dangvien.model.js";
export const createApplicant = async (dangVienId) => {
  const dangVien = await DangVien.findById(dangVienId);
  if (!dangVien) throw new Error("Không tìm thấy đảng viên");
  if (!dangVien.la_cam_tinh_dang) throw new Error("Đảng viên này không phải cảm tình đảng");
  const existing = await Applicant.findOne({ dang_vien_id: dangVienId });
  if (existing) throw new Error("Đảng viên này đã có hồ sơ cảm tình đảng");
  const steps = await Step.find().sort({ step_order: 1 });
  const stepData = steps.map((s) => ({
    step_id: s._id,
    completed: false,
    details: {},
  }));
  return Applicant.create({
    dang_vien_id: dangVienId,
    steps: stepData,
  });
};

// export const getAllApplicants = () => Applicant.find().populate("steps.step_id", "name step_order template_file");

// export const getApplicantById = (id) =>
//   Applicant.findById(id).populate("steps.step_id", "name step_order template_file");

export const getAllApplicants = () =>
  Applicant.find()
    .populate("dang_vien_id", "so_tt ho_ten email ngay_sinh gioi_tinh la_cam_tinh_dang")
    .populate("steps.step_id", "name step_order template_file")
    .sort({ createdAt: -1 });

export const getApplicantById = (id) =>
  Applicant.findById(id)
    .populate("dang_vien_id", "so_tt ho_ten email ngay_sinh gioi_tinh la_cam_tinh_dang")
    .populate("steps.step_id", "name step_order template_file");

export const updateApplicant = (id, data) => Applicant.findByIdAndUpdate(id, data, { new: true });

export const deleteApplicant = (id) => Applicant.findByIdAndDelete(id);

export const updateStepForApplicant = async (applicantId, stepId, body) => {
  const applicant = await Applicant.findById(applicantId);
  if (!applicant) throw new Error("Applicant not found");

  const step = applicant.steps.find((s) => s.step_id.toString() === stepId);
  if (!step) throw new Error("Step not found");

  step.completed = body.completed ?? step.completed;
  step.details = body.details ?? step.details;

  return applicant.save();
};

export const uploadFileForStep = async (applicantId, stepId, file) => {
  const applicant = await Applicant.findById(applicantId);
  if (!applicant) throw new Error("Applicant not found");

  const step = applicant.steps.find((s) => s.step_id.toString() === stepId);
  if (!step) throw new Error("Step not found");

  // step.file_url = file.path;
  step.file_url = `/uploads/${file.filename}`;
  step.file_name = file.originalname;
  step.uploaded_at = new Date();

  return applicant.save();
};

export const updateStepWithFile = async (applicantId, stepId, body, file) => {
  const applicant = await Applicant.findById(applicantId);
  if (!applicant) throw new Error("Applicant not found");

  const step = applicant.steps.find((s) => s.step_id.toString() === stepId);
  if (!step) throw new Error("Step not found");

  // ✅ update completed
  if (body.completed !== undefined) {
    step.completed = body.completed;
  }
  if (body.details !== undefined) {
    step.details = body.details;
  }

  // ✅ update file nếu có
  if (file) {
    step.file_url = `/uploads/${file.filename}`;
    step.file_name = file.originalname;
    step.uploaded_at = new Date();

    // 👉 optional: auto complete khi upload
    step.completed = true;
  }

  return await applicant.save();
};
