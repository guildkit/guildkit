import { defineMiddleware } from "astro:middleware";
import { backendBaseURL } from "@/lib/config";
import type { Organization } from "@guildkit/db/auth";

type SessionResponse = {
  user?: App.Locals["user"];
  session?: App.Locals["session"];
} | null;

/**
 * Resolve the better-auth session on the server by forwarding the incoming
 * `Cookie` header to the backend, and expose it (plus the active organization
 * for recruiters) on `Astro.locals` so pages can gate access without calling
 * the browser auth client during SSR.
 */
export const onRequest = defineMiddleware(async (context, next) => {
  context.locals.user = null;
  context.locals.session = null;
  context.locals.activeOrg = null;

  const cookie = context.request.headers.get("cookie");

  if (cookie) {
    try {
      const sessionRes = await fetch(`${ backendBaseURL }/api/auth/get-session`, {
        headers: { cookie },
      });

      if (sessionRes.ok) {
        const data = await sessionRes.json() as SessionResponse;

        if (data?.user) {
          context.locals.user = data.user;
          context.locals.session = data.session ?? null;

          if (data.user.type === "recruiter" || data.user.type === "administrative") {
            const orgRes = await fetch(
              `${ backendBaseURL }/api/auth/organization/get-full-organization?membersLimit=0`,
              { headers: { cookie } }
            );

            if (orgRes.ok) {
              context.locals.activeOrg = await orgRes.json() as Organization | null;
            }
          }
        }
      }
    } catch (err) {
      console.error("Failed to resolve the session in middleware:", err);
    }
  }

  return next();
});
