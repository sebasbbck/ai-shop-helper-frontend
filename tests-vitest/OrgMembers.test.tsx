import { beforeEach, describe, expect, test, vi } from "vitest";
import { fireEvent, screen } from "@testing-library/react";
import { renderWithProviders } from "./test-utils";
import OrgMembers from "@/features/org-admin/OrgMembers";
import type { OrgMemberPublic } from "@/api/model/orgMemberPublic";

type MembersState = {
  data?: { items: OrgMemberPublic[]; total: number };
  isLoading: boolean;
  isError: boolean;
  isPlaceholderData: boolean;
};

const h = vi.hoisted(() => ({
  state: {} as MembersState,
  getMembers: vi.fn(),
}));

vi.mock("@/features/shell/ActiveContext", () => ({
  useActiveContext: () => ({
    activeOrgId: "org1",
    activeOrg: { name: "Acme" },
  }),
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

function makeMember(overrides: Partial<OrgMemberPublic> = {}): OrgMemberPublic {
  return {
    id: "m1",
    org_id: "org1",
    user: { id: "u1", name: "Ada Lovelace", email: "ada@example.com" },
    role: { id: "r1", name: "Member", access_level: 20 },
    created_at: "2026-01-15T10:00:00Z",
    updated_at: "2026-01-15T10:00:00Z",
    ...overrides,
  };
}

beforeEach(() => {
  h.getMembers.mockClear();
  h.state = { isLoading: false, isError: false, isPlaceholderData: false };
});

describe("OrgMembers", () => {
  test("requests the active org's first page", () => {
    h.state = {
      data: { items: [], total: 0 },
      isLoading: false,
      isError: false,
      isPlaceholderData: false,
    };
    renderWithProviders(<OrgMembers />);
    expect(h.getMembers).toHaveBeenCalledWith(
      "org1",
      { offset: 0, limit: 25 },
      expect.anything(),
    );
  });

  test("shows the empty state", () => {
    h.state = {
      data: { items: [], total: 0 },
      isLoading: false,
      isError: false,
      isPlaceholderData: false,
    };
    renderWithProviders(<OrgMembers />);
    expect(screen.getByText("No members found")).toBeInTheDocument();
  });

  test("shows the error state", () => {
    h.state = {
      data: undefined,
      isLoading: false,
      isError: true,
      isPlaceholderData: false,
    };
    renderWithProviders(<OrgMembers />);
    expect(screen.getByText("Could not load members")).toBeInTheDocument();
  });

  test("renders members with nested user and role", () => {
    h.state = {
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
      isLoading: false,
      isError: false,
      isPlaceholderData: false,
    };
    renderWithProviders(<OrgMembers />);
    expect(screen.getByText("Ada Lovelace")).toBeInTheDocument();
    expect(screen.getByText("bob@example.com")).toBeInTheDocument();
    expect(screen.getByText("Owner")).toBeInTheDocument();
    expect(screen.getByText("Member")).toBeInTheDocument();
  });

  test("advances the offset when paging", () => {
    h.state = {
      data: { items: [makeMember()], total: 60 },
      isLoading: false,
      isError: false,
      isPlaceholderData: false,
    };
    renderWithProviders(<OrgMembers />);
    fireEvent.click(screen.getByRole("button", { name: "Go to next page" }));
    expect(h.getMembers).toHaveBeenLastCalledWith(
      "org1",
      { offset: 25, limit: 25 },
      expect.anything(),
    );
  });

  test("shows skeletons while loading", () => {
    h.state = {
      data: undefined,
      isLoading: true,
      isError: false,
      isPlaceholderData: false,
    };
    const { container } = renderWithProviders(<OrgMembers />);
    expect(
      container.querySelectorAll(".MuiSkeleton-root").length,
    ).toBeGreaterThan(0);
  });
});
