import '@testing-library/jest-dom/vitest'

const storage = new Map<string, string>()

Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: (key: string): string | null => storage.get(key) ?? null,
    setItem: (key: string, value: string) => storage.set(key, value),
    removeItem: (key: string) => storage.delete(key),
    clear: () => storage.clear(),
    get length() {
      return storage.size
    },
    key: (index: number): string | null => {
      const keys = Array.from(storage.keys())

      return keys[index] ?? null
    },
  },
  writable: true,
})
