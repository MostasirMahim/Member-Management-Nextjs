import { cookies } from 'next/headers';
import axiosInstance from "@/lib/axiosInstance";
import BrandTable from "@/components/products/brands/BrandTable";

export default async function BrandPage () {
    const cookieStore = cookies();
    const authToken = cookieStore.get("access_token")?.value || "";

    let brands = [];
    try {
        const { data } = await axiosInstance.get("/api/product/v1/products/brands/", {
            headers: {
                Cookie: `access_token=${authToken}`,
            }
        });
        brands = data;
    } catch (err) {
        console.error("Error fetching brands:", err);
    }
    
    return (
        <div className="p-6 space-y-6">
             
              <BrandTable brands={brands} />
        </div>
    );
}
