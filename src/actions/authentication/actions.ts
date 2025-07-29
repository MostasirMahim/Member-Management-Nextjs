"use server";

import axiosInstance from "@/lib/axiosInstance";
import { cookies } from "next/headers";

export const loginAction = async (formData: any) => {
  try {
    if (!formData.username || !formData.password) {
      return {
        success: false,
        error: null,
        message: "Username and password are required",
      };
    }
    const req = await axiosInstance.post("/api/account/v1/login/", formData);
    const res = req.data;

    const { access_token, refresh_token, code, status } = res;
    if (code === 200 && status === "success") {
      const cookie = await cookies();
      cookie.set("access_token", access_token, {
        httpOnly: true,
        secure: false,
      });
      cookie.set("refresh_token", refresh_token, {
        httpOnly: true,
        secure: false,
      });
    }
    return {
      success: true,
      data: res,
      message: "Login successful",
    };
  } catch (err: any) {
    console.log(err.message, err?.response?.data);
    return {
      success: false,
      error: err?.response?.data || "An error occurred during login",
      message: "An error occurred during login",
    };
  }
};

export const logoutAction = async () => {
  const cookie = await cookies();
  try {
    const req = await axiosInstance.delete("/api/account/v1/logout/");
    const res = req.data;
    const { code, status } = res;
    if (code === 200 && status === "success") {
      cookie.delete("access_token");
      cookie.delete("refresh_token");
      return res;
    }
    return { success: false, message: "Logout failed", error: res };
  } catch (err: any) {
    console.error("Logout error:", err?.response?.data || err.message);
    return err
  }
};

interface ApiProps {
  url: string;
  body?: {};
  method: "GET" | "POST" | "PATCH" | "DELETE";
}

export const handleUnauthorized = async ({ url, method, body }: ApiProps) => {
  const cookie = await cookies();
  const refreshToken = cookie.get("refresh_token")?.value;

  if (!refreshToken) {
    const logOutres = await logoutAction();
    return { success: false, message: logOutres?.message, data: null };
  }

  try {
    const refRes = await axiosInstance.post("/api/account/v1/token/refresh/", {
      refresh: refreshToken,
    });

    const { code, status, access_token } = refRes.data;
    if (code !== 200 || status !== "success") {
      const logOutres = await logoutAction();
      return { success: false, message: logOutres?.message, data: null };
    }

    cookie.set("access_token", access_token, { httpOnly: true, secure: false });

    const retryReq = await axiosInstance.request({
      url,
      method,
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
      data: body,
    });

    const retryRes = retryReq.data;

    if (retryRes?.code === 200) {
      return {
        success: true,
        message: "Request retried successfully",
        data: retryRes?.data,
      };
    }

    return {
      success: false,
      message: `Retry request failed with code ${retryRes.code}`,
      data: retryRes,
    };
  } catch (err) {
    console.error("Refresh token error:", err);
    await logoutAction();
    return {
      success: false,
      message: "Access Denied, user logged out",
      data: null,
    };
  }
};

export const ForgetSendOtp = async (email: string) => {
  try {
    const req = await axiosInstance.post("/api/account/v1/forget_password/", {
      email: email,
    });

    const res = req.data;
    console.log(res);

    return res;
  } catch (err:any) {
    console.error("error occurred", err.response.data || err.message);
  }
};

export const ForgetVerifyOtp = async (email: string, otp: number) => {
  try {
    const data = { email: email, otp: otp };
    const req = await axiosInstance.post("/api/account/v1/verify_otp/", data);
    const res = req.data;
    console.log(res);
    return res;
  } catch (err) {
    console.error(err);
  }
};

interface UserInfo {
  email: string;
  token: string;
  password: string;
}
export const resetPass = async (userinfo: UserInfo) => {
  try {
    console.log("Resetting password with userinfo:", userinfo);
    const cookie = await cookies();
    const req = await axiosInstance.post(
      "/api/account/v1/reset_password/",
      userinfo
    );
    const res = req.data;
    const { access_token, refresh_token, code, status } = res;
    if (code === 200 && status === "success") {
      const cookie = await cookies();
      cookie.set("access_token", access_token, {
        httpOnly: true,
        secure: false,
      });
      cookie.set("refresh_token", refresh_token, {
        httpOnly: true,
        secure: false,
      });
    }
    return res;
  } catch (err:any) {
    console.error(err);
    return err
  }
};

interface UserPass {
  current_password: string;
  new_password: string;
  confirm_password: string;
}
export const changePass = async (userinfo: UserPass) => {
  try {
     const cookie = await cookies();
     console.log("Changing password with userinfo:", userinfo);
    const req = await axiosInstance.patch(
      "/api/account/v1/reset_password/",
      userinfo,
      {
        headers: {
          Authorization: `Bearer ${cookie.get("access_token")?.value}`,
        },
      }
    );
    const res = req.data;
    console.log(res);
    return res;
  } catch (err:any) {
    console.error(err?.response?.data || err.message);
  }
};

export const getUserInfo = async () => {
  try {
    const cookie = await cookies();
    const token = cookie.get("access_token")?.value;

    if (!token) {
      return { success: false, message: "No token found", data: null };
    }

    const req = await axiosInstance.get(
      "/api/account/v1/authorization/get_user_all_permissions/",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const res = req.data;
    return {
      success: true,
      data: res,
      message: "User info fetched successfully",
    };
  } catch (err: any) {
    console.error(
      "Error fetching user info:",
      err?.response?.data || err.message
    );
    return { success: false, message: "Error fetching user info", data: null };
  }
};
