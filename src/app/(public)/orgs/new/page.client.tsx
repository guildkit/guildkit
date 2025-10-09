"use client";

import Form from "next/form";
import {
  startTransition,
  useActionState,
  type FormEvent,
  type ReactElement,
} from "react";
import { Button } from "@/components/generic/ButtonLink.tsx";
import { ArrayField } from "@/components/generic/fields/ArrayField.tsx";
import { ImageField } from "@/components/generic/fields/ImageField.tsx";
import { TagField } from "@/components/generic/fields/TagField.tsx";
import { TextField } from "@/components/generic/fields/TextField.tsx";
import { currencies } from "@/intermediate/currencies.ts";
import publicConfigs from "@/intermediate/public-configs.json";
import { createOrganization } from "@/lib/actions/organizations.ts";
import {
  orgAboutSchema,
  orgAddressSchema,
  orgEmailSchema,
  orgLogoSchema,
  orgNameSchema,
  orgSlugSchema,
  orgUrlSchema,
} from "@/lib/validations/organization.ts";
import type { Tag } from "react-tag-input";

export default function NewOrgPageClient(): ReactElement {
  const [ state, formAction, pending ] = useActionState(createOrganization, {});
  const { formErrors, fieldErrors } = state.errors ?? {};

  const currencyTags: Tag[] = currencies.map((currencyCode) => ({
    id: currencyCode,
    text: currencyCode,
    className: "",
  }));

  const onSubmit = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    startTransition(() => formAction(new FormData(evt.currentTarget)));
  };

  return (
    <Form
      action={formAction}
      onSubmit={onSubmit}
      className="max-w-4xl mx-auto px-4 py-8"
    >
      <h1 className="text-2xl font-bold flex justify-center mb-5">
        Create a new organization
      </h1>

      {formErrors?.map((formError) => (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-800">{formError}</p>
        </div>
      ))}

      <TextField
        type="text"
        label="Organization Name"
        placeholder="Your Company Name"
        name="name"
        autoComplete="organization"
        validator={orgNameSchema}
        errorMessages={fieldErrors?.name}
        required
        className="mb-6"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="flex flex-col">
          <TextField
            type="text"
            label="Organization Slug"
            description="Used in URLs. Lowercase letters, numbers, and hyphens only"
            placeholder="your-company-name"
            name="slug"
            validator={orgSlugSchema}
            errorMessages={fieldErrors?.slug}
            required
            className="mb-6"
          />

          <TextField
            type="url"
            label="Website URL"
            placeholder="https://yourcompany.com"
            name="url"
            autoComplete="url"
            validator={orgUrlSchema}
            errorMessages={fieldErrors?.url}
            required
            className="mb-6"
          />
        </div>

        <ImageField
          label="Company Logo"
          description="Logo should be a square."
          name="logo"
          maxSizeMiB={publicConfigs.maxLogoSizeMiB}
          validator={orgLogoSchema}
          errorMessages={fieldErrors?.logo}
          className="mb-6"
        />
      </div>

      <TextField
        type="textarea"
        label="About"
        placeholder="Tell us about your organization..."
        name="about"
        validator={orgAboutSchema}
        errorMessages={fieldErrors?.about}
        className="mb-6"
      />

      <ArrayField
        type="email"
        label="Contact Emails"
        itemName="email"
        description="In addition to the recruiters' emails, you can also send notifications to these emails"
        placeholder="account-team@example.com"
        name="emails"
        validator={orgEmailSchema}
        errorMessages={fieldErrors?.emails}
        className="mb-6"
      />

      <ArrayField
        type="text"
        label="Addresses"
        itemName="address"
        placeholder="123 Main St, City, Country; 456 Branch Ave, Another City, Country"
        name="addresses"
        autoComplete="street-address"
        validator={orgAddressSchema}
        errorMessages={fieldErrors?.addresses}
        required
        className="mb-6"
      />

      <TagField
        label="Supported Currencies"
        tags={currencyTags}
        name="currencies"
        errorMessages={fieldErrors?.currencies}
        required
        className="mb-6"
      />

      <Button
        type="submit"
        theme="button-deep"
        className="w-full"
        disabled={pending}
      >
        {pending ? "Creating..." : "Create Organization" }
      </Button>
    </Form>
  );
}
