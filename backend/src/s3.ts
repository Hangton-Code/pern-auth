import S3 from "aws-sdk/clients/s3";
require("dotenv").config();

const s3 = new S3({
  region: process.env.AWS_S3_BUCKET_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

export default s3;
