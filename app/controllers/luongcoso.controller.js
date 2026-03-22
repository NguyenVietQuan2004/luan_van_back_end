import * as luongCoSoService from "../services/luongcoso.service.js";

export const createLuongCoSo = async (req, res) => {
  try {
    const data = await luongCoSoService.create(req.body);
    res.status(201).json(data);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getAllLuongCoSo = async (req, res) => {
  try {
    const data = await luongCoSoService.getAll();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getLuongCoSoById = async (req, res) => {
  try {
    const data = await luongCoSoService.getById(req.params.id);
    if (!data) return res.status(404).json({ message: "Không tìm thấy mức lương cơ sở" });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getCurrentLuongCoSo = async (req, res) => {
  try {
    const data = await luongCoSoService.getCurrent();
    if (!data) return res.status(404).json({ message: "Chưa có mức lương cơ sở nào đang hiệu lực" });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateLuongCoSo = async (req, res) => {
  try {
    const data = await luongCoSoService.update(req.params.id, req.body);
    res.json(data);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteLuongCoSo = async (req, res) => {
  try {
    const result = await luongCoSoService.remove(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
