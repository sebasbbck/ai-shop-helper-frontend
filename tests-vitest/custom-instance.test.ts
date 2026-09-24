import { beforeEach, describe, expect, test, vi } from "vitest";
import axios, { type AxiosRequestConfig, type AxiosResponse } from "axios";

const h = vi.hoisted(() => ({
  token: null as string | null,
  setToken: vi.fn(),
}));

vi.mock("@/lib/api/token-store", () => ({
  getAccessToken: () => h.token,
  setAccessToken: (token: string | null) => {
    h.setToken(token);
    h.token = token;
  },
}));

import { customInstance } from "@/lib/api/custom-instance";

function stepAdapter(steps: Array<{ status: number; data?: unknown }>) {
  let call = 0;
  return async (config: AxiosRequestConfig): Promise<AxiosResponse> => {
    const step = steps[Math.min(call, steps.length - 1)];
    call += 1;
    const response = {
      data: step.data ?? {},
      status: step.status,
      statusText: "",
      headers: {},
      config,
    } as AxiosResponse;

    const validateStatus =
      config.validateStatus ??
      ((status: number) => status >= 200 && status < 300);
    if (!validateStatus(step.status)) {
      return Promise.reject(
        Object.assign(new Error(`Request failed with status ${step.status}`), {
          response,
          config,
          isAxiosError: true,
        }),
      );
    }
    return response;
  };
}

describe("customInstance", () => {
  beforeEach(() => {
    h.token = null;
    h.setToken.mockClear();
    vi.restoreAllMocks();
  });

  test("attaches the bearer token when one is available", async () => {
    h.token = "abc123";
    let seenAuth: unknown;
    const adapter = async (config: AxiosRequestConfig) => {
      seenAuth = config.headers?.Authorization;
      return {
        data: { ok: true },
        status: 200,
        statusText: "",
        headers: {},
        config,
      } as AxiosResponse;
    };

    await customInstance({ url: "/agents", method: "get", adapter });

    expect(seenAuth).toBe("Bearer abc123");
  });

  test("sends no Authorization header when there is no token", async () => {
    let seenAuth: unknown;
    const adapter = async (config: AxiosRequestConfig) => {
      seenAuth = config.headers?.Authorization;
      return {
        data: {},
        status: 200,
        statusText: "",
        headers: {},
        config,
      } as AxiosResponse;
    };

    await customInstance({ url: "/agents", method: "get", adapter });

    expect(seenAuth).toBeUndefined();
  });

  test("refreshes the token and retries the request on a 401", async () => {
    vi.spyOn(axios, "post").mockResolvedValueOnce({
      data: { access_token: "fresh-token" },
    } as AxiosResponse);

    const adapter = stepAdapter([
      { status: 401 },
      { status: 200, data: { ok: true } },
    ]);

    const result = await customInstance<{ ok: boolean }>({
      url: "/agents",
      method: "get",
      adapter,
    });

    expect(result).toEqual({ ok: true });
    expect(h.setToken).toHaveBeenCalledWith("fresh-token");
  });

  test("does not retry a 401 coming from an auth endpoint", async () => {
    const adapter = stepAdapter([{ status: 401 }]);

    await expect(
      customInstance({ url: "/auth/login", method: "post", adapter }),
    ).rejects.toMatchObject({ response: { status: 401 } });
  });

  test("propagates the error and clears the token when the refresh itself fails", async () => {
    h.token = "stale-token";
    vi.spyOn(axios, "post").mockRejectedValueOnce(new Error("refresh failed"));

    const adapter = stepAdapter([{ status: 401 }]);

    await expect(
      customInstance({ url: "/agents", method: "get", adapter }),
    ).rejects.toMatchObject({ response: { status: 401 } });
    expect(h.setToken).toHaveBeenCalledWith(null);
  });
});
