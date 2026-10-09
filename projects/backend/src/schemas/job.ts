import { z } from "zod";

export const JobsQuery = z.object({
  employer: z.uuid().or(z.literal("us")).optional(),
});
