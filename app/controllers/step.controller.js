import * as stepService from "../services/step.service.js";
import { parseJsonField } from "../utils/utils.js";

export const createStepCtrl = async (req, res) => {
  try {
    const parsedData = parseJsonField(req.body.data);

    const filePath = req.file ? `/uploads/${req.file.filename}` : null;

    const payload = {
      ...parsedData,
      template_file: filePath,
    };

    const data = await stepService.createStep(payload);
    res.status(201).json(data);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const createManyStepsCtrl = async (req, res) => {
  try {
    const data = await stepService.createManySteps(req.body);
    res.status(201).json(data);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const getAllStepsCtrl = async (req, res) => {
  const data = await stepService.getAllSteps();
  res.json(data);
};
export const getStepByIdCtrl = async (req, res) => {
  const data = await stepService.getStepById(req.params.id);
  res.json(data);
};

export const updateStepCtrl = async (req, res) => {
  try {
    const parsedData = parseJsonField(req.body.data);

    const filePath = req.file ? `/uploads/${req.file.filename}` : undefined; // ⚠️ undefined để không overwrite nếu không upload file

    const payload = {
      ...parsedData,
      ...(filePath && { template_file: filePath }),
    };

    const data = await stepService.updateStep(req.params.id, payload);
    res.json(data);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const deleteStepCtrl = async (req, res) => {
  await stepService.deleteStep(req.params.id);
  res.json({ message: "Deleted" });
};
