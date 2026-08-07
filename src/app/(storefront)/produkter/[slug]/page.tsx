import { notFound } from "next/navigation";

import { ProductGallery } from "@/components/shop/product-gallery";
import { VariantSelector } from "@/components/shop/variant-selector";
import { getProductBySlug } from "@/lib/products";

export default async function ProductPage(
  props: PageProps<"/produkter/[slug]">,
) {
  const { slug } = await props.params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 sm:grid-cols-2">
      <ProductGallery images={product.images} alt={product.name} />
      <div>
        {product.categories.length > 0 ? (
          <p className="text-sm text-muted-foreground">
            {product.categories.map((category) => category.name).join(", ")}
          </p>
        ) : null}
        <h1 className="mt-1 text-4xl text-foreground">{product.name}</h1>
        <p className="mt-4 text-secondary-foreground">{product.description}</p>

        <div className="mt-8">
          <VariantSelector
            productSlug={product.slug}
            productName={product.name}
            imageUrl={product.images[0]?.url}
            variants={product.variants}
          />
        </div>
      </div>
    </div>
  );
}
