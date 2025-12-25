// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import "./app.css";
// import { Inter } from "next/font/google";

// const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Samsara Smart Watch",
  description: "Premium smart watches with style and tech",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={"inter.className"}>{children}</body>
    </html>
  );
}
