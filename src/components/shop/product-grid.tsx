import { ProductCard } from "@/components/shop/product-card";
import type { getActiveProducts } from "@/lib/products";

type Product = Awaited<ReturnType<typeof getActiveProducts>>;

export function ProductGrid({ products }: { products: Product }) {
  if (!products.length) {
    return <p className="text-muted-foreground">Inga konstverk hittades.</p>;
  }

  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
