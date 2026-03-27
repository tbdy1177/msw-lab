import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata: Metadata = {
  title: "말싸움 연구소",
  description: "AI와 함께 말하는 힘을 키우세요 — 뒤돌아서 후회하지 말자",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
