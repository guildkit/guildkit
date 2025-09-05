import { pgEnum } from "drizzle-orm/pg-core";
// Cannot use `@/intermediate` since this file is not managed by Next.js
import { currencies } from "../../../intermediate/currencies.ts";

export const currency = pgEnum("Currency", currencies.map((currency) => currency.code) as [string, ...string[]]);
