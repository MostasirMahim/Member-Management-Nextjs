"use client";
import {
  Table,
  TableBody,
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

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import { CheckCircle, XCircle } from "lucide-react";
import { Button } from "../ui/button";

interface Props {
  itemsData: any;
}

interface PaginationProps {
  data: any;
}

function PaginationForItems({ data }: PaginationProps) {
  const paginationData = data;
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

function ItemTable({ itemsData }: Props) {
  const items = itemsData.data;
  const paginationData = itemsData.pagination;

  return (
    <div>
      <div>
        <h4 className="text-center text-2xl font-bold mb-4">
          Items of the restaurant
        </h4>
      </div>
      <div className="grid w-full [&>div]:max-h-[300px] [&>div]:border [&>div]:rounded">
        <Table>
          <TableHeader>
            <TableRow className="[&>*]:whitespace-nowrap sticky top-0 bg-background after:content-[''] after:inset-x-0 after:h-px after:bg-border after:absolute after:bottom-0">
              <TableHead className="pl-4">ID</TableHead>
              <TableHead>Restaurant</TableHead>
              <TableHead>category</TableHead>
              <TableHead>name</TableHead>
              <TableHead>description</TableHead>
              <TableHead>availability</TableHead>
              <TableHead>unit</TableHead>
              <TableHead>unit cost</TableHead>
              <TableHead>selling price</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="overflow-x-auto">
            {items.map((item: any) => (
              <TableRow
                key={item.id}
                className="odd:bg-muted/50 [&>*]:whitespace-nowrap"
              >
                <TableCell className="pl-4">{item.id}</TableCell>
                <TableCell className="font-medium">{item.restaurant}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell>
                  {item.availability ? (
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      <span>Available</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-red-600">
                      <XCircle className="w-4 h-4" />
                      <span>Unavailable</span>
                    </div>
                  )}
                </TableCell>
                <TableCell>{item.unit}</TableCell>
                <TableCell>${item.unit_cost}</TableCell>
                <TableCell>${item.selling_price}</TableCell>
                <TableCell>
                  <Button>Buy</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="my-2">
        <PaginationForItems data={paginationData} />
      </div>
    </div>
  );
}

export default ItemTable;
