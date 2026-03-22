import express from "express";
import {
  createStepCtrl,
  createManyStepsCtrl,
  getAllStepsCtrl,
  updateStepCtrl,
  deleteStepCtrl,
  getStepByIdCtrl,
} from "../controllers/step.controller.js";
import upload from "../middlewares/upload.js";

const stepRouter = express.Router();

stepRouter.post("/", upload.single("file"), createStepCtrl);
stepRouter.post("/many", createManyStepsCtrl);
stepRouter.get("/:id", getStepByIdCtrl);
stepRouter.get("/", getAllStepsCtrl);
stepRouter.put("/:id", upload.single("file"), updateStepCtrl);
stepRouter.delete("/:id", deleteStepCtrl);
export default stepRouter;
