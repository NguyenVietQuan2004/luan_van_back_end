import express from "express";
import {
  createDangVienPhi,
  getAllDangVienPhi,
  getDangVienPhiById,
  getDangVienPhiByDangVienId,
  updateDangVienPhi,
  deleteDangVienPhi,
} from "../controllers/dangvienphi.controller.js";

const router = express.Router();

router.post("/", createDangVienPhi);
router.get("/", getAllDangVienPhi);
router.get("/dangvien/:dang_vien_id", getDangVienPhiByDangVienId); // tiện ích: lấy theo ID đảng viên
router.get("/:id", getDangVienPhiById);
router.put("/:id", updateDangVienPhi);
router.delete("/:id", deleteDangVienPhi);

export default router;
