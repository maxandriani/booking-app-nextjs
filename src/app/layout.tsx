import type { Metadata } from "next";
import "./globals.css";
import AppThemeProvider from "@/components/layout/app-theme-provider";
import { AuthenticationProvider } from "@/hooks/use-authentication";

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
        <AuthenticationProvider>
          <AppThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
          >
            {children}
          </AppThemeProvider>
        </AuthenticationProvider>
      </body>
    </html>
  );
}
