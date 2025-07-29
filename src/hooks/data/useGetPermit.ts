import axiosInstance from "@/lib/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import { toast } from "../use-toast";


function useGetPermit() {
  return useQuery({
      queryKey: ["getAllPermissions"],
      queryFn: async () => {
        try {
          const res = await axiosInstance.get("/api/account/v1/authorization/custom_permission_name/")
          if (res?.data?.status == 'success') {
            return res.data.data;
          } else {
            console.error("Failed to fetch permissions:", res.data.message);
            return [];
          }
        } catch (error:any) {
          console.error("Error fetching all permissions", error);
          toast({
            title: "Error",
            description: error?.response?.data?.message || "Failed to fetch all permissions",
            variant: "destructive",
          });
          return [];
        }
      },
    });
}

export default useGetPermit