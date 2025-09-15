"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useThemeStore } from "@/store/theme_store";
import { cn } from "@/lib/utils";

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  const { theme } = useThemeStore();
  return (
    <NextThemesProvider {...props}>
      {" "}
      <div className={cn("antialiased", `theme-${theme}`)}>{children}</div>
    </NextThemesProvider>
  );
}
