"use client";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
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
import { Button } from "../ui/button";
import { Ban, RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import axiosInstance from "@/lib/axiosInstance";

interface Props {
  data: any;
}

const OutboxTable = ({ data }: Props) => {
  const outboxData = data?.data;
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

  const handleRetry = async () => {
    try {
      const response = await axiosInstance.post("/api/mails/v1/emails/retry/");
      if (response.status == 200) {
        toast.success("Retry process started successfully for failed email.");
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div>
      <div className="mb-4">
        <div className="flex justify-between items-center">
          <div>
            <h4 className=" text-4xl font-bold">Outbox List</h4>
            <p className="">
              All emails sent from the software are listed here.
            </p>
          </div>
          <div>
            <Button variant="destructive" onClick={handleRetry}>
              {" "}
              <RotateCcw /> Retry
            </Button>
          </div>
        </div>
      </div>
      <Table>
        <TableCaption>Outbox</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="">Id</TableHead>
            <TableHead className="">Email Address</TableHead>
            <TableHead className="">Status</TableHead>
            <TableHead className="">Email Compose</TableHead>
            <TableHead className="">Is from template</TableHead>
            <TableHead className="">Failed Reason</TableHead>
            <TableHead className="">Created at</TableHead>
            <TableHead className="">Updated at</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {outboxData.map((outbox: any) => (
            <TableRow key={outbox.id}>
              <TableCell className="">{outbox.id}</TableCell>
              <TableCell className="">{outbox.email_address}</TableCell>
              <TableCell>{outbox.status}</TableCell>
              <TableCell>{outbox.email_compose}</TableCell>
              <TableCell className="">
                {outbox.is_from_template ? "Yes" : "No"}
              </TableCell>
              <TableCell className="">
                {outbox.failed_reason ? outbox.failed_reason : <Ban />}
              </TableCell>
              <TableCell className="">
                {new Date(outbox.created_at).toLocaleString("en-BD", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </TableCell>
              <TableCell className="">
                {new Date(outbox.updated_at).toLocaleString("en-BD", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </TableCell>
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
};

export default OutboxTable;
