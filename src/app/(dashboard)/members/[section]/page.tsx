import AddMember from "@/components/member-pages/AddMember";
import AllMembers from "@/components/member-pages/AllMembers";
import IdTransferHistory from "@/components/member-pages/IdTransferHistory";
import PendingMembers from "@/components/member-pages/PendingMembers";
import RecycleBin from "@/components/member-pages/RecycleBin";
import { redirect } from "next/navigation";

import React from "react";

async function MembersLayouts({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  if(!["pending","add","view","history","bin"].includes(section)){
   return redirect("/members/view")
  
  }
  return (
    <div>
      {section === "pending" && <PendingMembers />}
      {section === "add" && <AddMember />}
      {section === "view" && <AllMembers />}
      {section === "history" && <IdTransferHistory />}
      {section === "bin" && <RecycleBin />}
    </div>
  );
}

export default MembersLayouts;
