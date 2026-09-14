import OrgAdminGuard from "@/features/org-admin/OrgAdminGuard";
import OrgMembers from "@/features/org-admin/OrgMembers";

export default function OrgAdminPage() {
  return (
    <OrgAdminGuard>
      <OrgMembers />
    </OrgAdminGuard>
  );
}
