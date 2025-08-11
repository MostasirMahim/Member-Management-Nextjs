import ShowRestaurantChoices from "@/components/restaurant/ShowRestaurantChoices";
import axiosInstance from "@/lib/axiosInstance";
import { cookies } from "next/headers";

interface Props {
  searchParams: Promise<{ page: string }>;
}

async function RestaurantChoicesPage({ searchParams }: Props) {
  const cookieStore = cookies();
  const authToken = cookieStore.get("access_token")?.value || "";
  let { page } = await searchParams;
  let cuisinesData = {};
  let categoriesData = {};
  page = page || "1";

  try {
    const [cuisinesRes, categoriesRes] = await Promise.all([
      axiosInstance.get(
        `/api/restaurants/v1/restaurants/cusines/?page=${page}`,
        {
          headers: {
            Cookie: `access_token=${authToken}`,
          },
        }
      ),
      axiosInstance.get(
        `/api/restaurants/v1/restaurants/categories/?page=${page}`,
        {
          headers: {
            Cookie: `access_token=${authToken}`,
          },
        }
      ),
    ]);
    cuisinesData = cuisinesRes.data;
    categoriesData = categoriesRes.data;
  } catch (error: any) {
    console.log("Error occurred");
    console.log(error.response?.data);
    const errorMsg = error?.response?.data?.message || "Something went wrong";
    throw new Error(errorMsg);
  }

  return (
    <div className="shadow-md border p-4 rounded-md">
      <div className="mb-4">
        <h4 className="text-2xl font-bold text-center">Restaurant choices</h4>
        <p className="text-center">Set and view restaurant choices</p>
      </div>

      <div className="flex  flex-wrap  md:flex-row flex-col gap-4">
        <div className="flex-1">
          <h5 className="font-bold">All available restaurant cuisines</h5>
          <ShowRestaurantChoices data={cuisinesData} state="cuisine" />
        </div>
        <div className="flex-1">
          <h5 className="font-bold">All available restaurant category</h5>
          <ShowRestaurantChoices data={categoriesData} state="category" />
        </div>
      </div>
    </div>
  );
}

export default RestaurantChoicesPage;
