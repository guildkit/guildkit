import Image from "next/image";
import { notFound } from "next/navigation";
import { Link } from "@/components/generic/ButtonLink.tsx";
import { db } from "@/lib/db/db.ts";
import type { ReactElement } from "react";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function JobPage({ params }: Props): Promise<ReactElement> {
  const { id: jobId } = await params;

  const job = await db.query.job.findFirst({
    columns: {
      id: true,
      title: true,
      description: true,
      location: true,
      salary: true,
      salaryPer: true,
      currency: true,
      applicationUrl: true,
      createdAt: true,
      updatedAt: true,
    },
    with: {
      employer: {
        columns: {
          slug: true,
          name: true,
        },
      },
    },
    where: (job, { eq }) => eq(job.id, jobId),
    orderBy: (job, { desc }) => [ desc(job.updatedAt) ],
  });

  if (!job) {
    notFound();
  }

  return (
    <div className="w-full max-w-4xl px-9">
      <h1 className="text-3xl font-black text-gray-900 mb-2">{job.title}</h1>
      <Link
        href={`/orgs/${ job.employer.slug }`}
        className="inline-flex items-center gap-2 mb-3 text-lg text-gray-900 font-bold"
      >
        <Image
          src="/vendor/octicons/organization.svg"
          alt="Employer"
          title="Employer"
          width={18}
          height={18}
        />
        {job.employer.name}
      </Link>
      <div className="mb-6">
        <span className="inline-flex items-center gap-1.5 mr-2 py-2 px-4 text-sm font-medium text-gray-800 bg-gray-200 rounded-full">
          <Image src="/vendor/octicons/location.svg" alt="" width={16} height={16} />
          Work location: {job.location}
        </span>
        <span className="inline-flex items-center gap-1.5 mr-2 py-2 px-4 text-sm font-medium text-gray-800 bg-green-200 rounded-full">
          <Image src="/vendor/tabler/coins.svg" alt="" width={16} height={16} />
          {/* TODO Use user's locale in `toLocaleString()` */}
          Salary: {job.salary.toLocaleString("en-US")} {job.currency}/{job.salaryPer}
        </span>
      </div>
      <div className="inline-flex items-center gap-1.5 justify-end w-full mb-6 text-sm">
        <Image src="/vendor/octicons/clock.svg" alt="" width={16} height={16} />
        {/* TODO Use user's locale in `toLocaleString()` */}
        Last updated at {(job.updatedAt ?? job.createdAt).toLocaleDateString("en-US")}
      </div>

      <section className="mb-5">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Description</h3>
        <p>
          {job.description}
        </p>
      </section>

      <section className="mt-8">
        <Link
          href={job.applicationUrl}
          theme="button-deep"
          className="px-6 py-3 font-semibold rounded-lg"
          prefetch
        >
          Apply
        </Link>
      </section>
    </div>
  );
}
