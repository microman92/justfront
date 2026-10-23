import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://trionn.com"),
  title: "TRIONN | AI-Powered Creative Design & Development Studio",
  description: "Websites, AI products, brands, and systems built for clarity, scale and impact.",
  alternates: { canonical: "/" },
  icons: { icon: "/sites/trionn/brand/blast-icon.svg" },
  openGraph: {
    title: "TRIONN | AI-Powered Creative Design & Development Studio",
    description: "Independent digital studio crafting meaningful brand experiences through strategy, design, and technology.",
    type: "website",
    url: "https://trionn.com/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
