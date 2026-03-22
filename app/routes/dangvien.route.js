import express from "express";
import {
  createDangVien,
  getAllDangVien,
  getDangVienById,
  updateDangVien,
  deleteDangVien,
} from "../controllers/dangvien.controller.js";

const router = express.Router();

router.post("/", createDangVien);
router.get("/", getAllDangVien);
router.get("/:id", getDangVienById);
router.put("/:id", updateDangVien);
router.delete("/:id", deleteDangVien);

export default router;
