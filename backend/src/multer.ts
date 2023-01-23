import multer from "multer";
import path from "path";
import { APIError } from "./helpers/errorHandler";

const storage = multer.diskStorage({
  // disk storage
  destination: function (req, file, callback) {
    callback(null, "uploads/");
  },
});

const upload = (allowedExt: string[], maxSize: number) =>
  multer({
    storage: storage,
    fileFilter: function (req, file, callback) {
      // filter file type
      const ext = path.extname(file.originalname);
      if (!allowedExt.includes(ext)) {
        return callback(
          new APIError("File Type Is Not Supported", {
            statusCode: 400,
            body: {
              allowedExt,
            },
          })
        );
      }

      // filter file size
      const fileSize = parseInt(req.headers["content-length"] as string);
      if (fileSize > maxSize) {
        return callback(
          new APIError("File Size Is Too Large (>3MB)", {
            statusCode: 400,
          })
        );
      }

      // those filtered
      callback(null, true);
    },
  });

export default upload;
