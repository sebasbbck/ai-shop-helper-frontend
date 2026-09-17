import { beforeEach, describe, expect, test, vi } from "vitest";
import { fireEvent, screen } from "@testing-library/react";
import { renderWithProviders } from "./test-utils";
import { makeRouter } from "./mocks/router";
import { makeActiveContext } from "./mocks/active-context";
import OrgSwitcher from "@/components/layout/OrgSwitcher";

const h = vi.hoisted(() => ({
  isOrgAdmin: false,
  push: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => makeRouter({ push: h.push }),
  usePathname: () => "/org",
}));

vi.mock("@/features/shell/ActiveContext", () => ({
  useActiveContext: () =>
    makeActiveContext({
      orgs: [{ id: "org1", name: "Acme" }],
      activeOrg: { id: "org1", name: "Acme" },
      activeOrgId: "org1",
    }),
}));

vi.mock("@/features/org-admin/useActiveOrgRole", () => ({
  useActiveOrgRole: () => ({ isOrgAdmin: h.isOrgAdmin }),
}));

vi.mock("@/components/layout/CreateOrgDialog", () => ({ default: () => null }));

beforeEach(() => {
  h.push.mockClear();
  h.isOrgAdmin = false;
});

describe("OrgSwitcher members link", () => {
  test("shows the members link for org admins and navigates", () => {
    h.isOrgAdmin = true;
    renderWithProviders(<OrgSwitcher collapsed={false} />);
    const link = screen.getByText("Members");
    fireEvent.click(link);
    expect(h.push).toHaveBeenCalledWith("/org/admin");
  });

  test("hides the members link for non-admins", () => {
    h.isOrgAdmin = false;
    renderWithProviders(<OrgSwitcher collapsed={false} />);
    expect(screen.queryByText("Members")).not.toBeInTheDocument();
  });
});
