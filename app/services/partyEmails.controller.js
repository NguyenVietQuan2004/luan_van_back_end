import PartyEmails from "../models/partyEmails.model.js";

// Lấy danh sách email (dùng khi gửi thông báo)
export const getPartyEmails = async () => {
  const doc = await PartyEmails.findOne().lean();
  if (!doc || !doc.emails) return [];

  return doc.emails
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean);
};

// Admin: Lấy chuỗi hiện tại để hiển thị form
export const getEmailsString = async (req, res) => {
  try {
    const doc = await PartyEmails.findOne();
    res.json({ emails: doc ? doc.emails : "" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Admin: Cập nhật (tạo mới nếu chưa có)
export const updateEmails = async (req, res) => {
  try {
    const { emails } = req.body; // chuỗi: "a@gmail.com,b@gmail.com"

    // Validate cơ bản (tùy chọn)
    if (typeof emails !== "string") {
      return res.status(400).json({ error: "Dữ liệu không hợp lệ" });
    }

    const cleaned = emails
      .split(",")
      .map((e) => e.trim())
      .filter((e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) // lọc email hợp lệ
      .join(",");

    let doc = await PartyEmails.findOne();
    if (doc) {
      doc.emails = cleaned;
      doc.updatedAt = new Date();
      await doc.save();
    } else {
      doc = await PartyEmails.create({ emails: cleaned });
    }

    res.json({ success: true, emails: doc.emails });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
