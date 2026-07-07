"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useOrgsGetMyOrgs } from "@/api/endpoints/orgs/orgs";
import type { OrgWithProjects, ProjectPublic } from "@/api/model";

const LS_ORG_KEY = "active_org_id";
const LS_PROJECT_MAP_KEY = "active_project_by_org";

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

  const [activeOrgId, setActiveOrgIdState] = useState<string | null>(null);
  const [activeProjectId, setActiveProjectIdState] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);
  const [pendingOrgId, setPendingOrgId] = useState<string | null>(null);
  const [pendingProjectId, setPendingProjectId] = useState<string | null>(null);

  useEffect(() => {
    if (isLoading || initialized) return;
    if (orgs.length === 0) {
      setInitialized(true);
      return;
    }

    const storedOrgId = localStorage.getItem(LS_ORG_KEY);
    const projectMapRaw = localStorage.getItem(LS_PROJECT_MAP_KEY);
    const projectMap: Record<string, string> = projectMapRaw
      ? (JSON.parse(projectMapRaw) as Record<string, string>)
      : {};

    const validOrg = orgs.find((o) => o.id === storedOrgId) ?? orgs[0];
    const orgId = validOrg.id;
    const orgProjects = validOrg.projects ?? [];
    const validProject =
      orgProjects.find((p) => p.id === projectMap[orgId]) ?? orgProjects[0];

    setActiveOrgIdState(orgId);
    setActiveProjectIdState(validProject?.id ?? null);
    setInitialized(true);
  }, [orgs, isLoading, initialized]);

  useEffect(() => {
    if (!pendingOrgId) return;
    const org = orgs.find((o) => o.id === pendingOrgId);
    if (!org) return;
    const orgProjects = org.projects ?? [];
    const project = pendingProjectId
      ? (orgProjects.find((p) => p.id === pendingProjectId) ?? orgProjects[0])
      : orgProjects[0];
    localStorage.setItem(LS_ORG_KEY, pendingOrgId);
    setActiveOrgIdState(pendingOrgId);
    setActiveProjectIdState(project?.id ?? null);
    setPendingOrgId(null);
    setPendingProjectId(null);
  }, [orgs, pendingOrgId, pendingProjectId]);

  const setActiveOrg = (id: string) => {
    const org = orgs.find((o) => o.id === id);
    if (!org) return;

    const projectMapRaw = localStorage.getItem(LS_PROJECT_MAP_KEY);
    const projectMap: Record<string, string> = projectMapRaw
      ? (JSON.parse(projectMapRaw) as Record<string, string>)
      : {};

    const orgProjects = org.projects ?? [];
    const project =
      orgProjects.find((p) => p.id === projectMap[id]) ?? orgProjects[0];

    localStorage.setItem(LS_ORG_KEY, id);
    setActiveOrgIdState(id);
    setActiveProjectIdState(project?.id ?? null);
  };

  const setActiveProject = (id: string) => {
    if (!activeOrgId) return;
    const projectMapRaw = localStorage.getItem(LS_PROJECT_MAP_KEY);
    const projectMap: Record<string, string> = projectMapRaw
      ? (JSON.parse(projectMapRaw) as Record<string, string>)
      : {};
    const newMap = { ...projectMap, [activeOrgId]: id };
    localStorage.setItem(LS_PROJECT_MAP_KEY, JSON.stringify(newMap));
    setActiveProjectIdState(id);
  };

  const selectAfterCreate = (orgId: string, projectId?: string) => {
    setPendingOrgId(orgId);
    if (projectId) setPendingProjectId(projectId);
  };

  const activeOrg = orgs.find((o) => o.id === activeOrgId);
  const activeProject = activeOrg?.projects?.find((p) => p.id === activeProjectId);
  const activeProjectTypeId = activeProject?.project_type_id ?? null;

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
  if (!ctx) throw new Error("useActiveContext must be used within ActiveContextProvider");
  return ctx;
}
