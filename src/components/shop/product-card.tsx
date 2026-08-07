import Image from "next/image";
import Link from "next/link";

import { formatPrice } from "@/lib/format";
import type { getActiveProducts } from "@/lib/products";

type Product = Awaited<ReturnType<typeof getActiveProducts>>[number];

export function ProductCard({ product }: { product: Product }) {
  const image = product.images[0];
  const prices = product.variants.map((variant) => variant.priceOre);
  const fromPrice = prices.length ? Math.min(...prices) : null;

  return (
    <Link
      href={`/produkter/${product.slug}`}
      className="group flex flex-col gap-3"
    >
      <div className="relative aspect-4/5 overflow-hidden rounded-lg bg-card">
        {image ? (
          <Image
            src={image.url}
            alt={image.alt ?? product.name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            Ingen bild ännu
          </div>
        )}
      </div>
      <div>
        <h3 className="text-lg text-foreground">{product.name}</h3>
        {product.category ? (
          <p className="text-sm text-muted-foreground">
            {product.category.name}
          </p>
        ) : null}
        {fromPrice !== null ? (
          <p className="mt-1 text-sm text-primary">
            Från {formatPrice(fromPrice)}
          </p>
        ) : null}
      </div>
    </Link>
  );
}
