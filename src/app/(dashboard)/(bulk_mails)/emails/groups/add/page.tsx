"use client";

import AddGroupForm from "@/components/bulk_mail/AddGroupForm";
import { UserPlus } from "lucide-react";

function GroupAdd() {
  return (
    <div>
      <div>
        <h4 className="text-center text-2xl font-bold">
          <span className="flex items-center justify-center gap-1">
            <UserPlus /> Create Group
          </span>
        </h4>
      </div>
      <AddGroupForm />
    </div>
  );
}

export default GroupAdd;
