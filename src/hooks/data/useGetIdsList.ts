import axiosInstance from "@/lib/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";

function useGetIdsList() {
  return useQuery({
    queryKey: ["getIdsList"],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get(
          "/api/member/v1/members/list/ids/"
        );
        if (res?.data?.status == "success") {
        const result =res.data?.data
          return result;
        } else {
          console.error("Failed to fetch List:", res.data.message);
          return [];
        }
      } catch (error: any) {
        console.error("Error fetching List stats:", error);
       toast.error("Error fetching List");
        return [];
      }
    },
  });
}

export default useGetIdsList;