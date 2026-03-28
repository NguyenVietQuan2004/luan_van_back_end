import cron from "node-cron";
import Document from "../models/document/document.model.js";
import { sendNotificationEmails } from "./document.service.js"; // hoặc nơi bạn để hàm send mail
import * as dangVienService from "./dangvien.service.js";

// Hàm kiểm tra và gửi reminder
const checkAndSendReminders = async () => {
  try {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Tìm các document có deadline trong khoảng từ giờ này → ngày mai cùng giờ
    // (có thể điều chỉnh khoảng thời gian rộng hơn nếu muốn)
    const documents = await Document.find({
      deadline: {
        $gte: now, // deadline chưa đến
        $lte: tomorrow, // deadline trong vòng 24h tới
      },
      reminderSent: { $ne: true }, // chưa gửi reminder
    });

    console.log(`🔍 Tìm thấy ${documents.length} document cần nhắc nhở`);

    for (const doc of documents) {
      try {
        await sendNotificationEmails(doc); // hàm bạn đã có

        // Đánh dấu đã gửi reminder để tránh gửi lại
        await Document.findByIdAndUpdate(doc._id, {
          $set: { reminderSent: true },
        });

        console.log(`✅ Đã gửi reminder cho document: ${doc.file_name}`);
      } catch (err) {
        console.error(`❌ Lỗi gửi reminder cho ${doc.file_name}:`, err);
      }
    }
  } catch (error) {
    console.error("Lỗi kiểm tra reminder:", error);
  }
};

// Khởi tạo cron job: chạy **mỗi ngày 1 lần** (ví dụ: 8h sáng)
export const startReminderScheduler = () => {
  // Chạy lúc 08:00 hàng ngày (timezone Việt Nam)
  cron.schedule("0 8 * * *", checkAndSendReminders, {
    timezone: "Asia/Ho_Chi_Minh",
  });

  console.log("⏰ Reminder scheduler đã khởi động (kiểm tra reminder lúc 8h sáng hàng ngày)");
};

// Nếu muốn chạy kiểm tra thường xuyên hơn (ví dụ mỗi 30 phút) để chính xác hơn:
export const startFrequentReminderScheduler = () => {
  cron.schedule("*/30 * * * *", checkAndSendReminders, {
    // mỗi 30 phút
    timezone: "Asia/Ho_Chi_Minh",
  });
};
