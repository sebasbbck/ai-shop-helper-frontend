"use client";

import { useSyncExternalStore } from "react";

const LOCAL_STORAGE_EVENT = "local-storage";

function subscribe(callback: () => void): () => void {
  window.addEventListener("storage", callback);
  window.addEventListener(LOCAL_STORAGE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(LOCAL_STORAGE_EVENT, callback);
  };
}

export function useLocalStorage(
  key: string,
): readonly [string | null, (value: string) => void] {
  const value = useSyncExternalStore(
    subscribe,
    () => localStorage.getItem(key),
    () => null,
  );

  const setValue = (next: string): void => {
    localStorage.setItem(key, next);
    window.dispatchEvent(new Event(LOCAL_STORAGE_EVENT));
  };

  return [value, setValue] as const;
}
