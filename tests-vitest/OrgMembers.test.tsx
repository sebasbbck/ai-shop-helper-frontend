import { beforeEach, describe, expect, test, vi } from "vitest";
import { fireEvent, screen } from "@testing-library/react";
import { renderWithProviders } from "./test-utils";
import { makeActiveContext } from "./mocks/active-context";
import { makeListQueryState, type ListQueryState } from "./mocks/query-state";
import { makeMember } from "./mocks/entities";
import OrgMembers from "@/features/org-admin/OrgMembers";
import type { OrgMemberPublic } from "@/api/model/orgMemberPublic";

const h = vi.hoisted(() => ({
  state: {} as ListQueryState<OrgMemberPublic>,
  getMembers: vi.fn(),
}));

vi.mock("@/features/shell/ActiveContext", () => ({
  useActiveContext: () =>
    makeActiveContext({ activeOrgId: "org1", activeOrg: { name: "Acme" } }),
}));

vi.mock("@/api/endpoints/org-members/org-members", () => ({
  useOrgMembersGetOrgMembers: (
    orgId: string,
    params: unknown,
    options: unknown,
  ) => {
    h.getMembers(orgId, params, options);
    return h.state;
  },
}));

beforeEach(() => {
  h.getMembers.mockClear();
  h.state = makeListQueryState();
});

describe("OrgMembers", () => {
  test("requests the active org's first page", () => {
    h.state = makeListQueryState({ data: { items: [], total: 0 } });
    renderWithProviders(<OrgMembers />);
    expect(h.getMembers).toHaveBeenCalledWith(
      "org1",
      { offset: 0, limit: 25 },
      expect.anything(),
    );
  });

  test("shows the empty state", () => {
    h.state = makeListQueryState({ data: { items: [], total: 0 } });
    renderWithProviders(<OrgMembers />);
    expect(screen.getByText("No members found")).toBeInTheDocument();
  });

  test("shows the error state", () => {
    h.state = makeListQueryState({ isError: true });
    renderWithProviders(<OrgMembers />);
    expect(screen.getByText("Could not load members")).toBeInTheDocument();
  });

  test("renders members with nested user and role", () => {
    h.state = makeListQueryState({
      data: {
        items: [
          makeMember({ role: { id: "r0", name: "Owner", access_level: 0 } }),
          makeMember({
            id: "m2",
            user: { id: "u2", name: "Bob", email: "bob@example.com" },
          }),
        ],
        total: 2,
      },
    });
    renderWithProviders(<OrgMembers />);
    expect(screen.getByText("Ada Lovelace")).toBeInTheDocument();
    expect(screen.getByText("bob@example.com")).toBeInTheDocument();
    expect(screen.getByText("Owner")).toBeInTheDocument();
    expect(screen.getByText("Member")).toBeInTheDocument();
  });

  test("advances the offset when paging", () => {
    h.state = makeListQueryState({
      data: { items: [makeMember()], total: 60 },
    });
    renderWithProviders(<OrgMembers />);
    fireEvent.click(screen.getByRole("button", { name: "Go to next page" }));
    expect(h.getMembers).toHaveBeenLastCalledWith(
      "org1",
      { offset: 25, limit: 25 },
      expect.anything(),
    );
  });

  test("shows skeletons while loading", () => {
    h.state = makeListQueryState({ isLoading: true });
    const { container } = renderWithProviders(<OrgMembers />);
    expect(
      container.querySelectorAll(".MuiSkeleton-root").length,
    ).toBeGreaterThan(0);
  });
});
