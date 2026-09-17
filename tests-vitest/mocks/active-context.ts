import { vi } from "vitest";
import type { OrgWithProjects } from "@/api/model/orgWithProjects";
import type { ProjectPublic } from "@/api/model/projectPublic";

/**
 * Shared shape for `@/features/shell/ActiveContext`'s `useActiveContext()`
 * mock. Each caller used to hand-write a partial object literal and hope the
 * component under test never reads a field it forgot to include — this
 * factory gives every field a harmless default so only the fields a test
 * actually cares about need to be passed.
 */
type ActiveContextOverrides = Partial<{
  orgs: Partial<OrgWithProjects>[];
  isLoading: boolean;
  isEmpty: boolean;
  activeOrgId: string | null;
  activeProjectId: string | null;
  activeOrg: Partial<OrgWithProjects>;
  activeProject: Partial<ProjectPublic>;
  activeProjectTypeId: string | null;
  setActiveOrg: (id: string) => void;
  setActiveProject: (id: string) => void;
  selectAfterCreate: (orgId: string, projectId?: string) => void;
}>;

export function makeActiveContext(overrides: ActiveContextOverrides = {}) {
  return {
    orgs: [],
    isLoading: false,
    isEmpty: false,
    activeOrgId: null,
    activeProjectId: null,
    activeOrg: undefined,
    activeProject: undefined,
    activeProjectTypeId: null,
    setActiveOrg: vi.fn(),
    setActiveProject: vi.fn(),
    selectAfterCreate: vi.fn(),
    ...overrides,
  };
}
