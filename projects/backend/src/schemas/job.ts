import { z } from "zod";

export const JobIdParams = z.object({
  id: z.string().meta({ example: "6d980b9e-582d-11f1-b6c2-63f8127cddf7" }),
});

export const JobsQuery = z.object({
  employer: z.uuid().or(z.literal("us")).optional(),
});

export const CreatedJobResponse = z.object({
  newJobId: z.uuid(),
});

export const DeletedJobResponse = z.object({});
