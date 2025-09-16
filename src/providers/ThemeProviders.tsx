"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useThemeStore } from "@/store/theme_store";

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  const { theme } = useThemeStore();

  React.useEffect(() => {
    const body = document.body;
    if (!body) return;
    body.classList.forEach((c) => {
      if (c.startsWith("theme-")) body.classList.remove(c);
    });
    body.classList.add(`theme-${theme}`);
  }, [theme]);
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
