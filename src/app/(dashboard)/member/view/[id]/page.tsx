import MemberDetails from "@/components/member/MemberDetails";

async function page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <MemberDetails id={id} />;
}

export default page;
