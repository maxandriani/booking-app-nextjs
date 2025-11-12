"use client";

import { ThemeProvider } from "next-themes";

export type AppThemeProviderProps = React.ComponentProps<typeof ThemeProvider> & React.PropsWithChildren

export default function AppThemeProvider({ children, ...props }: AppThemeProviderProps) {
  return <ThemeProvider {...props}>{children}</ThemeProvider>;
}