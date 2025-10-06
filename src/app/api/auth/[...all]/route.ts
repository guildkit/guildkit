import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "@/lib/auth.ts";

export const { POST, GET } = toNextJsHandler(auth.handler);
