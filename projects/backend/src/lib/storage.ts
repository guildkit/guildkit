import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import type { GuildKitConfig } from "@guildkit/shared";

export class StorageClient {
  private storage: S3Client;
  private bucketName: string;

  constructor(config: GuildKitConfig["servers"]["storage"]) {
    const {
      bucket,
      cloudflareAccountId,
      client,
    } = config;

    this.bucketName = bucket ?? "guildkit";

    this.storage = new S3Client({
      ...client,
      endpoint: client.endpoint
        ?? (cloudflareAccountId ? `https://${ cloudflareAccountId }.r2.cloudflarestorage.com` : undefined),
    });
  }

  /**
   *
   * @param destPath - path to put given file
   * @param file - file object to put
   * @returns Path for logo including bucket name
   */
  async putObject(destPath: string, file: File) {
    await this.storage.send(new PutObjectCommand({
      Bucket: this.bucketName,
      Key: destPath,
      Body: new Uint8Array(await file.arrayBuffer()),
    }));

    return `/${ this.bucketName }/${ destPath }`;
  };
}

export const logoDirName = "org-logos";
