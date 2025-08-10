"use client";
import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import Link from "next/link";

interface Props {
  data: any;
}

interface RestaurantTableProps {
  restaurants: any;
}

function ViewAllRestaurant({ data }: Props) {
  const restaurants = data.data;
  const paginationData = data.pagination;
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
      <div className="flex justify-between items-center mb-4">
        <div>
          <h4 className="text-2xl font-bold">Restaurants</h4>
          <p>Viewing all restaurants</p>
        </div>
        <div>
          <Link href="restaurants/add/">
            <Button variant="default">
              <Plus /> Add
            </Button>
          </Link>
        </div>
      </div>
      <RestaurantTable restaurants={restaurants} />
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

export default ViewAllRestaurant;

export function RestaurantTable({ restaurants }: RestaurantTableProps) {
  return (
    <div className="grid w-full [&>div]:max-h-[300px] [&>div]:border [&>div]:rounded">
      <Table>
        <TableHeader>
          <TableRow className="[&>*]:whitespace-nowrap sticky top-0 bg-background after:content-[''] after:inset-x-0 after:h-px after:bg-border after:absolute after:bottom-0">
            <TableHead className="pl-4">ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>City</TableHead>
            <TableHead>State</TableHead>
            <TableHead>Postal Code</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Operating hours</TableHead>
            <TableHead>Capacity</TableHead>
            <TableHead>status</TableHead>
            <TableHead>opening time</TableHead>
            <TableHead>closing time</TableHead>
            <TableHead>Booking fees per seat</TableHead>
            <TableHead>Cuisine type</TableHead>
            <TableHead>Restaurant type</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="overflow-x-auto">
          {restaurants.map((restaurant: any) => (
            <TableRow
              key={restaurant.id}
              className="odd:bg-muted/50 [&>*]:whitespace-nowrap"
            >
              <TableCell className="pl-4">{restaurant.id}</TableCell>
              <TableCell className="font-medium">{restaurant.name}</TableCell>
              <TableCell>
                {restaurant.description.substring(0, 100)}...
              </TableCell>
              <TableCell>{restaurant.address}</TableCell>
              <TableCell>{restaurant.city}</TableCell>
              <TableCell>{restaurant.state}</TableCell>
              <TableCell>{restaurant.postal_code}</TableCell>
              <TableCell>{restaurant.phone}</TableCell>
              <TableCell>{restaurant.operating_hours}</TableCell>
              <TableCell>{restaurant.capacity}</TableCell>
              <TableCell>{restaurant.status}</TableCell>
              <TableCell>{restaurant.opening_time}</TableCell>
              <TableCell>{restaurant.closing_time}</TableCell>
              <TableCell>${restaurant.booking_fees_per_seat} </TableCell>
              <TableCell>{restaurant?.cuisine_type?.name} </TableCell>
              <TableCell>{restaurant?.restaurant_type?.name} </TableCell>
              <TableCell>
                <Link href={`/restaurants/${restaurant.id}`}>
                  <Button>View</Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
