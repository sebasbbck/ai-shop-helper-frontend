import { beforeEach, describe, expect, test, vi } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "./test-utils";
import { useActiveOrgRole } from "@/features/org-admin/useActiveOrgRole";

const h = vi.hoisted(() => ({
  activeOrgId: null as string | null,
  me: undefined as { id: string } | undefined,
  meLoading: false,
  member: undefined as { role: { access_level: number } } | undefined,
  memberLoading: false,
}));

vi.mock("@/features/shell/ActiveContext", () => ({
  useActiveContext: () => ({ activeOrgId: h.activeOrgId }),
}));

vi.mock("@/api/endpoints/users/users", () => ({
  useUsersGetMe: () => ({ data: h.me, isLoading: h.meLoading }),
}));

vi.mock("@/api/endpoints/org-members/org-members", () => ({
  useOrgMembersGetOrgMember: () => ({
    data: h.member,
    isLoading: h.memberLoading,
  }),
}));

function Probe() {
  const { isOrgAdmin, isLoading, accessLevel } = useActiveOrgRole();
  return (
    <div>
      <span data-testid="admin">{String(isOrgAdmin)}</span>
      <span data-testid="loading">{String(isLoading)}</span>
      <span data-testid="level">{String(accessLevel)}</span>
    </div>
  );
}

beforeEach(() => {
  h.activeOrgId = "org1";
  h.me = { id: "u1" };
  h.meLoading = false;
  h.member = undefined;
  h.memberLoading = false;
});

describe("useActiveOrgRole", () => {
  test("admin for owner/admin access levels", () => {
    h.member = { role: { access_level: 10 } };
    renderWithProviders(<Probe />);
    expect(screen.getByTestId("admin").textContent).toBe("true");
    expect(screen.getByTestId("level").textContent).toBe("10");
  });

  test("not admin for member access level", () => {
    h.member = { role: { access_level: 20 } };
    renderWithProviders(<Probe />);
    expect(screen.getByTestId("admin").textContent).toBe("false");
  });

  test("loading while membership resolves", () => {
    h.member = undefined;
    h.memberLoading = true;
    renderWithProviders(<Probe />);
    expect(screen.getByTestId("loading").textContent).toBe("true");
    expect(screen.getByTestId("admin").textContent).toBe("false");
  });

  test("not admin and not loading when there is no active org", () => {
    h.activeOrgId = null;
    renderWithProviders(<Probe />);
    expect(screen.getByTestId("loading").textContent).toBe("false");
    expect(screen.getByTestId("admin").textContent).toBe("false");
  });
});
