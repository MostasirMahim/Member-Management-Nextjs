import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Send } from "lucide-react";
import { Button } from "../ui/button";

interface Props {
  data: any;
}

function EmailGroupsTable({ data }: Props) {
  const groups = data?.data;
  return (
    <div>
      <Table>
        <TableCaption>
          <div>
            <h4 className="flex items-center justify-center">
              <Send /> Email groups
            </h4>
          </div>
        </TableCaption>
        <TableHeader>
          <TableRow className="bg-gray-200 dark:bg-gray-800">
            <TableHead className="text-center">ID</TableHead>
            <TableHead className="text-center">Name</TableHead>
            <TableHead className="text-center">Description</TableHead>
            <TableHead className="text-center">User</TableHead>
            <TableHead className="text-center">Created At</TableHead>
            <TableHead className="text-center">Updated At</TableHead>
            <TableHead className="text-center">View</TableHead>
            <TableHead className="text-center">Update</TableHead>
            <TableHead className="text-center">Delete</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {groups.map((group: any, index: number) => (
            <TableRow key={index}>
              <TableCell className="text-center">{group.id}</TableCell>
              <TableCell className="text-center capitalize">
                {group.name || "—"}
              </TableCell>
              <TableCell className="text-center capitalize">
                {group.description || "—"}
              </TableCell>
              <TableCell className="text-center capitalize">
                {group.user || "—"}
              </TableCell>

              <TableCell className="text-center">
                {new Date(group.created_at).toLocaleString("en-BD", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </TableCell>
              <TableCell className="text-center">
                {new Date(group.updated_at).toLocaleString("en-BD", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </TableCell>
              <TableCell>
                <Button variant="outline">View</Button>
              </TableCell>
              <TableCell>
                <Button variant="default" disabled>
                  Update
                </Button>
              </TableCell>
              <TableCell>
                <Button variant="destructive">Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default EmailGroupsTable;
