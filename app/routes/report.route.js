// import express from "express";
// import upload from "../middlewares/upload.js";
// import {
//   createReportTypeCtrl,
//   getAllReportTypesCtrl,
//   createReportCodeCtrl,
//   getAllReportCodesCtrl,
//   getReportCodesByTypeCtrl,
//   createReportCtrl,
//   getAllReportsCtrl,
//   getReportByIdCtrl,
//   updateReportCtrl,
//   deleteReportCtrl,
// } from "../controllers/report.controller.js";

// const reportRouter = express.Router();

// // ReportType
// reportRouter.post("/types", createReportTypeCtrl);
// reportRouter.get("/types", getAllReportTypesCtrl);

// // ReportCode - Hỗ trợ upload template_file
// reportRouter.post("/codes", upload.single("file"), createReportCodeCtrl);
// reportRouter.get("/codes", getAllReportCodesCtrl);
// reportRouter.get("/codes/type/:typeId", getReportCodesByTypeCtrl);

// // Report - Hỗ trợ upload file chính
// reportRouter.post("/", upload.single("file"), createReportCtrl);
// reportRouter.put("/:id", upload.single("file"), updateReportCtrl);

// reportRouter.get("/", getAllReportsCtrl);
// reportRouter.get("/:id", getReportByIdCtrl);
// reportRouter.delete("/:id", deleteReportCtrl);

// export default reportRouter;

import express from "express";
import upload from "../middlewares/upload.js";
import {
  // ReportType
  createReportTypeCtrl,
  getAllReportTypesCtrl,
  getReportTypeByIdCtrl,
  updateReportTypeCtrl,
  deleteReportTypeCtrl,

  // ReportCode
  createReportCodeCtrl,
  getAllReportCodesCtrl,
  getReportCodesByTypeCtrl,
  getReportCodeByIdCtrl,
  updateReportCodeCtrl,
  deleteReportCodeCtrl,

  // Report
  createReportCtrl,
  getAllReportsCtrl,
  getReportByIdCtrl,
  updateReportCtrl,
  deleteReportCtrl,
  getNextSo,
} from "../controllers/report.controller.js";

const reportRouter = express.Router();

// ===================== REPORT TYPE =====================
reportRouter.post("/types", createReportTypeCtrl);
reportRouter.get("/types", getAllReportTypesCtrl);
reportRouter.get("/types/:id", getReportTypeByIdCtrl);
reportRouter.put("/types/:id", updateReportTypeCtrl);
reportRouter.delete("/types/:id", deleteReportTypeCtrl);
reportRouter.get("/next-so", getNextSo);

// ===================== REPORT CODE =====================
reportRouter.post("/codes", upload.single("file"), createReportCodeCtrl);
reportRouter.get("/codes", getAllReportCodesCtrl);
reportRouter.get("/codes/type/:typeId", getReportCodesByTypeCtrl);
reportRouter.get("/codes/:id", getReportCodeByIdCtrl);
reportRouter.put("/codes/:id", upload.single("file"), updateReportCodeCtrl); // hỗ trợ cập nhật template_file
reportRouter.delete("/codes/:id", deleteReportCodeCtrl);

// ===================== REPORT =====================
reportRouter.post("/", upload.single("file"), createReportCtrl);
reportRouter.get("/", getAllReportsCtrl);
reportRouter.get("/:id", getReportByIdCtrl);
reportRouter.put("/:id", upload.single("file"), updateReportCtrl);
reportRouter.delete("/:id", deleteReportCtrl);

export default reportRouter;
