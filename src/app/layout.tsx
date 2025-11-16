import type { Metadata } from "next";
import "./globals.css";
import AppThemeProvider from "@/components/layout/app-theme-provider";
import { Toaster } from "sonner";
import { ViewTransition } from "react";

export const metadata: Metadata = {
  title: "Controle de reservas",
  description: "Controle de reservas de temporada.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body>
        <ViewTransition name="app-layout" enter="slide-in">
          <AppThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
          >
            {children}
          </AppThemeProvider>
        </ViewTransition>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
