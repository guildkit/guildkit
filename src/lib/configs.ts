import type { Currency } from "@/lib/types.ts";
import userConfig from "../../guildkit.config.ts";
import type { S3ClientConfig } from "@aws-sdk/client-s3";

type BaseStorageConfig = S3ClientConfig & {
  /** Bucket name. Default to "guildkit" */
  bucket?: string;

  // Unconfigurable by default
  /** @deprecated This parameter is only required for Cloudflare R2 and ignored for this platform. */
  accountId?: undefined;
};

type CloudflareR2Config = Omit<BaseStorageConfig, "accountId" | "region"> & {
  platform: "cloudflare";
  accountId?: string;

  // Unconfigurable parameters
  /** @deprecated `region` is always `auto` on Cloudflare R2. */
  region?: "auto";
};

type MinioConfig = Omit<BaseStorageConfig, "region" | "forcePathStyle"> & {
  platform: "minio";

  // Unconfigurable parameters
  /** @deprecated This parameter is ignored. `region` is always `us-east-1` for Min.io. */
  region?: "us-east-1";
  /** @deprecated This parameter is ignored. `forcePathStyle` is always `true` for Min.io. */
  forcePathStyle?: true;
};

type DevStorageConfig = Omit<MinioConfig, "platform" | "endpoint" | "credentials"> & {
  platform: "development";
};

type AwsS3OrCustomConfig = BaseStorageConfig & {
  platform: "aws" | "custom";
};

export type GuildKitConfig = {
  storage: CloudflareR2Config | MinioConfig | DevStorageConfig | AwsS3OrCustomConfig;
  currencies: Currency[];
  maxLogoSizeMiB?: number;
};

export const config: Required<GuildKitConfig> = {
  storage: userConfig.storage,
  currencies: userConfig.currencies,
  maxLogoSizeMiB: userConfig.maxLogoSizeMiB ?? 5,
};
