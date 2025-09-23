"use client";
import { HistoryIcon } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatPostDate } from "@/lib/date_modify";
import useGetIdTransfer from "@/hooks/data/useGetIdTransfer";

function SpecificIdHistory(memberId: { memberId: string }) {
  const { data: filteredUsers, isLoading } = useGetIdTransfer(memberId);

  if(!filteredUsers || filteredUsers?.length === 0) return null
  return (
    <div className="space-y-6">
      <div className="rounded-md border my-2 font-secondary">
        <Table className="">
          <TableHeader>
            <TableRow className="text-center font-bold h-14 bg-background border-b-2 border-primary dark:bg-accent">
              <TableHead className="text-center">
                ID
              </TableHead>
              <TableHead >
                Current ID
              </TableHead>
              <TableHead >
                Transferred ID
              </TableHead>
              <TableHead >
                Reason
              </TableHead>
              <TableHead className="text-center">
                Transferred
              </TableHead>
              <TableHead >
                Start Date
              </TableHead>
              <TableHead >
                End Date
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers?.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-8 text-red-500 font-medium"
                >
                  <Card className="p-8 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <HistoryIcon className="h-12 w-12 text-muted-foreground" />
                      <div className="space-y-2">
                        <h3 className="text-lg font-medium">
                          No History Found
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Member Has No ID Transfer History
                        </p>
                      </div>
                    </div>
                  </Card>
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers?.map((user: any) => (
                <TableRow
                  key={user.id}
                  className="  cursor-pointer hover:translate-y-1 transition-transform duration-300 ease-in-out bg-background "
                >
                  <TableCell className="font-medium ">{user.id}</TableCell>
                  <TableCell>
                    <p className="font-medium text-left">
                      {user.member}
                    </p>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium text-left">
                      {user.stored_member_id}
                    </p>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium text-left">
                      {user.transferred_reason}
                    </p>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant={"default"}
                      className={`${
                        user.transferred
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      } px-2 py-1 rounded-full text-xs font-semibold`}
                    >
                      {user.transferred ? "Yes" : "No"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <p className="font-medium text-left">
                      {formatPostDate(user.start_date)}
                    </p>
                  </TableCell>
                  <TableCell className="text-center">
                    <p className="font-medium text-left">
                      {formatPostDate(user.start_date)}
                    </p>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default SpecificIdHistory;
