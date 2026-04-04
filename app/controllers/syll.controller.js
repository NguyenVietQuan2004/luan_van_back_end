// import * as syllabusService from "../services/syll.service.js";
// import { parseJsonField } from "../utils/utils.js";

// export const createSyllabus = async (req, res) => {
//   try {
//     const parsedData = parseJsonField(req.body.data || "{}");

//     if (!req.file) {
//       return res.status(400).json({ message: "Vui lòng upload file" });
//     }

//     const syllabusData = {
//       filename: req.file.filename,
//       originalName: req.file.originalname,
//       ...parsedData,
//     };

//     const newSyllabus = await syllabusService.createSyllabus(syllabusData);

//     return res.status(201).json({
//       message: "Tạo syllabus thành công",
//       data: newSyllabus,
//     });
//   } catch (error) {
//     console.error("Create syllabus error:", error);
//     return res.status(500).json({ message: error.message || "Lỗi server" });
//   }
// };

// export const getAllSyllabus = async (req, res) => {
//   try {
//     const data = await syllabusService.getAllSyllabus();
//     return res.json(data);
//   } catch (error) {
//     return res.status(500).json({ message: error.message });
//   }
// };

// export const getSyllabusById = async (req, res) => {
//   try {
//     const data = await syllabusService.getSyllabusById(req.params.id);
//     return res.json(data);
//   } catch (error) {
//     return res.status(404).json({ message: error.message });
//   }
// };

// export const updateSyllabus = async (req, res) => {
//   try {
//     const parsedData = parseJsonField(req.body.data || "{}");

//     const updateData = { ...parsedData };

//     if (req.file) {
//       updateData.filename = req.file.filename;
//       updateData.originalName = req.file.originalname;
//     }

//     const updated = await syllabusService.updateSyllabus(req.params.id, updateData);

//     return res.json({
//       message: "Cập nhật thành công",
//       data: updated,
//     });
//   } catch (error) {
//     console.error("Update syllabus error:", error);
//     return res.status(400).json({ message: error.message || "Lỗi cập nhật" });
//   }
// };

// export const deleteSyllabus = async (req, res) => {
//   try {
//     await syllabusService.deleteSyllabus(req.params.id);
//     return res.json({ message: "Deleted" });
//   } catch (error) {
//     return res.status(404).json({ message: error.message });
//   }
// };

import * as syllabusService from "../services/syll.service.js";
import { parseJsonField } from "../utils/utils.js";

export const createSyllabus = async (req, res) => {
  try {
    const parsedData = parseJsonField(req.body.data || "{}");

    if (!req.file) {
      return res.status(400).json({ message: "Vui lòng upload file" });
    }

    const syllabusData = {
      filename: req.file.filename,
      originalName: req.file.originalname,
      file_path: `/uploads/${req.file.filename}`, // ← THÊM DÒNG NÀY
      ...parsedData,
    };

    const newSyllabus = await syllabusService.createSyllabus(syllabusData);

    return res.status(201).json({
      message: "Tạo syllabus thành công",
      data: newSyllabus,
    });
  } catch (error) {
    console.error("Create syllabus error:", error);
    return res.status(500).json({ message: error.message || "Lỗi server" });
  }
};

export const getAllSyllabus = async (req, res) => {
  try {
    const data = await syllabusService.getAllSyllabus();
    return res.json(data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getSyllabusById = async (req, res) => {
  try {
    const data = await syllabusService.getSyllabusById(req.params.id);
    return res.json(data);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

export const updateSyllabus = async (req, res) => {
  try {
    const parsedData = parseJsonField(req.body.data || "{}");

    const updateData = { ...parsedData };

    if (req.file) {
      updateData.filename = req.file.filename;
      updateData.originalName = req.file.originalname;
      updateData.file_path = `/uploads/${req.file.filename}`; // ← THÊM DÒNG NÀY
    }

    const updated = await syllabusService.updateSyllabus(req.params.id, updateData);

    return res.json({
      message: "Cập nhật thành công",
      data: updated,
    });
  } catch (error) {
    console.error("Update syllabus error:", error);
    return res.status(400).json({ message: error.message || "Lỗi cập nhật" });
  }
};

export const deleteSyllabus = async (req, res) => {
  try {
    await syllabusService.deleteSyllabus(req.params.id);
    return res.json({ message: "Deleted" });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};
