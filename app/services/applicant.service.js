// // services/applicant.service.js
// import mongoose from "mongoose";
// import { Applicant } from "../models/camtinhdang/applicant.model.js"; // điều chỉnh đường dẫn nếu cần
// // Nếu bạn dùng cloudinary hoặc s3 để upload → import helper upload ở đây
// // Ví dụ: import { uploadToCloudinary } from "../utils/cloudinary.js";

// /**
//  * Tạo mới một Applicant
//  * @param {Object} applicantData
//  * @returns {Promise<Applicant>}
//  */
// export const createApplicant = async (applicantData) => {
//   try {
//     const applicant = new Applicant({
//       name: applicantData.name,
//       dob: applicantData.dob ? new Date(applicantData.dob) : undefined,
//       gender: applicantData.gender,
//       steps: [], // sẽ được thêm sau hoặc khi tạo từ form
//     });

//     // Nếu gửi luôn danh sách steps ban đầu
//     if (applicantData.steps && Array.isArray(applicantData.steps)) {
//       applicant.steps = applicantData.steps.map((step) => ({
//         step_id: step.step_id,
//         completed: step.completed || false,
//         details: step.details || {},
//       }));
//     }

//     await applicant.save();
//     return applicant;
//   } catch (error) {
//     throw new Error(`Không thể tạo applicant: ${error.message}`);
//   }
// };

// /**
//  * Lấy tất cả applicants (có thể thêm query, pagination sau)
//  */
// export const getAllApplicants = async () => {
//   try {
//     return await Applicant.find()
//       .populate("steps.step_id") // populate thông tin Step nếu cần
//       .lean(); // nhẹ hơn nếu chỉ đọc
//   } catch (error) {
//     throw new Error(`Lỗi khi lấy danh sách applicants: ${error.message}`);
//   }
// };

// /**
//  * Lấy một applicant theo ID
//  */
// export const getApplicantById = async (id) => {
//   if (!mongoose.Types.ObjectId.isValid(id)) {
//     throw new Error("ID applicant không hợp lệ");
//   }

//   const applicant = await Applicant.findById(id).populate("steps.step_id").lean();

//   if (!applicant) {
//     throw new Error("Không tìm thấy applicant");
//   }

//   return applicant;
// };

// /**
//  * Cập nhật thông tin cơ bản của applicant (name, dob, gender, ...)
//  */
// export const updateApplicant = async (id, updateData) => {
//   if (!mongoose.Types.ObjectId.isValid(id)) {
//     throw new Error("ID không hợp lệ");
//   }

//   const allowedFields = ["name", "dob", "gender"];
//   const filteredData = {};

//   for (const key of allowedFields) {
//     if (updateData[key] !== undefined) {
//       filteredData[key] = updateData[key];
//     }
//   }

//   if (filteredData.dob) {
//     filteredData.dob = new Date(filteredData.dob);
//   }

//   const updated = await Applicant.findByIdAndUpdate(id, { $set: filteredData }, { new: true, runValidators: true });

//   if (!updated) {
//     throw new Error("Không tìm thấy applicant để cập nhật");
//   }

//   return updated;
// };

// /**
//  * Xóa applicant
//  */
// export const deleteApplicant = async (id) => {
//   if (!mongoose.Types.ObjectId.isValid(id)) {
//     throw new Error("ID không hợp lệ");
//   }

//   const result = await Applicant.findByIdAndDelete(id);
//   if (!result) {
//     throw new Error("Không tìm thấy applicant để xóa");
//   }

//   // Nếu có file → nên xóa file trên cloudinary/s3 ở đây (tuỳ chọn)
//   return result;
// };

// /**
//  * Cập nhật thông tin một step cụ thể của applicant
//  * @param {string} applicantId
//  * @param {string} stepId
//  * @param {Object} stepData
//  */
// export const updateStepForApplicant = async (applicantId, stepId, stepData) => {
//   if (!mongoose.Types.ObjectId.isValid(applicantId) || !mongoose.Types.ObjectId.isValid(stepId)) {
//     throw new Error("ID không hợp lệ");
//   }

//   const applicant = await Applicant.findById(applicantId);
//   if (!applicant) throw new Error("Không tìm thấy applicant");

//   const stepIndex = applicant.steps.findIndex((s) => s.step_id.toString() === stepId);

