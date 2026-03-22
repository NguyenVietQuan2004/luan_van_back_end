import express from "express";
import {
  createNopDangPhiCapTren,
  getAllNopDangPhiCapTren,
  getNopDangPhiCapTrenById,
  getNopDangPhiCapTrenByThangNam,
  updateNopDangPhiCapTren,
  deleteNopDangPhiCapTren,
  kiemTraDaNopDu,
} from "../controllers/nopdangphicaptren.controller.js";

const router = express.Router();

router.post("/", createNopDangPhiCapTren);
router.get("/", getAllNopDangPhiCapTren);
router.get("/kiem-tra", kiemTraDaNopDu); // ví dụ: /api/nopdangphicaptren/kiem-tra?thang=1&nam=2026
router.get("/:id", getNopDangPhiCapTrenById);
router.get("/:thang/:nam", getNopDangPhiCapTrenByThangNam);
router.put("/:id", updateNopDangPhiCapTren);
router.delete("/:id", deleteNopDangPhiCapTren);

export default router;
