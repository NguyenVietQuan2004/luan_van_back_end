import * as contestService from "../services/contest.service.js";
import { parseJsonField } from "../utils/utils.js";

export const createContestCtrl = async (req, res) => {
  try {
    const filePath = req.file ? `/uploads/${req.file.filename}` : null;
    const jsonData = parseJsonField(req.body.data); // ← thay đổi chính ở đây
    const contestData = {
      ...jsonData, // title, description, startDate, prize, v.v.
      rules_file: filePath,
    };
    const created = await contestService.createContest(contestData);
    res.status(201).json(created);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message || "Lỗi khi tạo contest" });
  }
};

export const updateContestCtrl = async (req, res) => {
  try {
    const jsonData = parseJsonField(req.body.data);
    let updateData = { ...jsonData };
    if (req.file) {
      updateData.rules_file = `/uploads/${req.file.filename}`;
    }
    console.log("Update data:", updateData);
    const updated = await contestService.updateContest(req.params.id, updateData);
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message || "Lỗi khi cập nhật contest" });
  }
};

export const getAllContestsCtrl = async (req, res) => {
  try {
    const data = await contestService.getAllContests();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getContestByIdCtrl = async (req, res) => {
  try {
    const data = await contestService.getContestById(req.params.id);
    res.json(data);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const deleteContestCtrl = async (req, res) => {
  try {
    const data = await contestService.deleteContest(req.params.id);
    res.json(data);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
