import { orgSchema } from "@guildkit/shared/zod";
import { pseudoRandomString } from "@phanect/utils";
import { APIError } from "better-auth";
import { NextResponse, type NextRequest } from "next/server";
import { flattenError } from "zod";
import { auth } from "../../lib/auth.ts";
import { requireAuthAs } from "../../lib/auth-guard.ts";
import { config } from "../../lib/config.ts";
import { logoDirName, StorageClient } from "../../lib/storage.ts";

const uploadLogo = async (logoFile: File, storageClient: StorageClient): Promise<string> => {
  const fileExt = logoFile.name.split(".").pop() ?? "";
  const destPath = `${ logoDirName }/${ pseudoRandomString(32) }.${ fileExt }`;
  return storageClient.putObject(destPath, logoFile);
};

/**
 * Create an organization
 * @tag organization
 * @body orgSchema
 * @contentType multipart/form-data
 * @response 201:OrganizationCreatedResponse:Successfully created an organization
 * @add 400:ValidationErrorResponse:The form data is invalid.
 * @add 401:ErrorResponse:The user is not logged in or is not a recruiter.
 * @add 409:ValidationErrorResponse:The slug or the organization already exists.
 * @add 500:ValidationErrorResponse:Failed to create an organization (Unexpected error)
 */
export const POST = async (request: NextRequest): Promise<NextResponse> => {
  const authResult = await requireAuthAs(request, "recruiter", { allowOrphanRecruiter: true });

  if (authResult instanceof NextResponse) {
    return authResult;
  }

  const formData = await request.formData().catch(() => new FormData());

  const { success, data, error } = orgSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    logo: formData.get("logo") ?? undefined,
    about: formData.get("about") ?? undefined,
    url: formData.get("url"),
    emails: formData.getAll("emails"),
    addresses: formData.getAll("addresses"),
    currencies: formData.getAll("currencies"),
  });

  if (!success) {
    return NextResponse.json({ errors: flattenError(error) }, { status: 400 });
  }

  const { logo, ...newOrgData } = data;

  try {
    const storage = new StorageClient(config.servers.storage);
    const logoURL = logo ? await uploadLogo(logo, storage) : undefined;

    await auth.api.createOrganization({
      body: {
        ...newOrgData,
        logo: logoURL,
      },
      headers: request.headers,
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    if (err instanceof APIError) {
      if (err.body?.code === "SLUG_IS_TAKEN") {
        return NextResponse.json({
          errors: {
            formErrors: [],
            fieldErrors: { slug: [ "This slug is already taken." ]},
          },
        }, { status: 409 });
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
};
