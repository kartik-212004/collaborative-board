import type { Metadata } from "next";

import { ThemeProvider } from "@/modules/theme-provider";

import "./globals.css";

export const metadata: Metadata = {
  title: "CollabDraw",
  description: "Real-time collaborative drawing board",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
