import "./globals.css";
import type { Metadata } from "next";
import { IBM_Plex_Sans, Space_Grotesk } from "next/font/google";
import Sidebar from "@/components/Sidebar";
import AuthGate from "@/components/AuthGate";

const bodyFont = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"]
});

const displayFont = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display"
});

export const metadata: Metadata = {
  title: "IT Career Transition Dashboard",
  description: "Track progress during a transition into the IT industry."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={displayFont.variable}>
      <body className={bodyFont.className}>
        <div className="min-h-screen grid grid-cols-[260px_1fr]">
          <Sidebar />
          <main className="px-10 py-10">
            <AuthGate>{children}</AuthGate>
          </main>
        </div>
      </body>
    </html>
  );
}
