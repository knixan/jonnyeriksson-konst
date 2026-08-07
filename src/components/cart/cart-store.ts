export type CartItem = {
  variantId: string;
  productSlug: string;
  productName: string;
  variantLabel: string;
  priceOre: number;
  quantity: number;
  imageUrl?: string;
};

const STORAGE_KEY = "jonnykonst-cart";

let items: CartItem[] = [];
let hydrated = false;
const listeners = new Set<() => void>();

function emitChange() {
  for (const listener of listeners) listener();
}

function persist() {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // ignore write failures (private browsing, storage full, etc.)
  }
}

function hydrate() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) items = JSON.parse(raw);
  } catch {
    // ignore corrupt local storage
  }
}

export const cartStore = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  getSnapshot() {
    hydrate();
    return items;
  },
  getServerSnapshot() {
    return items;
  },
  addItem(item: Omit<CartItem, "quantity">, quantity = 1) {
    const existing = items.find((i) => i.variantId === item.variantId);
    items = existing
      ? items.map((i) =>
          i.variantId === item.variantId
            ? { ...i, quantity: i.quantity + quantity }
            : i,
        )
      : [...items, { ...item, quantity }];
    persist();
    emitChange();
  },
  removeItem(variantId: string) {
    items = items.filter((i) => i.variantId !== variantId);
    persist();
    emitChange();
  },
  setQuantity(variantId: string, quantity: number) {
    items =
      quantity <= 0
        ? items.filter((i) => i.variantId !== variantId)
        : items.map((i) =>
            i.variantId === variantId ? { ...i, quantity } : i,
          );
    persist();
    emitChange();
  },
  clear() {
    items = [];
    persist();
    emitChange();
  },
};
