import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "หวยลาวพัฒนา Analyzer",
  description: "ระบบวิเคราะห์หวยลาวพัฒนา ด้วยข้อมูลย้อนหลังและการทดสอบโมเดลแบบอัตโนมัติ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="th"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-gray-100">
        <nav className="bg-black text-white px-6 py-4">
          <div className="max-w-7xl mx-auto flex flex-wrap gap-6">
            <Link href="/">🏠 Dashboard</Link>

            <Link href="/statistics">
              📊 Statistics
            </Link>

            <Link href="/tracker">
              🎯 Tracker
            </Link>

            <Link href="/missing">
              ⏳ Missing
            </Link>

            <Link href="/missing-2d">
              🔢 Missing 2D
            </Link>

            <Link href="/model-ranking">
              🏆 Ranking
            </Link>

            <Link href="/admin">
              ⚙️ Admin
            </Link>
          </div>
        </nav>

        <main>{children}</main>
      </body>
    </html>
  );
}