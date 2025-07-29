import AddMember from "@/components/member-pages/AddMember";
import AllMembers from "@/components/member-pages/AllMembers";
import PendingMembers from "@/components/member-pages/PendingMembers";
import React from "react";

async function MembersLayouts({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  return (
    <div>
      {section === "pending" && <PendingMembers />}
      {section === "add" && <AddMember />}
      {section === "view" && <AllMembers />}
    </div>
  );
}

export default MembersLayouts;
