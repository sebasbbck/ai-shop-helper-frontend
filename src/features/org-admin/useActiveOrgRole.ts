"use client";

import { useOrgMembersGetOrgMember } from "@/api/endpoints/org-members/org-members";
import { useUsersGetMe } from "@/api/endpoints/users/users";
import { useActiveContext } from "@/features/shell/ActiveContext";

const ORG_ADMIN_MAX_LEVEL = 10;

interface ActiveOrgRole {
  isLoading: boolean;
  isOrgAdmin: boolean;
  accessLevel: number | null;
}

export function useActiveOrgRole(): ActiveOrgRole {
  const { activeOrgId } = useActiveContext();
  const { data: me, isLoading: meLoading } = useUsersGetMe({
    query: { retry: false },
  });

  const enabled = Boolean(activeOrgId && me?.id);
  const { data, isLoading: memberLoading } = useOrgMembersGetOrgMember(
    activeOrgId ?? "",
    me?.id ?? "",
    { query: { enabled, retry: false } },
  );

  const accessLevel = data?.role.access_level ?? null;

  return {
    isLoading: meLoading || (enabled && memberLoading),
    isOrgAdmin: accessLevel !== null && accessLevel <= ORG_ADMIN_MAX_LEVEL,
    accessLevel,
  };
}
