import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { formatJoinedDate as formatDate } from "@/lib/date_modify";
import { cookies } from "next/headers";
import axiosInstance from "@/lib/axiosInstance";
import { toast } from "react-toastify";
import { FileSpreadsheet } from "lucide-react";
import { Button } from "../ui/button";

const NoDetailsFound = ({ sectionName }: { sectionName: string }) => (
  <div className="text-left text-muted-foreground ">
    No {sectionName.toLowerCase()} details found.
  </div>
);

async function MemberDetails({ id }: { id: string }) {
  const cookieStore = cookies();
  const authToken = cookieStore.get("access_token")?.value || "";
  let responseData: any = {};
  try {
    const { data } = await axiosInstance.get(`/api/member/v1/members/${id}/`, {
      headers: {
        Cookie: `access_token=${authToken}`,
      },
    });
    responseData = data.data;
  } catch (error: any) {
    toast.error(error?.response?.data?.message || "Something went wrong");
    console.log(error.response.data);
    const errorMsg = error?.response?.data?.message || "Something went wrong";
    throw new Error(errorMsg);
  }
  const {
    member_info,
    contact_info,
    email_address,
    address,
    job,
    spouse,
    descendant,
    emergency_contact,
    certificate,
    companion,
    document,
    special_days,
  } = responseData || {};
  return (
    <div className="w-full mx-auto  space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Member Details</h1>
          <p className="text-muted-foreground">View full member details</p>
        </div>

        <div>
          <Button className="gap-1">
            <FileSpreadsheet className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>
      <div className="conainer space-y-6 max-w-4xl mx-auto">
        <Card className="">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Personal Information</CardTitle>
            <div>
              {member_info.is_active ? (
                <Badge variant="default">Active</Badge>
              ) : (
                <Badge variant="destructive">Inactive</Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-6">
            <div className="flex flex-col items-center  gap-4">
              <Avatar className="h-24 w-24">
                <AvatarImage
                  src={
                    member_info.profile_photo
                      ? `/placeholder.svg?height=96&width=96&query=profile photo of ${member_info.first_name} ${member_info.last_name}`
                      : "/placeholder.svg?height=96&width=96"
                  }
                  alt={`${member_info.first_name} ${member_info.last_name}`}
                />
                <AvatarFallback>
                  {member_info.first_name[0]}
                  {member_info.last_name[0]}
                </AvatarFallback>
              </Avatar>
              <div className="text-center md:text-left">
                <p className="text-xl font-semibold">
                  {member_info.first_name} {member_info.last_name}
                </p>
                <p className="text-muted-foreground">
                  Member ID: {member_info.member_ID}
                </p>
                <div className="flex justify-center items-center">
                  <Badge variant="secondary" className="mt-1">
                    {member_info.membership_type?.name || "N/A"}
                  </Badge>
                  <Badge variant="outline" className="ml-2 mt-1">
                    {member_info.membership_status?.name || "N/A"}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="grid gap-2 text-sm">
              <p>
                <span className="font-medium">Batch Number:</span>{" "}
                {member_info.batch_number || "N/A"}
              </p>
              <p>
                <span className="font-medium">Institute:</span>{" "}
                {member_info.institute_name?.name || "N/A"} (
                {member_info.institute_name?.code || "N/A"})
              </p>

              <Separator />
              <p>
                <span className="font-medium">Gender:</span>{" "}
                {member_info.gender?.name || "N/A"}
              </p>

              <p>
                <span className="font-medium">Marital Status:</span>{" "}
                {member_info.marital_status?.name || "N/A"}
              </p>
              <Separator />
              <p>
                <span className="font-medium">Anniversary Date:</span>{" "}
                {formatDate(member_info.anniversary_date)}
              </p>
              <p>
                <span className="font-medium">Date of Birth:</span>{" "}
                {formatDate(member_info.date_of_birth)}
              </p>
              <Separator />

              <p>
                <span className="font-medium">Blood Group:</span>{" "}
                {member_info.blood_group || "N/A"}
              </p>
              <p>
                <span className="font-medium">Nationality:</span>{" "}
                {member_info.nationality || "N/A"}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="">
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent>
            {contact_info && contact_info.length > 0 ? (
              <div className="grid gap-4">
                {contact_info.map((contact: any, index: number) => (
                  <div
                    key={contact.id}
                    className="flex items-center justify-between text-sm"
                  >
                    <div>
                      <p className="font-medium">{contact.number}</p>
                      <p className="text-muted-foreground">
                        {contact.contact_type?.name || "N/A"}
                      </p>
                    </div>
                    {contact.is_primary && <Badge>Primary</Badge>}
                  </div>
                ))}
              </div>
            ) : (
              <NoDetailsFound sectionName="Contact" />
            )}
          </CardContent>
        </Card>
        <Card className="">
          <CardHeader>
            <CardTitle>Email Addresses</CardTitle>
          </CardHeader>
          <CardContent>
            {email_address && email_address.length > 0 ? (
              <div className="grid gap-4">
                {email_address.map((email: any) => (
                  <div
                    key={email.id}
                    className="flex items-center justify-between text-sm"
                  >
                    <div>
                      <p className="font-medium">{email.email}</p>
                      <p className="text-muted-foreground">
                        {email.email_type?.name || "N/A"}
                      </p>
                    </div>
                    {email.is_primary && <Badge>Primary</Badge>}
                  </div>
                ))}
              </div>
            ) : (
              <NoDetailsFound sectionName="Email" />
            )}
          </CardContent>
        </Card>
        <Card className="">
          <CardHeader>
            <CardTitle>Addresses</CardTitle>
          </CardHeader>
          <CardContent>
            {address && address.length > 0 ? (
              <div className="grid gap-4">
                {address.map((addr: any) => (
                  <div key={addr.id} className="text-sm">
                    <p className="font-medium">{addr.address}</p>
                    <p className="text-muted-foreground">
                      {addr.address_type?.name || "N/A"}
                    </p>
                    {addr.is_primary && <Badge className="mt-1">Primary</Badge>}
                  </div>
                ))}
              </div>
            ) : (
              <NoDetailsFound sectionName="Address" />
            )}
          </CardContent>
        </Card>
        <Card className="">
          <CardHeader>
            <CardTitle>Job History</CardTitle>
          </CardHeader>
          <CardContent>
            {job && job.length > 0 ? (
              <div className="grid gap-4">
                {job.map((jobItem: any, index: number) => (
                  <div key={jobItem.id}>
                    <p className="text-lg font-semibold">{jobItem.title}</p>
                    <p className="text-muted-foreground">
                      {jobItem.organization_name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {jobItem.location}
                    </p>
                    {jobItem.job_description && (
                      <p className="text-sm mt-2">{jobItem.job_description}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <NoDetailsFound sectionName="Job History" />
            )}
          </CardContent>
        </Card>
        <Card className="">
          <CardHeader>
            <CardTitle>Spouse Details</CardTitle>
          </CardHeader>
          <CardContent>
            {spouse && spouse.length > 0 ? (
              <div className="grid gap-6">
                {spouse.map((s: any) => (
                  <div
                    key={s.id}
                    className="flex flex-col sm:flex-row items-center sm:items-start gap-4"
                  >
                    <Avatar className="h-20 w-20">
                      <AvatarImage
                        src={
                          s.image
                            ? `/placeholder.svg?height=80&width=80&query=spouse photo of ${s.spouse_name}`
                            : "/placeholder.svg?height=80&width=80"
                        }
                        alt={s.spouse_name}
                      />
                      <AvatarFallback>{s.spouse_name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="text-center sm:text-left">
                      <p className="text-lg font-semibold">{s.spouse_name}</p>
                      <p className="text-muted-foreground">
                        Contact: {s.spouse_contact_number || "N/A"}
                      </p>
                      <p className="text-muted-foreground">
                        Date of Birth: {formatDate(s.spouse_dob)}
                      </p>
                      <Badge className="mt-1">
                        {s.current_status === 1 ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <NoDetailsFound sectionName="Spouse" />
            )}
          </CardContent>
        </Card>
        <Card className="">
          <CardHeader>
            <CardTitle>Descendants</CardTitle>
          </CardHeader>
          <CardContent>
            {descendant && descendant.length > 0 ? (
              <div className="grid gap-6">
                {descendant.map((d: any) => (
                  <div
                    key={d.id}
                    className="flex flex-col sm:flex-row items-center sm:items-start gap-4"
                  >
                    <Avatar className="h-20 w-20">
                      <AvatarImage
                        src={
                          d.image
                            ? `/placeholder.svg?height=80&width=80&query=descendant photo of ${d.name}`
                            : "/placeholder.svg?height=80&width=80"
                        }
                        alt={d.name}
                      />
                      <AvatarFallback>{d.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="text-center sm:text-left">
                      <p className="text-lg font-semibold">{d.name}</p>
                      <p className="text-muted-foreground">
                        Relation: {d.relation_type?.name || "N/A"}
                      </p>
                      <p className="text-muted-foreground">
                        Contact: {d.descendant_contact_number || "N/A"}
                      </p>
                      <p className="text-muted-foreground">
                        Date of Birth: {formatDate(d.dob)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <NoDetailsFound sectionName="Descendant" />
            )}
          </CardContent>
        </Card>
        <Card className="">
          <CardHeader>
            <CardTitle>Emergency Contacts</CardTitle>
          </CardHeader>
          <CardContent>
            {emergency_contact && emergency_contact.length > 0 ? (
              <div className="grid gap-4">
                {emergency_contact.map((ec: any) => (
                  <div key={ec.id} className="text-sm">
                    <p className="font-medium">{ec.contact_name}</p>
                    <p className="text-muted-foreground">
                      Number: {ec.contact_number || "N/A"}
                    </p>
                    <p className="text-muted-foreground">
                      Relation: {ec.relation_with_member || "N/A"}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <NoDetailsFound sectionName="Emergency Contact" />
            )}
          </CardContent>
        </Card>
        <Card className="">
          <CardHeader>
            <CardTitle>Certificates</CardTitle>
          </CardHeader>
          <CardContent>
            {certificate && certificate.length > 0 ? (
              <div className="grid gap-4">
                {certificate.map((cert: any) => (
                  <div key={cert.id} className="text-sm">
                    <p className="font-medium">{cert.title}</p>
                    <p className="text-muted-foreground">
                      Number: {cert.certificate_number || "N/A"}
                    </p>
                    {cert.certificate_document && (
                      <p className="text-muted-foreground">
                        Document:{" "}
                        <a
                          href={`/placeholder.svg?height=200&width=300&query=certificate document for ${cert.title}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline"
                        >
                          View Document
                        </a>
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <NoDetailsFound sectionName="Certificate" />
            )}
          </CardContent>
        </Card>
        <Card className="">
          <CardHeader>
            <CardTitle>Companions</CardTitle>
          </CardHeader>
          <CardContent>
            {companion && companion.length > 0 ? (
              <div className="grid gap-6">
                {companion.map((comp: any) => (
                  <div
                    key={comp.id}
                    className="flex flex-col sm:flex-row items-center sm:items-start gap-4"
                  >
                    <Avatar className="h-20 w-20">
                      <AvatarImage
                        src={
                          comp.companion_image
                            ? `/placeholder.svg?height=80&width=80&query=companion photo of ${comp.companion_name}`
                            : "/placeholder.svg?height=80&width=80"
                        }
                        alt={comp.companion_name}
                      />
                      <AvatarFallback>{comp.companion_name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="text-center sm:text-left">
                      <p className="text-lg font-semibold">
                        {comp.companion_name}
                      </p>
                      <p className="text-muted-foreground">
                        Relation: {comp.relation_with_member || "N/A"}
                      </p>
                      <p className="text-muted-foreground">
                        Contact: {comp.companion_contact_number || "N/A"}
                      </p>
                      <p className="text-muted-foreground">
                        Card Number: {comp.companion_card_number || "N/A"}
                      </p>
                      <p className="text-muted-foreground">
                        Date of Birth: {formatDate(comp.companion_dob)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <NoDetailsFound sectionName="Companion" />
            )}
          </CardContent>
        </Card>
        <Card className="">
          <CardHeader>
            <CardTitle>Documents</CardTitle>
          </CardHeader>
          <CardContent>
            {document && document.length > 0 ? (
              <div className="grid gap-4">
                {document.map((doc: any) => (
                  <div key={doc.id} className="text-sm">
                    <p className="font-medium">
                      {doc.document_type?.name || "N/A"}
                    </p>
                    <p className="text-muted-foreground">
                      Number: {doc.document_number || "N/A"}
                    </p>
                    {doc.document_document && (
                      <p className="text-muted-foreground">
                        Document:{" "}
                        <a
                          href={`/placeholder.svg?height=200&width=300&query=document for ${doc.document_type?.name}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline"
                        >
                          View Document
                        </a>
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <NoDetailsFound sectionName="Document" />
            )}
          </CardContent>
        </Card>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Special Days</CardTitle>
          </CardHeader>
          <CardContent>
            {special_days && special_days.length > 0 ? (
              <div className="grid gap-4">
                {special_days.map((day: any) => (
                  <div key={day.id} className="text-sm">
                    <p className="font-medium">{day.title}</p>
                    <p className="text-muted-foreground">
                      Date: {formatDate(day.date)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <NoDetailsFound sectionName="Special Day" />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
export default MemberDetails;
