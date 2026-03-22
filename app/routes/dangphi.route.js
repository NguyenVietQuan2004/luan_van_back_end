import express from "express";
import {
  createDangPhi,
  getAllDangPhi,
  getDangPhiById,
  updateDangPhi,
  deleteDangPhi,
  tinhDangPhiThangHienTai,
} from "../controllers/dangphi.controller.js";

const router = express.Router();

router.post("/tinh-thang-hien-tai", tinhDangPhiThangHienTai);
router.post("/", createDangPhi);
router.get("/", getAllDangPhi);

// router.get("/tong", ); // ví dụ /api/dangphi/tong?thang=1&nam=2026
router.get("/:id", getDangPhiById);
router.put("/:id", updateDangPhi);
router.delete("/:id", deleteDangPhi);

export default router;
