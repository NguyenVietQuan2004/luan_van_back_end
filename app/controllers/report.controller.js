import * as reportService from "../services/report.service.js";
import { parseJsonField } from "../utils/utils.js";
import { ReportType } from "../models/report/report-type.model.js";
import { ReportCode } from "../models/report/report-code.model.js";
import { Report } from "../models/report/report.model.js";

// ===================== ReportType =====================
export const createReportTypeCtrl = async (req, res) => {
  try {
    const data = await reportService.createReportType(req.body);
    res.status(201).json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getAllReportTypesCtrl = async (req, res) => {
  const data = await reportService.getAllReportTypes();
  res.json(data);
};

// ===================== ReportCode - Hỗ trợ upload template_file =====================
export const createReportCodeCtrl = async (req, res) => {
  try {
    let codeData = {};

    if (req.file) {
      // Có upload file template
      const parsedData = parseJsonField(req.body.data);
      codeData = {
        ...parsedData,
        template_file: `/uploads/${req.file.filename}`, // hoặc bạn có thể đổi thành template_url nếu muốn
      };
    } else {
      // Không có file
      const parsedData = parseJsonField(req.body.data || req.body);
      codeData = { ...parsedData };
    }

    const data = await reportService.createReportCode(codeData);
    res.status(201).json(data);
  } catch (error) {
    console.error("Create ReportCode Error:", error);
    res.status(400).json({ message: error.message || "Lỗi tạo mã báo cáo" });
  }
};

export const getAllReportCodesCtrl = async (req, res) => {
  const data = await reportService.getAllReportCodes();
  res.json(data);
};

export const getReportCodesByTypeCtrl = async (req, res) => {
  const data = await reportService.getReportCodesByType(req.params.typeId);
  res.json(data);
};

// ===================== Report - Hỗ trợ upload file =====================
export const createReportCtrl = async (req, res) => {
  try {
    let reportData = {};

    if (req.file) {
      const parsedData = parseJsonField(req.body.data);
      reportData = {
        ...parsedData,
        file_url: `/uploads/${req.file.filename}`,
        file_name: req.file.originalname,
      };
    } else {
      const parsedData = parseJsonField(req.body.data || req.body);
      reportData = { ...parsedData };
    }

    const data = await reportService.createReport(reportData);
    res.status(201).json(data);
  } catch (error) {
    console.error("Create Report Error:", error);
    res.status(400).json({ message: error.message || "Lỗi tạo báo cáo" });
  }
};

export const getAllReportsCtrl = async (req, res) => {
  const data = await reportService.getAllReports();
  res.json(data);
};

export const getReportByIdCtrl = async (req, res) => {
  const data = await reportService.getReportById(req.params.id);
  if (!data) return res.status(404).json({ message: "Không tìm thấy báo cáo" });
  res.json(data);
};

export const updateReportCtrl = async (req, res) => {
  try {
    let updateData = {};

    if (req.file) {
      const parsedData = parseJsonField(req.body.data);
      updateData = {
        ...parsedData,
        file_url: `/uploads/${req.file.filename}`,
        file_name: req.file.originalname,
      };
    } else {
      const parsedData = parseJsonField(req.body.data || req.body);
      updateData = { ...parsedData };
    }

    const data = await reportService.updateReport(req.params.id, updateData);
    res.json(data);
  } catch (error) {
    console.error("Update Report Error:", error);
    res.status(400).json({ message: error.message || "Lỗi cập nhật báo cáo" });
  }
};

export const deleteReportCtrl = async (req, res) => {
  await reportService.deleteReport(req.params.id);
  res.json({ message: "Đã xóa báo cáo thành công" });
};

// ===================== REPORT TYPE =====================
export const getReportTypeByIdCtrl = async (req, res) => {
  try {
    const data = await reportService.getReportTypeById(req.params.id);
    if (!data) return res.status(404).json({ message: "Không tìm thấy loại báo cáo" });
    res.json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateReportTypeCtrl = async (req, res) => {
  try {
    const data = await reportService.updateReportType(req.params.id, req.body);
    res.json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteReportTypeCtrl = async (req, res) => {
  try {
    await reportService.deleteReportType(req.params.id);
    res.json({ message: "Đã xóa loại báo cáo thành công" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ===================== REPORT CODE =====================
export const getReportCodeByIdCtrl = async (req, res) => {
  try {
    const data = await reportService.getReportCodeById(req.params.id);
    if (!data) return res.status(404).json({ message: "Không tìm thấy mã báo cáo" });
    res.json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateReportCodeCtrl = async (req, res) => {
  try {
    let updateData = {};

    if (req.file) {
      const parsedData = parseJsonField(req.body.data || req.body);
      updateData = {
        ...parsedData,
        template_file: `/uploads/${req.file.filename}`,
      };
    } else {
      const parsedData = parseJsonField(req.body.data || req.body);
      updateData = { ...parsedData };
    }

    const data = await reportService.updateReportCode(req.params.id, updateData);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message || "Lỗi cập nhật mã báo cáo" });
  }
};

export const deleteReportCodeCtrl = async (req, res) => {
  try {
    await reportService.deleteReportCode(req.params.id);
    res.json({ message: "Đã xóa mã báo cáo thành công" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getNextSo = async (req, res) => {
  try {
    const { code_id } = req.query;

    if (!code_id) {
      return res.status(400).json({
        success: false,
        message: "Thiếu tham số code_id",
      });
    }

    // Tìm số lớn nhất hiện có của code_id này
    const lastReport = await Report.findOne({ code_id }).sort({ so: -1 }).select("so").lean();
    const nextSo = lastReport ? lastReport.so + 1 : 1;
    console.log(nextSo, "adjsia");

    return res.status(200).json({
      success: true,
      nextSo,
      message: "Lấy số tiếp theo thành công",
    });
  } catch (error) {
    console.error("Error in getNextSo:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy số tiếp theo",
      error: error.message,
    });
  }
};
