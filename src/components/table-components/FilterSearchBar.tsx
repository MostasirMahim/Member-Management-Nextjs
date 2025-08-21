"use client";
import React, { useState } from "react";
import { Search, Filter, Calendar, FileSpreadsheet } from "lucide-react";

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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import useGetAllChoice from "@/hooks/data/useGetAllChoice";
import useGetAllMembers from "@/hooks/data/useGetAllMembers";

interface FilterState {
  date_of_birth?: Date;
  membership_type?: string;
  membership_status?: string;
  blood_group?: string;
  gender?: string;
  institute_name?: string;
  marital_status?: string;
}
const initialFilters: FilterState = {
  date_of_birth: undefined,
  membership_type: "",
  membership_status: "",
  blood_group: "",
  gender: "",
  institute_name: "",
  marital_status: "",
};
function FilterSearchBar() {
  const [filters, setFilters] = useState<FilterState>(initialFilters);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { data: choiceSections } = useGetAllChoice();
  const { refetch, isFetching  } = useGetAllMembers(1, filters);
  const {
    membership_type,
    institute_name,
    gender,
    membership_status,
    marital_status,
  } = choiceSections ?? {};

  const updateFilter = (
    key: keyof FilterState,
    value: string | Date | undefined
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };
  const resetFilters = () => {
    setFilters(initialFilters);
  };

  return (
    <div
      className={`w-full  ${isFilterOpen ? "shadow-lg border rounded-lg" : ""}`}
    >
      <div className="flex gap-2 ">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search users..."
            className="pl-10 border-0 bg-background focus-visible:ring-0 focus-visible:ring-offset-0 h-10"
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="gap-2 border-0 bg-background h-10 hover:bg-primary hover:text-primary-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
        >
          <Filter className="h-4 w-4" />
          Filter
        </Button>
      </div>

      {isFilterOpen && (
        <div className="border-t-2 mt-1 border-primary bg-background p-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Date of Birth
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal bg-transparent"
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {filters.date_of_birth ? (
                      format(filters.date_of_birth, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={filters.date_of_birth}
                    onSelect={(date) => updateFilter("date_of_birth", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Membership Type
              </Label>
              <Select
                value={filters.membership_type}
                onValueChange={(value) =>
                  updateFilter("membership_type", value)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose Membership Type" />
                </SelectTrigger>
                <SelectContent>
                  {membership_type?.map((choice: any, index: number) => (
                    <SelectItem key={index} value={choice.name}>
                      {choice.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Membership Status
              </Label>
              <Select
                value={filters.membership_status}
                onValueChange={(value) =>
                  updateFilter("membership_status", value)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose Membership Status" />
                </SelectTrigger>
                <SelectContent>
                  {membership_status?.map((choice: any, index: number) => (
                    <SelectItem key={index} value={choice.name}>
                      {choice.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Blood Group
              </Label>
              <Select
                value={filters.blood_group}
                onValueChange={(value) => updateFilter("blood_group", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose Blood Group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A+">A+</SelectItem>
                  <SelectItem value="A-">A-</SelectItem>
                  <SelectItem value="B+">B+</SelectItem>
                  <SelectItem value="B-">B-</SelectItem>
                  <SelectItem value="AB+">AB+</SelectItem>
                  <SelectItem value="AB-">AB-</SelectItem>
                  <SelectItem value="O+">O+</SelectItem>
                  <SelectItem value="O-">O-</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Institute Name
              </Label>
              <Select
                value={filters.institute_name}
                onValueChange={(value) => updateFilter("institute_name", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose Institute" />
                </SelectTrigger>
                <SelectContent>
                  {institute_name?.map((choice: any, index: number) => (
                    <SelectItem key={index} value={choice.name}>
                      {choice.name} - {choice.code}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Marital Status
              </Label>
              <Select
                value={filters.marital_status}
                onValueChange={(value) => updateFilter("marital_status", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="What's Marital Status?" />
                </SelectTrigger>
                <SelectContent>
                  {marital_status?.map((choice: any, index: number) => (
                    <SelectItem key={index} value={choice.name}>
                      {choice.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Gender
              </Label>
              <Select
                value={filters.gender}
                onValueChange={(value) => updateFilter("gender", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose Gender">
                    {filters.gender}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {gender?.map((choice: any, index: number) => (
                    <SelectItem key={index} value={choice.name}>
                      {choice.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className=" flex items-center justify-center gap-2">
                <Button className="mt-4" onClick={() => refetch()}>
                <Filter className="h-4 w-4" />
                {isFetching ? "Filtering..." : "Apply"}
              </Button>
              <Button className="mt-4" variant="destructive" onClick={() => resetFilters()}>
                Reset
              </Button>
              
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FilterSearchBar;
