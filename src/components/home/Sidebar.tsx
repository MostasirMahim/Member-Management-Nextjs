"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/context/SidebarContext";

interface SubItem {
  icon: React.ReactNode;
  label: string;
  href: string;
  badge?: number;
  subItems?: SubItem[];
}

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  badge?: number;
  subItems?: SubItem[];
  level?: number;
}

const NavItem = ({
  icon,
  label,
  href,
  badge,
  subItems,
  level = 0,
}: NavItemProps) => {
  const pathname = usePathname();
  const { openKeys, setOpenKeys } = useSidebar();
  const key = label + href;
  const isOpen = openKeys.includes(key);

  useEffect(() => {
    if ((pathname === href || hasActiveSubItem(subItems)) && !isOpen) {
      setOpenKeys([...openKeys, key]);
    }
  }, [pathname]);

  function hasActiveSubItem(items?: SubItem[]): boolean {
    if (!items) return false;
    return items.some((item) => {
      if (pathname === item.href) return true;
      return hasActiveSubItem(item.subItems);
    });
  }

  const toggleOpen = () => {
    setOpenKeys(
      isOpen ? openKeys.filter((k) => k !== key) : [...openKeys, key]
    );
  };

  const paddingLeft = level * 16 + 12;
  const buttonWidth = level > 0 ? "w-full" : "w-[90%]";

  if (subItems && subItems.length > 0) {
    return (
      <Collapsible open={isOpen} onOpenChange={toggleOpen}>
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className={cn(
              `${buttonWidth} hover:translate-y-1 transition-transform duration-300 ease-in-out justify-between gap-1 h-10 px-3`,
              (pathname === href || hasActiveSubItem(subItems)) &&
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
                badge={subItem.badge}
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
          pathname === href &&
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

const Sidebar = ({
  navigation,
}: {
  navigation: NavItemProps[];
}) => {
  const pathname = usePathname();
  return (
    <div className="flex flex-col max-h-screen overflow-y-auto font-primary">
      <div className="p-4 flex items-center justify-center">
        <img
          src="/assets/logo.png"
          alt=""
          className="object-contain rounded-full h-[120px] w-[120px]"
        />
      </div>
      <ScrollArea className="flex-1 overflow-y-auto no-scrollbar border-b-2 mb-5">
        <nav className="space-y-1 px-2">
          {navigation.map((item, index) => (
            <NavItem key={index} {...item} />
          ))}
        </nav>
      </ScrollArea>
    </div>
  );
};

export default Sidebar;