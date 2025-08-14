import RestaurantItemAddForm from "@/components/restaurant/RestaurantItemAddForm";
import axiosInstance from "@/lib/axiosInstance";
import { cookies } from "next/headers";

async function RestaurantItemsAdd() {
  const cookieStore = cookies();
  const authToken = cookieStore.get("access_token")?.value || "";
  let restaurantData = {};
  let categoryData = {};

  try {
    const [restaurantRes, categoriesRes] = await Promise.all([
      axiosInstance.get(`/api/restaurants/v1/restaurants/?page_size=200`, {
        headers: {
          Cookie: `access_token=${authToken}`,
        },
      }),
      axiosInstance.get(
        `/api/restaurants/v1/restaurants/items/categories/?page_size=200`,
        {
          headers: {
            Cookie: `access_token=${authToken}`,
          },
        }
      ),
    ]);
    restaurantData = restaurantRes.data;
    categoryData = categoriesRes.data;
  } catch (error: any) {
    console.log("Error occurred");
    console.log(error.response?.data);
    const errorMsg = error?.response?.data?.message || "Something went wrong";
    throw new Error(errorMsg);
  }
  return (
    <div>
      <RestaurantItemAddForm
        categoriesData={categoryData}
        restaurantData={restaurantData}
      />
    </div>
  );
}

export default RestaurantItemsAdd;
