import { CategoryFilter } from "@/components/shop/category-filter";
import { ProductGrid } from "@/components/shop/product-grid";
import { SearchForm } from "@/components/shop/search-form";
import { getActiveProducts, getCategories } from "@/lib/products";

const pageTitles = {
  ORIGINAL: "Originalmålningar",
  PRINT: "Prints",
} as const;

export default async function ProductsPage(props: PageProps<"/produkter">) {
  const { kategori, typ, sok } = await props.searchParams;
  const categorySlug = typeof kategori === "string" ? kategori : undefined;
  const type = typ === "ORIGINAL" || typ === "PRINT" ? typ : undefined;
  const search = typeof sok === "string" && sok.trim() ? sok.trim() : undefined;

  const [products, categories] = await Promise.all([
    getActiveProducts(categorySlug, type, search),
    getCategories(),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="flex flex-wrap items-center justify-between gap-6">
        <h1 className="text-4xl text-foreground">
          {search ? `Sökresultat för "${search}"` : type ? pageTitles[type] : "Konstverk"}
        </h1>
        <SearchForm
          initialValue={search}
          redirectParams={{ kategori: categorySlug, typ: type }}
          className="w-full sm:w-64"
        />
      </div>
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
