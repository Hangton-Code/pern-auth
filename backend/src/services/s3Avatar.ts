import fs from "fs";
import s3 from "../s3";

const bucketName = process.env.AWS_S3_BUCKET_NAME as string;

function uploadAvatar(file: Express.Multer.File) {
  // upload
  const fileStream = fs.createReadStream(file.path);

  const uploadParams = {
    Bucket: bucketName,
    Body: fileStream,
    Key: file.filename,
  };

  return s3.upload(uploadParams).promise();
}

function getAvatarFileStream(fileKey: string) {
  const downloadParams = {
    Key: fileKey,
    Bucket: bucketName,
  };

  return s3.getObject(downloadParams).createReadStream();
}

function deleteAvatar(fileKey: string) {
  const deleteParams = {
    Key: fileKey,
    Bucket: bucketName,
  };

  return s3.deleteObject(deleteParams).promise();
}

export { uploadAvatar, getAvatarFileStream, deleteAvatar };
