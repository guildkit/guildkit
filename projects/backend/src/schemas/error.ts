import { z } from "zod";

export const ErrorResponse = z.object({
  code: z.string(),
  message: z.string().optional(),
});

/** The result of `flattenError()` of Zod */
export const ValidationErrorResponse = z.object({
  errors: z.object({
    formErrors: z.array(z.string()),
    fieldErrors: z.record(z.string(), z.array(z.string())),
  }),
});

export const BadRequestResponse = z.union([ ErrorResponse, ValidationErrorResponse ]);
