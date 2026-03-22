// src/controllers/dangphi.controller.js
import * as dangPhiService from "../services/dangphi.service.js";

export const createDangPhi = async (req, res) => {
  try {
    const data = await dangPhiService.create(req.body);
    res.status(201).json(data);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getAllDangPhi = async (req, res) => {
  try {
    const data = await dangPhiService.getAll(req.query);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getDangPhiById = async (req, res) => {
  try {
    const data = await dangPhiService.getById(req.params.id);
    if (!data) return res.status(404).json({ message: "Không tìm thấy" });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateDangPhi = async (req, res) => {
  try {
    const data = await dangPhiService.update(req.params.id, req.body);
    res.json(data);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteDangPhi = async (req, res) => {
  try {
    await dangPhiService.remove(req.params.id);
    res.json({ message: "Xóa thành công" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Bonus endpoint
export const getTongNopCapTren = async (req, res) => {
  try {
    const { thang, nam } = req.query;
    if (!thang || !nam) return res.status(400).json({ message: "Thiếu thang/nam" });
    const result = await dangPhiService.tinhTongNopCapTren(Number(thang), Number(nam));
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Controller
export const tinhDangPhiThangHienTai = async (req, res) => {
  try {
    const result = await dangPhiService.tinhDangPhiChoTatCaDangVienThangHienTai();
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Router
