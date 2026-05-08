import { S3Client } from "@aws-sdk/client-s3";

export const s3 = new S3Client({
  region: process.env.S3_REGION ?? "us-east-1",
  endpoint: process.env.S3_ENDPOINT ?? "http://localhost:9000",
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID ?? "guildkit",
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY ?? "guildkit",
  },
  forcePathStyle: true, // Required for MinIO/RustFS
});

export const S3_BUCKET = process.env.S3_BUCKET ?? "guildkit";
