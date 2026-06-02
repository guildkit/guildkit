#!/usr/bin/env nu

#MISE depends = [ "clean" ]
#MISE depends_post = [ "setup" ]
#MISE raw = true
#MISE description="Reinstall all the dependencies and rebuild the old builds"
# `raw = true` is required for the spinner and interactive UIs

# Remove pnpm-lock.yaml
const pnpmLockPath = path self "../../pnpm-lock.yaml"
rm --force --permanent $pnpmLockPath

# Install dependencies
corepack enable
corepack up
pnpm install
