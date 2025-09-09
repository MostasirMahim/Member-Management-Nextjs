import React, { createContext, useContext, useState } from "react";

type SidebarState = {
  openKeys: string[];
  setOpenKeys: (keys: string[]) => void;
};

const SidebarContext = createContext<SidebarState | undefined>(undefined);

export const SidebarProvider = ({ children }: { children: React.ReactNode }) => {
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  return (
    <SidebarContext.Provider value={{ openKeys, setOpenKeys }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => {
  const ctx = useContext(SidebarContext);
  if (!ctx) throw new Error("useSidebar must be used within SidebarProvider");
  return ctx;
};