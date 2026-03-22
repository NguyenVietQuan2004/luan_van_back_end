import * as heSoLuongService from "../services/hesoluong.service.js";

export const createHeSoLuong = async (req, res) => {
  try {
    const data = await heSoLuongService.create(req.body);
    res.status(201).json(data);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getAllHeSoLuong = async (req, res) => {
  try {
    const data = await heSoLuongService.getAll();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getHeSoLuongById = async (req, res) => {
  try {
    const data = await heSoLuongService.getById(req.params.id);
    if (!data) return res.status(404).json({ message: "Không tìm thấy hệ số lương" });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateHeSoLuong = async (req, res) => {
  try {
    const data = await heSoLuongService.update(req.params.id, req.body);
    res.json(data);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteHeSoLuong = async (req, res) => {
  try {
    const result = await heSoLuongService.remove(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
