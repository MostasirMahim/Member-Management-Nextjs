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

function PromoCodeViewTable({ data }: Props) {
  const promoCodes = data.data;

  return (
    <div className="grid w-full [&>div]:max-h-[300px] [&>div]:border [&>div]:rounded">
      <Table>
        <TableHeader>
          <TableRow className="[&>*]:whitespace-nowrap sticky top-0 bg-background after:content-[''] after:inset-x-0 after:h-px after:bg-border after:absolute after:bottom-0">
            <TableHead className="pl-4">ID</TableHead>
            <TableHead>promo code</TableHead>
            <TableHead>start date</TableHead>
            <TableHead>end date</TableHead>
            <TableHead>percentage</TableHead>
            <TableHead>amount</TableHead>
            <TableHead>limit</TableHead>
            <TableHead>remaining limit</TableHead>
            <TableHead>description</TableHead>
            <TableHead>category</TableHead>
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
              <TableCell className="">{promoCode.start_date}</TableCell>
              <TableCell className="">{promoCode.end_date}</TableCell>
              <TableCell className="font-medium text-right">
                {promoCode.percentage !== null &&
                promoCode.percentage !== undefined ? (
                  <span className="text-green-600 font-semibold">
                    {promoCode.percentage}%
                  </span>
                ) : (
                  <Badge variant="secondary" className="text-gray-500">
                    N/A
                  </Badge>
                )}
              </TableCell>

              <TableCell className="font-medium text-right">
                {promoCode.amount !== null && promoCode.amount !== undefined ? (
                  <span className="text-blue-600 font-semibold">
                    ৳{promoCode.amount}
                  </span>
                ) : (
                  <Badge variant="secondary" className="text-gray-500">
                    N/A
                  </Badge>
                )}
              </TableCell>
              <TableCell className="">{promoCode.limit}</TableCell>
              <TableCell className="font-medium">
                {promoCode.remaining_limit}
              </TableCell>
              <TableCell className="">{promoCode.description}</TableCell>
              <TableCell className="flex flex-wrap gap-1">
                {promoCode.category?.length ? (
                  promoCode.category.map((cat: any) => (
                    <Badge
                      key={cat.id}
                      variant="outline"
                      className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                    >
                      {cat.name}
                    </Badge>
                  ))
                ) : (
                  <Badge variant="secondary" className="text-gray-500">
                    N/A
                  </Badge>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default PromoCodeViewTable;
