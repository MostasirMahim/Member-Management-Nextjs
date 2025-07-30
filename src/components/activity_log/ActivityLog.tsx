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

function ActivityLog({ data }: { data: any }) {
  const [activityLogs, setActivityLogs] = useState([]);
  const [paginationData, setPaginationData] = useState({});

  useEffect(() => {
    setActivityLogs(data?.data);
    setPaginationData(data?.pagination);
  }, []);
  console.log("data", activityLogs);
  console.log("pagination", paginationData);
  return (
    <div className="max-h-full overflow-y-auto">
      <Table>
        <TableCaption>All user activity logs. </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center ">User</TableHead>
            <TableHead className="text-center">Timestamp</TableHead>
            <TableHead className="text-center">Ip address</TableHead>
            <TableHead className="text-center m-w-[300px]">Location</TableHead>
            <TableHead className="text-center">User Agent</TableHead>
            <TableHead className="text-center">Request Method</TableHead>
            <TableHead className="text-center">Referrer Url</TableHead>
            <TableHead className="text-center">Device</TableHead>
            <TableHead className="text-center">Path</TableHead>
            <TableHead className="text-center">Verb</TableHead>
            <TableHead className="text-center">Severity Level</TableHead>
            <TableHead className="text-center">Description</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {activityLogs?.map((log: any, indx) => (
            <TableRow key={indx} className="">
              <TableCell className="text-center font-medium ">
                {log.user || "None"}
              </TableCell>
              <TableCell className="text-center ">{log.timestamp}</TableCell>
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
                      ? "bg-yellow-100 text-yellow-600"
                      : "bg-green-100 text-green-600"
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
      <div className="mt-4">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>
                2
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}

export default ActivityLog;
