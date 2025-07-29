"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Search,
  Filter,
  MoreHorizontal,
  ArrowUpDown,
  Pencil,
  Trash2,
  Eye,
  FileText,
  Star,
  StarOff,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

import { useQuery } from "@tanstack/react-query";
import { formatJoinedDate } from "@/lib/date_modify";
import { useRouter } from "next/navigation";
import { LoadingPage } from "@/components/ui/loading";
import { articles } from "@/lib/dummy";

export default function PostsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const router = useRouter();

  // const { data: allArticles, isLoading: post_isLoading } = useQuery({
  //   queryKey: ["all_Posts"],
  //   queryFn: () => getAllPosts(),
  // });


  const categories = Array.from(
    new Set(articles?.map((article) => article.category))
  );

  const filteredArticles =
    articles?.filter((article) => {
      const matchesSearch =
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.author
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        article.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" || article.category === selectedCategory;

      return matchesSearch && matchesCategory;
    }) || [];

  const handleSelectAll = () => {
    if (selectedItems.length === filteredArticles.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredArticles.map((article) => article.id));
    }
  };

  const handleSelectItem = (id: string) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((item) => item !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const handleBulkAction = (action: string) => {
    setSelectedItems([]);
  };

  // if (post_isLoading) return <LoadingPage />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Posts</h1>
          <p className="text-muted-foreground">
            Manage all articles and content
          </p>
        </div>

        <Button className="gap-1">
          <FileText className="h-4 w-4" /> New Post
        </Button>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search posts..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-1">
                <Filter className="h-4 w-4" /> Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuLabel>Filter Posts</DropdownMenuLabel>
              <DropdownMenuSeparator />

              <div className="p-2">
                <label htmlFor="category-filter" className="text-xs">
                  Category
                </label>
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger id="category-filter">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="p-2">
                <label htmlFor="status-filter" className="text-xs">
                  Status
                </label>
                <Select
                  value={selectedStatus}
                  onValueChange={setSelectedStatus}
                >
                  <SelectTrigger id="status-filter">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Published">Published</SelectItem>
                    <SelectItem value="Draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  setSelectedCategory("all");
                  setSelectedStatus("all");
                }}
              >
                Reset Filters
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {selectedItems.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Bulk Actions ({selectedItems.length})
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleBulkAction("feature")}>
                <Star className="h-4 w-4 mr-2" /> Feature Selected
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleBulkAction("unfeature")}>
                <StarOff className="h-4 w-4 mr-2" /> Unfeature Selected
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleBulkAction("delete")}
                className="text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" /> Delete Selected
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* Posts Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={
                    selectedItems.length === filteredArticles.length &&
                    filteredArticles.length > 0
                  }
                  onCheckedChange={handleSelectAll}
                  aria-label="Select all"
                />
              </TableHead>
              <TableHead className="w-[300px]">
                <div className="flex items-center gap-1">
                  Title
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <ArrowUpDown className="h-3 w-3" />
                  </Button>
                </div>
              </TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredArticles.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-8 text-muted-foreground"
                >
                  No posts found. Try adjusting your filters.
                </TableCell>
              </TableRow>
            ) : (
              filteredArticles.map((article) => (
                <TableRow key={article.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedItems.includes(article.id)}
                      onCheckedChange={() => handleSelectItem(article.id)}
                      aria-label={`Select ${article.title}`}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 flex-shrink-0">
                        <Image
                          src={article.image || "/placeholder.svg"}
                          alt={article.title}
                          fill
                          className="object-cover rounded-md"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-1">
                          <p className="font-medium">{article.title}</p>
                          {false && (
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {article.excerpt?.substring(0, 60)}...
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{article.author || "Unknown"}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{article.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={"default"}
                      className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                    >
                      "Published"
                    </Badge>
                  </TableCell>
                  {/* <TableCell>{formatJoinedDate(article.createdAt)}</TableCell> */}
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() =>
                            router.push(`/article/${article.slug}`)
                          }
                          className="gap-2"
                        >
                          <Eye className="h-4 w-4" /> View
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2">
                          <Pencil className="h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2">
                          {false? (
                            <>
                              <StarOff className="h-4 w-4" /> Unfeature
                            </>
                          ) : (
                            <>
                              <Star className="h-4 w-4" /> Feature
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive gap-2">
                          <Trash2 className="h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing <strong>1</strong> to{" "}
          <strong>{filteredArticles.length}</strong> of{" "}
          <strong>{filteredArticles.length}</strong> posts
        </p>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm" disabled>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
