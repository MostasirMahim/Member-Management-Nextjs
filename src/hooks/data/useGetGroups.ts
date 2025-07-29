import axiosInstance from "@/lib/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import { toast } from "../use-toast";


function useGetGroups() {
  return useQuery({
      queryKey: ["getGroups"],
      queryFn: async () => {
        try {
          const res = await axiosInstance.get("/api/account/v1/authorization/group_permissions/")
          if (res?.data?.status == 'success') {
            return res.data.data;
          } else {
            console.error("Failed to fetch groups:", res.data.message);
            return [];
          }
        } catch (error:any) {
          console.error("Error fetching user stats:", error);
          toast({
            title: "Error",
            description: error?.response?.data?.message || "Failed to fetch groups",
            variant: "destructive",
          });
          return [];
        }
      },
    });
}

export default useGetGroups