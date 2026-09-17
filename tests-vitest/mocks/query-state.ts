/**
 * Shared shape for TanStack Query list-hook mocks (paginated GET endpoints).
 * Most list screens (OrgMembers, UsersAdmin, NotificationsScreen, ...) mock
 * their query hook to return exactly this shape — this factory removes the
 * copy-pasted `{ isLoading: false, isError: false, isPlaceholderData: false }`
 * boilerplate that was repeated on nearly every test.
 */
export type ListQueryState<T> = {
  data?: { items: T[]; total: number };
  isLoading: boolean;
  isError: boolean;
  isPlaceholderData: boolean;
};

export function makeListQueryState<T>(
  overrides: Partial<ListQueryState<T>> = {},
): ListQueryState<T> {
  return {
    isLoading: false,
    isError: false,
    isPlaceholderData: false,
    ...overrides,
  };
}
