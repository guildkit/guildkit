import { guildKitBackend } from "@guildkit/backend";

const backend = guildKitBackend(__GUILDKIT_CONFIG__ as GuildKitConfig);

export default backend;
