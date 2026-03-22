import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import connectDB from "./app/config/db.js";
import path from "path";
import routes from "./app/routes/index.js";
const app = express();
const port = 5000;
connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use("/uploads", express.static("uploads"));

app.use("/uploads", express.static(path.resolve("uploads")));
app.use("/api", routes);

app.listen(port, () => {
  console.log(`Server chạy ở http://localhost:${port}`);
});
