import { MoreHorizontal } from "lucide-react";
import { ComponentPropsWithoutRef } from "react";

interface PaginationEllipsisProps extends ComponentPropsWithoutRef<"div"> {}

export function PaginationEllipsis({
  className,
  ...props
}: PaginationEllipsisProps) {
  return (
    <span
      className={
        "flex h-9 w-9 items-center justify-center text-muted-foreground " +
        (className || "")
      }
      {...props}
    >
      <MoreHorizontal className="h-4 w-4" />
      <span className="sr-only">More pages</span>
    </span>
  );
}
