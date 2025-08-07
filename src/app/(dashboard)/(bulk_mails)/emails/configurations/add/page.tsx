import AddMailConfigForm from "@/components/bulk_mail/AddMailConfigForm";
import { Send } from "lucide-react";
import React from "react";

function EmailConfigAddPage() {
  return (
    <div className="shadow-md rounded-md p-4 border">
      <h3 className="text-center font-bold text-3xl">
        <span className="flex justify-center items-center gap-2">
          Add Mail configurations <Send />
        </span>
      </h3>
      <AddMailConfigForm />
    </div>
  );
}

export default EmailConfigAddPage;
