import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mail Maker - HTML 이메일 빌더",
  description: "운영팀을 위한 HTML 이메일 빌더",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">{children}</body>
    </html>
  );
}
