"use client";

import { useState } from "react";
import { createApplication } from "@/actions/applications";

export default function ApplyButton({ jobId }: { jobId: string; }) {
  const [ showForm, setShowForm ] = useState(false);
  const [ coverLetter, setCoverLetter ] = useState("");
  const [ isSubmitting, setIsSubmitting ] = useState(false);
  const [ applied, setApplied ] = useState(false);
  const [ error, setError ] = useState("");

  if (applied) {
    return (
      <span className="inline-flex items-center rounded-lg bg-green-50 px-5 py-2.5 text-sm font-semibold text-green-700 border border-green-200">
        ✓ Application submitted
      </span>
    );
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    try {
      await createApplication({
        jobId,
        coverLetter: coverLetter.trim() || undefined,
      });
      setApplied(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to submit application.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!showForm) {
    return (
      <button
        onClick={() => setShowForm(true)}
        className="rounded-lg bg-blue-600 px-6 py-2.5 font-semibold text-white hover:bg-blue-700 transition-colors"
      >
        Apply Now
      </button>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        void handleSubmit(e);
      }}
      className="w-full space-y-3"
    >
      <textarea
        value={coverLetter}
        onChange={(e) => setCoverLetter(e.target.value)}
        rows={4}
        placeholder="Cover letter (optional) — tell them why you're a great fit"
        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {isSubmitting ? "Submitting…" : "Submit Application"}
        </button>
        <button
          type="button"
          onClick={() => setShowForm(false)}
          className="rounded-lg border border-gray-300 px-4 text-sm text-gray-600 hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
