import { exit } from "node:process";
import dayjs from "dayjs";
import { db } from "../src/lib/db/db.ts";
import { job } from "../src/lib/db/schema/job.ts";
import { organization } from "../src/lib/db/schema/better-auth.ts";
import { insertUsers, type UserWithProps } from "../src/lib/db/helpers.ts";
import type { InferInsertModel } from "drizzle-orm";

const candidates: UserWithProps[] = [
  {
    id: "heizou",
    name: "Heizou Shikanoin",
    email: "heizou9876@yaemail.example.net",
    emailVerified: true,
    role: "none",
    props: {
      type: "candidate",
    },
  },
  {
    id: "shinobu",
    name: "Shinobu Kuki",
    email: "kuki@yaemail.example.net",
    emailVerified: true,
    role: "none",
    props: {
      type: "candidate",
    },
  },
  {
    id: "kazuha",
    name: "Kazuha Kaedehara",
    email: "kazuha.kaedehara@yaemail.example.net",
    emailVerified: true,
    role: "none",
    props: {
      type: "candidate",
    },
  },
];

const recruiterYae = {
  id: "yae",
  name: "Miko Yae",
  email: "miko.yae@yaedo.example.co.jp",
  emailVerified: true,
  role: "recruiter",
  props: {
    type: "recruiter",
  },
} as const satisfies UserWithProps;
const recruiterRaiden = {
  id: "ei",
  name: "Ei Raiden",
  email: "ei.raiden@shogunate.example.go.jp",
  emailVerified: true,
  role: "recruiter",
  props: {
    type: "recruiter",
  },
} as const satisfies UserWithProps;
const recruiterHiiragi = {
  id: "chisato",
  name: "Chisato Hiiragi",
  email: "chisato.hiiragi@shogunate.example.go.jp",
  emailVerified: true,
  role: "recruiter",
  props: {
    type: "recruiter",
  },
} as const satisfies UserWithProps;
const recruiterZhongli = {
  id: "zhongli",
  name: "Zhongli",
  email: "zhongli@wangsheng.example.com",
  emailVerified: true,
  role: "recruiter",
  props: {
    type: "recruiter",
  },
} as const satisfies UserWithProps;

type InitialOrg = InferInsertModel<typeof organization> & {
  recruiters: UserWithProps[];
};

const initialOrgYaedo: InitialOrg = {
  id: "yph",
  slug: "yaedo",
  name: "Yae Publishing House, K.K.",
  about: "Yae Publishing House is a leading light novel publisher from Inazuma. We also provide digital platforms to deliver the light novels and the other books to the global audience all over the Teyvat.",
  url: "https://yaedo.example.co.jp",
  addresses: [ "2-14-3, Hanamizaka, Inazuma City, Narukami Island, Inazuma" ],
  emails: [ "hr@yaedo.example.co.jp" ],
  currencies: [ "JPY" ],
  createdAt: new Date(),
  recruiters: [ recruiterYae ],
};

const initialOrgShogunate: InitialOrg = {
  id: "kanjou",
  slug: "kanjou",
  name: "Kanjou Commission, The Shogunate of Inazuma",
  about: "Kanjou Commission is a part of the Tri-Commission, The Shogunate of Inazuma. We are responsible for the Shogunate's financial and international affairs.",
  url: "https://shogunate.example.go.jp",
  addresses: [
    "The Inazuma Castle, 1-1-1, Inazuma City, Narukami Island, Inazuma",
    "Tenryou Commission Office, 1-2-5, Inazuma City, Narukami Island, Inazuma",
    "The Hiiragi Estate, 5-1-1, Rito, Narukami Island, Inazuma",
  ],
  emails: [ "personnel@kanjou.example.go.jp" ],
  currencies: [ "JPY" ],
  createdAt: new Date(),
  recruiters: [ recruiterRaiden, recruiterHiiragi ],
};

const initialOrgWangsheng: InitialOrg = {
  id: "wangsheng",
  slug: "wangsheng",
  name: "Wangsheng Funeral Parlor",
  url: "https://wangsheng.example.com",
  addresses: [
    "123456 Feiyun Slope, Liyue Harbor, Liyue",
  ],
  emails: [ "hutao@wangsheng.example.com" ],
  currencies: [ "CNY" ],
  createdAt: new Date(),
  recruiters: [ recruiterZhongli ],
  // Lazy Hu Tao didn't write `about` ― to test layout when about is not written.
};

