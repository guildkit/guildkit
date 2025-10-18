import Image from "next/image";
import { notFound } from "next/navigation";
import { Link } from "@/components/generic/ButtonLink.tsx";
import { JobList } from "@/components/JobList.tsx";
import { db } from "@/lib/db/db.ts";
import type { ReactElement } from "react";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function OrganizationPage({ params }: Props): Promise<ReactElement> {
  const { slug } = await params;

  const orgWithJobs = await db.query.organization.findFirst({
    columns: {
      id: true,
      name: true,
      url: true,
      about: true,
    },
    with: {
      jobs: {
        limit: 6,
        columns: {
          id: true,
          title: true,
          description: true,
          createdAt: true,
          updatedAt: true,
        },
      },
    },
    where: (organization, { eq }) => eq(organization.slug, slug),
  });

  if (!orgWithJobs) {
    notFound();
  }

  const { jobs, ...org } = orgWithJobs;

  const jobsWithEmployer = jobs.map((job) => ({
    ...job,
    employer: {
      name: org.name,
    },
  }));

  return (
    <>
      <div className="w-full max-w-5xl px-9 flex flex-col">
        <h1 className="text-5xl md:text-6xl font-bold text-left mt-16 mb-4 drop-shadow-lg">
          {org.name}
        </h1>

        <Link
          href={org.url}
          className="inline-flex gap-1.5 self-end"
          target="_blank"
        >
          <Image src="/vendor/octicons/globe.svg" alt="" width={16} height={16} className="flex-shrink-0" />
          {org.url}
        </Link>

        {org.about && (
          <section className="mt-10 mb-8 px-4 md:px-0">
            <h2 className="flex justify-start gap-2 items-center text-4xl text-gray-800 mb-8 relative before:content-[''] before:block before:bg-gray-500 before:rounded-sm before:w-1 before:h-5">
              About Us
            </h2>
            <p className="text-lg leading-relaxed text-gray-600 text-left max-w-3xl mx-auto">
              {org.about}
            </p>
          </section>
        )}

        <h2 className="flex justify-start gap-2 items-center text-4xl text-gray-800 mb-5 relative before:content-[''] before:block before:bg-gray-500 before:rounded-sm before:w-1 before:h-5">
          Open Positions
        </h2>
      </div>

      <section className="w-full max-w-6xl mb-8 px-4 md:px-0">
        <JobList jobs={jobsWithEmployer} />
      </section>
    </>
  );
}
