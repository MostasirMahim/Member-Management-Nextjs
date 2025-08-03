"use client";

import { useEffect, useState } from "react";
import axios from "@/lib/axiosInstance";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function MediaPage() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const fetchCategories = async () => {
    try {
      const res = await axios.get("/api/categories/");
      setCategories(res.data);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleUpload = async () => {
    if (!imageFile || !selectedCategory) {
      alert("Please select a file and category.");
      return;
    }

    const formData = new FormData();
    formData.append("image", imageFile);
    formData.append("category", selectedCategory);

    try {
      await axios.post("/api/media/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Image uploaded successfully!");
    } catch (error) {
      console.error("Upload failed", error);
      alert("Upload failed.");
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4">Upload Media</h2>
      <div className="space-y-4">
        <Input
          type="file"
          onChange={(e) => setImageFile(e.target.files?.[0] || null)}
        />

        <Select onValueChange={setSelectedCategory}>
          <SelectTrigger>
            <SelectValue placeholder="Select Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={String(cat.id)}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button onClick={handleUpload}>Upload</Button>
      </div>
    </div>
  );
}
