import axiosInstance from "@/lib/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";

function useGetAllMembers() {
  return useQuery({
    queryKey: ["getAllMembers"],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get("/api/member/v1/members/list/");
        if (res?.data?.status == "success") {
          const result = res.data;
          return result;
        } else {
          console.error("Failed to fetch Choices:", res.data.message);
          return [];
        }
      } catch (error: any) {
        console.error("Error fetching Choices stats:", error);
        toast(
          "Error",
          error?.response?.data?.message || "Failed to fetch Members"
        );
        return [];
      }
    },
  });
}

export default useGetAllMembers;