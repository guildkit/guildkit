pnpm run clean

# Remove pnpm-lock.yaml
const pnpmLockPath = path self "../pnpm-lock.yaml"
rm --force --permanent $pnpmLockPath

# Install dependencies
corepack enable
corepack up
pnpm install

# Install Agent Skills
pnpm exec skills update --project
