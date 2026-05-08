import type { Metadata } from "next";
import "@/app/globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: {
    template: "%s | GuildKit",
    default: "GuildKit – Find Your Next Opportunity",
  },
  description:
    "GuildKit is a job platform where companies post jobs and talent finds opportunities.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased">
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
