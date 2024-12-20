const multer = require("multer");
const path = require("path");

class ImageMulter {
  constructor() {
    this.imgupload = ["image/jpeg", "image/png", "image/jpg", "image/svg"];
  }

  storage = multer.diskStorage({
    destination: "./public/upload",
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
      if (!this.imgupload.includes(file.mimetype)) return cb(null, false);
      else return cb(null, true);
    },
    limits: { fileSize: 1024 * 1024 * 5 }, // 5MB
  });
}
module.exports = new ImageMulter();
