#!/usr/bin/env nu

#MISE depends = [ "clean" ]
#MISE depends_post = [ "setup" ]
#MISE raw = true
#MISE description="Reinstall all the dependencies and rebuild the old builds"
# `raw = true` is required for the spinner and interactive UIs

# Remove pnpm-lock.yaml
const pnpmLockPath = path self "../../pnpm-lock.yaml"
rm --force --permanent $pnpmLockPath

# Create placeholder for ./bin/guildkit
const missingCliDirPath = path self "../../projects/cli/bin"
const missingCliPath = $missingCliDirPath | path join "guildkit.mjs"
mkdir $missingCliDirPath
touch $missingCliPath

# Install dependencies
corepack enable
corepack up
pnpm install
