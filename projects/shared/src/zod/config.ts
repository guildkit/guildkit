import { z } from "@hono/zod-openapi";
import type { S3ClientConfig } from "@aws-sdk/client-s3";

export const GuildKitConfigSchema = z.object({
  slug: z.string().regex(/^[a-zA-Z0-9_-]+$/),
  siteName: z.string(),
  servers: z.object({
    app: z.enum([ "nodejs", "cloudflare" ]),
    storage: z.object({
      bucket: z.string().optional(),
      cloudflareAccountId: z.string().optional(),
      client: z.custom<S3ClientConfig>(),
    }),
  }),
  dev: z.object({
    port: z.number().optional(),
  }).optional(),
});

export type GuildKitConfig = z.infer<typeof GuildKitConfigSchema>;
