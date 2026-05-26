import type { S3ClientConfig } from "@aws-sdk/client-s3";

export type GuildKitConfig = {
  slug: string;
  siteName: string;
  servers: {
    app: "nodejs" | "cloudflare";
    storage: {
      /** Bucket name. Default to "guildkit" */
      bucket?: string;
      /** Cloudflare account ID. Only required for Cloudflare R2. */
      cloudflareAccountId?: string;
      /** Options to be passed to S3 client SDK */
      client: S3ClientConfig;
    };
  };
  dev?: {
    port?: number;
  };
};

export const maxLogoSizeMiB = 8;
