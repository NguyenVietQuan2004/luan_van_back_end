import * as applicantService from "../services/applicant.service.js";
import { parseJsonField } from "../utils/utils.js";

export const createApplicantCtrl = async (req, res) => {
  const parsedData = parseJsonField(req.body.data);
  const data = await applicantService.createApplicant(parsedData);
  res.status(201).json(data);
};

export const getAllApplicantsCtrl = async (req, res) => {
  const data = await applicantService.getAllApplicants();
  res.json(data);
};

export const getApplicantByIdCtrl = async (req, res) => {
  const data = await applicantService.getApplicantById(req.params.id);
  res.json(data);
};

export const updateApplicantCtrl = async (req, res) => {
  const parsedData = parseJsonField(req.body.data);
  const data = await applicantService.updateApplicant(req.params.id, parsedData);
  res.json(data);
};

export const deleteApplicantCtrl = async (req, res) => {
  await applicantService.deleteApplicant(req.params.id);
  res.json({ message: "Deleted" });
};

export const updateStepCtrl = async (req, res) => {
  const { applicantId, stepId } = req.params;
  const data = await applicantService.updateStepForApplicant(applicantId, stepId, req.body);
  res.json(data);
};

export const uploadFileCtrl = async (req, res) => {
  const { applicantId, stepId } = req.params;
  const data = await applicantService.uploadFileForStep(applicantId, stepId, req.file);
  res.json(data);
};

export const updateStepWithFileCtrl = async (req, res) => {
  const { applicantId, stepId } = req.params;

  try {
    const metadata = parseJsonField(req.body.data);
    const updateData = {
      ...metadata, // note, status, score, comment, ...
    };

    if (req.file) {
      updateData.file = req.file;
    }

    const data = await applicantService.updateStepWithFile(
      applicantId,
      stepId,
      updateData, // object đã parse
      req.file, // file riêng nếu cần
    );

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message || "Lỗi cập nhật step với file" });
  }
};
