import express from "express";
import {
  createRegistrationCtrl,
  getAllRegistrationsCtrl,
  getRegistrationByIdCtrl,
  updateRegistrationCtrl,
  deleteRegistrationCtrl,
} from "../controllers/contest.registration.controller.js";

import upload from "../middlewares/upload.js";

const router = express.Router();

// CREATE + upload
router.post("/", upload.single("file"), createRegistrationCtrl);

// READ
router.get("/", getAllRegistrationsCtrl);
router.get("/:id", getRegistrationByIdCtrl);

// UPDATE + upload
router.put("/:id", upload.single("file"), updateRegistrationCtrl);

// DELETE
router.delete("/:id", deleteRegistrationCtrl);

export default router;
