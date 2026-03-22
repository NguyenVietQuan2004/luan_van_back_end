// controllers/document.controller.js
import * as documentService from "../services/document.service.js";
import { parseJsonField } from "../utils/utils.js";

export const createDocument = async (req, res) => {
  try {
    // Parse metadata từ field "data" (JSON string)
    const parsedData = parseJsonField(req.body.data || "{}");

    // File bắt buộc khi create
    if (!req.file) {
      return res.status(400).json({ message: "Vui lòng upload file" });
    }

    const documentData = {
      file_name: req.file.originalname,
      file_path: `/uploads/${req.file.filename}`,
      ...parsedData, // markdown, summary, deadline sẽ được merge vào đây
    };

    const newDoc = await documentService.createDocument(documentData);

    return res.status(201).json({
      message: "Tạo document thành công",
      data: newDoc,
    });
  } catch (error) {
    console.error("Create document error:", error);
    return res.status(500).json({ message: error.message || "Lỗi server" });
  }
};

export const getAllDocuments = async (req, res) => {
  try {
    const docs = await documentService.getAllDocuments();
    return res.json(docs);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getDocumentById = async (req, res) => {
  try {
    const doc = await documentService.getDocumentById(req.params.id);
    return res.json(doc);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

export const updateDocument = async (req, res) => {
  try {
    // Parse metadata từ field "data" (nếu có)
    const parsedData = parseJsonField(req.body.data || "{}");

    const updateData = { ...parsedData };

    // Nếu có file mới thì cập nhật file
    if (req.file) {
      updateData.file_name = req.file.originalname;
      updateData.file_path = `/uploads/${req.file.filename}`;
    }

    const updated = await documentService.updateDocument(req.params.id, updateData);

    return res.json({
      message: "Cập nhật thành công",
      data: updated,
    });
  } catch (error) {
    console.error("Update document error:", error);
    return res.status(400).json({ message: error.message || "Lỗi khi cập nhật" });
  }
};

export const deleteDocument = async (req, res) => {
  try {
    await documentService.deleteDocument(req.params.id);
    return res.json({ message: "Deleted" });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};