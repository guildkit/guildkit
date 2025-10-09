import { z } from "zod";
import { salaryPer } from "@/lib/db/schema/job.ts";
import { currency } from "@/lib/db/schema/currencies.ts";

export const jobSchema = z.object({
  title: z.string().trim().min(2, "Job title must be at least 2 characters."),
  description: z.string().trim().min(4, "Job description must be at least 4 characters."),
  applicationUrl: z.url("Please enter a valid URL."),
  location: z.string().trim().min(2, "Location must be at least 2 characters."),
  salary: z.coerce.number<number>().positive("Salary must be a positive number."),
  currency: z.enum(currency.enumValues),
  salaryPer: z.enum(salaryPer.enumValues),
  recruiterId: z.string(),
  expiresAt: z.date("Please enter a valid date."),
});

export type Job = z.infer<typeof jobSchema>;
