const multer = require("multer");
const path = require("path");
const fs = require("fs");
const AppError = require("../errors/app-error");

class UploadUtil {

    static defaultPath = path.resolve(process.cwd(), "public/upload");

    static mediaTypes = {
        image: ["image/jpeg","image/png","image/jpg","image/webp","image/gif","image/bmp","image/tiff","image/svg+xml","image/heic","image/heif","image/avif"],
        video: ["video/mp4","video/mpeg","video/quicktime"],
        audio: ["audio/mpeg","audio/wav","audio/ogg"],
        document: ["application/pdf","application/msword","application/vnd.openxmlformats-officedocument.wordprocessingml.document","application/vnd.ms-excel","application/vnd.openxmlformats-officedocument.spreadsheetml.sheet","application/vnd.ms-powerpoint","application/vnd.openxmlformats-officedocument.presentationml.presentation"],
    }

    static _allowedExtensions = {
        // Images
        "image/jpeg": [".jpg", ".jpeg"],
        "image/jpg": [".jpg", ".jpeg"],
        "image/png": [".png"],
        "image/webp": [".webp"],
        "image/gif": [".gif"],
        "image/bmp": [".bmp"],
        "image/tiff": [".tif", ".tiff"],
        "image/svg+xml": [".svg"],
        "image/heic": [".heic"],
        "image/heif": [".heif"],
        "image/avif": [".avif"],

        // Videos
        "video/mp4": [".mp4"],
        "video/mpeg": [".mpeg", ".mpg"],
        "video/quicktime": [".mov"],

        // Audio
        "audio/mpeg": [".mp3"],
        "audio/wav": [".wav"],
        "audio/ogg": [".ogg"],

        // Documents
        "application/pdf": [".pdf"],
        "application/msword": [".doc"],
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
        "application/vnd.ms-excel": [".xls"],
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
        "application/vnd.ms-powerpoint": [".ppt"],
        "application/vnd.openxmlformats-officedocument.presentationml.presentation": [".pptx"],
    };
    
    static schema = {
        default : {
            path: this.defaultPath,
            allowedMimeTypes: this.mediaTypes.image,
            fileSize: 5, // 5MB
        },
        company : {
            path: path.resolve(this.defaultPath, "company"),
            allowedMimeTypes: this.mediaTypes.image,
            fileSize: 10, // 10MB
            validation: (req) => {
                try {
                    const { company_id } = req.headers;
                    
                    // Add custom validation logic here, e.g. check if companyId is valid
                    if (!company_id || typeof company_id !== "string") return {valid: false};

                    // Sanitize company_id to prevent directory traversal and ensure it's a valid folder name
                    const sanitized = company_id.replace(/[^a-zA-Z0-9_-]/g, "");
                    if (!sanitized) return { valid: false };

                    return {valid: true, path: path.resolve(this.defaultPath, `company/${sanitized}`)};
                } catch (error) {
                    return {valid: false};
                }
            }
        }
    }

    // ===>  Multer configuration
    static _initializeUploadDir(uploadDir) {

        if (!uploadDir) return;

        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
    }

    static _handleMulterError(err, next, schema) {
        if (err?.code === "LIMIT_FILE_SIZE") {
            return next(new AppError({
                code: "LIMIT_FILE_SIZE",
                message: `File size exceeds the ${schema.fileSize}MB limit.`,
                type: "BAD_REQUEST",
            }));
        }
        return next(err);
    }

    static _wrapUpload(uploadFn, schema) {
        return (req, res, next) => {
            uploadFn(req, res, (err) => {
                if (err) return this._handleMulterError(err, next, schema);

                const normalize = (f) => {
                    f.relativePath = this.getRelativePath(f.path);
                    return f;
                };

                if (req.file) req.file = normalize(req.file);

                if (req.files) {
                    if (Array.isArray(req.files)) {
                        req.files = req.files.map(normalize);
                    } else {
                        Object.keys(req.files).forEach(key => {
                            req.files[key] = req.files[key].map(normalize);
                        });
                    }
                }

                next();
            });
        };
    }

