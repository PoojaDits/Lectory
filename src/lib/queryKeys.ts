/**
 * Centralized React Query keys.
 * Keeping them in one place prevents typos and makes cache
 * invalidation predictable across the app.
 */
export const queryKeys = {
  // ── Marketplace catalog ──
  books: {
    all: ["books"] as const,
    list: (params?: Record<string, unknown>) =>
      ["books", "list", params ?? {}] as const,
    detail: (id: string | number) => ["books", "detail", String(id)] as const,
    pending: ["books", "pending"] as const,
  },
  listings: {
    all: ["listings"] as const,
    byBook: (bookId: string | number) =>
      ["listings", "byBook", String(bookId)] as const,
    bySeller: (sellerId: string | number) =>
      ["listings", "bySeller", String(sellerId)] as const,
  },
  cart: {
    byCustomer: (customerId: string | number) =>
      ["cart", String(customerId)] as const,
  },
  orders: {
    byCustomer: (customerId: string | number) =>
      ["orders", "customer", String(customerId)] as const,
    bySeller: (sellerId: string | number) =>
      ["orders", "seller", String(sellerId)] as const,
    all: ["orders"] as const,
  },
  sellers: {
    all: ["sellers"] as const,
    pending: ["sellers", "pending"] as const,
    detail: (id: string | number) => ["sellers", "detail", String(id)] as const,
  },
  customers: {
    all: ["customers"] as const,
  },
  admin: {
    dashboard: ["admin", "dashboard"] as const,
  },
} as const;
