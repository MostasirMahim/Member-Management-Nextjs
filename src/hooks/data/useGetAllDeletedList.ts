import axiosInstance from "@/lib/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";

function useGetAllDeletedList() {
  return useQuery({
    queryKey: ["getAllDeletedList"],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get(
          "/api/member/v1/members/deleted/list/"
        );
        if (res?.data?.status == "success") {
          const result =res.data
          return result;
        } else {
          console.error("Failed to fetch Deleted List:", res.data.message);
          return [];
        }
      } catch (error: any) {
        console.error("Error fetching Deleted List:", error);
       toast.error("Error fetching Deleted List");
        return [];
      }
    },
  });
}

export default useGetAllDeletedList;