"use client";

import type React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";

import {
  LayoutDashboard,
  Users,
  FileText,
  FolderOpen,
  Clock,
  LogOut,
  Menu,
  Bell,
  ChevronDown,
  ChevronRight,
  UserCheck,
  UserX,
  Plus,
  Eye,
  Edit,
  Logs,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import { ScrollArea } from "@/components/ui/scroll-area";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { currentUser } from "@/lib/dummy";
import ModeToggle from "./ThemeToggle";
import { cn } from "@/lib/utils";
import { logoutAction } from "@/actions/authentication/actions";
import { LoadingDots } from "./ui/loading";
import { toast } from "@/hooks/use-toast";

const navigation = [
  {
    icon: <LayoutDashboard className="h-5 w-5" />,
    label: "Dashboard",
    href: "/",
  },
  {
    icon: <Users className="h-5 w-5" />,
    label: "MemberSphere",
    href: "",
    subItems: [
      {
        icon: <UserCheck className="h-4 w-4" />,
        label: "Pending Members",
        href: "/members/pending",
      },
      {
        icon: <Plus className="h-4 w-4" />,
        label: "Add Member",
        href: "/members/add",
      },
      {
        icon: <UserX className="h-4 w-4" />,
        label: "View Members",
        href: "/members/view",
      },
    ],
  },
  {
    icon: <FileText className="h-5 w-5" />,
    label: "Pulse360",
    href: "",
    subItems: [
      {
        icon: <Eye className="h-4 w-4" />,
        label: "View Dues",
        href: "/dues/view",
      },
      {
        icon: <Edit className="h-4 w-4" />,
        label: "Viwes",
        href: "/dues/view",
      },
    ],
  },
  {
    icon: <Clock className="h-5 w-5" />,
    label: "Elevated",
    href: "",
    badge: 5,
    subItems: [
      {
        icon: <Eye className="h-4 w-4" />,
        label: "Upload Payment",
        href: "/payments/upload",
      },
      {
        icon: <Edit className="h-4 w-4" />,
        label: "View Payments",
        href: "/payments/view",
      },
    ],
  },
  {
    icon: <FolderOpen className="h-5 w-5" />,
    label: "Attendance",
    href: "",
    subItems: [
      {
        icon: <Eye className="h-4 w-4" />,
        label: "Upload Attendance",
        href: "/attendance/upload",
      },
      {
        icon: <Plus className="h-4 w-4" />,
        label: "View Attendance",
        href: "/attendance/view",
      },
    ],
  },
  {
    icon: <FolderOpen className="h-5 w-5" />,
    label: "Email",
    href: "",
    subItems: [
      {
        icon: <Eye className="h-4 w-4" />,
        label: "Send Email",
        href: "/email/send",
      },
      {
        icon: <Plus className="h-4 w-4" />,
        label: "View Emails",
        href: "/email/view",
      },
    ],
  },
  {
    icon: <Users className="h-5 w-5" />,
    label: "All Users",
    href: "/users",
  },
  {
    icon: <Users className="h-5 w-5" />,
    label: "All Groups",
    href: "/groups",
  },
  {
    icon: <Users className="h-5 w-5" />,
    label: "Add Choices",
    href: "/choices",
  },
  {
    icon: <Users className="h-5 w-5" />,
    label: "Onboarding",
    href: "/registration/email",
  },
  {
    icon: <Logs className="h-5 w-5" />,
    label: "Activity Logs",
    href: "/activity_logs",
  },
  {
    icon: <Logs className="h-5 w-5" />,
    label: "My activity logs",
    href: "/activity_logs/my",
  },
];

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  active?: boolean;
  badge?: number;
  subItems?: Array<{
    icon: React.ReactNode;
    label: string;
    href: string;
  }>;
}

