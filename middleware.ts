// "use server";
// import { NextRequest, NextResponse } from "next/server";

// export async function middleware(request: NextRequest) {
//   const token = request.cookies.get("access_token")?.value;

//   if (!token) {
//     console.log("🔴 No token found");
//     return NextResponse.next();
//   }

//   try {
//     const res = await fetch(
//       `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/account/v1/authorization/get_user_all_permissions/`,
//       {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//         cache: "no-store",
//       }
//     );

//     const data = await res.json();
//     console.log("✅ Middleware API Response:", data);
//   } catch (error) {
//     console.error("❌ Middleware request failed:", error);
//   }

//   return NextResponse.next();
// }
// export const config = {
//   matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
// };