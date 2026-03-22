import Document from "../models/document/document.model.js";
// services/document.service.js
export const createDocument = async (data) => {
  try {
    const document = new Document(data);
    return await document.save();
  } catch (error) {
    throw new Error(`Không thể tạo document: ${error.message}`);
  }
};

export const getAllDocuments = async (options = {}) => {
  const { sort = { uploaded_at: -1 }, limit = 20, skip = 0 } = options;

  try {
    return await Document.find().sort(sort).skip(skip).limit(limit).lean();
  } catch (error) {
    throw new Error(`Không thể lấy danh sách document: ${error.message}`);
  }
};

export const getDocumentById = async (id) => {
  try {
    const doc = await Document.findById(id).lean();
    if (!doc) {
      throw new Error("Không tìm thấy document");
    }
    return doc;
  } catch (error) {
    throw new Error(`Lỗi khi lấy document: ${error.message}`);
  }
};

export const updateDocument = async (id, updateData) => {
  try {
    const updated = await Document.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true },
    ).lean();

    if (!updated) {
      throw new Error("Không tìm thấy document để cập nhật");
    }
    return updated;
  } catch (error) {
    throw new Error(`Lỗi khi cập nhật document: ${error.message}`);
  }
};

export const deleteDocument = async (id) => {
  try {
    const deleted = await Document.findByIdAndDelete(id);
    if (!deleted) {
      throw new Error("Không tìm thấy document để xóa");
    }
    return { message: "Xóa document thành công", id };
  } catch (error) {
    throw new Error(`Lỗi khi xóa document: ${error.message}`);
  }
};
