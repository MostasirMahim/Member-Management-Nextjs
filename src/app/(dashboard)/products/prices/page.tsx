"use client";

import { useState } from "react";
import axios from "@/lib/axiosInstance"; 
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function PricesPage() {
  const [price, setPrice] = useState("");
  const [prices, setPrices] = useState([]);

  const handleAddPrice = async () => {
    try {
      const res = await axios.post("/api/prices/", { price });
      setPrices([...prices, res.data]);
      setPrice("");
    } catch (error) {
      console.error("Price add failed:", error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Add Price</h2>
      <div className="flex gap-2 mb-6">
        <Input
          placeholder="Enter price"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <Button onClick={handleAddPrice}>Add</Button>
      </div>

      <h3 className="text-lg font-medium mb-2">📋 All Prices:</h3>
      <div className="border rounded-md">
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">#</th>
              <th className="p-2">Price</th>
            </tr>
          </thead>
          <tbody>
            {prices.map((p, index) => (
              <tr key={p.id}>
                <td className="p-2">{index + 1}</td>
                <td className="p-2">${p.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
