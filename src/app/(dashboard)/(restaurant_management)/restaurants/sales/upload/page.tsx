import RestaurantSalesUploadForm from "@/components/restaurant/RestaurantSalesUploadForm";
import axiosInstance from "@/lib/axiosInstance";
import { cookies } from "next/headers";
import React from "react";

interface Props {
  searchParams: Promise<{ page?: string }>;
}

async function RestaurantSalesUploadPage({ searchParams }: Props) {
  const cookieStore = cookies();
  const authToken = cookieStore.get("access_token")?.value || "";

  let incomeParticularData = {};
  let receivedFromData = {};
  let restaurantData = {};
  let { page } = await searchParams;
  page = page || "1";

  try {
    const [incomeRes, receivedFromRes, restaurantRes] = await Promise.all([
      axiosInstance.get("/api/member_financial/v1/income/particular/", {
        headers: {
          Cookie: `access_token=${authToken}`,
        },
      }),
      axiosInstance.get("/api/member_financial/v1/income/receiving_options/", {
        headers: {
          Cookie: `access_token=${authToken}`,
        },
      }),
      axiosInstance.get(`/api/restaurants/v1/restaurants/?page=${page}`, {
        headers: {
          Cookie: `access_token=${authToken}`,
        },
      }),
    ]);
    incomeParticularData = incomeRes.data;
    receivedFromData = receivedFromRes.data;
    restaurantData = restaurantRes.data;
  } catch (error: any) {
    console.log("Error occurred");
    console.log(error.response?.data);
    const errorMsg = error?.response?.data?.message || "Something went wrong";
    throw new Error(errorMsg);
  }
  return (
    <div>
      <div>
        <h4 className="text-center font-bold text-3xl mb-4">
          Upload restaurant sales file{" "}
        </h4>
      </div>
      <RestaurantSalesUploadForm
        incomeParticular={incomeParticularData}
        receivedFrom={receivedFromData}
        restaurant={restaurantData}
      />
    </div>
  );
}

export default RestaurantSalesUploadPage;
