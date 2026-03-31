import express from "express";
import {
  createSyllabus,
  getAllSyllabus,
  getSyllabusById,
  updateSyllabus,
  deleteSyllabus,
} from "../controllers/syll.controller.js";

import upload from "../middlewares/upload.js";

const syllabusRouter = express.Router();

syllabusRouter.post("/", upload.single("file"), createSyllabus);

syllabusRouter.get("/", getAllSyllabus);

syllabusRouter.get("/:id", getSyllabusById);

syllabusRouter.put("/:id", upload.single("file"), updateSyllabus);

syllabusRouter.delete("/:id", deleteSyllabus);

export default syllabusRouter;
