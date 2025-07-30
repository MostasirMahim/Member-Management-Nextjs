"use server";

import axiosInstance from "@/lib/axiosInstance";

export async function createMembershipType(data: Record<string, any>) {
  try {
    const req = await axiosInstance.post(`/api/core/v1/membership_type/`, data);
    return req.data;
  } catch (err) {
    console.error(err);
  }
}

export async function createInstituteName(data: Record<string, any>) {
  try {
    const req = await axiosInstance.post(`/api/core/v1/institute_name/`, data);
    return req.data;
  } catch (err) {
    console.error(err);
  }
}

export async function createGender(data: Record<string, any>) {
  try {
    const req = await axiosInstance.post(`/api/core/v1/gender/`, data);
    return req.data;
  } catch (err) {
    console.error(err);
  }
}

export async function createMembershipStatus(data: Record<string, any>) {
  try {
    const req = await axiosInstance.post(
      `/api/core/v1/member_ship_status_choice/`,
      data
    );
    return req.data;
  } catch (err) {
    console.error(err);
  }
}

export async function createMaritalStatus(data: Record<string, any>) {
  try {
    const req = await axiosInstance.post(
      `/api/core/v1/marital_status_choice/`,
      data
    );
    return req.data;
  } catch (err) {
    console.error(err);
  }
}

export async function createEmploymentType(data: Record<string, any>) {
  try {
    const req = await axiosInstance.post(
      `/api/core/v1/employment_type_choice/`,
      data
    );
    return req.data;
  } catch (err) {
    console.error(err);
  }
}

export async function createEmailType(data: Record<string, any>) {
  try {
    const req = await axiosInstance.post(
      `/api/core/v1/email_type_choice/`,
      data
    );
    return req.data;
  } catch (err) {
    console.error(err);
  }
}

export async function createContactType(data: Record<string, any>) {
  try {
    const req = await axiosInstance.post(
      `/api/core/v1/contact_type_choice/`,
      data
    );
    return req.data;
  } catch (err) {
    console.error(err);
  }
}

export async function createAddressType(data: Record<string, any>) {
  try {
    const req = await axiosInstance.post(
      `/api/core/v1/address_type_choice/`,
      data
    );
    return req.data;
  } catch (err) {
    console.error(err);
  }
}

export async function createDocumentType(data: Record<string, any>) {
  try {
    const req = await axiosInstance.post(
      `/api/core/v1/document_type_choice/`,
      data
    );
    return req.data;
  } catch (err) {
    console.error(err);
  }
}

export async function createSpouseStatus(data: Record<string, any>) {
  try {
    const req = await axiosInstance.post(
      `/api/core/v1/spouse_status_type_choice/`,
      data
    );
    return req.data;
  } catch (err) {
    console.error(err);
  }
}

export async function createDescendantRelation(data: Record<string, any>) {
  try {
    const req = await axiosInstance.post(
      `/api/core/v1/descendant_relation_type_choice/`,
      data
    );
    return req.data;
  } catch (err) {
    console.error(err);
  }
}

export const postHandlers = {
  membership_type: createMembershipType,
  institute_name: createInstituteName,
  gender: createGender,
  member_ship_status_choice: createMembershipStatus,
  marital_status_choice: createMaritalStatus,
  employment_type_choice: createEmploymentType,
  email_type_choice: createEmailType,
  contact_type_choice: createContactType,
  address_type_choice: createAddressType,
  document_type_choice: createDocumentType,
  spouse_status_type_choice: createSpouseStatus,
  descendant_relation_type_choice: createDescendantRelation,
};
