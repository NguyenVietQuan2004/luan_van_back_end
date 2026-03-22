import express from "express";
import {
  createLuongCoSo,
  getAllLuongCoSo,
  getLuongCoSoById,
  getCurrentLuongCoSo,
  updateLuongCoSo,
  deleteLuongCoSo,
} from "../controllers/luongcoso.controller.js";

const router = express.Router();

router.post("/", createLuongCoSo);
router.get("/", getAllLuongCoSo);
router.get("/current", getCurrentLuongCoSo); // endpoint tiện ích: lấy mức hiện hành
router.get("/:id", getLuongCoSoById);
router.put("/:id", updateLuongCoSo);
router.delete("/:id", deleteLuongCoSo);

export default router;
