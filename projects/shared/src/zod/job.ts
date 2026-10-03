import { z } from "@hono/zod-openapi";
import { salaryPer } from "../enums";
import { currencies } from "../intermediate/currencies";
import { orgSchema } from "./organization";

export const jobTitleSchema = z.string().trim().min(2, "Job title must be at least 2 characters.");
export const jobDescriptionSchema = z.string().trim().min(4, "Job description must be at least 4 characters.");
export const jobApplicationUrlSchema = z.url("Please enter a valid URL.");
export const jobLocationSchema = z.string().trim().min(2, "Location must be at least 2 characters.");
export const jobSalarySchema = z.coerce.number<number>().positive("Salary must be a positive number.");
export const jobCurrencySchema = z.enum(currencies, "Please set available currency code. (e.g. \"USD\" for US Dollar)");
export const jobSalaryPerSchema = z.enum(salaryPer, "Please set a valid salary period. (e.g. \"hour\", \"day\", \"week\", \"month\", \"year\")");
export const jobExpiresAtSchema = z.preprocess(
  (dateInput) => typeof dateInput === "string" ? new Date(Date.parse(dateInput)) : dateInput,
  z.date("Please enter a valid date.")
);

export const JobSchema = z.object({
  id: z.uuid(),
  title: jobTitleSchema,
  description: jobDescriptionSchema,
  applicationUrl: jobApplicationUrlSchema,
  location: jobLocationSchema,
  salary: jobSalarySchema,
  currency: jobCurrencySchema,
  salaryPer: jobSalaryPerSchema,
  expiresAt: jobExpiresAtSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Job = z.infer<typeof JobSchema>;

export const JobCreateSchema = JobSchema.pick({
  title: true,
  description: true,
  applicationUrl: true,
  location: true,
  salary: true,
  currency: true,
  salaryPer: true,
}).extend({
  expiresAt: z.iso.date(),
});

//
// Response schemas
//
// Dates are serialized as ISO `date-time` strings on the wire; the generated
// OpenAPI client converts them back into `Date` objects on the consumer side.
//

/** Job summary as shown in job lists (home page, employer dashboard, org page). */
export const JobResponseSchema = JobSchema.pick({
  id: true,
  title: true,
  description: true,
}).extend({
  createdAt: z.iso.date(),
  updatedAt: z.iso.date(),
  employer: orgSchema.pick({
    name: true,
  }),
}).openapi("JobResponse");

export type JobListItem = z.infer<typeof JobResponseSchema>;

export const JobsResponseSchema = z.array(JobResponseSchema).openapi("JobsResponse");

/** Full job detail as shown on the public job page. */
export const jobDetailSchema = JobSchema.pick({
  id: true,
  title: true,
  description: true,
  location: true,
  salary: true,
  salaryPer: true,
  currency: true,
  applicationUrl: true,
}).extend({
  createdAt: z.iso.date(),
  updatedAt: z.iso.date(),
  employer: orgSchema.pick({
    slug: true,
    name: true,
  }),
}).openapi("JobDetail");

export type JobDetail = z.infer<typeof jobDetailSchema>;
