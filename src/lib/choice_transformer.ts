type ChoiceItem = { id: string; name: string; code?: string };
type ChoiceSection = {
  title: string;
  slug: string;
  component: string;
  hasCode?: boolean;
  items: ChoiceItem[];
};

const SLUG_COMPONENT_MAP: Record<
  string,
  { title: string; component: string; hasCode?: boolean }
> = {
  membership_type: {
    title: "Membership Type",
    component: "MembershipTypeChoice",
  },
  institute_name: {
    title: "Institute Name",
    component: "InstituteNameChoice",
    hasCode: true,
  },
  gender: { title: "Gender", component: "GenderChoice" },
  membership_status: {
    title: "Membership Status",
    component: "MembershipStatusChoice",
  },
  marital_status: { title: "Marital Status", component: "MaritalStatusChoice" },
  employment_type: {
    title: "Employment Type",
    component: "EmploymentTypeChoice",
  },
  email_type: { title: "Email Type", component: "EmailTypeChoice" },
  contact_type: { title: "Contact Type", component: "ContactTypeChoice" },
  address_type: { title: "Address Type", component: "AddressTypeChoice" },
  document_type: { title: "Document Type", component: "DocumentTypeChoice" },
  spouse_status_choice: {
    title: "Spouse Status Type",
    component: "SpouseStatusTypeChoice",
  },
  descendant_relation_choice: {
    title: "Descendant Relation Type",
    component: "DescendantRelationTypeChoice",
  },
};
export default function dataToChoiceSections(
  fetched: Record<string, any[]>
): ChoiceSection[] {
  return Object.entries(fetched).map(([slug, items]) => {
    const map = SLUG_COMPONENT_MAP[slug] ?? {
      title: slug.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
      component: "GenericChoice",
    };

    return {
      title: map.title,
      slug,
      component: map.component,
      hasCode: map.hasCode,
      items: items.map((item, index) => ({
        id: index.toString(),
        name: item.name,
        ...(item.code ? { code: item.code } : {}),
      })),
    };
  });
}
