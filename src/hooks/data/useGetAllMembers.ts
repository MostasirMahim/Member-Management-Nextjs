import axiosInstance from "@/lib/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";

type Filters = {
  date_of_birth?: Date;
  membership_type?: string;
  membership_status?: string;
  blood_group?: string;
  gender?: string;
  institute_name?: string;
  marital_status?: string;
  download_excel?: boolean;

  nationality?: string;
  contact_number?: string;
  email?: string;
  member_ID?: string;
  name?: string;
};
function useGetAllMembers(page: number = 1, filters: Filters = {}) {
  return useQuery({
    queryKey: ["getAllMembers", page],
    queryFn: async () => {
      try {
        const params = new URLSearchParams();
        params.append("page", page.toString());

        Object.entries(filters).forEach(([key, value]) => {
          if (value === null || value === undefined || value === "") return;

          if (key === "date_of_birth" && value instanceof Date) {
            params.append(key, value.toISOString().split("T")[0]); // format date
          } else {
            params.append(key, String(value));
          }
        });

        const res = await axiosInstance.get(
          `/api/member/v1/members/list/?${params.toString()}`
        );
        if (res?.data?.status == "success") {
          const result = res.data;
          return result;
        } else {
          console.error("Failed to fetch Choices:", res.data.message);
          return [];
        }
      } catch (error: any) {
        console.error("Error fetching Choices stats:", error);
        toast(
          "Error",
          error?.response?.data?.message || "Failed to fetch Members"
        );
        return [];
      }
    },
  });
}

export default useGetAllMembers;
