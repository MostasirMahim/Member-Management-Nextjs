import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { formatJoinedDate as formatDate } from "@/lib/date_modify";
import {
  User,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  Heart,
  Users,
  AlertTriangle,
  Award,
  FileText,
  Calendar,
  Hash,
  GraduationCap,
  Globe,
  Droplets,
  Building,
} from "lucide-react";
import { cookies } from "next/headers";
import axiosInstance from "@/lib/axiosInstance";
import { toast } from "react-toastify";

const NoDetailsFound = ({ sectionName }: { sectionName: string }) => (
  <div className="text-center text-muted-foreground py-8">
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

  if (!responseData || Object.keys(responseData).length === 0) {
    return (
      <div className="w-full mx-auto space-y-6 p-4 md:p-6">
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
          <User className="h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold mb-2">No Member Data Found</h2>
          <p className="text-muted-foreground">
            No information available for member ID: {id}
          </p>
        </div>
      </div>
    );
  }
  //TODO:Need Functionality Attach to See Documents File View/GET Operation

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
  } = responseData ?? {};

  const primaryNumber = contact_info?.find((c: any) => c.is_primary);
  const primaryEmail = email_address?.find((e: any) => e.is_primary);

  if (!member_info) {
    return (
      <div className="w-full mx-auto space-y-6 p-4 md:p-6">
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
          <User className="h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold mb-2">Invalid Member Data</h2>
          <p className="text-muted-foreground">
            Member information is incomplete or corrupted.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <div className="w-full space-y-5">
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-800 dark:via-indigo-800 dark:to-purple-800 rounded-2xl shadow-2xl">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5"></div>
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:20px_20px]"></div>
          </div>

          <div className="relative p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="relative group">
                <div className="relative">
                  <Avatar className="h-32 w-32 md:h-40 md:w-40 border-4 border-white/20 shadow-2xl transition-transform duration-300 group-hover:scale-105">
                    <AvatarImage
                      src={
                        `${
                          process.env.NEXT_PUBLIC_BACKEND_API_URL ||
                          "http://localhost:8000"
                        }${member_info?.profile_photo}` || "/assets/logo.png"
                      }
                      alt={`${member_info?.first_name} ${member_info?.last_name}`}
                      className="object-cover"
                    />
                    <AvatarFallback className="text-2xl md:text-3xl font-bold bg-gradient-to-br from-blue-400 to-purple-600 text-white">
                      {member_info?.first_name?.[0]}
                      {member_info?.last_name?.[0]}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </div>
              <div className="flex-1 text-center md:text-left text-white space-y-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold mb-2 animate-fade-in">
                    {member_info?.first_name} {member_info?.last_name}
                  </h1>
                  <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-4">
                    <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30 transition-colors">
                      {member_info?.membership_type?.name}
                    </Badge>
                    <Badge className="bg-green-500/20 text-green-100 border-green-400/30">
                      {member_info?.membership_status?.name}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm border border-white/20">
                    <div className="flex items-center gap-2 mb-1">
                      <Hash className="h-4 w-4" />
                      <span className="text-white/80">Member ID</span>
                    </div>
                    <p className="font-semibold">{member_info?.member_ID}</p>
                  </div>

                  <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm border border-white/20">
                    <div className="flex items-center gap-2 mb-1">
                      <Building className="h-4 w-4" />
                      <span className="text-white/80">Institute</span>
                    </div>
                    <p className="font-semibold line-clamp-1">
                      {member_info?.institute_name?.name}
                    </p>
                  </div>

                  <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm border border-white/20">
                    <div className="flex items-center gap-2 mb-1">
                      <Droplets className="h-4 w-4" />
                      <span className="text-white/80">Blood Group</span>
                    </div>
                    <p className="font-semibold">{member_info?.blood_group}</p>
                  </div>

                  <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm border border-white/20">
                    <div className="flex items-center gap-2 mb-1">
                      <Globe className="h-4 w-4" />
                      <span className="text-white/80">Nationality</span>
                    </div>
                    <p className="font-semibold">{member_info?.nationality}</p>
                  </div>
                </div>

                <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <span>{primaryNumber?.number}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span>{primaryEmail?.email}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <Tabs defaultValue="personal" className="w-full">
            <div className="border-b border-gray-200 dark:border-gray-700">
              <div className="relative">
                <div className="overflow-x-scroll no-scrollbar">
                  <TabsList className="w-full justify-start h-auto p-0 bg-transparent rounded-t-lg ">
                    <div className="flex justify-around min-w-max w-full p-2 gap-2 bg-[#d8d6ff] dark:bg-gray-800 rounded-t-lg">
                      <TabsTrigger
                        value="personal"
                        className="gap-2 border-b-2 border-transparent bg-background dark:bg-gray-700 rounded-lg data-[state=active]:border-blue-500 data-[state=active]:bg-blue-50 dark:data-[state=active]:bg-blue-800/50 data-[state=active]:text-blue-700 dark:data-[state=active]:text-blue-200 hover:bg-blue-50 dark:hover:bg-blue-800/30 transition-all duration-200 "
                      >
                        <User className="h-4 w-4" />
                        <span className="hidden sm:inline">Personal Info</span>
                        <span className="sm:hidden">Personal</span>
                      </TabsTrigger>
                      <TabsTrigger
                        value="contact"
                        className="gap-2  bg-background dark:bg-gray-700 rounded-lg border-b-2 border-transparent data-[state=active]:border-green-500 data-[state=active]:bg-green-50 dark:data-[state=active]:bg-green-800/50 data-[state=active]:text-green-700 dark:data-[state=active]:text-green-200 hover:bg-green-50 dark:hover:bg-green-800/30 transition-all duration-200"
                      >
                        <Phone className="h-4 w-4" />
                        <span className="hidden sm:inline">Contact Info</span>
                        <span className="sm:hidden">Contact</span>
                      </TabsTrigger>
                      <TabsTrigger
                        value="family"
                        className="gap-2 bg-background dark:bg-gray-700 rounded-lg  border-b-2 border-transparent data-[state=active]:border-pink-500 data-[state=active]:bg-pink-50 dark:data-[state=active]:bg-pink-800/50 data-[state=active]:text-pink-700 dark:data-[state=active]:text-pink-200 hover:bg-pink-50 dark:hover:bg-pink-800/30 transition-all duration-200"
                      >
                        <Heart className="h-4 w-4" />
                        <span className="hidden sm:inline">Family</span>
                        <span className="sm:hidden">Family</span>
                      </TabsTrigger>
                      <TabsTrigger
                        value="work"
                        className="gap-2 bg-background dark:bg-gray-700 rounded-lg border-b-2 border-transparent data-[state=active]:border-orange-500 data-[state=active]:bg-orange-50 dark:data-[state=active]:bg-orange-800/50 data-[state=active]:text-orange-700 dark:data-[state=active]:text-orange-200 hover:bg-orange-50 dark:hover:bg-orange-800/30 transition-all duration-200"
                      >
                        <Briefcase className="h-4 w-4" />
                        <span className="hidden sm:inline">Work History</span>
                        <span className="sm:hidden">Work</span>
                      </TabsTrigger>

                      <TabsTrigger
                        value="documents"
                        className="gap-2 bg-background dark:bg-gray-700 rounded-lg border-b-2 border-transparent data-[state=active]:border-purple-500 data-[state=active]:bg-purple-50 dark:data-[state=active]:bg-purple-800/50 data-[state=active]:text-purple-700 dark:data-[state=active]:text-purple-200 hover:bg-purple-50 dark:hover:bg-purple-800/30 transition-all duration-200"
                      >
                        <FileText className="h-4 w-4" />
                        <span className="hidden sm:inline">Documents</span>
                        <span className="sm:hidden">Docs</span>
                      </TabsTrigger>
                      <TabsTrigger
                        value="companions"
                        className="gap-2 bg-background dark:bg-gray-700 rounded-lg border-b-2 border-transparent data-[state=active]:border-teal-500 data-[state=active]:bg-teal-50 dark:data-[state=active]:bg-teal-800/50 data-[state=active]:text-teal-700 dark:data-[state=active]:text-teal-200 hover:bg-teal-50 dark:hover:bg-teal-800/30 transition-all duration-200"
                      >
                        <Users className="h-4 w-4" />
                        <span className="hidden sm:inline">Companions</span>
                        <span className="sm:hidden">Companions</span>
                      </TabsTrigger>
                      <TabsTrigger
                        value="special"
                        className="gap-2 bg-background dark:bg-gray-700 rounded-lg border-b-2 border-transparent data-[state=active]:border-indigo-500 data-[state=active]:bg-indigo-50 dark:data-[state=active]:bg-indigo-800/50 data-[state=active]:text-indigo-700 dark:data-[state=active]:text-indigo-200 hover:bg-indigo-50 dark:hover:bg-indigo-800/30 transition-all duration-200"
                      >
                        <Calendar className="h-4 w-4" />
                        <span className="hidden sm:inline">Special Days</span>
                        <span className="sm:hidden">Special</span>
                      </TabsTrigger>
                    </div>
                  </TabsList>
                </div>
              </div>
            </div>

            <TabsContent value="personal" className="m-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 dark:border dark:border-blue-800/30">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                      <User className="h-5 w-5" />
                      Basic Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="p-3 rounded-lg bg-white/60 dark:bg-blue-900/20 border border-blue-200/50 dark:border-blue-700/30">
                        <p className="text-blue-600 dark:text-blue-400 font-medium">
                          Marital Status
                        </p>
                        <p className="font-semibold text-blue-900 dark:text-blue-100">
                          {member_info?.marital_status?.name || "N/A"}
                        </p>
                      </div>
                      <div className="p-3 rounded-lg bg-white/60 dark:bg-blue-900/20 border border-blue-200/50 dark:border-blue-700/30">
                        <p className="text-blue-600 dark:text-blue-400 font-medium">
                          Gender
                        </p>
                        <p className="font-semibold text-blue-900 dark:text-blue-100">
                          {member_info?.gender?.name || "N/A"}
                        </p>
                      </div>
                      <div className="p-3 rounded-lg bg-white/60 dark:bg-blue-900/20 border border-blue-200/50 dark:border-blue-700/30">
                        <p className="text-blue-600 dark:text-blue-400 font-medium">
                          Blood Group
                        </p>
                        <p className="font-semibold text-blue-900 dark:text-blue-100">
                          {member_info?.blood_group || "N/A"}
                        </p>
                      </div>
                      <div className="p-3 rounded-lg bg-white/60 dark:bg-blue-900/20 border border-blue-200/50 dark:border-blue-700/30">
                        <p className="text-blue-600 dark:text-blue-400 font-medium">
                          Date of Birth
                        </p>
                        <p className="font-semibold text-blue-900 dark:text-blue-100">
                          {formatDate(member_info?.date_of_birth)}
                        </p>
                      </div>
                      <div className="p-3 rounded-lg bg-white/60 dark:bg-blue-900/20 border border-blue-200/50 dark:border-blue-700/30">
                        <p className="text-blue-600 dark:text-blue-400 font-medium">
                          Anniversary Date
                        </p>
                        <p className="font-semibold text-blue-900 dark:text-blue-100">
                          {formatDate(member_info?.anniversary_date)}
                        </p>
                      </div>
                      <div className="p-3 rounded-lg bg-white/60 dark:bg-blue-900/20 border border-blue-200/50 dark:border-blue-700/30">
                        <p className="text-blue-600 dark:text-blue-400 font-medium">
                          Nationality
                        </p>
                        <p className="font-semibold text-blue-900 dark:text-blue-100">
                          {member_info?.nationality || "N/A"}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/50 dark:to-teal-950/50 dark:border dark:border-emerald-800/30">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
                      <GraduationCap className="h-5 w-5" />
                      Institution Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 rounded-lg bg-white/60 dark:bg-emerald-900/20 border border-emerald-200/50 dark:border-emerald-700/30">
                      <p className="text-emerald-600 dark:text-emerald-400 font-medium text-sm">
                        Institute Name
                      </p>
                      <p className="font-semibold text-emerald-900 dark:text-emerald-100">
                        {member_info?.institute_name?.name || "N/A"}
                      </p>
                    </div>
                    <div className="p-4 rounded-lg bg-white/60 dark:bg-emerald-900/20 border border-emerald-200/50 dark:border-emerald-700/30">
                      <p className="text-emerald-600 dark:text-emerald-400 font-medium text-sm">
                        Institute Code
                      </p>
                      <p className="font-semibold text-emerald-900 dark:text-emerald-100">
                        {member_info?.institute_name?.code || "N/A"}
                      </p>
                    </div>
                    <div className="p-4 rounded-lg bg-white/60 dark:bg-emerald-900/20 border border-emerald-200/50 dark:border-emerald-700/30">
                      <p className="text-emerald-600 dark:text-emerald-400 font-medium text-sm">
                        Batch Number
                      </p>
                      <p className="font-semibold text-emerald-900 dark:text-emerald-100">
                        {member_info?.batch_number || "N/A"}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="contact" className="m-6 space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/50 dark:to-violet-950/50 dark:border dark:border-purple-800/30">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-purple-700 dark:text-purple-300">
                      <Phone className="h-5 w-5" />
                      Phone Numbers
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {contact_info && contact_info.length > 0 ? (
                      <div className="space-y-3">
                        {contact_info.map((contact: any) => (
                          <div
                            key={contact.id}
                            className="flex items-center justify-between p-3 rounded-lg bg-white/60 dark:bg-purple-900/20 border border-purple-200/50 dark:border-purple-700/30"
                          >
                            <div>
                              <p className="font-semibold text-purple-900 dark:text-purple-100">
                                {contact.number}
                              </p>
                              <p className="text-sm text-purple-600 dark:text-purple-400">
                                {contact.contact_type?.name || "N/A"}
                              </p>
                            </div>
                            {contact.is_primary && (
                              <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-800 dark:text-purple-200 border-purple-300 dark:border-purple-600">
                                Primary
                              </Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <NoDetailsFound sectionName="Contact" />
                    )}
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/50 dark:to-amber-950/50 dark:border dark:border-orange-800/30">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-orange-700 dark:text-orange-300">
                      <Mail className="h-5 w-5" />
                      Email Addresses
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {email_address && email_address.length > 0 ? (
                      <div className="space-y-3">
                        {email_address.map((email: any) => (
                          <div
                            key={email.id}
                            className="flex items-center justify-between p-3 rounded-lg bg-white/60 dark:bg-orange-900/20 border border-orange-200/50 dark:border-orange-700/30"
                          >
                            <div>
                              <p className="font-semibold break-all text-orange-900 dark:text-orange-100">
                                {email.email}
                              </p>
                              <p className="text-sm text-orange-600 dark:text-orange-400">
                                {email.email_type?.name || "N/A"}
                              </p>
                            </div>
                            {email.is_primary && (
                              <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-800 dark:text-orange-200 border-orange-300 dark:border-orange-600">
                                Primary
                              </Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <NoDetailsFound sectionName="Email" />
                    )}
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-950/50 dark:to-cyan-950/50 dark:border dark:border-teal-800/30">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-teal-700 dark:text-teal-300">
                      <MapPin className="h-5 w-5" />
                      Addresses
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {address && address.length > 0 ? (
                      <div className="space-y-4 w-full">
                        {address.map((addr: any) => (
                          <div
                            key={addr.id}
                            className="flex items-center justify-between p-3 rounded-lg bg-white/60 dark:bg-teal-900/20 border border-teal-200/50 dark:border-teal-700/30"
                          >
                            <div>
                              <p className="font-semibold text-teal-900 dark:text-teal-100">
                                {addr.address}
                              </p>
                              <p className="text-sm text-teal-600 dark:text-teal-400">
                                {addr.address_type?.name || "N/A"}
                              </p>
                            </div>
                            {addr.is_primary && (
                              <Badge className="mt-1 bg-teal-100 text-teal-700 dark:bg-teal-800 dark:text-teal-200 border-teal-300 dark:border-teal-600">
                                Primary
                              </Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <NoDetailsFound sectionName="Address" />
                    )}
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-950/50 dark:to-rose-950/50 dark:border dark:border-red-800/30">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-300">
                      <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                      Emergency Contacts
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {emergency_contact && emergency_contact.length > 0 ? (
                      <div className="grid gap-4">
                        {emergency_contact.map((ec: any) => (
                          <div
                            key={ec.id}
                            className="p-4 border border-red-200 dark:border-red-700/30 rounded-lg flex justify-between items-center bg-white/60 dark:bg-red-900/20"
                          >
                            <div>
                              <p className="font-semibold text-red-900 dark:text-red-100">
                                {ec.contact_name}
                              </p>
                              <p className="text-sm text-red-600 dark:text-red-400">
                                Number: {ec.contact_number || "N/A"}
                              </p>
                              <p className="text-sm text-red-600 dark:text-red-400">
                                Relation: {ec.relation_with_member || "N/A"}
                              </p>
                            </div>
                            {ec.is_active && (
                              <Badge className="mt-1 bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-200 border-red-300 dark:border-red-600">
                                Active
                              </Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <NoDetailsFound sectionName="Emergency Contact" />
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="family" className="m-6">
              <div className="grid gap-6 lg:grid-cols-2">
                <Card className="border-0 shadow-lg bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-950/50 dark:to-rose-950/50 dark:border dark:border-pink-800/30">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-pink-700 dark:text-pink-300">
                      <Heart className="h-5 w-5" />
                      Spouse Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {spouse && spouse.length > 0 ? (
                      <div className="space-y-6">
                        {spouse.map((s: any) => (
                          <div
                            key={s.id}
                            className="flex items-center gap-4 p-4 rounded-lg bg-white/60 dark:bg-pink-900/20 border border-pink-200/50 dark:border-pink-700/30"
                          >
                            <Avatar className="h-16 w-16 ring-4 ring-pink-200 dark:ring-pink-700">
                              <AvatarImage
                                src={s?.image || "/placeholder.svg"}
                                alt={s?.spouse_name}
                              />
                              <AvatarFallback className="bg-pink-100 text-pink-700 dark:bg-pink-800 dark:text-pink-200">
                                {s.spouse_name?.[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <p className="font-semibold text-pink-900 dark:text-pink-100">
                                {s.spouse_name}
                              </p>
                              <p className="text-sm text-pink-600 dark:text-pink-400">
                                Contact Number:{" "}
                                {s.spouse_contact_number || "N/A"}
                              </p>
                              <p className="text-sm text-pink-600 dark:text-pink-400">
                                Date of Birth: {formatDate(s.spouse_dob)}
                              </p>
                              <Badge
                                className={`mt-1 ${
                                  s.current_status === 1
                                    ? "bg-pink-100 text-pink-700 dark:bg-pink-800 dark:text-pink-200 border-pink-300 dark:border-pink-600"
                                    : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200"
                                }`}
                              >
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

                <Card className="border-0 shadow-lg bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/50 dark:to-blue-950/50 dark:border dark:border-indigo-800/30">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300">
                      <Users className="h-5 w-5" />
                      Descendants
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {descendant && descendant.length > 0 ? (
                      <div className="space-y-6">
                        {descendant.map((d: any) => (
                          <div
                            key={d.id}
                            className="flex items-center gap-4 p-4 rounded-lg bg-white/60 dark:bg-indigo-900/20 border border-indigo-200/50 dark:border-indigo-700/30"
                          >
                            <Avatar className="h-16 w-16 ring-4 ring-indigo-200 dark:ring-indigo-700">
                              <AvatarImage
                                src={d?.image || "/placeholder.svg"}
                                alt={d.name}
                              />
                              <AvatarFallback className="bg-indigo-100 text-indigo-700 dark:bg-indigo-800 dark:text-indigo-200">
                                {d.name?.[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 flex justify-between items-center">
                              <div>
                                <p className="font-semibold text-indigo-900 dark:text-indigo-100">
                                  {d.name}
                                </p>
                                <p className="text-sm text-indigo-600 dark:text-indigo-400">
                                  Relation Type:{" "}
                                  {d.relation_type?.name || "N/A"}
                                </p>
                                <p className="text-sm text-indigo-600 dark:text-indigo-400">
                                  Contact Number:{" "}
                                  {d.descendant_contact_number || "N/A"}
                                </p>
                                <p className="text-sm text-indigo-600 dark:text-indigo-400">
                                  Date of Birth: {formatDate(d.dob)}
                                </p>
                                {d.is_active && (
                                  <Badge className="mt-1 bg-indigo-100 text-indigo-700 dark:bg-indigo-800 dark:text-indigo-200 border-indigo-300 dark:border-indigo-600">
                                    Active
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <NoDetailsFound sectionName="Descendant" />
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="work" className="m-6">
              <Card className="border-0 shadow-lg bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-950/50 dark:to-gray-950/50 dark:border dark:border-slate-800/30">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                    <Briefcase className="h-5 w-5" />
                    Job History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {job && job.length > 0 ? (
                    <div className="space-y-6">
                      {job.map((jobItem: any) => (
                        <div
                          key={jobItem.id}
                          className={`${
                            jobItem.is_active
                              ? "border-l-4 border-slate-500 dark:border-slate-400 bg-slate-50 dark:bg-slate-900/30"
                              : "border-l-4 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900/20"
                          } pl-6 py-4 rounded-r-lg`}
                        >
                          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                            {jobItem.title}
                          </h3>
                          <p className="text-slate-700 dark:text-slate-300 font-medium">
                            <span className="text-sm font-normal text-slate-600 dark:text-slate-400">
                              Organization Name:
                            </span>{" "}
                            {jobItem.organization_name}
                          </p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            <span className="text-sm font-normal">
                              Location:
                            </span>{" "}
                            {jobItem.location}
                          </p>
                          {jobItem.job_description && (
                            <p className="text-sm mt-2 text-slate-600 dark:text-slate-400 bg-white/50 dark:bg-slate-800/30 p-3 rounded-lg">
                              {jobItem.job_description}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <NoDetailsFound sectionName="Job History" />
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="documents" className="m-6">
              <div className="grid gap-6 lg:grid-cols-2">
                <Card className="border-0 shadow-lg bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-950/50 dark:to-amber-950/50 dark:border dark:border-yellow-800/30">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-yellow-700 dark:text-yellow-300">
                      <Award className="h-5 w-5" />
                      Certificates
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {certificate && certificate.length > 0 ? (
                      <div className="space-y-4">
                        {certificate.map((cert: any) => (
                          <div
                            key={cert.id}
                            className="p-4 border border-yellow-200 dark:border-yellow-700/30 rounded-lg bg-white/60 dark:bg-yellow-900/20"
                          >
                            <p className="font-semibold text-yellow-900 dark:text-yellow-100">
                              {cert.title}
                            </p>
                            <p className="text-sm text-yellow-600 dark:text-yellow-400">
                              Number: {cert.certificate_number || "N/A"}
                            </p>
                            {cert.certificate_document && (
                              <a
                                href={`/placeholder.svg?height=200&width=300&query=certificate document for ${cert.title}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-yellow-700 dark:text-yellow-300 hover:text-yellow-800 dark:hover:text-yellow-200 hover:underline font-medium"
                              >
                                View Document
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <NoDetailsFound sectionName="Certificate" />
                    )}
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50 dark:border dark:border-green-800/30">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-300">
                      <FileText className="h-5 w-5" />
                      Documents
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {document && document.length > 0 ? (
                      <div className="space-y-4">
                        {document.map((doc: any) => (
                          <div
                            key={doc.id}
                            className="p-4 border border-green-200 dark:border-green-700/30 rounded-lg bg-white/60 dark:bg-green-900/20"
                          >
                            <p className="font-semibold text-green-900 dark:text-green-100">
                              {doc.document_type?.name || "N/A"}
                            </p>
                            <p className="text-sm text-green-600 dark:text-green-400">
                              Number: {doc.document_number || "N/A"}
                            </p>
                            {doc.document_document && (
                              <a
                                href={`/placeholder.svg?height=200&width=300&query=document for ${doc.document_type?.name}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-green-700 dark:text-green-300 hover:text-green-800 dark:hover:text-green-200 hover:underline font-medium"
                              >
                                View Document
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <NoDetailsFound sectionName="Document" />
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="companions" className="m-6">
              <Card className="border-0 shadow-lg bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/50 dark:to-purple-950/50 dark:border dark:border-violet-800/30">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-violet-700 dark:text-violet-300">
                    <Users className="h-5 w-5" />
                    Companions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {companion && companion.length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-2">
                      {companion.map((comp: any) => (
                        <div
                          key={comp.id}
                          className="flex items-center gap-4 p-4 border border-violet-200 dark:border-violet-700/30 rounded-lg bg-white/60 dark:bg-violet-900/20"
                        >
                          <Avatar className="h-16 w-16 ring-4 ring-violet-200 dark:ring-violet-700">
                            <AvatarImage
                              src={comp.companion_image || "/placeholder.svg"}
                              alt={comp.companion_name}
                            />
                            <AvatarFallback className="bg-violet-100 text-violet-700 dark:bg-violet-800 dark:text-violet-200">
                              {comp.companion_name?.[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="font-semibold text-violet-900 dark:text-violet-100">
                              {comp.companion_name}
                            </p>
                            <p className="text-sm text-violet-600 dark:text-violet-400">
                              Relation: {comp.relation_with_member || "N/A"}
                            </p>
                            <p className="text-sm text-violet-600 dark:text-violet-400">
                              Contact: {comp.companion_contact_number || "N/A"}
                            </p>
                            <p className="text-sm text-violet-600 dark:text-violet-400">
                              Card: {comp.companion_card_number || "N/A"}
                            </p>
                            <p className="text-sm text-violet-600 dark:text-violet-400">
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
            </TabsContent>

            <TabsContent value="special" className="m-6">
              <Card className="border-0 shadow-lg bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-950/50 dark:to-pink-950/50 dark:border dark:border-rose-800/30">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-rose-700 dark:text-rose-300">
                    <Calendar className="h-5 w-5" />
                    Special Days
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {special_days && special_days.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {special_days.map((day: any) => (
                        <div
                          key={day.id}
                          className="p-4 border border-rose-200 dark:border-rose-700/30 rounded-lg text-center bg-white/60 dark:bg-rose-900/20 hover:shadow-md transition-shadow"
                        >
                          <p className="font-semibold text-rose-900 dark:text-rose-100">
                            {day.title}
                          </p>
                          <p className="text-sm text-rose-600 dark:text-rose-400">
                            {formatDate(day.date)}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <NoDetailsFound sectionName="Special Day" />
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
export default MemberDetails;
