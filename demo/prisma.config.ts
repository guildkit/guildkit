import { definePrismaConfig } from "guildkit";

const config = definePrismaConfig({
  migrations: {
    seed: "guildkit seed",
  },
});

export default config;
