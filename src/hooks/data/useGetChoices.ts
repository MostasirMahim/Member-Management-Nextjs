import axiosInstance from "@/lib/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import dataToChoiceSections from "@/lib/choice_transformer";
import { toast } from "react-toastify";

function useGetChoices() {
  return useQuery({
    queryKey: ["getChoices"],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get(
          "/api/core/v1/all_choices/?cache=false"
        );
        if (res?.data?.status == "success") {
          const result = dataToChoiceSections(res.data.data);
          return result;
        } else {
          console.error("Failed to fetch Choices:", res.data.message);
          return [];
        }
      } catch (error: any) {
        console.error("Error fetching Choices stats:", error);
        toast.error(error?.response?.data?.message || "Error fetching Choices");
        return [];
      }
    },
  });
}

export default useGetChoices;
