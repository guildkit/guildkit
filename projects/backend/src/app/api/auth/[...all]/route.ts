import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "../../../../lib/auth.ts";
import { preflight, withCors } from "../../../../lib/cors.ts";

const handlers = toNextJsHandler(auth);

export const GET = withCors(handlers.GET);
export const POST = withCors(handlers.POST);
export const OPTIONS = preflight;
