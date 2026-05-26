import { join } from "node:path";

export const getPaths = (cwdPath: string) => {
  const intermediateRootPath = join(cwdPath, ".guildkit/intermediate");
  const intermediateBackendPath = join(intermediateRootPath, "backend");
  const intermediateFrontendPath = join(intermediateRootPath, "frontend");
  const distRootPath = join(cwdPath, "dist");
  const distBackendPath = join(distRootPath, "backend");
  const distFrontendPath = join(distRootPath, "frontend");

  return {
    intermediateRootPath,
    intermediateBackendPath,
    intermediateFrontendPath,
    distRootPath,
    distBackendPath,
    distFrontendPath,
  };
};
