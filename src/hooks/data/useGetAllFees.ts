import axiosInstance from "@/lib/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";

function useGetAllFees() {
  return useQuery({
    queryKey: ["getAllFees"],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get("/api/event/v1/events/fees/");
        if (res?.data?.status == "success") {
          return res?.data;
        } else {
          console.error("Failed to fetch:", res.data.message);
          return [];
        }
      } catch (error: any) {
        console.error("Error fetching users:", error);
        toast.error(error?.response?.data?.message || "Failed to fetch fees");
        return [];
      }
    },
  });
}

export default useGetAllFees;
