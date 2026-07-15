import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ContextSOP | From incident noise to reliable action",
  description: "Transform operational transcripts into safe, interactive runbooks.",
  openGraph: { title: "ContextSOP", description: "Living runbooks for incident response." },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
