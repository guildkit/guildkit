import { z } from "zod";
import { Currency, SalaryPer } from "@/lib/prisma/enums.ts";

export const jobTitleSchema = z.string().trim().min(2, "Job title must be at least 2 characters.");
export const jobDescriptionSchema = z.string().trim().min(4, "Job description must be at least 4 characters.");
export const jobApplicationUrlSchema = z.url("Please enter a valid URL.");
export const jobLocationSchema = z.string().trim().min(2, "Location must be at least 2 characters.");
export const jobSalarySchema = z.coerce.number<number>().positive("Salary must be a positive number.");
export const jobCurrencySchema = z.enum(Currency, "Please set available currency code. (e.g. \"USD\" for US Dollar)");
export const jobSalaryPerSchema = z.enum(SalaryPer, "Please set a valid salary period. (e.g. \"hour\", \"day\", \"week\", \"month\", \"year\")");
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
