"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Filter, RefreshCcw } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface FilterOptions {
  categories: string[];
  brands: string[];
}

interface Props {
  filterOptions: FilterOptions;
}

export function SearchFilterSection({ filterOptions }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || "all"
  );
  const [selectedBrand, setSelectedBrand] = useState(
    searchParams.get("brand") || "all"
  );

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");
    if (searchQuery) {
      params.set("search", searchQuery);
    } else {
      params.delete("search");
    }
    router.push(`?${params.toString()}`);
  };

  const handleCategoryChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");
    if (value !== "all") {
      params.set("category", value);
    } else {
      params.delete("category");
    }
    setSelectedCategory(value);
    router.push(`?${params.toString()}`);
  };

  const handleBrandChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");
    if (value !== "all") {
      params.set("brand", value);
    } else {
      params.delete("brand");
    }
    setSelectedBrand(value);
    router.push(`?${params.toString()}`);
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedBrand("all");
    router.push(`?page=1`);
  };

  return (
    <div className="flex flex-col sm:flex-wrap gap-4">
      <div className="flex-1 flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search products..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-1">
              <Filter className="h-4 w-4" /> Filter
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            <DropdownMenuLabel>Filter Products</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="p-2">
              <Label htmlFor="category-filter" className="text-xs">
                Category
              </Label>
              <Select
                value={selectedCategory}
                onValueChange={handleCategoryChange}
              >
                <SelectTrigger id="category-filter">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {filterOptions.categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="p-2">
              <Label htmlFor="brand-filter" className="text-xs">
                Brand
              </Label>
              <Select value={selectedBrand} onValueChange={handleBrandChange}>
                <SelectTrigger id="brand-filter">
                  <SelectValue placeholder="Select brand" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Brands</SelectItem>
                  {filterOptions.brands.map((brand) => (
                    <SelectItem key={brand} value={brand}>
                      {brand}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleResetFilters}>
              <RefreshCcw className="mr-2 h-4 w-4" /> Reset Filters
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button onClick={handleSearch} className="sm:hidden">
          <Search className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}