import { protected_routes } from "@/lib/protected_routes";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

interface PermissionCache {
  permissions: string[];
  timestamp: number;
}

const permissionCache = new Map<string, PermissionCache>();
const CACHE_TTL = 60 * 1000;

function cleanupExpiredCache() {
  const now = Date.now();
  const entries = Array.from(permissionCache.entries());

  for (const [key, value] of entries) {
    if (now - value.timestamp > CACHE_TTL) {
      permissionCache.delete(key);
    }
  }
}

if (typeof setInterval !== "undefined") {
  setInterval(cleanupExpiredCache, 5 * 60 * 1000);
}
export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const pathname = req.nextUrl.pathname;
  const token = req.cookies.get("access_token")?.value;

  if (!token) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  let user_permissions: string[] = [];
  const cacheKey = `user_${token}`;

  const cachedData = permissionCache.get(cacheKey);
  const now = Date.now();
  const oneMinute = 60 * 1000;

  if (cachedData && now - cachedData.timestamp < oneMinute) {
    user_permissions = cachedData.permissions;
  } else {
    try {
      const baseURL =
        process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:8000";
      const apiRes = await fetch(
        `${baseURL}/api/account/v1/authorization/get_user_all_permissions/`,
        {
          headers: {
            cookie: `access_token=${token};`,
          },
          cache: "no-store",
          credentials: "include",
        }
      );

      const json = await apiRes.json();
      if (json.code !== 200) {
        url.pathname = "/login";
        return NextResponse.redirect(url);
      }

      const data = json.data[0];
      user_permissions = data.permissions.map((p: any) => p.permission_name);

      permissionCache.set(cacheKey, {
        permissions: user_permissions,
        timestamp: now,
      });
    } catch (err) {
      console.log(err);
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
  }

  const matchedRoute = protected_routes.find(
    (route) => pathname === route.path || pathname.startsWith(`${route.path}/`)
  );

  if (
    matchedRoute?.permission_name &&
    !user_permissions.includes(matchedRoute.permission_name)
  ) {
    url.pathname = "/unauthorized";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|login|forget-password).*)",
  ],
};
