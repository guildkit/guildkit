import { initAuth } from "@guildkit/db";
import { prisma } from "./prisma.ts";

export const auth = initAuth(process.env, prisma);
