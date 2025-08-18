import { Suspense, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Users,
  FileText,
  Clock,
  FolderOpen,
  Eye,
  ThumbsUp,
  MessageSquare,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  Check,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { articles, userArticles } from "@/lib/dummy";
import { useQuery } from "@tanstack/react-query";

import { LoadingPage } from "@/components/ui/loading";
import DashBoardCard from "@/components/DashBoard/DashBoardCard";
import DashboardFilterButton from "@/components/DashBoard/DashboardFilterButton";

interface Props {
  searchParams: Promise<{
    created_at?: string;
    created_at_after?: string;
    created_at_before?: string;
  }>;
}

function Home({ searchParams }: Props) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, Here's what's happening with your club.
          </p>
        </div>
        <div className="flex gap-2">
          <DashboardFilterButton />
        </div>
      </div>

      {/* Stats Cards */}
      <Suspense fallback={<h1>loading..</h1>}>
        <DashBoardCard searchParams={searchParams} />
      </Suspense>

      <div className="shadow p-4 rounded-lg border border-gray-200">
        <h4 className="text-xl font-bold mb-4">Analytical data</h4>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">chart 1</div>
          <div className="flex-1">chart 2</div>
        </div>
      </div>
    </div>
  );
}

export default Home;
