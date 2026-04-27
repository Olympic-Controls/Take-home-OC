import "@testing-library/jest-dom/vitest";
import { afterEach, beforeEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";

// Stub localStorage BEFORE importing the store - jsdom v29 exposes
// localStorage but its methods throw without --localstorage-file.
// vi.stubGlobal can't override jsdom's non-configurable property,
// so we use Object.defineProperty.
const storageMap = new Map<string, string>();
const storageMock: Storage = {
  getItem: (key: string) => storageMap.get(key) ?? null,
  setItem: (key: string, value: string) => {
    storageMap.set(key, value);
  },
  removeItem: (key: string) => {
    storageMap.delete(key);
  },
  clear: () => storageMap.clear(),
  get length() {
    return storageMap.size;
  },
  key: (index: number) => [...storageMap.keys()][index] ?? null,
};
Object.defineProperty(globalThis, "localStorage", {
  value: storageMock,
  writable: true,
  configurable: true,
});

// Now safe to import modules that use localStorage via zustand persist
const { useDashboardStore } = await import("../stores");
const { resetDatasetIndex } = await import("../mockData");

let uuidCounter = 0;

beforeEach(() => {
  // Deterministic IDs for snapshots / assertions
  uuidCounter = 0;
  vi.stubGlobal(
    "crypto",
    Object.assign({}, globalThis.crypto, {
      randomUUID: () => `test-uuid-${uuidCounter++}`,
    }),
  );

  // Clear persisted state
  storageMap.clear();

  // Reset Zustand store to initial state (merge, not replace — keep actions)
  useDashboardStore.setState({ widgets: {}, widgetIds: [], layouts: {} });

  // Reset dataset cycling counter
  resetDatasetIndex();
});

afterEach(() => {
  cleanup();
});
