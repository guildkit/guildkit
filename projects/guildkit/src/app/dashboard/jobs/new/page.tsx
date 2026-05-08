"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createCompany, getMyCompanies } from "@/actions/companies";
import { createJob } from "@/actions/jobs";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Post a Job" };

type Company = {
  id: string;
  name: string;
  _count: { jobs: number; };
};

const JOB_TYPES = [
  { value: "FULL_TIME", label: "Full-time" },
  { value: "PART_TIME", label: "Part-time" },
  { value: "CONTRACT", label: "Contract" },
  { value: "FREELANCE", label: "Freelance" },
  { value: "INTERNSHIP", label: "Internship" },
] as const;

export default function NewJobPage() {
  const router = useRouter();

  const [ companies, setCompanies ] = useState<Company[]>([]);
  const [ isLoadingCompanies, setIsLoadingCompanies ] = useState(true);
  const [ showNewCompany, setShowNewCompany ] = useState(false);
  const [ newCompanyName, setNewCompanyName ] = useState("");
  const [ isSubmitting, setIsSubmitting ] = useState(false);
  const [ error, setError ] = useState("");

  const [ form, setForm ] = useState({
    title: "",
    description: "",
    requirements: "",
    location: "",
    remote: false,
    salaryMin: "",
    salaryMax: "",
    type: "FULL_TIME" as (typeof JOB_TYPES)[number]["value"],
    companyId: "",
  });

  useEffect(() => {
    async function loadCompanies() {
      const data = await getMyCompanies();
      setCompanies(data);
      if (data.length > 0) {
        setForm((prev) => ({ ...prev, companyId: data[0]!.id }));
      } else {
        setShowNewCompany(true);
      }
      setIsLoadingCompanies(false);
    }
    void loadCompanies();
  }, []);

  const set = <K extends keyof typeof form>(key: K, val: (typeof form)[K]) =>
    setForm((prev) => ({ ...prev, [key]: val }));

  const handleAddCompany = async () => {
    if (!newCompanyName.trim()) {
      return;
    }
    try {
      const company = await createCompany({ name: newCompanyName.trim() });
      const enriched = { ...company, _count: { jobs: 0 }};
      setCompanies((prev) => [ ...prev, enriched ]);
      set("companyId", company.id);
      setShowNewCompany(false);
      setNewCompanyName("");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create company.",
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    try {
      await createJob({
        title: form.title,
        description: form.description,
        requirements: form.requirements || undefined,
        location: form.location || undefined,
        remote: form.remote,
        salaryMin: form.salaryMin ? Number(form.salaryMin) : undefined,
        salaryMax: form.salaryMax ? Number(form.salaryMax) : undefined,
        type: form.type,
        companyId: form.companyId,
      });
      router.push("/dashboard/jobs");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create job.");
      setIsSubmitting(false);
    }
  };

  if (isLoadingCompanies) {
    return <p className="text-gray-500">Loading…</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Post a New Job</h1>

      <form
        onSubmit={(e) => {
          void handleSubmit(e);
        }}
        className="space-y-6 max-w-2xl"
      >
        {/* Company */}
        <div>
          <label
            htmlFor="companyId"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Company
          </label>
          {companies.length > 0 && (
            <select
              id="companyId"
              value={form.companyId}
              onChange={(e) => set("companyId", e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm"
            >
              {companies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          )}

          {showNewCompany ? (
            <div className="mt-2 flex gap-2">
              <input
                id="newCompanyName"
                type="text"
                value={newCompanyName}
                onChange={(e) => setNewCompanyName(e.target.value)}
                placeholder="Company name"
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm"
              />
              <button
                type="button"
                onClick={() => {
                  void handleAddCompany();
                }}
                className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
              >
                Add
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowNewCompany(true)}
              className="mt-2 text-sm text-blue-600 hover:text-blue-800"
            >
              + Add a new company
            </button>
          )}
        </div>

        {/* Title */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Job Title <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            type="text"
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
            required
            placeholder="e.g. Senior Software Engineer"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm"
          />
        </div>

        {/* Job Type */}
        <div>
          <label
            htmlFor="jobType"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Employment Type
          </label>
          <select
            id="jobType"
            value={form.type}
            onChange={(e) =>
              set("type", e.target.value as (typeof JOB_TYPES)[number]["value"])}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm"
          >
            {JOB_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        {/* Location */}
        <div>
          <label
            htmlFor="location"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Location
          </label>
          <div className="flex items-center gap-4">
            <input
              id="location"
              type="text"
              value={form.location}
              onChange={(e) => set("location", e.target.value)}
              placeholder="e.g. San Francisco, CA"
              disabled={form.remote}
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm disabled:bg-gray-50 disabled:text-gray-400"
            />
            <label
              htmlFor="remote"
              className="flex items-center gap-2 text-sm text-gray-700 shrink-0"
            >
              <input
                id="remote"
                type="checkbox"
                checked={form.remote}
                onChange={(e) => set("remote", e.target.checked)}
                className="rounded"
              />
              Remote
            </label>
          </div>
        </div>

        {/* Salary */}
        <div>
          <label
            htmlFor="salaryMin"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Salary Range (USD / year, optional)
          </label>
          <div className="flex items-center gap-3">
            <input
              id="salaryMin"
              type="number"
              value={form.salaryMin}
              onChange={(e) => set("salaryMin", e.target.value)}
              placeholder="Min"
              min={0}
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm"
            />
            <span className="text-gray-400">–</span>
            <input
              id="salaryMax"
              type="number"
              value={form.salaryMax}
              onChange={(e) => set("salaryMax", e.target.value)}
              placeholder="Max"
              min={0}
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Job Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            required
            rows={6}
            placeholder="Describe the role, responsibilities, and what makes it great…"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm"
          />
        </div>

        {/* Requirements */}
        <div>
          <label
            htmlFor="requirements"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Requirements (optional)
          </label>
          <textarea
            id="requirements"
            value={form.requirements}
            onChange={(e) => set("requirements", e.target.value)}
            rows={4}
            placeholder="List the skills, experience, and qualifications needed…"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={isSubmitting || !form.companyId}
            className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {isSubmitting ? "Saving…" : "Save as Draft"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-lg border border-gray-300 px-6 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
