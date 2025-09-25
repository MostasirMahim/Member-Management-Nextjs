"use client";
import { useFormik } from "formik";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import useGetPermit from "@/hooks/data/useGetPermit";
import { LoadingDots } from "../ui/loading";
import useGetIdsList from "@/hooks/data/useGetIdsList";
import { Search } from "lucide-react";
import { Input } from "../ui/input";
import { useState } from "react";

interface FormProps {
  variables?: any;
  isSingle?: boolean;
  onCancel: () => void;
}

export function MembersList({ isSingle = false,
  variables,
  onCancel,
}: FormProps) {
  const { data: ALL_IDS, isLoading } = useGetIdsList();
    const [searchQuery, setSearchQuery] = useState("");

  const ALL_LIST = ALL_IDS?.filter((id: any) => {
      const matchesSearch = id.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesSearch }) || [];

  const formik = useFormik({
    initialValues: {
      selectedIds: [] as string[],
    },
    onSubmit: async (values) => {
     console.log(values);
      if(variables){
        variables.setFieldValue("member_ID",values.selectedIds[0] ||"")
        onCancel();
      }
    },
  });

  const handleidsChange = (ids: any, checked: boolean) => {
    const currentIds = formik.values.selectedIds;
    if (isSingle) {
      formik.setFieldValue("selectedIds", checked ? [ids] : []);
      return;
    }

    if (checked) {
      formik.setFieldValue("selectedIds", [
        ...currentIds,
        ids,
      ]);
    } else {
      formik.setFieldValue(
        "selectedIds",
        currentIds.filter((p) => p !== ids)
      );
    }
  };

  const selectAll = () => {
    formik.setFieldValue(
      "selectedIds",
      ALL_LIST?.map((p: any) => p)
    );
  };

  const clearAll = () => {
    formik.setFieldValue("selectedIds", []);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-sm text-muted-foreground">
            Loading idss...
          </p>
        </div>
      </div>
    );
  }
  if (isLoading) return <LoadingDots />;

  return (
    <div className="w-full mx-auto">
      <form onSubmit={formik.handleSubmit} className="space-y-4 sm:space-y-6">
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search Members..."
              className="pl-10 bg-background focus-visible:ring-0 focus-visible:ring-offset-0 h-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={selectAll}
                disabled={isSingle}
                className="text-xs sm:text-sm bg-transparent"
              >
                Select All
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={clearAll}
                className="text-xs sm:text-sm bg-transparent"
              >
                Clear All
              </Button>
            </div>
          </div>

          <div className="text-sm text-muted-foreground">
            Selected : {formik.values.selectedIds.length} of{" "}
            {ALL_LIST?.length || 0} members
          </div>

          <ScrollArea className="h-[250px] sm:h-[300px] border rounded-md p-3 sm:p-4">
            <div className="space-y-2 sm:space-y-3">
              {ALL_LIST?.map((ids: any, index: number) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 p-1 hover:bg-muted/50 rounded"
                >
                  <Checkbox
                    id={ids}
                    checked={formik.values.selectedIds.includes(
                      ids
                    )}
                    onCheckedChange={(checked) =>
                      handleidsChange(ids, checked as boolean)
                    }
                  />
                  <Label
                    htmlFor={ids}
                    className="text-xs sm:text-sm font-mono cursor-pointer flex-1 leading-tight"
                  >
                    {ids}
                  </Label>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="w-full sm:w-auto bg-transparent"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={
              formik.values.selectedIds.length === 0 ||
              formik.isSubmitting
            }
            className="w-full sm:w-auto"
          >
            {formik.isSubmitting
              ? "Adding..."
              : `Add ${formik.values.selectedIds.length} ids${
                  formik.values.selectedIds.length !== 1 ? "s" : ""
                }`}
          </Button>
        </div>
      </form>
    </div>
  );
}
