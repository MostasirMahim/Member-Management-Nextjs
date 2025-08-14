import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "../ui/badge";

interface Props {
  data: any;
}

function ViewAllCategoryTable({ data }: Props) {
  const categories = data.data;

  return (
    <div className="grid w-full [&>div]:max-h-[300px] [&>div]:border [&>div]:rounded">
      <Table>
        <TableHeader>
          <TableRow className="[&>*]:whitespace-nowrap sticky top-0 bg-background after:content-[''] after:inset-x-0 after:h-px after:bg-border after:absolute after:bottom-0">
            <TableHead className="pl-4">ID</TableHead>
            <TableHead>name</TableHead>
            <TableHead>is active</TableHead>
            <TableHead>created at</TableHead>
            <TableHead>updated at</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="overflow-x-auto">
          {categories.map((cat: any) => (
            <TableRow
              key={cat.id}
              className="odd:bg-muted/50 [&>*]:whitespace-nowrap"
            >
              <TableCell className="pl-4">{cat.id}</TableCell>
              <TableCell className="font-medium">{cat.name}</TableCell>
              <TableCell className="flex flex-wrap gap-1">
                {cat.is_active ? (
                  <Badge
                    key={cat.id}
                    variant="outline"
                    className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                  >
                    YES
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="text-gray-500">
                    NO
                  </Badge>
                )}
              </TableCell>
              <TableCell className="">
                {new Date(cat.created_at).toLocaleString("en-BD", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </TableCell>
              <TableCell className="">
                {new Date(cat.updated_at).toLocaleString("en-BD", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default ViewAllCategoryTable;
