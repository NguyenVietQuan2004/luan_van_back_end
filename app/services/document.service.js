import Document from "../models/document/document.model.js";
import * as dangVienService from "../services/dangvien.service.js";
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

import nodemailer from "nodemailer";
import path from "path"; // Thêm import này
import fs from "fs"; // Để check file tồn tại (tùy chọn)

// Transporter (giữ nguyên như cũ)
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: { rejectUnauthorized: false },
});
// ====================== GỬI THÔNG BÁO ======================
export const sendNotificationEmails = async (document) => {
  const emails = await dangVienService.getAllPartyEmails();
  if (emails.length === 0) {
    throw new Error("Chưa có email đảng viên nào được cấu hình trong .env");
  }

  const deadlineText = document.deadline
    ? new Date(document.deadline).toLocaleDateString("vi-VN", { dateStyle: "long" })
    : "Không có deadline";

  // Xây dựng đường dẫn file tuyệt đối
  const uploadsBase = process.env.UPLOADS_DIR || path.join(__dirname, "..", "public", "uploads");
  const fileFullPath = path.join(uploadsBase, path.basename(document.file_path)); // Chỉ lấy tên file để tránh lỗi path

  if (!fs.existsSync(fileFullPath)) {
    console.warn(`File không tồn tại để attach: ${fileFullPath}`);
  }

  const mailOptions = {
    from: process.env.EMAIL_FROM || '"Thông báo Đảng" <no-reply@yourdomain.com>',
    to: emails.join(", "), // Gửi bulk cho tất cả
    subject: `Thông báo tài liệu: ${document.file_name}`,
    text: `
Tài liệu cần xử lý:

Tên file: ${document.file_name}
Tóm tắt: ${document.summary || "Không có tóm tắt"}
Deadline: ${deadlineText}

Vui lòng kiểm tra và xử lý trước hạn.
File đính kèm: ${document.file_name}
    `,
    html: `
      <h3>Tài liệu cần xử lý</h3>
      <p><strong>Tên file:</strong> ${document.file_name}</p>
      <p><strong>Tóm tắt:</strong> ${document.summary || "Không có tóm tắt"}</p>
      <p><strong>Hạn thực hiện:</strong> ${deadlineText}</p>
      <hr>
      <p>File gốc đã được đính kèm bên dưới.</p>
      <p>Vui lòng kiểm tra và xử lý trước deadline.</p>
    `,
    attachments: [
      {
        filename: document.file_name, // Tên file hiển thị cho người nhận
        path: fileFullPath, // Đường dẫn tuyệt đối trên server
        // contentType: 'application/pdf',     // Tùy chọn: Nodemailer tự detect từ extension
      },
    ],
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Đã gửi thông báo (có đính kèm file) đến ${emails.length} đảng viên | MessageId: ${info.messageId}`);
  } catch (err) {
    console.error("Gửi email thất bại:", err);
    throw new Error(`Lỗi gửi email: ${err.message}`);
  }
};
