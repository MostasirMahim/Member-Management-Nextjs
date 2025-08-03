// "use client";

// import React, { useState, useEffect } from "react";
// import axios from "@/lib/axiosInstance"; 
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import {
//   DropdownMenu,
//   DropdownMenuTrigger,
//   DropdownMenuContent,
//   DropdownMenuItem,
// } from "@/components/ui/dropdown-menu";
// import { MoreVertical } from "lucide-react";
// import CategoryTable from "@/components/products/categories/CategoryTable";


// export default function CategoriesPage() {
//   const [categories, setCategories] = useState([]);
//   const [newCategory, setNewCategory] = useState("");

//   const fetchCategories = async () => {
//     try {
//       const response = await axios.get("/api/product/v1/products/categories/");
//       setCategories(response.data);
//     } catch (error) {
//       console.error("Error fetching categories:", error);
//     }
//   };

//   const handleAddCategory = async () => {
//     if (!newCategory.trim()) return;
//     try {
//       await axios.post("/product/v1/products/categories/", {
//         name: newCategory,
//       });
//       setNewCategory("");
//       fetchCategories(); // reload list
//     } catch (error) {
//       console.error("Error adding category:", error);
//     }
//   };

//   useEffect(() => {
//     fetchCategories();
//   }, []);
//   console.log(categories);
//   return (
//     <div className="p-6 space-y-6">
//       {/* Add Category Card */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Add New Category</CardTitle>
//         </CardHeader>
//         <CardContent className="flex items-center gap-4">
//           <Input
//             placeholder="Category Name"
//             value={newCategory}
//             onChange={(e) => setNewCategory(e.target.value)}
//           />
//           <Button onClick={handleAddCategory}>Add</Button>
//         </CardContent>
//       </Card>

//       {/* Category List Table */}
//       <Card>
//         <CardHeader>
//           <CardTitle>All Categories</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead>#</TableHead>
//                 <TableHead>Category Name</TableHead>
//                 <TableHead className="text-right">Actions</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {categories.map((category, index) => (
//                 <TableRow key={category.id}>
//                   <TableCell>{index + 1}</TableCell>
//                   <TableCell>{category.name}</TableCell>
//                   <TableCell className="text-right">
//                     <DropdownMenu>
//                       <DropdownMenuTrigger asChild>
//                         <Button variant="ghost" size="icon">
//                           <MoreVertical className="h-4 w-4" />
//                         </Button>
//                       </DropdownMenuTrigger>
//                       <DropdownMenuContent align="end">
//                         <DropdownMenuItem>Edit</DropdownMenuItem>
//                         <DropdownMenuItem>Delete</DropdownMenuItem>
//                         <DropdownMenuItem>View</DropdownMenuItem>
//                       </DropdownMenuContent>
//                     </DropdownMenu>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

// import CategorySelect from "@/components/products/categories/CategorySelect";
import CategoryTable from "@/components/products/categories/CategoryTable";
import axiosInstance from "@/lib/axiosInstance";
import { cookies } from "next/headers";

export default async function CategoriesPage() {
  const cookieStore = cookies();
  const authToken = cookieStore.get("access_token")?.value || "";

  let categories = [];

  try {
    const { data } = await axiosInstance.get("/api/product/v1/products/categories/", {
      headers: {
        Cookie: `access_token=${authToken}`,
      },
    });
    categories = data;
  } catch (error) {
    console.error("Failed to fetch categories", error);
  }

  return (
    <div className="p-6 space-y-6">
      {/* User Input (select box etc) */}
      {/* <CategorySelect categories={categories} /> */}

      {/* Show in Table */}
      <CategoryTable categories={categories} />
    </div>
  );
}
