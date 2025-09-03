import axiosInstance from "@/lib/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";

function useGetTicket(ticket_id:string) {
  return useQuery({
      queryKey: ["getTicket",ticket_id],
      queryFn: async () => {
        try {
          const res = await axiosInstance.get(`/api/event/v1/events/tickets/${ticket_id}/`)
          if (res?.data?.status == 'success') {
            return res?.data?.data;
          } else {
            console.error("Failed to fetch all Tickets:", res.data.message);
            return {};
          }
        } catch (error:any) {
          console.error("Error fetching users:", error);
          toast.error(error?.response?.data?.message || "Failed to fetch users");
          return {};
        }
      },
    });
}

export default useGetTicket;