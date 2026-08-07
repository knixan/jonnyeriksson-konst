import { notFound } from "next/navigation";

import { DeleteProductButton } from "@/components/admin/delete-product-button";
import { ProductForm } from "@/components/admin/product-form";
import { prisma } from "@/lib/prisma";

import { updateProduct } from "../actions";

export default async function EditProductPage(
  props: PageProps<"/admin/produkter/[id]">,
) {
  const { id } = await props.params;

  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: {
        categories: true,
        images: { orderBy: { position: "asc" } },
        variants: { orderBy: { sortOrder: "asc" } },
      },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl text-foreground">Redigera produkt</h1>
        <DeleteProductButton
          productId={product.id}
          productName={product.name}
        />
      </div>
      <ProductForm
        categories={categories}
        submitLabel="Spara ändringar"
        defaultValues={{
          name: product.name,
          slug: product.slug,
          description: product.description,
          type: product.type,
          status: product.status,
          categoryIds: product.categories.map((c) => c.id),
          images: product.images.map((image) => ({
            url: image.url,
            alt: image.alt ?? undefined,
          })),
          variants: product.variants.map((variant) => ({
            id: variant.id,
            size: variant.size,
            framed: variant.framed,
            priceKr: variant.priceOre / 100,
            inStock: variant.inStock,
          })),
        }}
        onSubmit={updateProduct.bind(null, product.id)}
      />
    </div>
  );
}
