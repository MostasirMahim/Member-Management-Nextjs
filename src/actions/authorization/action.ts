"use server";

import { handleApi } from "@/lib/api";
import { revalidatePath } from "next/cache";

const baseUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;

export const sendOtp = async (email: string) => {
  try {
    const url = `${baseUrl}/api/account/v1/authorization/admin_user_email/`;
    const req = handleApi({ url, method: "POST", body: { email } });
    return req;
  } catch (err) {
    console.error("error occurred", err);
  }
};

export const getPermissions = async () => {
  const url = `${baseUrl}/api/account/v1/authorization/get_user_all_permissions/`;
  const req = await handleApi({ url, method: "GET" });
  console.log(`permissionList`, req);
};

export const verifyOtp = async ( email: string, otp: number) => {
  try {
    const url = `${baseUrl}/api/account/v1/authorization/admin_user_verify_otp/`;
    const data = { email, otp };
    const req = handleApi({ url, method: "POST", body: data });
    return req;
  } catch (err) {
    console.error(err);
  }
};

interface userInfo {
  email: string;
  username: string;
  name: string;
  password: string;
}

export const addUser = async ( userinfo: userInfo) => {
  try {
    const url = `${baseUrl}/api/account/v1/authorization/admin_user_register/`;
    const req = await handleApi({ url, method: "POST", body: userinfo });
    return req;
  } catch (err) {
    console.error(err);
  }
};

export const add_Permission = async (formdata: FormData) => {
  try {
    const name = formdata.get("name");
    const permission = { name };
    const url = `${baseUrl}/api/account/v1/authorization/custom_permission_name/`;
    const req = await handleApi({ url, method: "POST", body: permission });
    if (req?.code === 201) {
      revalidatePath("/permissions");
    }
  } catch (err) {
    console.error(err);
  }
};

export const add_Group = async (formdata: FormData) => {
  try {
    const createGroup = {
      name: formdata.get("gName"),
      permission: formdata.getAll("permission"),
    };
    const url = `${baseUrl}/api/account/v1/authorization/group_permissions/`;
    const req = await handleApi({ url, method: "POST", body: createGroup });
    if (req?.code === 201) {
      revalidatePath("/view_groups");
    }
    return req;
  } catch (err) {
    console.error(err);
  }
};

export const delete_Group = async (id: number) => {
  try {
    const url = `${baseUrl}/api/account/v1/authorization/group_permissions/${id}/`;
    const req = await handleApi({ url, method: "DELETE" });
    if (req?.code === 200) {
      revalidatePath(`/view_groups`);
    }
    return req;
  } catch (err) {
    console.error(err);
  }
};

export const remove_User = async (data: object, id: string) => {
  try {
    const url = `${baseUrl}/api/account/v1/authorization/assign_group_user/`;
    const req = await handleApi({ url, method: "DELETE", body: data });
    if (req?.code === 200) {
      revalidatePath(`/view_groups/${id}`);
    }
    return req;
  } catch (err) {
    console.error(err);
  }
};

export const assign_User = async (data: object) => {
  const url = `${baseUrl}/api/account/v1/authorization/assign_group_user/`;
  const res = await handleApi({ url, method: "POST", body: data });

  if (res?.code === 200) {
    const id = res?.updated_groups?.[0]?.group_id;
    revalidatePath(`/view_groups/${id}`);
  }

  return res;
};

export const assign_Permission = async (data: object, id: string) => {
  const url = `${baseUrl}/api/account/v1/authorization/group_permissions/${id}/`;
  const res = await handleApi({ url, method: "PATCH", body: data });

  if (res?.code === 200) {
    revalidatePath(`/view_groups/${id}`);
  }

  return res;
};

export const remove_Permission = async (id: number) => {
  const url = `${baseUrl}/api/account/v1/authorization/group_permissions/${id}/`;
  const res = await handleApi({ url, method: "PATCH" });

  if (res?.code === 200) {
    revalidatePath(`/view_groups/${id}`);
  }

  return res;
};
