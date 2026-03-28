// import dotenv from "dotenv";
// dotenv.config();
// import express from "express";
// import cors from "cors";
// import connectDB from "./app/config/db.js";
// import path from "path";
// import routes from "./app/routes/index.js";
// const app = express();
// const port = 5000;
// connectDB();

// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// // app.use("/uploads", express.static("uploads"));

// app.use("/uploads", express.static(path.resolve("uploads")));
// app.use("/api", routes);
// app.get("/wake-up", (req, res) => {
//   console.log("Ứng dụng đã được đánh thức!");
//   res.send("Ứng dụng đã được đánh thức!");
// });
// app.listen(port, () => {
//   console.log(`Server chạy ở http://localhost:${port}`);
// });

import express from "express";
import cors from "cors";
import connectDB from "./app/config/db.js";
import path from "path";
import routes from "./app/routes/index.js";
import cron from "node-cron"; // Import node-cron
import dotenv from "dotenv";

dotenv.config(); // Đọc giá trị từ .env file

const app = express();
const port = process.env.PORT || 5000;
connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.resolve("uploads")));
app.use("/api", routes);

// Tạo API wake-up
app.get("/wake-up", (req, res) => {
  console.log("Ứng dụng đã được đánh thức!");
  res.send("Ứng dụng đã được đánh thức!");
});

// Cấu hình cron job để gọi API /wake-up mỗi 5 phút
cron.schedule("*/5 * * * *", () => {
  console.log("Đang chạy cron job...");
  const apiUrl = process.env.API_URL || `http://localhost:${port}`;

  // Gọi API wake-up bằng URL động
  fetch(`${apiUrl}/wake-up`)
    .then((response) => response.text())
    .then((data) => console.log(data))
    .catch((error) => console.error("Error:", error));
});

// Lắng nghe trên cổng 5000
app.listen(port, () => {
  console.log(`Server chạy ở http://localhost:${port}`);
});
// import DangPhi from "./app/models/dangphi/dangphi.model.js";
// (async () => {
//   try {
//     const result = await DangPhi.deleteMany({
//       $or: [{ thang: { $ne: 3 } }, { nam: { $ne: 2026 } }],
//     });

//     console.log(`Đã xóa ${result.deletedCount} bản ghi DangPhi (không phải 3/2026)`);
//   } catch (error) {
//     console.error("Lỗi khi cleanup DangPhi:", error);
//   }
// })();
import { startReminderScheduler } from "./app/services/reminder.service.js";

// ... sau khi connect MongoDB
startReminderScheduler(); // hoặc startFrequentReminderScheduler()