//   if (stepIndex === -1) {
//     // Nếu chưa có step này → thêm mới
//     applicant.steps.push({
//       step_id: stepId,
//       completed: stepData.completed ?? false,
//       details: stepData.details || {},
//       // file_url, file_name sẽ được xử lý ở hàm upload riêng hoặc updateWithFile
//     });
//   } else {
//     // Cập nhật step hiện có
//     const step = applicant.steps[stepIndex];

//     if (stepData.completed !== undefined) step.completed = stepData.completed;
//     if (stepData.details) step.details = { ...step.details, ...stepData.details };

//     // Các trường khác như note, score, comment... nằm trong details
//     if (stepData.note) step.details.note = stepData.note;
//     if (stepData.score) step.details.score = stepData.score;
//     if (stepData.comment) step.details.comment = stepData.comment;
//     // ... thêm các trường khác bạn muốn
//   }

//   await applicant.save();
//   return applicant;
// };

// /**
//  * Upload file cho một step (thường dùng riêng hoặc kết hợp)
//  * @param {string} applicantId
//  * @param {string} stepId
//  * @param {Express.Multer.File} file
//  */
// export const uploadFileForStep = async (applicantId, stepId, file) => {
//   if (!file) throw new Error("Không có file được upload");

//   // Ví dụ upload lên Cloudinary (bạn cần implement hàm này)
//   // const uploadResult = await uploadToCloudinary(file);
//   // const fileUrl = uploadResult.secure_url;
//   // const publicId = uploadResult.public_id;

//   // Giả lập cho ví dụ:
//   const fileUrl = `https://res.cloudinary.com/demo/${file.filename}`; // thay bằng logic thật
//   const fileName = file.originalname;

//   const applicant = await Applicant.findById(applicantId);
//   if (!applicant) throw new Error("Không tìm thấy applicant");

//   const step = applicant.steps.find((s) => s.step_id.toString() === stepId);
//   if (!step) {
//     applicant.steps.push({
//       step_id: stepId,
//       file_url: fileUrl,
//       file_name: fileName,
//       uploaded_at: new Date(),
//     });
//   } else {
//     step.file_url = fileUrl;
//     step.file_name = fileName;
//     step.uploaded_at = new Date();
//   }

//   await applicant.save();
//   return applicant;
// };

// /**
//  * Cập nhật step + file cùng lúc (dùng cho updateStepWithFileCtrl)
//  */
// export const updateStepWithFile = async (applicantId, stepId, updateData, file) => {
//   let fileUrl = null;
//   let fileName = null;

//   if (file) {
//     // Thực hiện upload file lên cloud/storage
//     // const uploadResult = await uploadToCloudinary(file);
//     // fileUrl = uploadResult.secure_url;
//     // fileName = file.originalname;

//     // Giả lập:
//     fileUrl = `/uploads/${file.filename}`;
//     fileName = file.originalname;
//   }

//   const applicant = await Applicant.findById(applicantId);
//   if (!applicant) throw new Error("Không tìm thấy applicant");

//   const stepIndex = applicant.steps.findIndex((s) => s.step_id.toString() === stepId);

//   const stepPayload = {
//     completed: updateData.completed ?? false,
//     details: {
//       ...(applicant.steps[stepIndex]?.details || {}),
//       ...updateData, // note, score, comment, ...
//     },
//   };

//   if (fileUrl) {
//     stepPayload.file_url = fileUrl;
//     stepPayload.file_name = fileName;
//     stepPayload.uploaded_at = new Date();
//   }

//   if (stepIndex === -1) {
//     applicant.steps.push({
//       step_id: stepId,
//       ...stepPayload,
//     });
//   } else {
//     applicant.steps[stepIndex] = {
//       ...applicant.steps[stepIndex],
//       ...stepPayload,
//     };
//   }

//   await applicant.save();
//   return applicant;
// };

import { Applicant } from "../models/camtinhdang/applicant.model.js";
import { Step } from "../models/camtinhdang/step.model.js";

export const createApplicant = async (data) => {
  const steps = await Step.find().sort({ step_order: 1 });

  const stepData = steps.map((s) => ({
    step_id: s._id,
    completed: false,
    details: {},
  }));

  return Applicant.create({ ...data, steps: stepData });
};

export const getAllApplicants = () => Applicant.find().populate("steps.step_id", "name step_order template_file");

export const getApplicantById = (id) =>
  Applicant.findById(id).populate("steps.step_id", "name step_order template_file");

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
