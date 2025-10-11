import { z } from "zod";
import { salaryPer } from "@/lib/db/schema/job.ts";
import { currency } from "@/lib/db/schema/currencies.ts";

export const jobTitleSchema = z.string().trim().min(2, "Job title must be at least 2 characters.");
export const jobDescriptionSchema = z.string().trim().min(4, "Job description must be at least 4 characters.");
export const jobApplicationUrlSchema = z.url("Please enter a valid URL.");
export const jobLocationSchema = z.string().trim().min(2, "Location must be at least 2 characters.");
export const jobSalarySchema = z.coerce.number<number>().positive("Salary must be a positive number.");
export const jobCurrencySchema = z.enum(currency.enumValues); // TODO organization.currencies に限定する TODO エラーメッセージ書く
export const jobSalaryPerSchema = z.enum(salaryPer.enumValues);
export const jobExpiresAtSchema = z.preprocess(
  (dateInput) => typeof dateInput === "string" ? new Date(Date.parse(dateInput)) : dateInput,
  z.date("Please enter a valid date.")
);

export const jobSchema = z.object({
  title: jobTitleSchema,
  description: jobDescriptionSchema,
  applicationUrl: jobApplicationUrlSchema,
  location: jobLocationSchema,
  salary: jobSalarySchema,
  currency: jobCurrencySchema,
  salaryPer: jobSalaryPerSchema,
  expiresAt: jobExpiresAtSchema,
});

export type Job = z.infer<typeof jobSchema>;
