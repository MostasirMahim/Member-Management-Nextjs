"use client";
import type React from "react";
import Link from "next/link";
import { CircleUser, LogOut, Maximize, Menu, Minimize } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ThemeToggle from "./ThemeToggle";
import { useState } from "react";

interface NavbarProps {
  userData: {
    username?: string;
  };
  onLogout: () => void;
  onMenuClick?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ userData, onLogout, onMenuClick }) => {
  const [isFullScreen, setIsFullScreen] = useState(false);

  const toggleFullScreen = async () => {
    if (!isFullScreen) {
      await document.documentElement.requestFullscreen();
      setIsFullScreen(true);
    } else {
      await document.exitFullscreen();
      setIsFullScreen(false);
    }
  };
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background/80 backdrop-blur-md px-4 sm:px-6 shadow-sm">
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden hover:bg-accent hover:text-accent-foreground transition-colors"
        onClick={onMenuClick}
      >
        <Menu className="h-6 w-6" />
        <span className="sr-only">Toggle menu</span>
      </Button>
      <div className="flex-1" />
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleFullScreen}
          className="hover:bg-accent hover:text-accent-foreground transition-colors relative"
        >
          {isFullScreen ? (
            <Minimize className="h-5 w-5" />
          ) : (
            <Maximize className="h-5 w-5" />
          )}
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="h-9 w-9 rounded-full border-border hover:bg-accent hover:text-accent-foreground hover:border-accent-foreground/20 transition-all duration-200 bg-transparent"
            >
              <CircleUser className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56 bg-popover border-border shadow-lg"
          >
            <DropdownMenuLabel className="text-popover-foreground">
              {userData?.username || "My account"}
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-border" />
            <DropdownMenuItem className="hover:bg-accent hover:text-accent-foreground transition-colors">
              <Link href={`/reset-password`} className="flex w-full">
                Reset Password
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-accent hover:text-accent-foreground transition-colors">
              <Link href={`/settings`} className="flex w-full">
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-border" />
            <DropdownMenuItem className="text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors">
              <Button
                onClick={onLogout}
                className="flex w-full justify-start p-0 h-auto bg-transparent hover:bg-transparent text-inherit shadow-none"
                variant="ghost"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Log Out
              </Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Navbar;
