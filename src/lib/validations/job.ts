import { z } from "zod";
import { currency } from "@/lib/db/schema/currencies.ts";
import { salaryPer } from "@/lib/db/schema/job.ts";

export const jobSchema = z.object({
  title: z.string().trim().min(2, "Job title must be at least 2 characters."),
  description: z.string().trim().min(4, "Job description must be at least 4 characters."),
  applicationUrl: z.url("Please enter a valid URL."),
  location: z.string().trim().min(2, "Location must be at least 2 characters."),
  salary: z.coerce.number<number>().positive("Salary must be a positive number."),
  currency: z.enum(currency.enumValues, "Please set available currency code. (e.g. \"USD\" for US Dollar)"),
  salaryPer: z.enum(salaryPer.enumValues, "Please set a valid salary period. (e.g. \"hour\", \"day\", \"week\", \"month\", \"year\")"),
  expiresAt: z.preprocess(
    (dateInput) => typeof dateInput === "string" ? new Date(Date.parse(dateInput)) : dateInput,
    z.date("Please enter a valid date.")
  ),
});

export type Job = z.infer<typeof jobSchema>;
