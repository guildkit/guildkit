"use server";

import { randomUUID } from "node:crypto";
import { headers } from "next/headers";
import { redirect, RedirectType } from "next/navigation";
import { flattenError } from "zod";
import { APIError } from "better-auth";
import { orgSchema, type Organization } from "@/lib/validation/organization.ts";
import { auth } from "@/lib/auth.ts";
import { logoDirName, putObject } from "@/lib/storage.ts";
import type { ActionState } from "@/lib/types.ts";

const uploadLogo = async (logoFile: File) => {
  const fileExt = logoFile.name.split(".").pop() ?? "";
  const destPath = `${ logoDirName }/${ randomUUID() }.${ fileExt }`;

  return putObject(destPath, logoFile);
};

export const createOrganization = async (_initialState: ActionState<Organization>, formData: FormData): Promise<ActionState<Organization>> => {
  try {
    const {
      success,
      error,
      data,
    } = orgSchema.safeParse({
      name: formData.get("name"),
      slug: formData.get("slug"),
      logo: formData.get("logo"),
      about: formData.get("about"),
      url: formData.get("url"),
      emails: formData.getAll("emails"),
      addresses: formData.getAll("addresses"),
      currencies: formData.getAll("currencies"),
    });

    if (!success) {
      return {
        errors: flattenError(error),
      };
    }

    const { logo, ...newOrgData } = data;

    const logoURL = logo ? await uploadLogo(logo) : undefined;

    await auth.api.createOrganization({
      body: {
        ...newOrgData,
        logo: logoURL,
      },
      headers: await headers(),
    });
  } catch (err) {
    if (err instanceof APIError) {
      if (err.body?.code === "SLUG_IS_TAKEN") {
        return {
          errors: {
            formErrors: [],
            fieldErrors: {
              slug: [ "This slug is already taken." ],
            },
          },
        };
      } else if (err.body?.code === "ORGANIZATION_ALREADY_EXISTS") {
        return {
          errors: {
            formErrors: [ "The organization already exists." ],
            fieldErrors: {},
          },
        };
      }
    }

    console.error(
      "Unexpected error on creating organization:", err,
      ...(err instanceof APIError ? [ "\n\nerr.body:", err.body ] : []),
    );

    return {
      errors: {
        formErrors: [ "Failed to create organization. Sorry, this is probably a bug of our website. Error code: GK-BQ7CX" ],
        fieldErrors: {},
      },
    };
  } finally {
    // You cannot redirect in the `try` & `catch` blocks
    // See: https://nextjs.org/docs/app/guides/redirecting#redirect-function
    redirect("/employer/jobs", RedirectType.replace);
  }
};
