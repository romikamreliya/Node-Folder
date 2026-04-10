const multer = require("multer");
const path = require("path");
const fs = require("fs");

class UploadUtil {
  constructor(uploadDir = "public/upload") {
    this.uploadDir = path.join(process.cwd(), uploadDir);
    this.allowedMimeTypes = [
      "image/jpeg",
      "image/png",
      "image/jpg",
      "image/webp",
    ];
    this.fileSize = 5; // 5MB
    this.maxFileSize = this.fileSize * 1024 * 1024;
    this.allowedExtensions = [".jpg", ".jpeg", ".png", ".webp"];
  }

  // ===>  Multer configuration
  _initializeUploadDir() {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  _fileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();

    // Check MIME type
    if (!this.allowedMimeTypes.includes(file.mimetype)) {
      return cb(
        new Error(
          `Invalid file type. Allowed types: ${this.allowedMimeTypes.join(", ")}`,
        ),
      );
    }

    if (!this.allowedExtensions.includes(ext)) {
      return cb(
        new Error(
          `Invalid file extension. Allowed extensions: ${this.allowedExtensions.join(", ")}`,
        ),
      );
    }

    cb(null, true);
  };

  _handleMulterError(err, next) {
    if (err?.code === "LIMIT_FILE_SIZE") {
      return next(new Error(`File size exceeds the ${this.fileSize}MB limit.`));
    }
    return next(err);
  }

  _wrapUpload(uploadFn) {
    return (req, res, next) => {
      uploadFn(req, res, (err) => this._handleMulterError(err, next));
    };
  }

  storage = multer.diskStorage({
    destination: (req, file, cb) => {
      try {
        this._initializeUploadDir();
        cb(null, this.uploadDir);
      } catch (err) {
        cb(new Error(`Failed to create upload directory: ${err.message}`));
      }
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const ext = path.extname(file.originalname).toLowerCase();
      const name = path.basename(file.originalname, ext).replace(/\s+/g, "-");
      cb(null, `${name}-${uniqueSuffix}${ext}`);
    },
  });

  // ===> Get multer upload middleware configured with storage, file filter, and size limits
  getUploadMiddleware() {
    const upload = multer({
      storage: this.storage,
      fileFilter: this._fileFilter,
      limits: { fileSize: this.maxFileSize },
    });

    return {
      single: (fieldName) => this._wrapUpload(upload.single(fieldName)),
      array: (fieldName, maxCount) => this._wrapUpload(upload.array(fieldName, maxCount)),
      fields: (fields) => this._wrapUpload(upload.fields(fields)),
      any: () => this._wrapUpload(upload.any()),
    };
  }

  // ===>  Utility methods

  // delete uploaded file
  deleteFile(filename) {
    try {
      const filepath = path.join(this.uploadDir, filename);
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  }

  // get file info
  getFileInfo(filename) {
    try {
      const filepath = path.join(this.uploadDir, filename);
      if (fs.existsSync(filepath)) {
        const stats = fs.statSync(filepath);
        return {
          filename,
          size: stats.size,
          created: stats.birthtime,
          path: filepath,
        };
      }
      return null;
    } catch (err) {
      return null;
    }
  }
}
module.exports = UploadUtil;
