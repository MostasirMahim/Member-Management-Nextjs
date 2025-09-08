import axiosInstance from "@/lib/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";



function useGetGroups() {
  return useQuery({
      queryKey: ["getGroups"],
      queryFn: async () => {
        try {
          const res = await axiosInstance.get("/api/account/v2/authorization/group_permissions/")
          if (res?.data?.status == 'success') {
            return res.data.data;
          } else {
            console.error("Failed to fetch groups:", res.data.message);
            return [];
          }
        } catch (error:any) {
          console.error("Error fetching:", error);
         toast.error(error?.response?.data?.message || "Failed to fetch groups");
          return [];
        }
      },
      refetchOnMount: "always", 
    });
}

export default useGetGroups