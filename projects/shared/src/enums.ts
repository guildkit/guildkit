export const userTypes = [
  "administrative",
  "recruiter",
  "candidate",
] as const;

export type UserType = typeof userTypes[number];

export const salaryPer = [
  "year",
  "month",
  "day",
  "hour",
] as const;

export type SalaryPer = typeof salaryPer[number];