const NavItem = ({
  icon,
  label,
  href,
  active,
  badge,
  subItems,
}: NavItemProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Check if any sub-item is active
  const hasActiveSubItem = subItems?.some(
    (subItem) => pathname === subItem.href
  );
  const isParentActive = active || hasActiveSubItem;

  if (subItems && subItems.length > 0) {
    return (
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start gap-3 h-10 px-3",
              isParentActive && "bg-accent text-accent-foreground"
            )}
          >
            {icon}
            <span className="flex-1 text-left">{label}</span>
            {badge && (
              <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
                {badge}
              </span>
            )}
            {isOpen ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-1">
          <div className="ml-6 space-y-1">
            {subItems.map((subItem) => (
              <Link key={subItem.href} href={subItem.href}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start gap-3 h-9 px-3 text-sm",
                    pathname === subItem.href &&
                      "bg-accent text-accent-foreground"
                  )}
                >
                  {subItem.icon}
                  <span>{subItem.label}</span>
                </Button>
              </Link>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    );
  }

  return (
    <Link href={href}>
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start gap-3 h-10 px-3",
          active && "bg-accent text-accent-foreground"
        )}
      >
        {icon}
        <span className="flex-1 text-left">{label}</span>
        {badge && (
          <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
            {badge}
          </span>
        )}
      </Button>
    </Link>
  );
};

function AdminDashboard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutate: logOutFunc, isPending } = useMutation({
    mutationFn: async () => {
      const res = await logoutAction();
      return res;
    },
    onSuccess: (data) => {
      if (data.status === "success") {
        toast({
          title: data.details || "Logged Out",
          description: data.message || "You have been logged out successfully.",
          variant: "default",
        });
        queryClient.invalidateQueries({ queryKey: ["authUser"] });
        router.replace("/login");
      } else {
        const { message, errors, details } = data?.response.data;
        if (errors) {
          const allErrors = Object.values(errors).flat().join("\n");
          toast({
            title: "Logout Failed",
            description: allErrors,
            variant: "destructive",
          });
        } else {
          toast({
            title: details || "Logout Failed",
            description: message || "An error occurred during logout.",
            variant: "destructive",
          });
        }
      }
    },
    onError: (error: any) => {
      console.error("Error in Logout:", error);
      toast({
        title: "Logout Failed",
        description: error?.message || "An error occurred during logout.",
        variant: "destructive",
      });
    },
  });

  const USER = currentUser;

  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const Sidebar = () => (
    <div className="flex flex-col h-full font-primary">
      <div className="p-4">
        <div className="flex items-center justify-center">
          <img
            src="/assets/logo.png"
            alt=""
            className="object-contain rounded-full h-[120px] w-[120px]"
          />
        </div>
      </div>

      <ScrollArea className="flex-1 px-3">
        <nav className="space-y-1">
          {navigation.map((item) => (
            <NavItem
              key={item.label}
              icon={item.icon}
              label={item.label}
              href={item.href}
              active={pathname === item.href}
              badge={item.badge}
              subItems={item.subItems}
            />
          ))}
        </nav>
      </ScrollArea>
    </div>
  );

  if (isPending) return <LoadingDots />;
  return (
    <div className="min-h-screen flex bg-muted/30">
      <aside className="hidden lg:block w-64 border-r bg-background h-screen sticky top-0">
        <Sidebar />
      </aside>

      <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
        <SheetContent side="left" className="p-0 w-64">
          <SheetHeader>
            <SheetTitle></SheetTitle>
            <SheetDescription></SheetDescription>
          </SheetHeader>
          <Sidebar />
        </SheetContent>
      </Sheet>

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 sm:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setIsMobileOpen(true)}
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle menu</span>
          </Button>
          <div className="flex-1" />
          <div className="flex items-center gap-4">
            <ModeToggle />
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={USER?.avatar || "/user.png"}
                      alt={USER?.name}
                    />
                    <AvatarFallback>{USER?.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link href={`/reset-password`} className="flex w-full">
                    Reset Password
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">
                  <Button onClick={() => logOutFunc()} className="flex w-full">
                    <LogOut className="h-4 w-4 mr-1" />
                    Log Out
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8 ">
          {children}
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;
