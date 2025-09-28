"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { RefreshCcwIcon } from "lucide-react";

export default function RefreshButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      variant="outline"
      onClick={() => startTransition(() => router.refresh())}
      className="gap-2 hover:bg-primary hover:text-primary-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
    >
      <RefreshCcwIcon className={`h-4 w-4 ${isPending ? "animate-spin" : ""}`} />
      Refresh
    </Button>
  );
}
