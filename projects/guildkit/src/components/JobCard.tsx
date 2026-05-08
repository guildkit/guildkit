import Link from "next/link";

type JobCardProps = {
  job: {
    id: string;
    title: string;
    location: string | null;
    remote: boolean;
    type: string;
    salaryMin: number | null;
    salaryMax: number | null;
    createdAt: Date;
    company: {
      name: string;
    };
  };
};

const JOB_TYPE_LABELS: Record<string, string> = {
  FULL_TIME: "Full-time",
  PART_TIME: "Part-time",
  CONTRACT: "Contract",
  FREELANCE: "Freelance",
  INTERNSHIP: "Internship",
};

export default function JobCard({ job }: JobCardProps) {
  const salary
    = job.salaryMin && job.salaryMax
      ? `$${ job.salaryMin.toLocaleString() } – $${ job.salaryMax.toLocaleString() }`
      : null;

  const location = job.remote ? "Remote" : (job.location ?? "Location not specified");

  return (
    <Link href={`/jobs/${ job.id }`}>
      <article className="rounded-lg border border-gray-200 bg-white p-6 hover:border-blue-300 hover:shadow-md transition-all h-full flex flex-col">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600">
            {job.title}
          </h3>
          <p className="mt-1 text-sm text-gray-600">{job.company.name}</p>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
            {JOB_TYPE_LABELS[job.type] ?? job.type}
          </span>
          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
            {location}
          </span>
          {salary && (
            <span className="rounded-full bg-green-50 px-3 py-1 text-xs text-green-700">
              {salary}
            </span>
          )}
        </div>

        <p className="mt-3 text-xs text-gray-400">
          Posted{" "}
          {new Date(job.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </p>
      </article>
    </Link>
  );
}
