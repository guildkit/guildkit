import { env } from "node:process";
import { S3Client, type S3ClientConfig } from "@aws-sdk/client-s3";
import { config } from "./configs.ts";

const { platform: storagePlatform, bucket: configFileBucket, accountId: configFileAccountId, ...storageConfig } = config.storage;

export const bucketName = configFileBucket ?? env.STORAGE_BUCKET ?? "guildkit";
const cloudflareAccountId = configFileAccountId ?? env.CLOUDFLARE_ACCOUNT_ID;

if (storagePlatform === "cloudflare" && !cloudflareAccountId) {
  throw new Error("Cloudflare account ID is not configured for Cloudflare R2. Set `accountId` in your guildkit.config.ts or `CLOUDFLARE_ACCOUNT_ID` environment variable.");
}

const s3Config: S3ClientConfig = {
  ...storageConfig,

  // Hard-coded configs
  ...(
    storagePlatform === "development" ? {
      endpoint: "http://localhost:9000",
      forcePathStyle: true, // Required for Min.io
      region: "us-east-1", // Min.io's default
      credentials: {
        accessKeyId: "guildkit", // Same as MINIO_ROOT_USER configured in compose.yaml
        secretAccessKey: "guildkit", // Same as MINIO_ROOT_PASSWORD configured in compose.yaml
      },
    } : storagePlatform === "cloudflare" ? {
      endpoint: config.storage.endpoint ?? `https://${ cloudflareAccountId }.r2.cloudflarestorage.com`,
      region: "auto", // Cloudflare's default
    } : {} // empty if storagePlatform === "aws" or "custom"
  ),
};

export const storage = new S3Client(s3Config);

export const logoDirName = "org-logos";
