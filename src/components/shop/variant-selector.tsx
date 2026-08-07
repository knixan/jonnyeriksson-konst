"use client";

import { useState } from "react";
import { toast } from "sonner";

import { useCart } from "@/components/cart/cart-context";
import { Button } from "@/components/ui/button";
import { formatPrice, variantLabel } from "@/lib/format";
import { cn } from "@/lib/utils";

type Variant = {
  id: string;
  size: string;
  framed: boolean;
  priceOre: number;
  inStock: boolean;
};

export function VariantSelector({
  productSlug,
  productName,
  imageUrl,
  variants,
}: {
  productSlug: string;
  productName: string;
  imageUrl?: string;
  variants: Variant[];
}) {
  const { addItem } = useCart();
  const firstAvailable = variants.find((v) => v.inStock) ?? variants[0];
  const [selectedId, setSelectedId] = useState(firstAvailable?.id);
  const selected = variants.find((v) => v.id === selectedId);

  if (!variants.length) {
    return (
      <p className="text-muted-foreground">
        Inga varianter tillgängliga just nu.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        {variants.map((variant) => (
          <button
            key={variant.id}
            type="button"
            disabled={!variant.inStock}
            onClick={() => setSelectedId(variant.id)}
            className={cn(
              "flex items-center justify-between rounded-md border px-4 py-2.5 text-left text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-50",
              selectedId === variant.id
                ? "border-cta bg-cta text-cta-foreground"
                : "border-border text-primary hover:border-accent hover:text-accent",
            )}
          >
            <span>
              {variantLabel(variant.size, variant.framed)}
              {!variant.inStock ? " (Slutsåld)" : ""}
            </span>
            <span>{formatPrice(variant.priceOre)}</span>
          </button>
        ))}
      </div>
      <Button
        variant="cta"
        size="lg"
        disabled={!selected || !selected.inStock}
        onClick={() => {
          if (!selected) return;
          addItem({
            variantId: selected.id,
            productSlug,
            productName,
            variantLabel: variantLabel(selected.size, selected.framed),
            priceOre: selected.priceOre,
            imageUrl,
          });
          toast.success(`${productName} tillagd i varukorgen`);
        }}
      >
        Lägg i varukorg
      </Button>
    </div>
  );
}
