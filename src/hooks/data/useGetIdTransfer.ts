import axiosInstance from "@/lib/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";

function useGetIdTransfer({ memberId }: { memberId: string }) {
  return useQuery({
    queryKey: ["getMemberIdTransfer", memberId],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get(
          `/api/member/v1/members/history/${memberId}/`
        );
        if (res?.data?.status == "success") {
          return res.data.data;
        } else {
          console.error("Failed to fetch permissions:", res.data.message);
          return [];
        }
      } catch (error: any) {
        console.error("Error fetching all permissions", error);
        toast.error(
          error?.response?.data?.message ||
            error.message ||
            "Error fetching all permissions"
        );
        return [];
      }
    },
  });
}

export default useGetIdTransfer;
