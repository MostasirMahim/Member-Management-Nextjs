import AddRestaurantForm from "@/components/restaurant/AddRestaruantForm";
import axiosInstance from "@/lib/axiosInstance";
import { cookies } from "next/headers";

async function RestaurantAddPage() {
  const cookieStore = cookies();
  const authToken = cookieStore.get("access_token")?.value || "";

  let cuisinesData = {};
  let categoriesData = {};

  try {
    const [cuisinesRes, categoriesRes] = await Promise.all([
      axiosInstance.get(
        "/api/restaurants/v1/restaurants/cusines/?page_size=200",
        {
          headers: {
            Cookie: `access_token=${authToken}`,
          },
        }
      ),
      axiosInstance.get(
        "/api/restaurants/v1/restaurants/categories/?page_size=200",
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
      <div>
        <h4 className="text-2xl font-bold text-center mb-4">
          Add a new restaurant
        </h4>
      </div>
      <AddRestaurantForm
        cuisinesData={cuisinesData}
        categoriesData={categoriesData}
      />
    </div>
  );
}

export default RestaurantAddPage;
