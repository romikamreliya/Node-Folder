const multer = require("multer");
const path = require("path");
const fs = require("fs");

class ImageMulter {
  constructor() {
    this.imgUpload = ["image/jpeg", "image/png", "image/jpg", "image/svg"];
  }

  storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = path.join(process.env.path, "logo");

      // check if folder exists, if not create it
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }

      cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
      cb(
        null,
        file.fieldname + "-" + Date.now() + path.extname(file.originalname)
      );
    },
  });

  upload = multer({
    storage: this.storage,

    fileFilter: (req, file, cb) => {
      if (!this.imgUpload.includes(file.mimetype)) return cb(null, false);
      else return cb(null, true);
    },
    limits: { fileSize: 1024 * 1024 * 5 }, // 5MB
  });
}
module.exports = new ImageMulter();
