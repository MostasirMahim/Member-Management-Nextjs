"use client";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

function ActivityLog({ data }: { data: any }) {
  const activityLogs = data?.data;
  const paginationData = data?.pagination;
  const router = useRouter();
  const currentPage = paginationData?.current_page || 1;
  const totalPages = paginationData?.total_pages || 1;

  const goToPage = (page: number) => {
    if (page !== currentPage) {
      router.push(`?page=${page}`);
      router.refresh();
    }
  };

  const renderPageLinks = () => {
    const pagesToShow = [];

    for (let i = 1; i <= totalPages; i++) {
      pagesToShow.push(
        <PaginationItem key={i}>
          <PaginationLink
            onClick={() => goToPage(i)}
            isActive={i === currentPage}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return pagesToShow;
  };

  return (
    <div>
      <Table>
        <TableCaption>All user activity logs. </TableCaption>
        <TableHeader>
          <TableRow className="bg-gray-100 dark:bg-gray-700 ">
            <TableHead className="text-center  font-bold">User</TableHead>
            <TableHead className="text-center font-bold">Timestamp</TableHead>
            <TableHead className="text-center">Ip address</TableHead>
            <TableHead className="text-center m-w-[300px] font-bold">
              Location
            </TableHead>
            <TableHead className="text-center font-bold">User Agent</TableHead>
            <TableHead className="text-center font-bold">
              Request Method
            </TableHead>
            <TableHead className="text-center font-bold">
              Referrer Url
            </TableHead>
            <TableHead className="text-center font-bold">Device</TableHead>
            <TableHead className="text-center font-bold">Path</TableHead>
            <TableHead className="text-center font-bold">Verb</TableHead>
            <TableHead className="text-center font-bold">
              Severity Level
            </TableHead>
            <TableHead className="text-center font-bold">Description</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {activityLogs?.map((log: any, indx: number) => (
            <TableRow key={indx} className="">
              <TableCell className="text-center font-medium ">
                {log.user || "None"}
              </TableCell>
              <TableCell className="text-center ">
                {new Date(log.timestamp).toLocaleString("en-US", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </TableCell>
              <TableCell className="text-center ">{log.ip_address}</TableCell>
              <TableCell className="text-center m-w-[300px]">
                {log.location}
              </TableCell>
              <TableCell className="text-center ">{log.user_agent}</TableCell>
              <TableCell
                className={` text-xs font-semibold
                ${
                  log.request_method === "POST"
                    ? " text-blue-800  dark:text-blue-300"
                    : log.request_method === "GET"
                    ? " text-green-800  dark:text-green-300"
                    : log.request_method === "PUT"
                    ? " text-yellow-800  dark:text-yellow-300"
                    : log.request_method === "PATCH"
                    ? " text-purple-800  dark:text-purple-300"
                    : log.request_method === "DELETE"
                    ? " text-red-800  dark:text-red-300"
                    : " text-gray-800  dark:text-gray-300"
                }
                `}
              >
                {log.request_method}
              </TableCell>
              <TableCell className="text-center ">{log.referrer_url}</TableCell>
              <TableCell className="text-center ">{log.device}</TableCell>
              <TableCell className="text-center ">{log.path}</TableCell>
              <TableCell className="text-center ">{log.verb}</TableCell>
              <TableCell className="text-center ">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    log.severity_level === "warning"
                      ? "bg-red-100 text-red-600"
                      : log.severity_level === "info"
                      ? "bg-green-100 text-green-600"
                      : "bg-yellow-100 text-yellow-600"
                  }`}
                >
                  {log.severity_level}
                </span>
              </TableCell>
              <TableCell className="text-center ">{log.description}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="my-5 pb-11">
        {/* -- PAGINATION -- */}
        <div className=" flex justify-center">
          <Pagination>
            <PaginationContent>
              {/* Previous Button */}
              {paginationData?.previous && (
                <PaginationItem>
                  <PaginationPrevious
                    onClick={(e) => {
                      e.preventDefault();
                      goToPage(currentPage - 1);
                    }}
                  />
                </PaginationItem>
              )}

              {/* Page Numbers */}
              {renderPageLinks()}

              {/* Next Button */}
              {paginationData?.next && (
                <PaginationItem>
                  <PaginationNext
                    onClick={(e) => {
                      e.preventDefault();
                      goToPage(currentPage + 1);
                    }}
                  />
                </PaginationItem>
              )}
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
}

export default ActivityLog;
