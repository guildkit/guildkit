import { PutObjectCommand, S3Client, type S3ClientConfig } from "@aws-sdk/client-s3";
import { config } from "./configs.ts";

const { platform: storagePlatform, bucket: configFileBucket, accountId: configFileAccountId, ...storageConfig } = config.storage;

export const bucketName = configFileBucket ?? process.env.STORAGE_BUCKET ?? "guildkit";
const cloudflareAccountId = configFileAccountId ?? process.env.CLOUDFLARE_ACCOUNT_ID;

if (storagePlatform === "cloudflare" && !cloudflareAccountId) {
  throw new Error("Cloudflare account ID is not configured for Cloudflare R2. Set `accountId` in your guildkit.config.ts or `CLOUDFLARE_ACCOUNT_ID` environment variable.");
}

const s3Config: S3ClientConfig = {
  ...storageConfig,

  // Hard-coded configs
  ...(
    storagePlatform === "development" ? {
      endpoint: "http://localhost:9000",
      forcePathStyle: true, // Required for rustfs
      region: "us-east-1", // rustfs's default
      credentials: {
        accessKeyId: "guildkit", // Same as RUSTFS_ACCESS_KEY configured in compose.yaml
        secretAccessKey: "guildkit", // Same as RUSTFS_SECRET_KEY configured in compose.yaml
      },
    } : storagePlatform === "cloudflare" ? {
      endpoint: config.storage.endpoint ?? `https://${ cloudflareAccountId }.r2.cloudflarestorage.com`,
      region: "auto", // Cloudflare's default
    } : {} // empty if storagePlatform === "aws" or "custom"
  ),
};

export const storage = new S3Client(s3Config);

/**
 *
 * @param destPath - path to put given file
 * @param file - file object to put
 * @returns Path for logo including bucket name
 */
export const putObject = async (destPath: string, file: File) => {
  await storage.send(new PutObjectCommand({
    Bucket: bucketName,
    Key: destPath,
    Body: Buffer.from(await file.arrayBuffer()),
  }));

  return `/${ bucketName }/${ destPath }`;
};

export const logoDirName = "org-logos";
