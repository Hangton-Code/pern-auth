"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAvatar = exports.getAvatarFileStream = exports.uploadAvatar = void 0;
const fs_1 = __importDefault(require("fs"));
const s3_1 = __importDefault(require("../s3"));
const bucketName = process.env.AWS_S3_BUCKET_NAME;
function uploadAvatar(file) {
    // upload
    const fileStream = fs_1.default.createReadStream(file.path);
    const uploadParams = {
        Bucket: bucketName,
        Body: fileStream,
        Key: file.filename,
    };
    return s3_1.default.upload(uploadParams).promise();
}
exports.uploadAvatar = uploadAvatar;
function getAvatarFileStream(fileKey) {
    const downloadParams = {
        Key: fileKey,
        Bucket: bucketName,
    };
    return s3_1.default.getObject(downloadParams).createReadStream();
}
exports.getAvatarFileStream = getAvatarFileStream;
function deleteAvatar(fileKey) {
    const deleteParams = {
        Key: fileKey,
        Bucket: bucketName,
    };
    return s3_1.default.deleteObject(deleteParams).promise();
}
exports.deleteAvatar = deleteAvatar;
