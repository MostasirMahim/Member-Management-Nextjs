"use client";

import { useRouter } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { PaginationEllipsis } from "./pagination-ellipsis";

interface PaginationData {
  count: number;
  total_pages: number;
  current_page: number;
  next: string | null;
  previous: string | null;
  page_size: number;
}

interface SmartPaginationProps {
  paginationData: PaginationData | undefined;
  className?: string;
}

export function SmartPagination({
  paginationData,
  className,
}: SmartPaginationProps) {
  const router = useRouter();

  if (!paginationData || paginationData.total_pages <= 1) {
    return null;
  }

  const { current_page, total_pages, next, previous } = paginationData;

  const goToPage = (page: number) => {
    if (page !== current_page && page >= 1 && page <= total_pages) {
      router.push(`?page=${page}`);
      router.refresh();
    }
  };

  const generatePageLinks = () => {
    const delta = 1; // Number of pages to show on each side of the current page
    const range = [];
    const rangeWithDots = [];

    // Calculate the range of page numbers to show around the current page
    for (
      let i = Math.max(2, current_page - delta);
      i <= Math.min(total_pages - 1, current_page + delta);
      i++
    ) {
      range.push(i);
    }

    // Always add the first page
    if (current_page - delta > 2) {
      rangeWithDots.push(1);
    }
    if (current_page - delta > 2) {
      rangeWithDots.push("...");
    }

    // Add the calculated range from above
    range.forEach((i) => {
      rangeWithDots.push(i);
    });

    // Add ellipsis and last page if needed
    if (current_page + delta < total_pages - 1) {
      rangeWithDots.push("...");
    }
    if (current_page + delta < total_pages) {
      rangeWithDots.push(total_pages);
    }

    // Always ensure first and last page are included if they weren't already
    // This handles cases where the range is very small (e.g., only 2-3 pages)
    if (!rangeWithDots.includes(1)) rangeWithDots.unshift(1);
    if (!rangeWithDots.includes(total_pages) && total_pages !== 1)
      rangeWithDots.push(total_pages);

    return rangeWithDots;
  };

  const renderPageItem = (page: number | string, index: number) => {
    // If the item is an ellipsis, render the ellipsis component
    if (page === "...") {
      return (
        <PaginationItem key={`ellipsis-${index}`} >
          <PaginationEllipsis className="cursor-pointer font-bold text-indigo-600 rounded-md p-2 hover:bg-indigo-400 transition-colors" />
        </PaginationItem>
      );
    }

    // Otherwise, render a page number button
    const pageNumber = page as number;
    return (
      <PaginationItem key={`page-${pageNumber}`}>
        <PaginationLink
          className="cursor-pointer font-bold text-indigo-600 rounded-md p-2 hover:bg-indigo-400 transition-colors"
          isActive={pageNumber === current_page}
          onClick={(e) => {
            e.preventDefault();
            goToPage(pageNumber);
          }}
        >
          {pageNumber}
        </PaginationLink>
      </PaginationItem>
    );
  };

  return (
    <div className={`my-2 ${className || ""}`}>
      <div className="flex justify-center">
        <Pagination>
          <PaginationContent>
            {/* Previous Button */}
            {previous && (
              <PaginationItem>
                <PaginationPrevious
                  className="cursor-pointer font-bold text-indigo-600 rounded-md p-2 hover:bg-indigo-400 transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    goToPage(current_page - 1);
                  }}
                />
              </PaginationItem>
            )}

            {/* Page Numbers with smart truncation */}
            {generatePageLinks().map((page, index) =>
              renderPageItem(page, index)
            )}

            {/* Next Button */}
            {next && (
              <PaginationItem>
                <PaginationNext
                  className="cursor-pointer font-bold text-indigo-600 rounded-md p-2 hover:bg-indigo-400 transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    goToPage(current_page + 1);
                  }}
                />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
