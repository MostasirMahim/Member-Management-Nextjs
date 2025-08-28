"use server";

import MemberIdTransfer from "@/components/member/MemberIdTransfer";
import SpecificIdHistory from "@/components/transferId-history/SpecificIdHistory";

function page({ params }: { params: { id: string } }) {
  const { id } = params;
  return (
    <div>
      <MemberIdTransfer />
      <SpecificIdHistory memberId={id} />
    </div>
  );
}

export default page;
