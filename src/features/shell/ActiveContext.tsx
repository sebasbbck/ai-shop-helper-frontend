"use client";

import { createContext, useContext } from "react";
import type { ReactNode } from "react";
import { useOrgsGetMyOrgs } from "@/api/endpoints/orgs/orgs";
import type { OrgWithProjects, ProjectPublic } from "@/api/model";
import { useLocalStorage } from "@/hooks/useLocalStorage";

const LS_ORG_KEY = "active_org_id";
const LS_PROJECT_MAP_KEY = "active_project_by_org";

function parseProjectMap(raw: string | null): Record<string, string> {
  if (!raw) return {};
  try {
    return JSON.parse(raw) as Record<string, string>;
  } catch {
    return {};
  }
}

interface ActiveContextValue {
  orgs: OrgWithProjects[];
  isLoading: boolean;
  isEmpty: boolean;
  activeOrgId: string | null;
  activeProjectId: string | null;
  activeOrg: OrgWithProjects | undefined;
  activeProject: ProjectPublic | undefined;
  activeProjectTypeId: string | null;
  setActiveOrg: (id: string) => void;
  setActiveProject: (id: string) => void;
  selectAfterCreate: (orgId: string, projectId?: string) => void;
}

const ActiveContext = createContext<ActiveContextValue | null>(null);

export function ActiveContextProvider({ children }: { children: ReactNode }) {
  const { data, isLoading } = useOrgsGetMyOrgs();
  const orgs = data?.items ?? [];

  const [storedOrgId, setStoredOrgId] = useLocalStorage(LS_ORG_KEY);
  const [projectMapRaw, setProjectMapRaw] = useLocalStorage(LS_PROJECT_MAP_KEY);
  const projectMap = parseProjectMap(projectMapRaw);

  const activeOrg =
    orgs.length > 0
      ? (orgs.find((o) => o.id === storedOrgId) ?? orgs[0])
      : undefined;
  const activeOrgId = activeOrg?.id ?? null;

  const orgProjects = activeOrg?.projects ?? [];
  const activeProject = activeOrgId
    ? (orgProjects.find((p) => p.id === projectMap[activeOrgId]) ??
      orgProjects[0])
    : undefined;
  const activeProjectId = activeProject?.id ?? null;
  const activeProjectTypeId = activeProject?.project_type_id ?? null;

  const setActiveOrg = (id: string) => {
    if (orgs.some((o) => o.id === id)) setStoredOrgId(id);
  };

  const setActiveProject = (id: string) => {
    if (!activeOrgId) return;
    setProjectMapRaw(JSON.stringify({ ...projectMap, [activeOrgId]: id }));
  };

  const selectAfterCreate = (orgId: string, projectId?: string) => {
    setStoredOrgId(orgId);
    if (projectId) {
      setProjectMapRaw(JSON.stringify({ ...projectMap, [orgId]: projectId }));
    }
  };

  return (
    <ActiveContext.Provider
      value={{
        orgs,
        isLoading,
        isEmpty: !isLoading && orgs.length === 0,
        activeOrgId,
        activeProjectId,
        activeOrg,
        activeProject,
        activeProjectTypeId,
        setActiveOrg,
        setActiveProject,
        selectAfterCreate,
      }}
    >
      {children}
    </ActiveContext.Provider>
  );
}

export function useActiveContext(): ActiveContextValue {
  const ctx = useContext(ActiveContext);
  if (!ctx)
    throw new Error(
      "useActiveContext must be used within ActiveContextProvider",
    );
  return ctx;
}
