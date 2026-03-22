// routes/document.routes.js
import express from "express";
import upload from "../middlewares/upload.js";
const router = express.Router();
import {
  createDocument,
  getAllDocuments,
  getDocumentById,
  updateDocument,
  deleteDocument,
} from "../controllers/document.controller.js";

// CREATE
router.post("/", upload.single("file"), createDocument);

// READ all
router.get("/", getAllDocuments);

// READ one
router.get("/:id", getDocumentById);

// UPDATE (có thể upload file mới)
router.put("/:id", upload.single("file"), updateDocument);

// DELETE
router.delete("/:id", deleteDocument);

export default router;
