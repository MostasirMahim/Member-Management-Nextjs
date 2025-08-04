import axiosInstance from "@/lib/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import { toast } from "../use-toast";

function useGetAllChoice() {
  return useQuery({
    queryKey: ["getAllChoice"],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get(
          "/api/core/v1/all_choices/?cache=false"
        );
        if (res?.data?.status == "success") {
            const result =res.data.data
          return result;
        } else {
          console.error("Failed to fetch Choices:", res.data.message);
          return [];
        }
      } catch (error: any) {
        console.error("Error fetching Choices stats:", error);
        toast({
          title: "Error",
          description:
            error?.response?.data?.message || "Failed to fetch Choices",
          variant: "destructive",
        });
        return [];
      }
    },
  });
}

export default useGetAllChoice;