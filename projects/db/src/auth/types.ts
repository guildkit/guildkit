import type { initAuth } from "./index.js";

export type User = ReturnType<typeof initAuth>["$Infer"]["Session"]["user"];
export type Session = ReturnType<typeof initAuth>["$Infer"]["Session"]["session"];
export type Organization = ReturnType<typeof initAuth>["$Infer"]["Organization"];
