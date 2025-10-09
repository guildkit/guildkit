import { z } from "zod";
import { currency } from "@/lib/db/schema/currencies.ts";
import { salaryPer } from "@/lib/db/schema/job.ts";

export const jobSchema = z.object({
  title: z.string().trim().min(2),
  description: z.string().trim().min(4),
  applicationUrl: z.string().url(),
  location: z.string().trim().min(2),
  salary: z.number().positive(),
  currency: z.enum(currency.enumValues),
  salaryPer: z.enum(salaryPer.enumValues),
  recruiterId: z.string(),
  expiresAt: z.string().date(),
});

export type Job = z.infer<typeof jobSchema>;
