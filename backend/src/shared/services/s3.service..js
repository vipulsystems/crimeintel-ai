import fs from "fs/promises";
import path from "path";
import AWS from "aws-sdk";

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

/**
 * Upload file to S3
 */
export const uploadFile = async (filePath, folder = "posts") => {
  try {
    const fileContent = await fs.readFile(filePath);
    const fileName = path.basename(filePath);

    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `${folder}/${Date.now()}_${fileName}`,
      Body: fileContent,
      ACL: "public-read",
    };

    const data = await s3.upload(params).promise();

    return data.Location;
  } catch (err) {
    console.error("❌ S3 Upload Error:", err.message);
    throw err;
  }
};