import * as dangVienPhiService from "../services/dangvienphi.service.js";

export const createDangVienPhi = async (req, res) => {
  try {
    const data = await dangVienPhiService.create(req.body);
    res.status(201).json(data);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getAllDangVienPhi = async (req, res) => {
  try {
    const data = await dangVienPhiService.getAll(req.query);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getDangVienPhiById = async (req, res) => {
  try {
    const data = await dangVienPhiService.getById(req.params.id);
    res.json(data);
  } catch (err) {
    res.status(err.message.includes("Không tìm thấy") ? 404 : 500).json({ message: err.message });
  }
};

export const getDangVienPhiByDangVienId = async (req, res) => {
  try {
    const data = await dangVienPhiService.getByDangVienId(req.params.dang_vien_id);
    res.json(data);
  } catch (err) {
    res.status(err.message.includes("Không tìm thấy") ? 404 : 500).json({ message: err.message });
  }
};

export const updateDangVienPhi = async (req, res) => {
  try {
    const data = await dangVienPhiService.update(req.params.id, req.body);
    res.json(data);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteDangVienPhi = async (req, res) => {
  try {
    const result = await dangVienPhiService.remove(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
