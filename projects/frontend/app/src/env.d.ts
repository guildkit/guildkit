/// <reference types="astro/client" />

import type { Organization } from "@guildkit/db";
import type { UserType } from "@guildkit/shared";

declare global {
  namespace App {
    interface Locals {
      user:
        | {
            id: string;
            email: string;
            name: string;
            image?: string | null;
            type: UserType;
          }
        | null;
      session: { activeOrganizationId?: string | null; } | null;
      activeOrg: Organization | null;
    }
  }
}

export {};
