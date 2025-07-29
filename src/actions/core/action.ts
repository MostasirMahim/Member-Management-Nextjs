"use server";

import axiosInstance from "@/lib/axiosInstance";

export async function getMembershipType() {
  try {
    const req = await axiosInstance.get(`/api/core/v1/membership_type/`);
    return req.data;
  } catch (err) {
    console.error(err);
  }
}

export async function createMembershipType(data: Record<string, any>) {
  try {
    const req = await axiosInstance.post(`/api/core/v1/membership_type/`, data);
    return req.data;
  } catch (err) {
    console.error(err);
  }
}

export async function getInstituteNames() {
  try {
    const req = await axiosInstance.get(`/api/core/v1/institute_name/`);
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

export async function getGenders() {
  try {
    const req = await axiosInstance.get(`/api/core/v1/gender/`);
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

export async function getMembershipStatuses() {
  try {
    const req = await axiosInstance.get(
      `/api/core/v1/member_ship_status_choice/`
    );
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

export async function getMaritalStatuses() {
  try {
    const req = await axiosInstance.get(`/api/core/v1/marital_status_choice/`);
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

export async function getEmploymentTypes() {
  try {
    const req = await axiosInstance.get(`/api/core/v1/employment_type_choice/`);
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

export async function getEmailTypes() {
  try {
    const req = await axiosInstance.get(`/api/core/v1/email_type_choice/`);
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

export async function getContactTypes() {
  try {
    const req = await axiosInstance.get(`/api/core/v1/contact_type_choice/`);
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

export async function getAddressTypes() {
  try {
    const req = await axiosInstance.get(`/api/core/v1/address_type_choice/`);
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

export async function getDocumentTypes() {
  try {
    const req = await axiosInstance.get(`/api/core/v1/document_type_choice/`);
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

export async function getSpouseStatuses() {
  try {
    const req = await axiosInstance.get(
      `/api/core/v1/spouse_status_type_choice/`
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

export async function getDescendantRelations() {
  try {
    const req = await axiosInstance.get(
      `/api/core/v1/descendant_relation_type_choice/`
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



export const getHandlers = {
  membership_type: getMembershipType,
  institute_name: getInstituteNames,
  gender: getGenders,
  member_ship_status_choice: getMembershipStatuses,
  marital_status_choice: getMaritalStatuses,
  employment_type_choice: getEmploymentTypes,
  email_type_choice: getEmailTypes,
  contact_type_choice: getContactTypes,
  address_type_choice: getAddressTypes,
  document_type_choice: getDocumentTypes,
  spouse_status_type_choice: getSpouseStatuses,
  descendant_relation_type_choice: getDescendantRelations,
};

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