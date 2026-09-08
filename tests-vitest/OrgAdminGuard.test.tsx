import { beforeEach, describe, expect, test, vi } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "./test-utils";
import OrgAdminGuard from "@/features/org-admin/OrgAdminGuard";

const h = vi.hoisted(() => ({
  role: { isOrgAdmin: false, isLoading: false },
  replace: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: h.replace, push: vi.fn(), prefetch: vi.fn() }),
}));

vi.mock("@/features/org-admin/useActiveOrgRole", () => ({
  useActiveOrgRole: () => h.role,
}));

beforeEach(() => {
  h.replace.mockClear();
  h.role = { isOrgAdmin: false, isLoading: false };
});

describe("OrgAdminGuard", () => {
  test("renders children for org admins", () => {
    h.role = { isOrgAdmin: true, isLoading: false };
    renderWithProviders(
      <OrgAdminGuard>
        <p>Members panel</p>
      </OrgAdminGuard>,
    );
    expect(screen.getByText("Members panel")).toBeInTheDocument();
    expect(h.replace).not.toHaveBeenCalled();
  });

  test("redirects non-admins to /org", () => {
    h.role = { isOrgAdmin: false, isLoading: false };
    renderWithProviders(
      <OrgAdminGuard>
        <p>Members panel</p>
      </OrgAdminGuard>,
    );
    expect(screen.queryByText("Members panel")).not.toBeInTheDocument();
    expect(h.replace).toHaveBeenCalledWith("/org");
  });

  test("waits while resolving", () => {
    h.role = { isOrgAdmin: false, isLoading: true };
    renderWithProviders(
      <OrgAdminGuard>
        <p>Members panel</p>
      </OrgAdminGuard>,
    );
    expect(screen.queryByText("Members panel")).not.toBeInTheDocument();
    expect(h.replace).not.toHaveBeenCalled();
  });
});
