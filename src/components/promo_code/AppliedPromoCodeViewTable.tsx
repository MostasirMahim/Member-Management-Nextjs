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

function AppliedPromoCodeViewTable({ data }: Props) {
  const promoCodes = data.data;

  return (
    <div className="grid w-full [&>div]:max-h-[300px] [&>div]:border [&>div]:rounded">
      <Table>
        <TableHeader>
          <TableRow className="[&>*]:whitespace-nowrap sticky top-0 bg-background after:content-[''] after:inset-x-0 after:h-px after:bg-border after:absolute after:bottom-0">
            <TableHead className="pl-4">ID</TableHead>
            <TableHead>promo code</TableHead>
            <TableHead>used_by</TableHead>
            <TableHead>is_active</TableHead>
            <TableHead>discounted_amount</TableHead>
            <TableHead>used_at</TableHead>
            <TableHead>created_at</TableHead>
            <TableHead>updated_at</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="overflow-x-auto">
          {promoCodes.map((promoCode: any) => (
            <TableRow
              key={promoCode.id}
              className="odd:bg-muted/50 [&>*]:whitespace-nowrap"
            >
              <TableCell className="pl-4">{promoCode.id}</TableCell>
              <TableCell className="font-medium">
                {promoCode.promo_code}
              </TableCell>
              <TableCell className="">{promoCode.used_by}</TableCell>
              <TableCell className="font-medium ">
                {promoCode.is_active ? (
                  <span className="text-green-600 font-semibold">YES</span>
                ) : (
                  <Badge variant="secondary" className="text-gray-500">
                    NO
                  </Badge>
                )}
              </TableCell>

              <TableCell className="font-medium ">
                <span className="text-blue-600 font-semibold">
                  ৳{promoCode.discounted_amount}
                </span>
              </TableCell>
              <TableCell className="">
                {new Date(promoCode.used_at).toLocaleString("en-BD", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </TableCell>
              <TableCell className="">
                {new Date(promoCode.created_at).toLocaleString("en-BD", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </TableCell>
              <TableCell className="">
                {new Date(promoCode.updated_at).toLocaleString("en-BD", {
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

export default AppliedPromoCodeViewTable;
