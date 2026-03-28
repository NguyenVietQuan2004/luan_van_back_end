import { ReportType } from "../models/report/report-type.model.js";
import { ReportCode } from "../models/report/report-code.model.js";
import { Report } from "../models/report/report.model.js";

export const createReportType = async (data) => {
  return ReportType.create(data);
};

export const getAllReportTypes = async () => {
  return ReportType.find().sort({ createdAt: -1 });
};

export const getReportTypeById = async (id) => {
  return ReportType.findById(id);
};

// ===================== ReportCode =====================
export const createReportCode = async (data) => {
  return ReportCode.create(data);
};

export const getAllReportCodes = async () => {
  return ReportCode.find().populate("type_id", "name").sort({ code: 1 });
};

export const getReportCodesByType = async (typeId) => {
  return ReportCode.find({ type_id: typeId }).populate("type_id", "name").sort({ code: 1 });
};

// ===================== Report =====================
import mongoose from "mongoose";

export const createReport = async (data) => {
  const { code_id, ...rest } = data;

  if (!code_id) throw new Error("code_id là bắt buộc");

  // Lấy số lớn nhất hiện tại
  const maxSo = await Report.aggregate([
    { $match: { code_id: new mongoose.Types.ObjectId(code_id) } },
    { $group: { _id: null, maxSo: { $max: "$so" } } },
  ]);

  const so = maxSo.length > 0 ? maxSo[0].maxSo + 1 : 1;

  return Report.create({
    ...rest,
    code_id,
    so,
  });
};

export const getAllReports = async () => {
  return Report.find()
    .populate({
      path: "code_id",
      populate: { path: "type_id", select: "name" },
      select: "code name template_file",
    })
    .sort({ createdAt: -1 });
};

export const getReportById = async (id) => {
  return Report.findById(id).populate({
    path: "code_id",
    populate: { path: "type_id", select: "name" },
    select: "code name template_file",
  });
};

export const updateReport = async (id, data) => {
  return Report.findByIdAndUpdate(id, data, { new: true, runValidators: true });
};

export const deleteReport = async (id) => {
  console.log(id);
  return Report.findByIdAndDelete(id);
};

export const findReportByCodeAndSo = async (codeId, so) => {
  return Report.findOne({ code_id: codeId, so });
};

// ===================== ReportType =====================

export const updateReportType = async (id, data) => {
  return ReportType.findByIdAndUpdate(id, data, { new: true, runValidators: true });
};

export const deleteReportType = async (id) => {
  // Kiểm tra xem có ReportCode nào đang tham chiếu đến type này không
  const existingCode = await ReportCode.findOne({ type_id: id });
  if (existingCode) {
    throw new Error("Không thể xóa loại báo cáo này vì đang có mã báo cáo tham chiếu đến");
  }

  return ReportType.findByIdAndDelete(id);
};
// ===================== ReportCode =====================
export const getReportCodeById = async (id) => {
  return ReportCode.findById(id).populate("type_id", "name");
};

export const updateReportCode = async (id, data) => {
  return ReportCode.findByIdAndUpdate(id, data, { new: true, runValidators: true });
};

export const deleteReportCode = async (id) => {
  // Kiểm tra xem có Report nào đang tham chiếu đến code này không
  const existingReport = await Report.findOne({ code_id: id });
  if (existingReport) {
    throw new Error("Không thể xóa mã báo cáo này vì đang có báo cáo tham chiếu đến");
  }

  return ReportCode.findByIdAndDelete(id);
};
