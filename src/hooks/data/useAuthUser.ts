import axiosInstance from "@/lib/axiosInstance";
import { useQuery } from "@tanstack/react-query";

//TODO: Check if user is logged in
function useAuthUser() {
  return useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get(
          "/api/account/v1/authorization/get_user_all_permissions/"
        );
        if (res?.data?.status == "success") {
          return res?.data?.data[0]?.username;
        } else {
          console.error("Failed to fetch user info:", res?.data.message);
          return null;
        }
      } catch (error) {
        console.error("Error fetching user stats:", error);
        return null;
      }
    },
    retry: false,
  });
}

export default useAuthUser;
