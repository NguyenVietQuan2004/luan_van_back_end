import * as nopDangPhiCapTrenService from "../services/nopdangphicaptren.service.js";

export const createNopDangPhiCapTren = async (req, res) => {
  try {
    const data = await nopDangPhiCapTrenService.create(req.body);
    res.status(201).json(data);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getAllNopDangPhiCapTren = async (req, res) => {
  try {
    const data = await nopDangPhiCapTrenService.getAll();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getNopDangPhiCapTrenById = async (req, res) => {
  try {
    const data = await nopDangPhiCapTrenService.getById(req.params.id);
    res.json(data);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getNopDangPhiCapTrenByThangNam = async (req, res) => {
  try {
    const { nam } = req.params;
    // const { thang, nam } = req.params;
    const data = await nopDangPhiCapTrenService.getByThangNam(Number(nam));
    res.json(data);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const updateNopDangPhiCapTren = async (req, res) => {
  try {
    const data = await nopDangPhiCapTrenService.update(req.params.id, req.body);
    res.json(data);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteNopDangPhiCapTren = async (req, res) => {
  try {
    const result = await nopDangPhiCapTrenService.remove(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const kiemTraDaNopDu = async (req, res) => {
  try {
    const { thang, nam } = req.query;
    if (!thang || !nam) return res.status(400).json({ message: "Thiếu thang/nam" });
    const daNopDu = await nopDangPhiCapTrenService.kiemTraDaNopDu(Number(thang), Number(nam));
    res.json({ daNopDu });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
