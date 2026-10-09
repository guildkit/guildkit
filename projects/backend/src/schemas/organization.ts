import { JobResponseSchema } from "@guildkit/shared/zod";
import { z } from "zod";

export const OrgSlugParams = z.object({
  slug: z.string().meta({ example: "your-company-inc" }),
});

export const OrganizationWithJobsSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  logo: z.string().nullable(),
  url: z.string(),
  about: z.string().nullable(),
  addresses: z.array(z.string()),
  emails: z.array(z.string()),
  currencies: z.array(z.string()),
  createdAt: z.iso.datetime(),
  jobs: z.array(JobResponseSchema),
});

export const OrganizationCreatedResponse = z.object({
  success: z.literal(true),
});
