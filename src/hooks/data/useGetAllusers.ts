import axiosInstance from "@/lib/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import { toast } from "../use-toast";


function useGetAllUsers() {
  return useQuery({
      queryKey: ["getAllUsers"],
      queryFn: async () => {
        try {
          const res = await axiosInstance.get("/api/account/v1/view_all_users/")
          if (res?.data?.status == 'success') {
            return res.data.data;
          } else {
            console.error("Failed to fetch all users:", res.data.message);
            return [];
          }
        } catch (error:any) {
          console.error("Error fetching users:", error);
          toast({
            title: "Error",
            description: error?.response?.data?.message || "Failed to fetch users",
            variant: "destructive",
          });
          return [];
        }
      },
    });
}

export default useGetAllUsers;