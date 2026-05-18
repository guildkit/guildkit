import { randomUUID } from "node:crypto";
import { APIError } from "better-auth";
import { NextResponse, type NextRequest } from "next/server";
import { flattenError } from "zod";
import { requireAuthAs } from "@/lib/auth/server.ts";
import { auth } from "@/lib/auth.ts";
import { logoDirName, putObject } from "@/lib/storage.ts";
import { orgSchema } from "@/lib/validations/organization.ts";

const uploadLogo = async (logoFile: File) => {
  const fileExt = logoFile.name.split(".").pop() ?? "";
  const destPath = `${ logoDirName }/${ randomUUID() }.${ fileExt }`;
  return putObject(destPath, logoFile);
};

export const POST = async (request: NextRequest): Promise<NextResponse> => {
  const { err } = await requireAuthAs("recruiter", { allowOrphanRecruiter: true });

  if (err) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();

  const { success, error, data } = orgSchema.safeParse({
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
    return NextResponse.json({
      errors: flattenError(error),
    }, { status: 400 });
  }

  try {
    const { logo, ...newOrgData } = data;
    const logoURL = logo ? await uploadLogo(logo) : undefined;

    await auth.api.createOrganization({
      body: {
        ...newOrgData,
        logo: logoURL,
      },
      headers: request.headers,
    });
  } catch (err) {
    if (err instanceof APIError) {
      if (err.body?.code === "SLUG_IS_TAKEN") {
        return NextResponse.json({
          errors: {
            formErrors: [],
            fieldErrors: { slug: [ "This slug is already taken." ]},
          },
        }, {status: 409 });
      } else if (err.body?.code === "ORGANIZATION_ALREADY_EXISTS") {
        return NextResponse.json({
          errors: {
            formErrors: [ "The organization already exists." ],
            fieldErrors: {},
          },
        }, { status: 409 });
      }
    }

    console.error(
      "Unexpected error on creating organization:", err,
      ...(err instanceof APIError ? [ "\n\nerr.body:", err.body ] : []),
    );

    return NextResponse.json({
      errors: {
        formErrors: [ "Failed to create organization. Sorry, this is probably a bug of our website. Error code: GK-BQ7CX" ],
        fieldErrors: {},
      },
    }, { status: 500 });
  }

  // You cannot redirect in the `try` & `catch` blocks
  // See: https://nextjs.org/docs/app/guides/redirecting#redirect-function
  return NextResponse.json({ redirectUrl: "/employer/jobs" }, { status: 201 });
};
