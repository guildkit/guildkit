import { z } from "zod";
import publicConfigs from "@/intermediate/public-configs.json";
import { currency } from "@/lib/db/schema/currencies.ts";
import { mibToByte } from "@/lib/utils/utils.ts";

export const orgNameSchema = z.string().trim().min(2, "Organization name must be at least 2 characters.");
export const orgSlugSchema = z.string()
  .trim()
  .min(2, "Slug must be at least 2 characters.")
  .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens.");
export const orgLogoSchema = z
  .preprocess((file) => {
    if (file instanceof File && file.size <= 0) {
      return undefined;
    } else {
      return file;
    }
  }, z.file()
    .min(1, "Empty file was given.")
    .max(mibToByte(publicConfigs.maxLogoSizeMiB), `File size has to be less than ${ publicConfigs.maxLogoSizeMiB } MiB.`)
    .mime([
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/gif",
      "image/svg+xml",
    ], "Unsupported file format. Supported file types: PNG, JPEG, WebP, GIF, and SVG.")
    .optional()
  );
export const orgAboutSchema = z.string().trim().optional();
export const orgUrlSchema = z.url("Please enter a valid URL.");
export const orgEmailSchema = z.email({ error: "Please enter a valid email here. Some legacy emails by Japanese mobile carriers may not be acceptable." });
export const orgAddressSchema = z.string().trim().min(4, "Address must be at least 4 characters.");
// TODO show the list of available currency code in the error message
// TODO guildkit.config.ts で指定されている currencies 以外が使えないようにする。
export const orgCurrencySchema = z.enum(currency.enumValues, "Please set available currency code. (e.g. \"USD\" for US Dollar)");

export const orgSchema = z.object({
  name: orgNameSchema,
  slug: orgSlugSchema,
  logo: orgLogoSchema,
  about: orgAboutSchema,
  url: orgUrlSchema,
  emails: z.array(orgEmailSchema).optional(),
  addresses: z.array(orgAddressSchema).min(1, "At least one address is required."),
  currencies: z.array(z.enum(currency.enumValues)).min(1, "At least one currency is required."),
});

export type Organization = z.infer<typeof orgSchema>;
