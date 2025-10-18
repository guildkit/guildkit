import type { flattenError } from "zod/v4/core";
import type { currencies } from "@/intermediate/currencies.ts";

export type ActionState<SCHEMA = unknown> = {
  errors?: ReturnType<typeof flattenError<SCHEMA>>;
};

export type Currency = typeof currencies[number];
