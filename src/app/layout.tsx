import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Веб-разработчик в Ташкенте — Михаил Кудрицкий | JustFront",
  description: "Сайты и веб-приложения на React, Next.js, Vue и Nuxt. AI-интеграции для бизнеса. Михаил Кудрицкий, преподаватель PROWEB. Ташкент и удалённо.",
  keywords: [
    "веб-разработчик Ташкент",
    "разработка сайтов Ташкент",
    "frontend-разработчик Ташкент",
    "разработка веб-приложений",
    "React и Next.js разработчик",
    "AI-интеграции для бизнеса",
    "автоматизация бизнес-процессов с ИИ",
    "Михаил Кудрицкий JustFront",
    "преподаватель PROWEB",
  ],
  icons: { icon: "/sites/mk-studio/brand/favicon.svg" },
  openGraph: {
    title: "Веб-разработчик в Ташкенте — Михаил Кудрицкий | JustFront",
    description: "Сайты, веб-приложения и AI-интеграции для бизнеса. Михаил Кудрицкий, преподаватель PROWEB. Ташкент и удалённо.",
    locale: "ru_RU",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
