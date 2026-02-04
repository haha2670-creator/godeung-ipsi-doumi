import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "🎓 고등 입시 도우미",
  description: "목표 대학 기반 맞춤 입시 로드맵, 내신 계산기, 모의고사 성적 관리, 생기부 관리 노트, AI 세특 생성",
  openGraph: {
    title: "🎓 고등 입시 도우미",
    description: "목표 대학 기반 맞춤 입시 로드맵, 내신 계산기, 모의고사 성적 관리, 생기부 관리 노트, AI 세특 생성",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "고등 입시 도우미",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "🎓 고등 입시 도우미",
    description: "목표 대학 기반 맞춤 입시 로드맵, 내신 계산기, 모의고사 성적 관리, 생기부 관리 노트, AI 세특 생성",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-gradient-to-br from-primary-500 to-secondary-500">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
