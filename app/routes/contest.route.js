import express from "express";
import {
  createContestCtrl,
  getAllContestsCtrl,
  getContestByIdCtrl,
  updateContestCtrl,
  deleteContestCtrl,
} from "../controllers/contest.controller.js";

import upload from "../middlewares/upload.js";

const router = express.Router();

// CREATE (có upload)
router.post("/", upload.single("file"), createContestCtrl);

// READ
router.get("/", getAllContestsCtrl);
router.get("/:id", getContestByIdCtrl);

// UPDATE (có upload)
router.put("/:id", upload.single("file"), updateContestCtrl);

// DELETE
router.delete("/:id", deleteContestCtrl);

export default router;
