import "@/lib/styles/globals.css";
import config from "../../../../guildkit.config.ts";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: config.siteName,
  // TODO Make this modifiable
  description: "A toolkit for building job search services",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode; }>) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <link rel="icon" href="https://brand.guildkit.net/generated/logo-light.svg" />
        <meta name="viewport" content="width=device-width" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
