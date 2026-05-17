"use client";

import { currencies, maxLogoSizeMiB } from "@guildkit/shared";
import {
  orgAboutSchema,
  orgAddressSchema,
  orgEmailSchema,
  orgLogoSchema,
  orgNameSchema,
  orgSlugSchema,
  orgUrlSchema,
  type Organization as OrgFormData,
} from "@guildkit/shared/zod";
import Form from "next/form";
import { useRouter } from "next/navigation";
import {
  useState,
  useTransition,
  type FormEvent,
  type ReactElement,
} from "react";
import { Button } from "@/components/generic/ButtonLink.tsx";
import { ArrayField } from "@/components/generic/fields/ArrayField.tsx";
import { Field } from "@/components/generic/fields/Field.tsx";
import { ImageField } from "@/components/generic/fields/ImageField.tsx";
import { TagField } from "@/components/generic/fields/TagField.tsx";
import type { Organization } from "@guildkit/db/auth";
import type { Tag } from "react-tag-input";
import type { ActionState } from "@/lib/types.ts";

type Props = {
  org?: Organization;
  initialLogoBase64?: string | undefined;
};

type ApiResponse = ActionState<OrgFormData> & { redirectUrl?: string; };

export const OrgEditorClient = ({ org, initialLogoBase64 }: Props): ReactElement => {
  const router = useRouter();
  const [ state, setState ] = useState<ActionState<OrgFormData>>({});
  const [ isPending, startTransition ] = useTransition();
  const { formErrors, fieldErrors } = state.errors ?? {};

  const currencyTags: Tag[] = currencies.map((currencyCode) => ({
    id: currencyCode,
    text: currencyCode,
    className: "",
  }));

  const onSubmit = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    startTransition(async () => {
      const res = await fetch("/api/organizations", {
        method: "POST",
        body: new FormData(evt.currentTarget),
      });
      const json = await res.json() as ApiResponse;
      if (json.redirectUrl) {
        router.replace(json.redirectUrl);
      } else {
        setState(json);
      }
    });
  };

  return (
    <Form
      action="/api/organizations"
      onSubmit={onSubmit}
      className="max-w-4xl mx-auto px-4 py-8"
    >
      <h1 className="text-2xl font-bold flex justify-center mb-5">
        { org ? `Organization settings for ${ org.name }` : "Create a new website" }
      </h1>

      {formErrors?.map((formError) => (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md" key={formError}>
          <p className="text-red-800">{formError}</p>
        </div>
      ))}

      <Field
        type="text"
        label="Organization Name"
        placeholder="Your Company Name"
        name="name"
        value={org?.name}
        autoComplete="organization"
        validator={orgNameSchema}
        errorMessages={fieldErrors?.name}
        required
        className="mb-6"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="flex flex-col">
          <Field
            type="text"
            label="Organization Slug"
            description="Used in URLs. Lowercase letters, numbers, and hyphens only"
            placeholder="your-company-name"
            name="slug"
            value={org?.slug}
            validator={orgSlugSchema}
            errorMessages={fieldErrors?.slug}
            required
            className="mb-6"
          />
        </div>

        <Field
          type="url"
          label="Website URL"
          placeholder="https://yourcompany.com"
          name="url"
          autoComplete="url"
          validator={orgUrlSchema}
          errorMessages={fieldErrors?.url}
          required
        />
      </div>

      <ImageField
        label="Company Logo"
        description="Logo should be a square."
        name="logo"
        initialImageBase64={initialLogoBase64}
        maxSizeMiB={maxLogoSizeMiB}
        validator={orgLogoSchema}
        errorMessages={fieldErrors?.logo}
        className="mb-6"
      />

      <Field
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
        disabled={isPending}
      >
        {isPending ? "Creating..." : "Create Organization" }
      </Button>
    </Form>
  );
};
