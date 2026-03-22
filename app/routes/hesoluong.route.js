import express from "express";
import {
  createHeSoLuong,
  getAllHeSoLuong,
  getHeSoLuongById,
  updateHeSoLuong,
  deleteHeSoLuong,
} from "../controllers/hesoluong.controller.js";

const router = express.Router();

router.post("/", createHeSoLuong);
router.get("/", getAllHeSoLuong);
router.get("/:id", getHeSoLuongById);
router.put("/:id", updateHeSoLuong);
router.delete("/:id", deleteHeSoLuong);

export default router;
