
// import { cookies } from "next/headers";
// import axiosInstance from "./axiosInstance";



// interface ApiProps {
//   url: string;
//   body?: {};
//   method: "GET" | "POST" | "PATCH" | "DELETE";
// }

// export const handleApi = async ({ url, method, body }: ApiProps) => {
//   try {
//     const cookie = await cookies();
//     const token = cookie.get("access_token")?.value;

//     const req = await axiosInstance.request({
//       url,
//       method,
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//       data: body,
//     });

//     const res = req.data;

//     if (res?.code === 200) {
//       return res;
//     }

//     if (res?.code === 401) {
//       const result = await logoutAction();
//       if (result.code !== 200) {
//         throw new Error(result.message);
//       }
//     }

//     return res;
//   } catch (err) {
//     console.error("API error:", err);
//     throw err;
//   }
// };
