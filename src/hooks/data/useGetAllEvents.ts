import axiosInstance from "@/lib/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";


function useGetAllEvents() {
  return useQuery({
      queryKey: ["getAllEvents"],
      queryFn: async () => {
        try {
          const res = await axiosInstance.get("/api/event/v1/events/")
          if (res?.data?.status == 'success') {
            return res?.data;
          } else {
            console.error("Failed to fetch all users:", res.data.message);
            return [];
          }
        } catch (error:any) {
          console.error("Error fetching users:", error);
          toast.error(error?.response?.data?.message || "Failed to fetch users");
          return [];
        }
      },
    });
}

export default useGetAllEvents;