const initialJobs: InferInsertModel<typeof job>[] = [
  {
    title: "[WFH] TypeScript Developer for our ebook store (Svelte / Hono / React Native)",
    description: `
      We are hiring a software developer for our ebook store. Your will be responsibile for one or some of the frontend, backend, and mobile app development.

      # Responsibilities

      You will be responsible for the one or more of the followings:

      - Web frontend development for our ebook store (Svelte)
      - Backend development for our ebook store (Hono + Cloudflare Workers)
      - Mobile app development for our ebook store (React Native)
      ...
    `.trim(),
    requirements: `
      # Required

      - One year or more experience in TypeScript development
      - Two years or more experience in JavaScript or altJS (e.g. TypeScript, Elm, CoffeeScript)
      - One year or more experience in one of the followings:
        - Svelte, React, Vue.js, Angular, or any other component-oriented frontend framework(s)
        - Node.js, Cloudflare Workers, or any other backend JavaScript/TypeScript framework(s)/platform(s)
        - React Native or any other mobile JavaScript/TypeScript framework(s)
    `.trim(),
    applicationUrl: "https://phanective.org/job-example-1",
    location: "Remote (any location in Inazuma)",
    salary: 8000000,
    currency: "JPY",
    salaryPer: "YEAR",
    expiresAt: dayjs().add(1, "month").toDate(),
    employer: initialOrgYaedo.id,
  },
  {
    title: "[WFH] SRE for our ebook store",
    description: `
      We are hiring an SRE for our ebook store.

      # Responsibilities

      You will be responsible for the infrastructure administration and the site reliability engineering for our online ebook store.
      ...
    `.trim(),
    requirements: `
      # Required

      - Two year or more experience as an SRE or an infrastructure engineer.
      - One year or more experience in the production Docker server administration
      - One year or more experience in Infrastructure as Code tools such as Terraform and Ansible

      # Nice to have

      - Experience in Node.js server administration
    `.trim(),
    applicationUrl: "https://phanective.org/job-example-2",
    location: "Remote (any location in Inazuma)",
    salary: 8000000,
    currency: "JPY",
    salaryPer: "YEAR",
    expiresAt: dayjs().add(1, "month").toDate(),
    employer: initialOrgYaedo.id,
  },
  {
    title: "[WFH] Marketing lead",
    description: `
      We are hiring a marketing lead for our ebook store.

      # Responsibilities

      - Marketing for our ebook store
      - Marketers management
      ...
    `.trim(),
    requirements: `
      # Required

      - Two year or more experience as a digital marketer in B2C field

      # Nice to have

      - Basic understandings for HTML
    `.trim(),
    applicationUrl: "https://phanective.org/job-example-3",
    location: "Remote (any location in Inazuma)",
    salary: 8000000,
    currency: "JPY",
    salaryPer: "YEAR",
    expiresAt: dayjs().add(1, "month").toDate(),
    employer: initialOrgYaedo.id,
  },
  {
    title: "Corporate Engineer",
    description: `
      We are hiring a software engineer for the Shogunate's internal systems.

      # Responsibilities

      - Development for the Shogunate's internal accounting systems (The Kanjou-kei)
      - Vendor management for the Shogunate's internal accounting systems (The Kanjou-kei)
      ...
    `.trim(),
    requirements: `
      # Required

      - Two or more experience in Java

      # Nice to have

      - Experience in vendor management
    `.trim(),
    applicationUrl: "https://phanective.org/job-example-4",
    location: "The Hiiragi Estate, 4-1-1, Rito, Narukami Island, Inazuma",
    salary: 9000000,
    currency: "JPY",
    salaryPer: "YEAR",
    expiresAt: dayjs().add(1, "month").toDate(),
    employer: initialOrgShogunate.id,
  },
  {
    title: "Web designer",
    description: `
      We are hiring a web designer to promote Wangsheng Funeral Parlor.

      # Responsibilities

      - Create and maintain our websites
      ...
    `.trim(),
    requirements: `
      # Required

      - Two or more experience in web design
      - Two or more experience in HTML and CSS

      # Nice to have

      - Experience in JavaScript
      - Experience in SEO
      - Interest in the tradition of funerary practices in Liyue
    `.trim(),
    applicationUrl: "https://phanective.org/job-example-4",
    location: "123456 Feiyun Slope, Liyue Harbor, Liyue",
    salary: 4500000,
    currency: "CNY",
    salaryPer: "YEAR",
    expiresAt: dayjs().add(1, "month").toDate(),
    employer: initialOrgWangsheng.id,
  },
];

const userExists = Boolean(await db.query.user.findFirst());
const jobExists = Boolean(await db.query.job.findFirst());
const alreadySeeded = userExists || jobExists;

if (alreadySeeded) {
  console.info("The data already exists in the database. Skip seeding.");
  exit(0);
}

// Allow N+1 problems for the readability
await db.transaction(async (tx) => {
  await insertUsers(candidates);

  for (const org of [ initialOrgYaedo, initialOrgShogunate, initialOrgWangsheng ]) {
    await tx.insert(organization).values({
      ...org,
    });
  }

  await insertUsers([
    ...initialOrgYaedo.recruiters.map((recruiter) => ({
      ...recruiter,
      recruitsFor: [ initialOrgYaedo.id ],
    })),
    ...initialOrgShogunate.recruiters.map((recruiter) => ({
      ...recruiter,
      recruitsFor: [ initialOrgShogunate.id ],
    })),
    ...initialOrgWangsheng.recruiters.map((recruiter) => ({
      ...recruiter,
      recruitsFor: [ initialOrgWangsheng.id ],
    })),
  ]);
});

await db.insert(job).values(initialJobs);
