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

# Create placeholder for @guildkit/client
const missingClientDirPath = path self "../../projects/client"
const missingClientPackageJsonPath = $missingClientDirPath | path join "package.json"

mkdir $missingClientDirPath
"{ \"name\": \"@guildkit/client\" }" | save $missingClientPackageJsonPath

# Install dependencies
corepack enable
corepack up
pnpm install
