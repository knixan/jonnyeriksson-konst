import { notFound } from "next/navigation";

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
      <h1 className="text-3xl text-foreground">Redigera produkt</h1>
      <ProductForm
        categories={categories}
        submitLabel="Spara ändringar"
        defaultValues={{
          name: product.name,
          slug: product.slug,
          description: product.description,
          type: product.type,
          status: product.status,
          categoryId: product.categoryId ?? "",
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
        onSubmit={(values) => updateProduct(product.id, values)}
      />
    </div>
  );
}
