// import multer from "multer";

// // nơi lưu file (local)
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/"); // thư mục uploads
//   },
//   filename: (req, file, cb) => {
//     const originalName = Buffer.from(file.originalname, "latin1").toString("utf8");
//     const uniqueName = Date.now() + "-" + originalName;
//     cb(null, uniqueName);
//   },
// });

// const upload = multer({ storage });

// export default upload;

import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    // decode UTF8 ngay tại middleware
    const decodedName = Buffer.from(file.originalname, "latin1").toString("utf8").normalize("NFC");

    // overwrite originalname luôn
    file.originalname = decodedName;

    const uniqueName = Date.now() + "-" + decodedName;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

export default upload;
