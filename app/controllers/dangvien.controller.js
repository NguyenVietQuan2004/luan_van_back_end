import * as dangVienService from "../services/dangvien.service.js";

export const createDangVien = async (req, res) => {
  try {
    const data = await dangVienService.create(req.body);
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAllDangVien = async (req, res) => {
  try {
    const data = await dangVienService.getAll();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getDangVienById = async (req, res) => {
  try {
    const data = await dangVienService.getById(req.params.id);
    if (!data) return res.status(404).json({ message: "Not found" });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateDangVien = async (req, res) => {
  try {
    const data = await dangVienService.update(req.params.id, req.body);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteDangVien = async (req, res) => {
  try {
    await dangVienService.remove(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
