"use client";

import { useState } from "react";
import axios from "@/lib/axiosInstance"; 
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function BrandsPage() {
  const [brandName, setBrandName] = useState("");
  const [brands, setBrands] = useState([]);

  const handleAddBrand = async () => {
    try {
      const res = await axios.post("/api/brands/", { name: brandName });
      setBrands([...brands, res.data]);
      setBrandName("");
    } catch (error) {
      console.error("Brand add failed:", error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Add New Brand</h2>
      <div className="flex gap-2 mb-6">
        <Input
          placeholder="Enter brand name"
          value={brandName}
          onChange={(e) => setBrandName(e.target.value)}
        />
        <Button onClick={handleAddBrand}>Add</Button>
      </div>

      <h3 className="text-lg font-medium mb-2">📋 All Brands:</h3>
      <div className="border rounded-md">
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">#</th>
              <th className="p-2">Brand Name</th>
            </tr>
          </thead>
          <tbody>
            {brands.map((brand, index) => (
              <tr key={brand.id}>
                <td className="p-2">{index + 1}</td>
                <td className="p-2">{brand.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
