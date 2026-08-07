import { ProductForm } from "@/components/admin/product-form";
import { prisma } from "@/lib/prisma";

import { createProduct } from "../actions";

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl text-foreground">Ny produkt</h1>
      <ProductForm
        categories={categories}
        submitLabel="Skapa produkt"
        defaultValues={{
          name: "",
          slug: "",
          description: "",
          type: "PRINT",
          status: "DRAFT",
          categoryIds: [],
          images: [],
          variants: [{ size: "", framed: false, priceKr: 0, inStock: true }],
        }}
        onSubmit={createProduct}
      />
    </div>
  );
}
