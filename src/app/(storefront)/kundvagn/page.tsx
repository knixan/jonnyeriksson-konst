"use client";

import { Minus, Plus, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { useCart } from "@/components/cart/cart-context";
import { buttonVariants } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import { isOptimizableImageUrl } from "@/lib/images";

export default function CartPage() {
  const { items, setQuantity, removeItem, subtotalOre } = useCart();

  if (!items.length) {
    return (
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 py-24 text-center">
        <h1 className="text-4xl text-foreground">Din varukorg är tom</h1>
        <Link href="/produkter" className={buttonVariants({ variant: "cta" })}>
          Se konstverk
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-4xl text-foreground">Varukorg</h1>
      <div className="mt-8 flex flex-col gap-6">
        {items.map((item) => (
          <div
            key={item.variantId}
            className="flex gap-4 border-b border-border pb-6"
          >
            <div className="relative size-24 shrink-0 overflow-hidden rounded-md bg-card">
              {item.imageUrl ? (
                <Image
                  src={item.imageUrl}
                  alt={item.productName}
                  fill
                  unoptimized={!isOptimizableImageUrl(item.imageUrl)}
                  sizes="96px"
                  className="object-cover"
                />
              ) : null}
            </div>
            <div className="flex flex-1 flex-col gap-1">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-foreground">{item.productName}</p>
                  <p className="text-sm text-muted-foreground">
                    {item.variantLabel}
                  </p>
                </div>
                <button
                  type="button"
                  aria-label="Ta bort"
                  onClick={() => removeItem(item.variantId)}
                  className="text-muted-foreground hover:text-accent"
                >
                  <X className="size-4" />
                </button>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <div className="flex items-center gap-3 rounded-full border border-border px-3 py-1">
                  <button
                    type="button"
                    aria-label="Minska antal"
                    onClick={() =>
                      setQuantity(item.variantId, item.quantity - 1)
                    }
                    className="text-primary hover:text-accent"
                  >
                    <Minus className="size-3.5" />
                  </button>
                  <span className="w-4 text-center text-sm text-foreground">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    aria-label="Öka antal"
                    onClick={() =>
                      setQuantity(item.variantId, item.quantity + 1)
                    }
                    className="text-primary hover:text-accent"
                  >
                    <Plus className="size-3.5" />
                  </button>
                </div>
                <p className="text-foreground">
                  {formatPrice(item.priceOre * item.quantity)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-between text-lg">
        <span className="text-primary">Delsumma</span>
        <span className="text-foreground">{formatPrice(subtotalOre)}</span>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">
        Frakt beräknas i kassan.
      </p>

      <Link
        href="/kassa"
        className={buttonVariants({ variant: "cta", size: "lg", className: "mt-6 w-full" })}
      >
        Till kassan
      </Link>
    </div>
  );
}
