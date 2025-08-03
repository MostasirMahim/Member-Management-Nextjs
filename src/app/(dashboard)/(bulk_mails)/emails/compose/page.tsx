"use client";

import ComposeMailForm from "@/components/bulk_mail/ComposeMailForm";

export default function EmailEditor() {
  return (
    <div className="border rounded-md p-2">
      <div>
        <h4 className="text-2xl font-bold text-center mb-2">
          Compose your email
        </h4>
      </div>
      <ComposeMailForm />
    </div>
  );
}
