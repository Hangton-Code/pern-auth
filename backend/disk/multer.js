"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const errorHandler_1 = require("./helpers/errorHandler");
const storage = multer_1.default.diskStorage({
    // disk storage
    destination: function (req, file, callback) {
        callback(null, "uploads/");
    },
});
const upload = (allowedExt, maxSize) => (0, multer_1.default)({
    storage: storage,
    fileFilter: function (req, file, callback) {
        // filter file type
        const ext = path_1.default.extname(file.originalname);
        if (!allowedExt.includes(ext)) {
            return callback(new errorHandler_1.APIError("File Type Is Not Supported", {
                statusCode: 400,
                body: {
                    allowedExt,
                },
            }));
        }
        // filter file size
        const fileSize = parseInt(req.headers["content-length"]);
        if (fileSize > maxSize) {
            return callback(new errorHandler_1.APIError("File Size Is Too Large (>3MB)", {
                statusCode: 400,
            }));
        }
        // those filtered
        callback(null, true);
    },
});
exports.default = upload;
