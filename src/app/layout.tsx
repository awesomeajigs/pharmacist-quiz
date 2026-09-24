import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";

export const metadata: Metadata = {
  title: "What Kind of Pharmacist Are You?",
  description:
    "10 quick questions. One honest answer about how you show up at work. Take the World Pharmacist Day quiz.",
  openGraph: {
    title: "What Kind of Pharmacist Are You?",
    description:
      "10 quick questions. One honest answer about how you show up at work.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${GeistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-bg text-ink">
        <div className="mx-auto flex w-full max-w-[480px] flex-1 flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
