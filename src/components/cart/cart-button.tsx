"use client";

import Image from "next/image";
import Link from "next/link";

import { useCart } from "@/components/cart/cart-context";

export function CartButton() {
  const { itemCount } = useCart();

  return (
    <Link
      href="/kundvagn"
      aria-label="Kundvagn"
      className="relative text-muted-foreground hover:text-accent"
    >
      <Image src="/icon/icon-bag.png" alt="" width={22} height={22} unoptimized />
      {itemCount > 0 ? (
        <span className="absolute -top-2 -right-2 flex size-4 items-center justify-center rounded-full bg-cta text-[10px] text-cta-foreground">
          {itemCount}
        </span>
      ) : null}
    </Link>
  );
}
