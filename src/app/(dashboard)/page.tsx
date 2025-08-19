import { Suspense } from "react";
import DashBoardCard from "@/components/DashBoard/DashBoardCard";
import DashboardFilterButton from "@/components/DashBoard/DashboardFilterButton";
import MemberPieChartSSR from "@/components/DashBoard/MemberPieChartSSR";
import MemberPieChartSSR2 from "@/components/DashBoard/MemberPieChartSSR2";
import DashboardLoader from "@/components/loader/DashboardLoader";
import { DashBoardActivityLog } from "@/components/DashBoard/DashBoardActivityLog";
import { DashBoardInfo } from "@/components/DashBoard/DashboardInfo";

interface Props {
  searchParams: Promise<{
    created_at?: string;
    created_at_after?: string;
    created_at_before?: string;
  }>;
}

async function Home({ searchParams }: Props) {
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
      <Suspense fallback={<DashboardLoader />}>
        <DashBoardCard searchParams={searchParams} />
      </Suspense>

      {/* charts */}
      <div className="shadow p-4 rounded-lg border border-gray-200">
        <h4 className="text-xl font-bold mb-4">Analytical data</h4>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Suspense fallback={<DashboardLoader />}>
              <MemberPieChartSSR />
            </Suspense>
          </div>
          <div className="flex-1">
            <Suspense fallback={<DashboardLoader />}>
              <MemberPieChartSSR2 />
            </Suspense>
          </div>
        </div>
      </div>

      <div className=" flex flex-col md:flex-row justify-between items-start  gap-4 space-y-4">
        <div className="flex-1  border-gray-200">
          <Suspense fallback={<DashboardLoader />}>
            <DashBoardActivityLog />
          </Suspense>
        </div>
        <div className="flex-1  border-gray-200">
          <DashBoardInfo />
        </div>
      </div>
    </div>
  );
}

export default Home;
