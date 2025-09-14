"use client"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

import { SmartPagination } from "../utils/SmartPagination"

function ActivityLog({ data }: { data: any }) {
  const activityLogs = data?.data
  const paginationData = data?.pagination

  return (
    <div className="w-full">
      <div className="w-full overflow-x-auto rounded-md border bg-background">
        <Table className="min-w-[1400px]">
          <TableCaption className="text-foreground">All user activity logs.</TableCaption>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="text-center font-bold text-foreground">User</TableHead>
              <TableHead className="text-center font-bold text-foreground">Timestamp</TableHead>
              <TableHead className="text-center font-bold text-foreground">IP Address</TableHead>
              <TableHead className="text-center font-bold text-foreground min-w-[300px]">Location</TableHead>
              <TableHead className="text-center font-bold text-foreground">User Agent</TableHead>
              <TableHead className="text-center font-bold text-foreground">Request Method</TableHead>
              <TableHead className="text-center font-bold text-foreground">Referrer URL</TableHead>
              <TableHead className="text-center font-bold text-foreground">Device</TableHead>
              <TableHead className="text-center font-bold text-foreground">Path</TableHead>
              <TableHead className="text-center font-bold text-foreground">Verb</TableHead>
              <TableHead className="text-center font-bold text-foreground">Severity Level</TableHead>
              <TableHead className="text-center font-bold text-foreground">Description</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activityLogs?.map((log: any, indx: number) => (
              <TableRow key={indx} className="hover:bg-muted/50 transition-colors border-b border-border">
                <TableCell className="text-center font-medium text-foreground">{log.user || "None"}</TableCell>
                <TableCell className="text-center text-muted-foreground">
                  {new Date(log.timestamp).toLocaleString("en-US", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </TableCell>
                <TableCell className="text-center text-foreground">{log.ip_address}</TableCell>
                <TableCell className="text-center text-foreground min-w-[300px]">{log.location}</TableCell>
                <TableCell className="text-center text-muted-foreground">{log.user_agent}</TableCell>
                <TableCell
                  className={`text-center text-xs font-semibold
                ${
                  log.request_method === "POST"
                    ? "text-blue-800 dark:text-blue-300"
                    : log.request_method === "GET"
                      ? "text-green-800 dark:text-green-300"
                      : log.request_method === "PUT"
                        ? "text-yellow-800 dark:text-yellow-300"
                        : log.request_method === "PATCH"
                          ? "text-purple-800 dark:text-purple-300"
                          : log.request_method === "DELETE"
                            ? "text-red-800 dark:text-red-300"
                            : "text-muted-foreground"
                }
                `}
                >
                  {log.request_method}
                </TableCell>
                <TableCell className="text-center text-muted-foreground">{log.referrer_url}</TableCell>
                <TableCell className="text-center text-foreground">{log.device}</TableCell>
                <TableCell className="text-center text-foreground">{log.path}</TableCell>
                <TableCell className="text-center text-foreground">{log.verb}</TableCell>
                <TableCell className="text-center">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      log.severity_level === "warning"
                        ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-300"
                        : log.severity_level === "info"
                          ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-300"
                          : "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-300"
                    }`}
                  >
                    {log.severity_level}
                  </span>
                </TableCell>
                <TableCell className="text-center text-foreground">{log.description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="my-5 pb-11 overflow-auto">
        {/* -- PAGINATION -- */}
        <SmartPagination paginationData={paginationData} />
      </div>
    </div>
  )
}

export default ActivityLog
