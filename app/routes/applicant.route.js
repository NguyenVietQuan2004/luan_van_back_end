import express from "express";
import {
  createApplicantCtrl,
  getAllApplicantsCtrl,
  getApplicantByIdCtrl,
  updateApplicantCtrl,
  deleteApplicantCtrl,
  updateStepCtrl,
  uploadFileCtrl,
  updateStepWithFileCtrl,
} from "../controllers/applicant.controller.js";
import upload from "../middlewares/upload.js";
const applicantRouter = express.Router();

applicantRouter.post(
  "/",
  upload.single("file"), // 👈 QUAN TRỌNG
  createApplicantCtrl,
);
applicantRouter.get("/", getAllApplicantsCtrl);
applicantRouter.get("/:id", getApplicantByIdCtrl);
applicantRouter.put(
  "/:id",
  upload.single("file"), // 👈 QUAN TRỌNG
  updateApplicantCtrl,
);
applicantRouter.delete("/:id", deleteApplicantCtrl);

applicantRouter.put("/:applicantId/step/:stepId", updateStepCtrl);
// applicantRouter.post("/:applicantId/step/:stepId/upload", uploadFileCtrl);
applicantRouter.post(
  "/:applicantId/step/:stepId/upload",
  upload.single("file"), // 👈 QUAN TRỌNG
  uploadFileCtrl,
);

applicantRouter.post(
  "/:applicantId/step/:stepId/upload-merge",
  upload.single("file"), // 👈 QUAN TRỌNG
  updateStepWithFileCtrl,
);
export default applicantRouter;
