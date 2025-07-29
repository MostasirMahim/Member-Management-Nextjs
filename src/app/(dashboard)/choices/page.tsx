"use client";
import { useState } from "react";
import { useFormik } from "formik";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ChoiceItem {
  id: string;
  name: string;
  code?: string;
}

interface ChoiceSection {
  title: string;
  slug: string;
  component: string;
  items: ChoiceItem[];
  hasCode?: boolean;
}

const DUMMY_DATA: ChoiceSection[] = [
  {
    title: "Membership Type",
    slug: "membership-type",
    component: "MembershipTypeChoice",
    items: [
      { id: "1", name: "LM" },
      { id: "2", name: "GM" },
      { id: "3", name: "Associate Member" },
      { id: "10", name: "LM" },
      { id: "20", name: "GM" },
      { id: "30", name: "Associate Member" },
      { id: "100", name: "LM" },
      { id: "200", name: "GM" },
      { id: "300", name: "Associate Member" },
      { id: "18", name: "LM" },
      { id: "28", name: "GM" },
      { id: "38", name: "Associate Member" },
    ],
  },
  {
    title: "Institute Name",
    slug: "institute-name",
    component: "InstituteNameChoice",
    hasCode: true,
    items: [
      { id: "1", name: "Bramonbaria Polytechnic Institute", code: "BPI" },
      { id: "2", name: "Dhaka University", code: "DU" },
      {
        id: "3",
        name: "Bangladesh University of Engineering and Technology",
        code: "BUET",
      },
    ],
  },
  {
    title: "Gender",
    slug: "gender",
    component: "GenderChoice",
    items: [
      { id: "1", name: "Male" },
      { id: "2", name: "Female" },
      { id: "3", name: "Other" },
    ],
  },
  {
    title: "Membership Status",
    slug: "membership-status",
    component: "MembershipStatusChoice",
    items: [
      { id: "1", name: "Active" },
      { id: "2", name: "Inactive" },
      { id: "3", name: "Pending" },
    ],
  },
  {
    title: "Marital Status",
    slug: "marital-status",
    component: "MaritalStatusChoice",
    items: [
      { id: "1", name: "Single" },
      { id: "2", name: "Married" },
      { id: "3", name: "Divorced" },
      { id: "4", name: "Widowed" },
    ],
  },
  {
    title: "Employment Type",
    slug: "employment-type",
    component: "EmploymentTypeChoice",
    items: [
      { id: "1", name: "Full Time" },
      { id: "2", name: "Part Time" },
      { id: "3", name: "Contract" },
      { id: "4", name: "Freelance" },
    ],
  },
  {
    title: "Email Type",
    slug: "email-type",
    component: "EmailTypeChoice",
    items: [
      { id: "1", name: "Personal" },
      { id: "2", name: "Work" },
      { id: "3", name: "Other" },
    ],
  },
  {
    title: "Contact Type",
    slug: "contact-type",
    component: "ContactTypeChoice",
    items: [
      { id: "1", name: "Mobile" },
      { id: "2", name: "Home" },
      { id: "3", name: "Office" },
    ],
  },
  {
    title: "Address Type",
    slug: "address-type",
    component: "AddressTypeChoice",
    items: [
      { id: "1", name: "Present" },
      { id: "2", name: "Permanent" },
      { id: "3", name: "Office" },
    ],
  },
  {
    title: "Document Type",
    slug: "document-type",
    component: "DocumentTypeChoice",
    items: [
      { id: "1", name: "National ID" },
      { id: "2", name: "Passport" },
      { id: "3", name: "Birth Certificate" },
    ],
  },
  {
    title: "Spouse Status Type",
    slug: "spouse-status-type",
    component: "SpouseStatusTypeChoice",
    items: [
      { id: "1", name: "Active" },
      { id: "2", name: "Deceased" },
    ],
  },
  {
    title: "Descendant Relation Type",
    slug: "descendant-relation-type",
    component: "DescendantRelationTypeChoice",
    items: [
      { id: "1", name: "Son" },
      { id: "2", name: "Daughter" },
      { id: "3", name: "Grandson" },
      { id: "4", name: "Granddaughter" },
    ],
  },
];

export default function ManageChoicesPage() {
  const [sections, setSections] = useState<ChoiceSection[]>(DUMMY_DATA);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    sectionIndex: -1,
    title: "",
  });

  const formiks = DUMMY_DATA.map((section) =>
    useFormik({
      initialValues: {
        name: "",
        code: section.hasCode ? "" : undefined,
      },
      onSubmit: () => {},
    })
  );

  const handleAddClick = (sectionIndex: number) => {
    const section = sections[sectionIndex];
    setConfirmDialog({
      isOpen: true,
      sectionIndex,
      title: section.title,
    });
  };

  const handleConfirm = (sectionIndex: number) => {
    const section = sections[sectionIndex];
    const formData = formiks[sectionIndex].values;

    const submissionData = {
      component: section.component,
      slug: section.slug,
      title: section.title,
      formData: formData,
      timestamp: new Date().toISOString(),
    };

    console.log(submissionData);

    const newItem: ChoiceItem = {
      id: Date.now().toString(),
      name: formData.name,
      code: formData.code,
    };

    setSections((prev) =>
      prev.map((s, i) =>
        i === sectionIndex ? { ...s, items: [...s.items, newItem] } : s
      )
    );

    formiks[sectionIndex].resetForm();
    setConfirmDialog({ isOpen: false, sectionIndex: -1, title: "" });
  };

  return (
    <div className="min-h-screen bg-background ">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 ">
          <h1 className="text-3xl font-bold tracking-tight">
            Manage All Choices
          </h1>
          <p className="mt-2 text-muted-foreground">
            Add and manage different types of choices for the membership system
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 ">
          {sections.map((section, sectionIndex) => (
            <Card key={section.slug} className="shadow-lg">
              <CardHeader className="pb-6">
                <CardTitle className="text-xl font-bold">
                  {section.title}
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="space-y-2 max-h-[250px] overflow-y-auto">
                  {section.items.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No items found
                    </p>
                  ) : (
                    section.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between rounded-md border p-3"
                      >
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{item.name}</span>
                          {item.code && (
                            <Badge variant="secondary" className="text-xs">
                              {item.code}
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <div className="flex  gap-2">
                  <div className="flex-1 space-y-2">
                    <Input
                      placeholder={`Enter new ${section.title.toLowerCase()} name`}
                      value={formiks[sectionIndex].values.name}
                      onChange={(e) =>
                        formiks[sectionIndex].setFieldValue(
                          "name",
                          e.target.value
                        )
                      }
                    />
                    {section.hasCode && (
                      <Input
                        placeholder={`Enter new ${section.title.toLowerCase()} code`}
                        value={formiks[sectionIndex].values.code || ""}
                        onChange={(e) =>
                          formiks[sectionIndex].setFieldValue(
                            "code",
                            e.target.value
                          )
                        }
                      />
                    )}
                  </div>
                  <Button
                    onClick={() => handleAddClick(sectionIndex)}
                    className="self-end"
                  >
                    Add
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <AlertDialog
          open={confirmDialog.isOpen}
          onOpenChange={(open) =>
            !open &&
            setConfirmDialog({ isOpen: false, sectionIndex: -1, title: "" })
          }
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Addition</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to add this new{" "}
                {confirmDialog.title.toLowerCase()}?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => handleConfirm(confirmDialog.sectionIndex)}
              >
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