    static _getStorage(schema) {
        return multer.diskStorage({
            destination: (req, file, cb) => {
                try {
                    let uploadPath = schema.path;
                    if(typeof schema.validation === "function") {
                        const valid = schema.validation(req);
                        if(!valid || !valid.valid) {
                            return cb(new AppError({
                                code: "UPLOAD_VALIDATION_FAILED",
                                message: "File validation failed based on custom schema rules.",
                                type: "BAD_REQUEST",
                            }));
                        }
                        uploadPath = valid.path || schema.path; 
                    }

                    this._initializeUploadDir(uploadPath);
                    cb(null, uploadPath);
                } catch (err) {
                    cb(new AppError({
                        code: "UPLOAD_DIR_CREATION_FAILED",
                        message: `Failed to create upload directory: ${err.message}`,
                        type: "BAD_REQUEST",
                    }));
                }
            },
            filename: (req, file, cb) => {
                const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
                const ext = path.extname(file.originalname).toLowerCase();
                // Use path.basename to prevent directory traversal attacks
                const baseName = path.basename(file.originalname, ext);
                const name = baseName.replace(/[^a-zA-Z0-9_-]/g, '_');
                cb(null, `${name}-${uniqueSuffix}${ext}`);
            },
        });
    }

    static _fileFilter = (schema) => {
        return (req, file, cb) => {
            const ext = path.extname(file.originalname).toLowerCase();

            // Check MIME type
            if (!schema.allowedMimeTypes.includes(file.mimetype)) {
                return cb(
                    new AppError({
                        code: "INVALID_FILE_TYPE",
                        message: `Invalid file type. Allowed types: ${schema.allowedMimeTypes.join(", ")}`,
                        type: "BAD_REQUEST",
                    })
                );
            }

            // ✅ Check extension matches MIME type
            const expectedExts = this._allowedExtensions[file.mimetype];
            if (expectedExts && !expectedExts.includes(ext)) {
                return cb(new AppError({
                    code: "MIME_EXTENSION_MISMATCH",
                    message: `File extension "${ext}" does not match type "${file.mimetype}".`,
                    type: "BAD_REQUEST",
                }));
            }

            cb(null, true);
        }
    };


    // ===> Get multer upload middleware configured with storage, file filter, and size limits

    /**
     * Creates upload middleware using the specified schema configuration.
     * @param {keyof typeof this.schema} [schemaName] - Name of the upload schema to apply.
     */ 
    static getUploadMiddleware(schemaName = "default") {
        const schema = this.schema[schemaName] || this.schema.default;
        
        const upload = multer({
            storage: this._getStorage(schema),
            fileFilter: this._fileFilter(schema),
            limits: { fileSize: schema.fileSize * 1024 * 1024 },
        });

        return {
            single: (fieldName) => this._wrapUpload(upload.single(fieldName), schema),
            array: (fieldName, maxCount) => this._wrapUpload(upload.array(fieldName, maxCount), schema),
            fields: (fields) => this._wrapUpload(upload.fields(fields), schema),
            any: () => this._wrapUpload(upload.any(), schema),
        };
    }

    // ===>  Utility methods

    /**
     * Deletes a file from the filesystem.
     * @param {string} filepath - Absolute path to the file.
     * @returns {boolean} true if deleted, false if not found or failed.
     */
    static deleteFile(filepath) {
        try {
            if (fs.existsSync(filepath)) {
                fs.unlinkSync(filepath);
                return true;
            }
            return false;
        } catch (err) {
            console.error(`[UploadUtil] Failed to delete file: ${filepath}`, err.message);
            return false;
        }
    }

    // get file info
    static getFileInfo(filepath) {
        try {
            if (fs.existsSync(filepath)) {
                const stats = fs.statSync(filepath);
                return {
                    filename: path.basename(filepath),
                    size: stats.size,
                    created: stats.birthtime,
                    path: filepath,
                };
            }
            return null;
        } catch (err) {
            console.error(`[UploadUtil] Failed to get file info: ${filepath}`, err.message);
            return null;
        }
    }

    /**
     * Returns the relative path from the upload root.
     * @param {string} absolutePath - Absolute file path.
     * @returns {string} Relative path e.g. "/company/abc/file.jpg"
     */
    static getRelativePath(absolutePath) {
        const normalizedBase = this.defaultPath.replace(/\\/g, "/");
        const normalizedAbs = absolutePath.replace(/\\/g, "/");
        return normalizedAbs.replace(normalizedBase, "");
    }
  
}
module.exports = UploadUtil;
