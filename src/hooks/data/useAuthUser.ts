import { getUserInfo } from "@/actions/authentication/actions";
import { useQuery } from "@tanstack/react-query";

function useAuthUser() {
  return  useQuery({
        queryKey: ["authUser"],
        queryFn: async () => {
          try {
            const res = await getUserInfo();
            if (res?.success) {
              return res?.data?.data[0]?.username;
            } else {
              console.error("Failed to fetch user info:", res.message);
              return null;
            }
          } catch (error) {
            console.error("Error fetching user stats:", error);
            return [];
          }
        },
        retry: false,
      });
}

export default useAuthUser;