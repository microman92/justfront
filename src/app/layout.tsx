import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Михаил Кудрицкий — Frontend-разработчик в Ташкенте | JustFront",
  description: "Frontend-разработка сайтов и веб-приложений на React, Next.js, Vue и Nuxt. AI-интеграции и автоматизация бизнеса. Михаил Кудрицкий, преподаватель PROWEB, Ташкент и удалённо.",
  keywords: [
    "frontend-разработчик Ташкент",
    "разработка сайтов Ташкент",
    "React разработчик",
    "Next.js разработчик",
    "разработка веб-приложений",
    "AI-интеграции для бизнеса",
    "автоматизация бизнеса с ИИ",
    "Михаил Кудрицкий frontend",
  ],
  icons: { icon: "/sites/mk-studio/brand/favicon.svg" },
  openGraph: {
    title: "Михаил Кудрицкий — Frontend-разработчик | JustFront",
    description: "Разработка сайтов, веб-приложений и AI-интеграций в Ташкенте и удалённо. Преподаватель PROWEB.",
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
