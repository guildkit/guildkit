export type Env = {
  SERVER_ENV?: string;
  BASE_URL?: string;
  DATABASE_URL?: string;
  BETTER_AUTH_SECRET?: string;

  GOOGLE_CLIENT_ID?: string;
  GOOGLE_CLIENT_SECRET?: string;
  GITHUB_CLIENT_ID?: string;
  GITHUB_CLIENT_SECRET?: string;

  // Storage config
  STORAGE_BUCKET?: string;
  AWS_ACCESS_KEY_ID?: string;
  AWS_SECRET_ACCESS_KEY?: string;
  CLOUDFLARE_ACCOUNT_ID?: string;

  NEON_API_KEY?: string;

  [unused: string]: string | undefined;
};
