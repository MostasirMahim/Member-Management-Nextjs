import axiosInstance from "@/lib/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";

type Filters = {
  start_date?: Date;
  end_date?: Date;
  transferred?: boolean;
};
function useGetTransferHistory(page: number = 1, filters: Filters = {}) {
  return useQuery({
    queryKey: ["getTransferHistory", page],
    queryFn: async () => {
      try {
        const params = new URLSearchParams();
        params.append("page", page.toString());

        Object.entries(filters).forEach(([key, value]) => {
          if (value === null || value === undefined) return;

          if (
            (key === "start_date" && value instanceof Date) ||
            (key === "end_date" && value instanceof Date)
          ) {
            params.append(key, value.toISOString().split("T")[0]);
          } else {
            params.append(key, String(value));
          }
        });

        const res = await axiosInstance.get(
          `/api/member/v1/members/history/?${params.toString()}`
        );
        if (res?.data?.status == "success") {
          const result = res.data;
          return result;
        } else {
          console.error("Failed to fetch :", res.data.message);
          return [];
        }
      } catch (error: any) {
        console.error("Error fetching:", error);
        toast.error(
          "Error",
          error?.response?.data?.message || "Failed to Load History "
        );
        return [];
      }
    },
  });
}

export default useGetTransferHistory;
