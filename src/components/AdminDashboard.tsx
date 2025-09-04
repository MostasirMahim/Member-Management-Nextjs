"use client";

import type React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";

import {
  LayoutDashboard,
  Users,
  FileText,
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
  Mails,
  MailPlus,
  UserRound,
  BetweenHorizonalStart,
  SquarePen,
  ExternalLink,
  Settings,
  HandPlatter,
  Soup,
  BookCheck,
  ShoppingCart,
  ListTodo,
  Upload,
  PercentCircle,
  Code,
  TicketCheck,
  TicketPlus,
  CirclePlus,
  BadgeDollarSign,
  List,
  Package,
  Wallet,
  CircleDollarSign,
  WalletCards,
  FilePlus,
  CreditCard,
  ListChecks,
  HandCoins,
  FileChartColumn,
  CircleUser,
  History,
  Dumbbell,
  Component,
  TableOfContents,
  Ticket,
  MapPinHouse,
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
import ModeToggle from "./ThemeToggle";
import { cn } from "@/lib/utils";
import { LoadingDots } from "./ui/loading";
import { toast } from "react-toastify";
import axiosInstance from "@/lib/axiosInstance";
import { filterNavigationByPermissions } from "./utils/Navigation_functions";

const navigation_sidebar_links = [
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
      {
        icon: <History className="h-4 w-4" />,
        label: "Transfer History",
        href: "/members/history",
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
    href: "/my-activity-logs",
  },
  ,
  {
    icon: <Mails className="h-5 w-5" />,
    label: "Email management",
    href: "#",
    subItems: [
      {
        icon: <MailPlus className="h-4 w-4" />,
        label: "Configurations",
        href: "/emails/configurations/",
      },
      {
        icon: <UserRound className="h-4 w-4" />,
        label: "Groups",
        href: "/emails/groups/",
      },
      {
        icon: <BetweenHorizonalStart className="h-4 w-4" />,
        label: "Add email to group",
        href: "/emails/add_email/",
      },
      {
        icon: <SquarePen className="h-4 w-4" />,
        label: "Compose email",
        href: "/emails/compose/",
      },
      {
        icon: <ExternalLink className="h-4 w-4" />,
        label: "Outbox",
        href: "/emails/outbox/",
      },
      {
        icon: <Settings className="h-4 w-4" />,
        label: "View all composes",
        href: "/emails/compose/view/",
      },
    ],
  },
  {
    icon: <HandPlatter className="h-5 w-5" />,
    label: "Restaurant management",
    href: "#",
    subItems: [
      {
        icon: <Soup className="h-4 w-4" />,
        label: "Restaurants",
        href: "/restaurants/",
      },
      {
        icon: <BookCheck className="h-4 w-4" />,
        label: "Add restaurants choices",
        href: "/restaurants/choices/",
      },
      {
        icon: <ShoppingCart className="h-4 w-4" />,
        label: "Add restaurant item",
        href: "/restaurants/items/add/",
      },
      {
        icon: <ListTodo className="h-4 w-4" />,
        label: "Add item category",
        href: "/restaurants/items/add/category/",
      },
      {
        icon: <Upload className="h-4 w-4" />,
        label: "Upload restaurant sales",
        href: "/restaurants/sales/upload/",
      },
      {
        icon: <ShoppingCart className="h-4 w-4" />,
        label: "View cart",
        href: "/restaurants/checkout/",
      },
    ],
  },
  {
    icon: <Package className="h-5 w-5" />,
    label: "Products Management",
    href: "#",
    subItems: [
      {
        icon: <Plus className="h-3 w-3" />,
        label: "Add Product",
        href: "/products/add/",
      },
      {
        icon: <Eye className="h-3 w-3" />,
        label: "View Products",
        href: "/products",
      },

      {
        icon: <List className="h-4 w-4" />,
        label: "Categories",
        href: "#",
        subItems: [
          {
            icon: <Plus className="h-3 w-3" />,
            label: "Add Category",
            href: "/products/categories/add/",
          },
          {
            icon: <Eye className="h-3 w-3" />,
            label: "View Categories",
            href: "/products/categories/",
          },
        ],
      },
      {
        icon: <List className="h-4 w-4" />,
        label: "Brands",
        href: "#",
        subItems: [
          {
            icon: <Plus className="h-3 w-3" />,
            label: "Add Brand",
            href: "/products/brands/add/",
          },
          {
            icon: <Eye className="h-3 w-3" />,
            label: "View Brands",
            href: "/products/brands/",
          },
        ],
      },
      {
        icon: <List className="h-4 w-4" />,
        label: "Media",
        href: "#",
        subItems: [
          {
            icon: <Plus className="h-3 w-3" />,
            label: "Add Media",
            href: "/products/media/add/",
          },
          {
            icon: <Eye className="h-3 w-3" />,
            label: "View Media",
            href: "/products/media/",
          },
        ],
      },
      {
        icon: <BadgeDollarSign className="h-4 w-4" />,
        label: "Prices",
        href: "#",
        subItems: [
          {
            icon: <Plus className="h-3 w-3" />,
            label: "Add Product Price",
            href: "/products/prices/add/",
          },
          {
            icon: <Eye className="h-3 w-3" />,
            label: "View Product Price",
            href: "/products/prices/",
          },
        ],
      },
      {
        icon: <ShoppingCart className="h-4 w-4" />,
        label: "Product Buy",
        href: "#",
        subItems: [
          {
            icon: <Plus className="h-3 w-3" />,
            label: "Add Product Cart",
            href: "/products/buy/add/",
          },
          {
            icon: <Eye className="h-3 w-3" />,
            label: "View Product Cart",
            href: "/products/buy/",
          },
        ],
      },
    ],
  },
  {
    icon: <PercentCircle className="h-5 w-5" />,
    label: "Promo code management",
    href: "#",
    subItems: [
      {
        icon: <Code className="h-4 w-4" />,
        label: "View all promo codes",
        href: "/promo_codes/",
      },
      {
        icon: <CirclePlus className="h-4 w-4" />,
        label: "Add promo code",
        href: "/promo_codes/add/",
      },
      {
        icon: <TicketCheck className="h-4 w-4" />,
        label: "promo codes category",
        href: "/promo_codes/categories/",
      },
      {
        icon: <TicketPlus className="h-4 w-4" />,
        label: "Add category",
        href: "/promo_codes/categories/add/",
      },
      {
        icon: <Eye className="h-4 w-4" />,
        label: "View applied promo codes",
        href: "/promo_codes/applied_promo_codes/",
      },
    ],
  },

  {
    icon: <Wallet className="h-5 w-5" />,
    label: "Member financial management",
    href: "#",
    subItems: [
      {
        icon: <FileText className="h-4 w-4" />,
        label: "Invoices",
        href: "#",
        subItems: [
          {
            icon: <FileText className="h-3 w-3" />,
            label: "View all invoices",
            href: "/mfm/invoices",
          },
          {
            icon: <CircleDollarSign className="h-4 w-4" />,
            label: "Payment Invoice",
            href: "/mfm/payment_invoice",
          },
        ],
      },
      {
        icon: <CreditCard className="h-4 w-4" />,
        label: "Incomes",
        href: "#",
        subItems: [
          {
            icon: <CreditCard className="h-4 w-4" />,
            label: "View all incomes",
            href: "/mfm/income",
          },
          {
            icon: <ListChecks className="h-4 w-4" />,
            label: "View Income Particulars",
            href: "/mfm/income_particulars",
          },
          {
            icon: <CreditCard className="h-4 w-4" />,
            label: "View Income Receiving Options",
            href: "/mfm/income_receiving_options",
          },
        ],
      },
      {
        icon: <CreditCard className="h-4 w-4" />,
        label: "View Invoice PaymentOptions",
        href: "/mfm/payment_options",
      },

      {
        icon: <WalletCards className="h-4 w-4" />,
        label: "View all Sales",
        href: "/mfm/sales",
      },
      {
        icon: <FilePlus className="h-4 w-4" />,
        label: "View all Transactions",
        href: "/mfm/transections",
      },
      {
        icon: <ListChecks className="h-4 w-4" />,
        label: "View all Payments",
        href: "/mfm/payments",
      },
      {
        icon: <HandCoins className="h-4 w-4" />,
        label: "View member dues",
        href: "/mfm/view_member_dues",
      },
      {
        icon: <UserCheck className="h-4 w-4" />,
        label: "View member accounts",
        href: "/mfm/view_member_accounts",
      },
    ],
  },
  {
    icon: <Upload className="h-5 w-5" />,
    label: "Upload sales",
    href: "#",
    subItems: [
      {
        icon: <FileChartColumn className="h-4 w-4" />,
        label: "upload restaurant sale",
        href: "/restaurants/sales/upload",
      },
      {
        icon: <FileChartColumn className="h-4 w-4" />,
        label: "Upload lounge sale",
        href: "/upload/sales/lounge",
      },
      {
        icon: <FileChartColumn className="h-4 w-4" />,
        label: "Upload others sales",
        href: "/upload/sales/others",
      },
    ],
  },
  {
    icon: <Dumbbell className="h-5 w-5" />,
    label: "Facility management",
    href: "#",
    subItems: [
      {
        icon: <CirclePlus className="h-4 w-4" />,
        label: "Create facility",
        href: "/facilities/create",
      },
      {
        icon: <Eye className="h-4 w-4" />,
        label: "View facilities",
        href: "/facilities",
      },
    ],
  },
  {
    icon: <Component className="h-5 w-5" />,
    label: "Event Management",
    href: "#",
    subItems: [
      {
        icon: <TableOfContents className="h-4 w-4" />,
        label: "Events",
        href: "/events",
      },
      {
        icon: <MapPinHouse className="h-4 w-4" />,
        label: "Venues",
        href: "/events/venues",
      },
      {
        icon: <Ticket className="h-4 w-4" />,
        label: "Tickets",
        href: "/events/tickets",
      },
      {
        icon: <HandCoins className="h-4 w-4" />,
        label: "Fees",
        href: "/events/fees",
      },
    ],
  },
];

interface SubItem {
  icon: React.ReactNode;
  label: string;
  href: string;
  subItems?: SubItem[];
}

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  active?: boolean;
  badge?: number;
  subItems?: SubItem[];
  level?: number;
}
const NavItem = ({
  icon,
  label,
  href,
  active,
  badge,
  subItems,
  level = 0,
}: NavItemProps) => {
  const pathname = usePathname();

  const hasActiveSubItem = (items?: SubItem[]): boolean => {
    if (!items) return false;
    return items.some((item) => {
      if (pathname === item.href) return true;
      return hasActiveSubItem(item.subItems);
    });
  };

  const isParentActive = active || hasActiveSubItem(subItems);
  const [isOpen, setIsOpen] = useState(isParentActive);

  const paddingLeft = level * 16 + 12;
  const buttonWidth = level > 0 ? "w-full" : "w-[90%]";

  if (subItems && subItems?.length > 0) {
    return (
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className={cn(
              `${buttonWidth} hover:translate-y-1 transition-transform duration-300 ease-in-out justify-between gap-1 h-10 px-3`,
              isParentActive &&
                "bg-primary hover:bg-primary hover:text-white rounded-xl dark:bg-accent text-white my-2"
            )}
            style={{ paddingLeft: `${paddingLeft}px` }}
          >
            <div className="flex items-center gap-2">
              {icon}
              <span className="text-left">{label}</span>
            </div>
            <div className="flex items-center">
              {badge && (
                <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full mr-2">
                  {badge}
                </span>
              )}
              {isOpen ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </div>
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-1">
          <div className="space-y-1">
            {subItems.map((subItem, index) => (
              <NavItem
                key={index}
                icon={subItem.icon}
                label={subItem.label}
                href={subItem.href}
                active={pathname === subItem.href}
                subItems={subItem.subItems}
                level={level + 1}
              />
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    );
  }

  return (
    <Link href={href} scroll={false}>
      <Button
        variant="ghost"
        className={cn(
          `${buttonWidth} hover:translate-y-1 transition-transform duration-300 ease-in-out justify-start gap-3 h-10 px-3 w-[90%]`,
          active &&
            "bg-blue-50 hover:bg-primary hover:text-white rounded-xl dark:bg-accent text-primary my-1"
        )}
        style={{ paddingLeft: `${paddingLeft}px` }}
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
  const [navigation, setNavigation] = useState<any>([]);
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutate: logOutFunc, isPending } = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.delete("/api/account/v1/logout/");
      return res.data;
    },
    onSuccess: async (data) => {
      if (data.status === "success") {
        toast.success(data.message || "You have been logged out successfully.");
        await queryClient.invalidateQueries({ queryKey: ["authUser"] });
        router.replace("/login");
        router.refresh();
        window.location.reload();
      }
    },
    onError: (error: any) => {
      console.error("Error in Logout:", error?.response);
      const { message, errors, details } = error?.response.data;
      if (errors) {
        errors?.map((error: any) => {
          toast.error(error?.message);
        });
      } else {
        toast.error(details || "Logout Failed");
      }
    },
  });

  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [filteredNavigation, setFilteredNavigation] = useState([]);
  const [userData, setUserData] = useState({
    is_admin: false,
    permissions: [],
    username: "",
  });

  useEffect(() => {
    // Fetch user permissions on component mount
    const fetchUserPermissions = async () => {
      try {
        const response = await axiosInstance.get(
          "/api/account/v1/authorization/get_user_all_permissions/"
        ); // Your endpoint
        const data = response.data;

        if (data.status === "success") {
          const user = data.data[0];
          // Transform the API response into the shape our function expects
          const permissionsList = user.permissions.map(
            (p: any) => p.permission_name
          );
          setUserData({
            is_admin: user.is_admin,
            permissions: permissionsList,
            username: user?.username,
          });

          // Filter the navigation based on the fetched permissions
          const filteredNav = filterNavigationByPermissions(
            navigation_sidebar_links,
            permissionsList,
            user.is_admin
          );
          setNavigation(filteredNav);
        }
      } catch (error) {
        console.error("Failed to fetch user permissions:", error);
        // Optional: Set to a default state, e.g., show nothing or a basic nav
        setNavigation([]);
      }
    };

    fetchUserPermissions();
  }, []);

  if (!mounted) {
    return null;
  }

  const Sidebar = () => (
    <div className="flex flex-col  max-h-screen overflow-y-auto font-primary ">
      <div className="p-4">
        <div className="flex items-center justify-center">
          <img
            src="/assets/logo.png"
            alt=""
            className="object-contain rounded-full h-[120px] w-[120px]"
          />
        </div>
      </div>

      <ScrollArea className="flex-1  overflow-y-auto no-scrollbar border-b-2 mb-5">
        <nav className="space-y-1 px-2">
          {navigation.map((item: any, index: number) => (
            <NavItem
              key={index}
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
    <div className="min-h-screen flex bg-muted/30 max-w-screen-2xl mx-auto">
      <aside className="hidden lg:block w-[20%] border-r bg-background h-full overflow-y-auto sticky top-0">
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

      <div className="flex-1 flex flex-col w-[80%] ">
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
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full border border-gray-500"
                >
                  <CircleUser className="h-10 w-10" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  {userData?.username || "My account"}
                </DropdownMenuLabel>
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
        <main className="overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#f4f7fb] dark:bg-black/80">
          {children}
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;
