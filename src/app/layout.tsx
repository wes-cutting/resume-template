import type { Metadata } from "next";
import type { ReactNode } from "react";
import "../styles/globals.css";
import "../styles/print.css";

export const metadata: Metadata = {
  title: "Resume",
  description: "Personal resume website",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-neutral-900 antialiased">{children}</body>
    </html>
  );
}
