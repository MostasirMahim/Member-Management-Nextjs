export const protected_routes: {
  path: string;
  permission_name: string | null;
}[] = [
  { path: "/", permission_name: null },
  { path: "/members", permission_name: "member_management" },
  { path: "/member", permission_name: "member_management" },
  { path: "/users", permission_name: "view_all_users" },
  { path: "/groups", permission_name: "group_permission_management" },
  { path: "/choices", permission_name: "member_management" },
  { path: "/registration", permission_name: "employee_onboarding" },
  { path: "/activity_logs", permission_name: "activity_log_management" },
  { path: "/emails", permission_name: "bulk_emails_management" },
  { path: "/restaurants", permission_name: "restaurant_management" },
  { path: "/products", permission_name: "product_management" },
  { path: "/promo_codes", permission_name: "promo_code_management" },
  { path: "/mfm", permission_name: "member_financial_management" },
  { path: "/upload/sales", permission_name: "member_financial_management" },
  { path: "/events", permission_name: null },
  { path: "/facilities", permission_name: "facility_management" },
];
