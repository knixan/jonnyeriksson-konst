import { CategoryFilter } from "@/components/shop/category-filter";
import { ProductGrid } from "@/components/shop/product-grid";
import { getActiveProducts, getCategories } from "@/lib/products";

const pageTitles = {
  ORIGINAL: "Originalmålningar",
  PRINT: "Prints",
} as const;

export default async function ProductsPage(props: PageProps<"/produkter">) {
  const { kategori, typ } = await props.searchParams;
  const categorySlug = typeof kategori === "string" ? kategori : undefined;
  const type = typ === "ORIGINAL" || typ === "PRINT" ? typ : undefined;

  const [products, categories] = await Promise.all([
    getActiveProducts(categorySlug, type),
    getCategories(),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="text-4xl text-foreground">
        {type ? pageTitles[type] : "Konstverk"}
      </h1>
      <div className="mt-6 mb-10">
        <CategoryFilter
          categories={categories}
          activeSlug={categorySlug}
          activeType={type}
        />
      </div>
      <ProductGrid products={products} />
    </div>
  );
}
