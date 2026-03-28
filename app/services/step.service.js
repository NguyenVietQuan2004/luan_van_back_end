import { Step } from "../models/camtinhdang/step.model.js";
import { Applicant } from "../models/camtinhdang/applicant.model.js";

export const createStep = async (data) => {
  // 1. Tạo Step mới
  const newStep = await Step.create(data);

  // 2. Tìm tất cả Applicant hiện có
  const allApplicants = await Applicant.find();

  // 3. Push Step mới vào mảng steps của từng Applicant
  for (const applicant of allApplicants) {
    // Kiểm tra xem Step này đã tồn tại trong applicant chưa (tránh trùng lặp)
    const exists = applicant.steps.some((s) => s.step_id.toString() === newStep._id.toString());

    if (!exists) {
      applicant.steps.push({
        step_id: newStep._id,
        completed: false,
        details: {},
        // file_url, file_name, uploaded_at sẽ được thêm sau
      });
      await applicant.save();
    }
  }

  return newStep;
};

// CREATE nhiều step (seed 10 bước)
export const createManySteps = async (data) => {
  return await Step.insertMany(data);
};

// GET tất cả step (sort theo thứ tự)
export const getAllSteps = async () => {
  return await Step.find().sort({ step_order: 1 });
};

// GET 1 step
export const getStepById = async (id) => {
  return await Step.findById(id);
};

// UPDATE step
export const updateStep = async (id, data) => {
  return await Step.findByIdAndUpdate(id, data, { new: true });
};

// DELETE step
export const deleteStep = async (id) => {
  // 1. check step tồn tại
  const step = await Step.findById(id);
  if (!step) throw new Error("Step not found");

  // 2. Xóa step này khỏi tất cả applicant
  await Applicant.updateMany(
    { "steps.step_id": id },
    {
      $pull: {
        steps: { step_id: id },
      },
    },
  );

  // 3. Xóa step
  await Step.findByIdAndDelete(id);

  return { message: "Deleted step and removed from applicants" };
};
