import axiosInstance from "@/lib/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";

function useGetMember(id: string, option = {}) {
  return useQuery({
    queryKey: ["useGetMember", id],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get(`/api/member/v1/members/${id}/`);
        if (res?.data?.status == "success") {
          const result = res.data?.data;
          return result;
        } else {
          console.error("Failed to fetch :", res.data.message);
          return [];
        }
      } catch (error: any) {
        console.error("Error fetching : ", error);
        toast(
          "Error",
          error?.response?.data?.message || "Failed to fetch Member"
        );
        return [];
      }
    },
    enabled: !!id,
    ...option,
  });
}

export default useGetMember;
