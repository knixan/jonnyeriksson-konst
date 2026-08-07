"use client";

import { useSyncExternalStore } from "react";

import { cartStore } from "@/components/cart/cart-store";

export function useCart() {
  const items = useSyncExternalStore(
    cartStore.subscribe,
    cartStore.getSnapshot,
    cartStore.getServerSnapshot,
  );

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotalOre = items.reduce(
    (sum, item) => sum + item.quantity * item.priceOre,
    0,
  );

  return {
    items,
    itemCount,
    subtotalOre,
    addItem: cartStore.addItem,
    removeItem: cartStore.removeItem,
    setQuantity: cartStore.setQuantity,
    clear: cartStore.clear,
  };
}
