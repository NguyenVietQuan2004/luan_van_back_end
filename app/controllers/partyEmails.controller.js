import PartyEmails from "../models/document/partyEmails.model.js";

export const getPartyEmails = async () => {
  const doc = await PartyEmails.findOne().lean();
  if (!doc || !doc.emails) return [];

  return doc.emails
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean);
};

export const getEmailsString = async (req, res) => {
  try {
    const doc = await PartyEmails.findOne();
    res.json({ emails: doc ? doc.emails : "" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateEmails = async (req, res) => {
  try {
    const { emails } = req.body; // chuỗi: "a@gmail.com,b@gmail.com"

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
