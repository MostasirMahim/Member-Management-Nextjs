import MediaTable from "@/components/products/media/MediaTable";
import axiosInstance from "@/lib/axiosInstance";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { toast } from "react-toastify";

export default async function MediaPage() {
  const cookieStore = cookies();
  const authToken = cookieStore.get("access_token")?.value;

  if (!authToken) {
    redirect("/");
  }

  let media = [];

  try {
    const { data } = await axiosInstance.get(
      "/api/product/v1/products/media/",
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );
    media = data;
  } catch (error: any) {
    if (error?.response?.status === 401 || error?.response?.status === 403) {
      redirect("/");
    }
    console.error("Failed to fetch media", error);
  }

  return (
    <div className="p-6 space-y-6">
      <MediaTable media={media} />
    </div>
  );
}
