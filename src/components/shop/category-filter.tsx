import Link from "next/link";

import { cn } from "@/lib/utils";
import type { getCategories } from "@/lib/products";

type Category = Awaited<ReturnType<typeof getCategories>>[number];

export function CategoryFilter({
  categories,
  activeSlug,
}: {
  categories: Category[];
  activeSlug?: string;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href="/produkter"
        className={cn(
          "rounded-full border border-border px-4 py-1.5 text-sm hover:border-accent hover:text-accent",
          !activeSlug
            ? "border-cta bg-cta text-cta-foreground"
            : "text-primary",
        )}
      >
        Alla
      </Link>
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/produkter?kategori=${category.slug}`}
          className={cn(
            "rounded-full border border-border px-4 py-1.5 text-sm hover:border-accent hover:text-accent",
            activeSlug === category.slug
              ? "border-cta bg-cta text-cta-foreground"
              : "text-primary",
          )}
        >
          {category.name}
        </Link>
      ))}
    </div>
  );
}
