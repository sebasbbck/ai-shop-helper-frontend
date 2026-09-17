import type { UserPublic } from "@/api/model/userPublic";
import type { OrgWithProjects } from "@/api/model/orgWithProjects";
import type { OrgMemberPublic } from "@/api/model/orgMemberPublic";
import type { NotificationPublic } from "@/api/model/notificationPublic";

/**
 * Shared test-data factories. One canonical default shape per domain entity,
 * overridable per test — replaces the same object literal being redefined
 * (sometimes verbatim) in every test file that needs one.
 */

export function makeUser(overrides: Partial<UserPublic> = {}): UserPublic {
  return {
    id: "u1",
    name: "Ada Lovelace",
    email: "ada@example.com",
    is_active: true,
    is_superuser: false,
    created_at: "2026-01-15T10:00:00Z",
    updated_at: "2026-01-15T10:00:00Z",
    ...overrides,
  };
}

export function makeOrg(
  overrides: Partial<OrgWithProjects> = {},
): OrgWithProjects {
  return {
    id: "org1",
    name: "Acme",
    credits: 0,
    projects: [],
    ...overrides,
  } as OrgWithProjects;
}

export function makeMember(
  overrides: Partial<OrgMemberPublic> = {},
): OrgMemberPublic {
  return {
    id: "m1",
    org_id: "org1",
    user: { id: "u1", name: "Ada Lovelace", email: "ada@example.com" },
    role: { id: "r1", name: "Member", access_level: 20 },
    created_at: "2026-01-15T10:00:00Z",
    updated_at: "2026-01-15T10:00:00Z",
    ...overrides,
  } as OrgMemberPublic;
}

export function makeNotification(
  overrides: Partial<NotificationPublic> = {},
): NotificationPublic {
  return {
    id: "n1",
    type: "execution_finished",
    payload: {},
    read_at: null,
    created_at: "2026-09-03T10:00:00Z",
    ...overrides,
  } as NotificationPublic;
}
