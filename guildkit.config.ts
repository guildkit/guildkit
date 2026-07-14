import type { GuildKitConfig } from "@guildkit/shared/zod";

// TODO make these items configurable by the GuildKit instance admins

const config: GuildKitConfig = {
  slug: "guildkit-demo",
  siteName: "GuildKit Demo",
  servers: {
    app: "cloudflare",
    storage: process.env.SERVER_ENV === "development" ? {
      // RustFS configured in compose.yaml
      client: {
        endpoint: "http://localhost:9000",
        forcePathStyle: true, // Required for RustFS
        region: "us-east-1", // RustFS's default
        credentials: {
          accessKeyId: "guildkit", // Same as RUSTFS_ACCESS_KEY configured in compose.yaml
          secretAccessKey: "guildkit", // Same as RUSTFS_SECRET_KEY configured in compose.yaml
        },
      },
    } : {
      bucket: process.env.STORAGE_BUCKET,
      cloudflareAccountId: process.env.CLOUDFLARE_ACCOUNT_ID,
      client: {
        region: "auto", // Cloudflare R2's default
      },
    },
  },
};

export default config;
