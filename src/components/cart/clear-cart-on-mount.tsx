"use client";

import { useEffect } from "react";

import { cartStore } from "@/components/cart/cart-store";

export function ClearCartOnMount() {
  useEffect(() => {
    cartStore.clear();
  }, []);
  return null;
}
